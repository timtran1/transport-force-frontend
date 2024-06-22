import {useState, useEffect} from "react";
import XRAYState from "../stores/XRAYState.js";
import {useLocation} from "react-router-dom";
import {Device} from '@capacitor/device';
import {useNetwork} from '@mantine/hooks';
import useModel from "./useModel.jsx";
import {useDeviceData} from 'react-device-detect'
import {Preferences} from "@capacitor/preferences";
import {App} from '@capacitor/app';
import {usePrevious} from "@mantine/hooks";
import UserState from "../stores/UserState.js";
import BackendHostURLState from "../stores/BackendHostURLState.js";

export default function useXRAY() {
    const {backendHost} = BackendHostURLState(state => state)
    const [loading, setLoading] = useState(true);
    const [websocket, setWebsocket] = useState(null);
    const {xraySession, setXraySession} = XRAYState();
    const location = useLocation();
    const network = useNetwork();
    const deviceData = useDeviceData();
    const {user: currentUser} = UserState(state => state);
    const prevUser = usePrevious(currentUser);

    const {create: createXray} = useModel('xray');
    const {create: createXrayEvent} = useModel('xray_event');

    // listen for user changes
    useEffect(() => {
        if (prevUser && currentUser &&
            currentUser.id !== prevUser.id &&
            currentUser.signed_up && !prevUser.signed_up
        ) {
            handleLoggedIn();
        }
    }, [currentUser, prevUser]);

    // handle app state events
    useEffect(() => {
        if (xraySession) {
            App.removeAllListeners()
            App.addListener('appStateChange', handleAppStateChange)
        }
    }, [xraySession])

    // handle location events
    useEffect(() => {
        if (xraySession) {
            handleLocationChange()
        }
    }, [location]);

    async function handleLocationChange() {
        const data = await getDeviceInfo()
        const event = await createXrayEvent({
            tracking_session_id: xraySession.id,
            type: 'page_view',
            data
        });
        setXraySession({...xraySession, events: [...xraySession.events, event]});
    }

    async function handleAppStateChange(appState) {
        const data = await getDeviceInfo()
        const {isActive} = appState
        const type = isActive ? 'active_tab' : 'leave_tab';
        const event = await createXrayEvent({
            tracking_session_id: xraySession.id,
            type,
            data
        });
        setXraySession({...xraySession, events: [...xraySession.events, event]});
    }

    async function handleLoggedIn() {
        // send event to websocket
        websocket.send(JSON.stringify({
            type: 'user_logged_in',
            data: currentUser
        }))
    }

    async function getDeviceInfo() {
        const deviceInfo = await Device.getInfo()
        return {
            ...deviceInfo,
            location,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            network,
            operatingSystem: deviceInfo.operatingSystem === 'unknown' ? deviceData.os.name : deviceInfo.operatingSystem,
            browser: deviceData.browser,
            cpu: deviceData.cpu,
        }
    }

    async function initializeXRAY() {
        if (!xraySession) {
            try {
                const tokenResult = await Preferences.get({key: 'token'})
                const token = tokenResult.value;
                if (!token) {
                    console.log('No token found, cannot initialize XRAY.');
                    return;
                }

                const device_info = await getDeviceInfo()
                const session = await createXray({
                    device_info,
                    origin: window.location.origin,
                })

                openSocket(session.id, token)

                const event = await createXrayEvent({
                    tracking_session_id: session.id,
                    type: 'page_view',
                    data: device_info,
                })

                const xraySession = {
                    ...session,
                    events: [event],
                };

                setXraySession(xraySession)
                return xraySession;
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
    }

    async function openSocket(sessionId, token) {
        if (websocket) {
            console.log('XRAY WebSocket is already open.');
            return;
        }

        // connect to websocket
        const hostWs = backendHost.replace('http', 'ws')
        const newWs = new WebSocket(`${hostWs}/ws/xray?token=${token}&session_id=${sessionId}`)

        newWs.onopen = () => {
            console.log('XRAY WebSocket connection established.');
        }
        newWs.onclose = () => {
            console.log('XRAY WebSocket connection closed.');
        }

        setWebsocket(newWs);
    }

    return {
        loading,
        xraySession,
        initializeXRAY,
        handleLoggedIn
    }
}