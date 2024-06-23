import {useEffect, useState} from 'react';
import {Html5QrcodeScanner} from "html5-qrcode";
import useModel from "../../common/api/useModel.jsx";
import H1 from "../../common/ui/H1.jsx";
import H2 from "../../common/ui/H2.jsx";
import RecordSelect from "../../common/ui/RecordSelect.jsx";
import Select from "../../common/ui/Select.jsx";
import NumberInput from "../../common/ui/NumberInput.jsx";
import TextInput from "../../common/ui/TextInput.jsx";
import TextArea from "../../common/ui/TextArea.jsx";
import {useTranslation} from "react-i18next";
import Button from "../../common/ui/Button.jsx";
import NotificationState from "../../common/stores/NotificationState.js";
import ReadOnlyField from "../../common/ui/ReadOnlyField.jsx";
import Notification from "../../common/notification/Notification.jsx";

export default function Scan() {
    const [cleared, setCleared] = useState(true);
    const [scannedPallet, setScannedPallet] = useState(null);
    const {t} = useTranslation();
    const {notify} = NotificationState();
    const [html5QrcodeScanner, setHtml5QrcodeScanner] = useState(null);

    const {getOne: getPallet} = useModel('pallet');
    const {create: createScan} = useModel('scan');
    const {create: createLocationLog} = useModel('location_log');

    const [record, setRecord] = useState({
        scan_type: "Load",
        latitude: null,
        longitude: null,
        foo: '',
        bar: '',
        notes: '',
        pallet_id: parent?.id || null,
        vehicle_id: null,
        depot_id: null,
    })

    // location pings
    useEffect(() => {
        if (navigator.geolocation) {
            const getLocationAndLog = async () => {
                navigator.geolocation.getCurrentPosition(
                    async position => {
                        const {latitude, longitude} = position.coords;
                        console.log({latitude, longitude});
                        setRecord({...record, latitude: latitude, longitude: longitude});
                        await createLocationLog({latitude, longitude});
                        notify({
                            message: 'Location log sent',
                            type: 'info'
                        });
                    },
                    error => {
                        console.error("Error occurred while getting location", error);
                    }
                );
            };

            // Run it first thing
            getLocationAndLog();

            // Then set up the interval
            const intervalId = setInterval(getLocationAndLog, 600000); // 600000ms = 10 minutes

            // Clear interval on component unmount
            return () => clearInterval(intervalId);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, []);


    async function handleSubmit(e) {
        try {
            e.preventDefault()
            const created = await createScan(record)
            notify({message: t('Scan submitted successfully!'), type: 'success'})
            setScannedPallet(null);
        } catch (error) {
            console.error(error)
            notify({message: error.message, type: 'error'})
        }
    }

    async function renderScanner() {
        setCleared(false);

        let scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 1,
                qrbox: {width: 250, height: 250},
            },
            /* verbose= */ false,
        );

        const onScanSuccess = async (decodedText, decodedResult) => {
            console.log(`Code matched = ${decodedText}`, decodedResult);
            if (decodedText.startsWith('pallet-')) {
                const palletId = parseInt(decodedText.split('-')[1])
                console.log({palletId});
                const pallet = await getPallet(palletId);
                if (pallet.id) {
                    setScannedPallet(pallet);
                    setRecord({...record, pallet_id: palletId})
                    // html5QrcodeScanner.stop();
                    notify({
                        message: 'Pallet scanned!',
                        type: 'success'
                    });
                }
            }

            console.log('clearing');
            scanner.clear();
            setCleared(true);
        };

        const onScanFailure = (error) => {
            console.warn(`Code scan error = ${error}`);
        };

        await scanner.render(onScanSuccess, onScanFailure);

        setHtml5QrcodeScanner(scanner);
    }

    return (
        <form className={`px-[24px] pt-[24px] max-w-screen-sm`} onSubmit={handleSubmit}>
            <H1>{t("Scan")}</H1>
            <div id="reader" className={`mx-auto`} style={{width: '300px'}}></div>
            <div>
                {cleared &&
                    <button className={`bg-blue-600 px-4 py-2 font-semibold rounded-lg text-white`}
                            onClick={renderScanner}>
                        Start scanning
                    </button>}
            </div>

            <div className={`flex flex-col gap-2 my-2 flex-wrap`}>

                {scannedPallet &&
                    <div>
                        <H2>Scanned Pallet</H2>
                        <div className={`text-red-500 font-semibold`}>{scannedPallet.name}</div>
                    </div>
                }

                <Select
                    label={t("Scan Type")}
                    placeholder={t("Pick a Scan Type")}
                    data={[
                        'Load',
                        'Off Depot',
                        'On Truck',
                        'Off Location',
                    ]}
                    searchable
                    required
                    defaultValue={"Load"}
                    value={record.scan_type}
                    onChange={value => setRecord({...record, scan_type: value})}
                />

                <div className={`flex gap-2`}>
                    <ReadOnlyField
                        label={t("Latitude")}
                        value={record.latitude}
                    />
                    <ReadOnlyField
                        label={t("Longitude")}
                        value={record.longitude}
                    />
                </div>


                <RecordSelect
                    model="vehicle"
                    displayField="name"
                    searchFields={['name']}
                    label={t("Vehicle")}
                    placeholder={t("Select a Vehicle")}
                    value={record.vehicle_id}
                    onChange={value => setRecord({...record, vehicle_id: value})}
                />
                <RecordSelect
                    model="depot"
                    displayField="name"
                    searchFields={['name']}
                    label={t("Depot")}
                    placeholder={t("Select a Depot")}
                    value={record.depot_id}
                    onChange={value => setRecord({...record, depot_id: value})}
                />


                <TextArea
                    label={t("Notes")}
                    placeholder={t("Enter Notes")}
                    value={record.notes}
                    onChange={e => setRecord({...record, notes: e.target.value})}
                />

                <TextArea
                    label={t("Notes 2")}
                    placeholder={t("Enter Notes 2")}
                    value={record.notes2}
                    onChange={e => setRecord({...record, notes2: e.target.value})}
                />


                <TextArea
                    label={t("Even More Notes")}
                    placeholder={t("Enter Even More Notes")}
                    value={record.even_more_notes}
                    onChange={e => setRecord({...record, even_more_notes: e.target.value})}
                />

                <TextArea
                    label={t("Notes Final")}
                    placeholder={t("Enter Notes Final")}
                    value={record.notes_final}
                    onChange={e => setRecord({...record, notes_final: e.target.value})}
                />

                <Button type={`submit`}>Submit</Button>
            </div>
            <Notification/>
        </form>
    );
}