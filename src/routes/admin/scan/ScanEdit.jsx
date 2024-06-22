import Card from "../../../common/ui/Card.jsx";
import TextInput from "../../../common/ui/TextInput.jsx";
import H1 from "../../../common/ui/H1.jsx";
import useModel from "../../../common/api/useModel.jsx";
import NotificationState from "../../../common/stores/NotificationState.js";
import {useNavigate, useParams} from "react-router-dom";
import FormViewSkeleton from "../../../common/ui/FormViewSkeleton.jsx";
import EditFormActionBar from "../../../common/ui/EditFormActionBar.jsx";
import Select from "../../../common/ui/Select.jsx";
import NumberInput from "../../../common/ui/NumberInput.jsx";
import TextArea from "../../../common/ui/TextArea.jsx";
import RecordSelect from "../../../common/ui/RecordSelect.jsx";
import { useTranslation } from "react-i18next";

export default function ScanEdit() {
    const {t} = useTranslation()
    const {id} = useParams()
    const query = useModel('scan', {id, autoFetch: true})
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
            notify({message: t('Scan updated successfully!'), type: 'success'})
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
                    <H1>{t("Scan")}</H1>
                    <div className={`flex gap-2 my-2 flex-wrap`}>
                        <TextInput
                            label={t("Barcode")}
                            placeholder={t("Enter Barcode")}
                            value={record.barcode}
                            onChange={e => setRecord({...record, barcode: e.target.value})}
                            required
                        />
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
                            required
                        />
                        <NumberInput
                            label={t("Latitude")}
                            placeholder={t("Enter Latitude")}
                            value={record.latitude}
                            onChange={value => setRecord({...record, latitude: value})}
                        />
                        <NumberInput
                            label={t("Longitude")}
                            placeholder={t("Enter Longitude")}
                            value={record.longitude}
                            onChange={value => setRecord({...record, longitude: value})}
                        />
                        <TextInput
                            label={t("Foo")}
                            placeholder={t("Enter Foo")}
                            value={record.foo}
                            onChange={e => setRecord({...record, foo: e.target.value})}
                        />
                        <TextInput
                            label={t("Bar")}
                            placeholder={t("Enter Bar")}
                            value={record.bar}
                            onChange={e => setRecord({...record, bar: e.target.value})}
                        />
                        <TextArea
                            label={t("Notes")}
                            placeholder={t("Enter Notes")}
                            value={record.notes}
                            onChange={e => setRecord({...record, notes: e.target.value})}
                        />
                            {!parent &&
                                <RecordSelect
                                    model="pallet"
                                    displayField="name"
                                    searchFields={['name']}
                                    label={t("Pallet")}
                                    placeholder={t("Select a Pallet")}
                                    required
                                    value={record.pallet_id}
                                    onChange={value => setRecord({...record, pallet_id: value})}
                                />
                            }
                    </div>
                </Card>
                :
                <FormViewSkeleton/>
            }
        </form>
    )
}