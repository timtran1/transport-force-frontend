import TextInput from "../../../common/ui/TextInput.jsx";
import H1 from "../../../common/ui/H1.jsx";
import {useState} from "react";
import useModel from "../../../common/api/useModel.jsx";
import NotificationState from "../../../common/stores/NotificationState.js";
import {useNavigate} from "react-router-dom";
import CreateFormWrapper from "../../../common/ui/CreateFormWrapper.jsx";
import NumberInput from "../../../common/ui/NumberInput.jsx";
import {useTranslation} from "react-i18next";

export default function VehicleCreate(props) {
    const {t} = useTranslation()
    const {modalMode, onSuccess, parent} = props

    const [record, setRecord] = useState({
        name: '',
        license_plate: '',
        model: '',
        make: '',
        year: null,
    })

    const {create, vehicleLoading} = useModel('vehicle')


    const loading = vehicleLoading
    const {notify} = NotificationState(state => state)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        try {
            e.preventDefault()
            const created = await create(record)
            await Promise.all([])
            notify({message: t('Vehicle created successfully!'), type: 'success'})
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
            <H1>{t("Vehicle")}</H1>
            <div className={`flex gap-2 my-2 flex-wrap`}>
                <TextInput
                    label={t("Name")}
                    placeholder={t("Enter Name")}
                    value={record.name}
                    onChange={e => setRecord({...record, name: e.target.value})}
                    required
                />
                <TextInput
                    label={t("License Plate")}
                    placeholder={t("Enter License Plate")}
                    value={record.license_plate}
                    onChange={e => setRecord({...record, license_plate: e.target.value})}
                    required
                />
            </div>
            <div className={`flex gap-2 my-2 flex-wrap`}>
                <TextInput
                    label={t("Make")}
                    placeholder={t("Enter Make")}
                    value={record.make}
                    onChange={e => setRecord({...record, make: e.target.value})}
                />
                <TextInput
                    label={t("Model")}
                    placeholder={t("Enter Model")}
                    value={record.model}
                    onChange={e => setRecord({...record, model: e.target.value})}
                />

                <NumberInput
                    label={t("Year")}
                    placeholder={t("Enter Year")}
                    value={record.year}
                    onChange={value => setRecord({...record, year: value})}
                />
            </div>
        </CreateFormWrapper>
    )
}