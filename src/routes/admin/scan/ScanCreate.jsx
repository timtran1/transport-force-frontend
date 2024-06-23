import TextInput from "../../../common/ui/TextInput.jsx";
import H1 from "../../../common/ui/H1.jsx";
import {useState} from "react";
import useModel from "../../../common/api/useModel.jsx";
import NotificationState from "../../../common/stores/NotificationState.js";
import {useNavigate} from "react-router-dom";
import CreateFormWrapper from "../../../common/ui/CreateFormWrapper.jsx";
import Select from "../../../common/ui/Select.jsx";
import NumberInput from "../../../common/ui/NumberInput.jsx";
import TextArea from "../../../common/ui/TextArea.jsx";
import RecordSelect from "../../../common/ui/RecordSelect.jsx";
import {useTranslation} from "react-i18next";

export default function ScanCreate(props) {
    const {t} = useTranslation()
    const {modalMode, onSuccess, parent} = props

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

    const {create, scanLoading} = useModel('scan')


    const loading = scanLoading
    const {notify} = NotificationState(state => state)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        try {
            e.preventDefault()
            const created = await create(record)
            await Promise.all([])
            notify({message: t('Scan created successfully!'), type: 'success'})
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
            <H1>{t("Scan")}</H1>
            <div className={`flex gap-2 my-2 flex-wrap`}>
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

            </div>
            <div className={`flex gap-2 my-2 flex-wrap`}>
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
            </div>
            <div className={`flex gap-2 my-2 flex-wrap`}>
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
            </div>
            <div className={`flex gap-2 my-2 flex-wrap`}>
                <TextArea
                    label={t("Notes")}
                    placeholder={t("Enter Notes")}
                    value={record.notes}
                    onChange={e => setRecord({...record, notes: e.target.value})}
                />
            </div>
            <div className={`flex gap-2 my-2 flex-wrap`}>
                <TextArea
                    label={t("Notes 2")}
                    placeholder={t("Enter Notes 2")}
                    value={record.notes2}
                    onChange={e => setRecord({...record, notes2: e.target.value})}
                />
            </div>
            <div className={`flex gap-2 my-2 flex-wrap`}>
                <TextArea
                    label={t("Even More Notes")}
                    placeholder={t("Enter Even More Notes")}
                    value={record.even_more_notes}
                    onChange={e => setRecord({...record, even_more_notes: e.target.value})}
                />
            </div>
            <div className={`flex gap-2 my-2 flex-wrap`}>
                <TextArea
                    label={t("Notes Final")}
                    placeholder={t("Enter Notes Final")}
                    value={record.notes_final}
                    onChange={e => setRecord({...record, notes_final: e.target.value})}
                />
            </div>
        </CreateFormWrapper>
    )
}