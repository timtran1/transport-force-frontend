import Card from "../../../common/ui/Card.jsx";
import TextInput from "../../../common/ui/TextInput.jsx";
import H1 from "../../../common/ui/H1.jsx";
import useModel from "../../../common/api/useModel.jsx";
import NotificationState from "../../../common/stores/NotificationState.js";
import {useNavigate, useParams} from "react-router-dom";
import FormViewSkeleton from "../../../common/ui/FormViewSkeleton.jsx";
import EditFormActionBar from "../../../common/ui/EditFormActionBar.jsx";
import NumberInput from "../../../common/ui/NumberInput.jsx";
import {useTranslation} from "react-i18next";

export default function VehicleEdit() {
    const {t} = useTranslation()
    const {id} = useParams()
    const query = useModel('vehicle', {id, autoFetch: true})
    const {record, setRecord, update, loading: recordLoading} = query


    const loading = recordLoading
    const {notify} = NotificationState(state => state)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        try {
            e.preventDefault()
            await Promise.all([
                update(record),
            ])
            notify({message: t('Vehicle updated successfully!'), type: 'success'})
            navigate(-1)
        } catch (e) {
            console.error(e)
            notify({message: e.message, type: 'error'})
        }
    }

    return (
        <form className={`max-w-screen-xl m-auto my-[20px] px-[24px]`} onSubmit={handleSubmit}>
            <EditFormActionBar query={query}/>
            {record ?
                <Card>
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
                </Card>
                :
                <FormViewSkeleton/>
            }
        </form>
    )
}