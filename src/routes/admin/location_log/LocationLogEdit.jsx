import Card from "../../../common/ui/Card.jsx";
import TextInput from "../../../common/ui/TextInput.jsx";
import H1 from "../../../common/ui/H1.jsx";
import useModel from "../../../common/api/useModel.jsx";
import NotificationState from "../../../common/stores/NotificationState.js";
import {useNavigate, useParams} from "react-router-dom";
import FormViewSkeleton from "../../../common/ui/FormViewSkeleton.jsx";
import EditFormActionBar from "../../../common/ui/EditFormActionBar.jsx";
import NumberInput from "../../../common/ui/NumberInput.jsx";
import { useTranslation } from "react-i18next";

export default function LocationLogEdit() {
    const {t} = useTranslation()
    const {id} = useParams()
    const query = useModel('location_log', {id, autoFetch: true})
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
            notify({message: t('Location Log updated successfully!'), type: 'success'})
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
                </Card>
                :
                <FormViewSkeleton/>
            }
        </form>
    )
}