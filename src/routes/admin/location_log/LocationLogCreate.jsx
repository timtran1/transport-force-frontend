import TextInput from "../../../common/ui/TextInput.jsx";
import H1 from "../../../common/ui/H1.jsx";
import {useState} from "react";
import useModel from "../../../common/api/useModel.jsx";
import NotificationState from "../../../common/stores/NotificationState.js";
import {useNavigate} from "react-router-dom";
import CreateFormWrapper from "../../../common/ui/CreateFormWrapper.jsx";
import NumberInput from "../../../common/ui/NumberInput.jsx";
import { useTranslation } from "react-i18next";

export default function LocationLogCreate(props) {
    const {t} = useTranslation()
    const {modalMode, onSuccess, parent} = props

    const [record, setRecord] = useState({
            latitude: null,
            longitude: null,
    })

    const {create, locationLogLoading} = useModel('location_log')



    const loading = locationLogLoading
    const {notify} = NotificationState(state => state)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        try {
            e.preventDefault()
            const created = await create(record)
            await Promise.all([
            ])
            notify({message: t('Location Log created successfully!'), type: 'success'})
            if (onSuccess) {
                onSuccess(created)
            } else {
                navigate(-1)
            }
        } catch (error) {
            console.error(error)
            notify({message: error.message, type: 'error'})
        }
    }

    return (
        <CreateFormWrapper onSubmit={handleSubmit} modalMode={modalMode} loading={loading}>
            <H1>{t("Location Log")}</H1>
            <div className={`flex gap-2 my-2 flex-wrap`}>
                <NumberInput
                    label={t("Latitude")}
                    placeholder={t("Enter Latitude")}
                    value={record.latitude}
                    onChange={value => setRecord({...record, latitude: value})}
                    required
                />
                <NumberInput
                    label={t("Longitude")}
                    placeholder={t("Enter Longitude")}
                    value={record.longitude}
                    onChange={value => setRecord({...record, longitude: value})}
                    required
                />
            </div>
        </CreateFormWrapper>
    )
}