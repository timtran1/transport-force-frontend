import {create} from 'zustand';

const initialState = {xraySession: null}

export default create(set => ({
    ...initialState,
    setXraySession: xraySession => set(() => ({xraySession})),
    logout: () => set(() => ({user: null})),
}));