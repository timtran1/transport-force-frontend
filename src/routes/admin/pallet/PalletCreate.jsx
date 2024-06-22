import TextInput from "../../../common/ui/TextInput.jsx";
import H1 from "../../../common/ui/H1.jsx";
import {useState} from "react";
import useModel from "../../../common/api/useModel.jsx";
import NotificationState from "../../../common/stores/NotificationState.js";
import {useNavigate} from "react-router-dom";
import CreateFormWrapper from "../../../common/ui/CreateFormWrapper.jsx";
import RecordSelect from "../../../common/ui/RecordSelect.jsx";
import {CloseButton, Table} from '@mantine/core';
import Divider from "../../../common/ui/Divider.jsx";
import useOne2many from "../../../common/api/useOne2many.js";
import Button from "../../../common/ui/Button"
import H2 from "../../../common/ui/H2.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";
import Select from "../../../common/ui/Select.jsx";
import NumberInput from "../../../common/ui/NumberInput.jsx";
import TextArea from "../../../common/ui/TextArea.jsx";

export default function PalletCreate(props) {
    const {t} = useTranslation()
    const {modalMode, onSuccess, parent} = props

    const [record, setRecord] = useState({
        name: '',
    })

    const {create, palletLoading} = useModel('pallet')

    const {
        create: createScans,
        loading: scansLoading,
    } = useOne2many({
        parentRecord: record,
        childModel: 'scan',
        relationshipName: 'scans',
        foreignKeyField: 'pallet_id',
    })
    const [scans, setScans] = useState([])


    const loading = palletLoading
        || scansLoading
    const {notify} = NotificationState(state => state)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        try {
            e.preventDefault()
            const created = await create(record)
            await Promise.all([
                createScans(scans, created),
            ])
            notify({message: t('Pallet created successfully!'), type: 'success'})
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
            <H1>{t("Pallet")}</H1>
            <div className={`flex gap-2 my-2 flex-wrap`}>
                <TextInput
                    label={t("Name")}
                    placeholder={t("Enter Name")}
                    value={record.name}
                    onChange={e => setRecord({...record, name: e.target.value})}
                />
            </div>
            <div className={`flex gap-2 my-2 flex-wrap`}>
                <TextArea
                    label={t("Description")}
                    placeholder={t("Enter Description")}
                    value={record.description}
                    onChange={e => setRecord({...record, description: e.target.value})}
                />
                <TextArea
                    label={t("Manifest")}
                    placeholder={t("Enter Manifest")}
                    value={record.manifest}
                    onChange={e => setRecord({...record, manifest: e.target.value})}
                />
                <TextArea
                    label={t("Handling Notes")}
                    placeholder={t("Enter Handling Notes")}
                    value={record.handling_notes}
                    onChange={e => setRecord({...record, handling_notes: e.target.value})}
                />
            </div>
            {/*<div className={`my-6 overflow-y-auto`}>*/}
            {/*    <H2>{t("Scans")}</H2>*/}
            {/*    <Divider/>*/}
            {/*    <Table className={`mt-2`}>*/}
            {/*        <Table.Thead>*/}
            {/*            <Table.Tr>*/}
            {/*                <Table.Th>{t("Scan Type")}</Table.Th>*/}
            {/*                <Table.Th>{t("Latitude")}</Table.Th>*/}
            {/*                <Table.Th>{t("Longitude")}</Table.Th>*/}
            {/*                <Table.Th>{t("Foo")}</Table.Th>*/}
            {/*                <Table.Th>{t("Bar")}</Table.Th>*/}
            {/*                <Table.Th>{t("Notes")}</Table.Th>*/}
            {/*                <Table.Th>{t("Vehicle")}</Table.Th>*/}
            {/*                <Table.Th>{t("Depot")}</Table.Th>*/}
            {/*            </Table.Tr>*/}
            {/*        </Table.Thead>*/}
            {/*        <Table.Tbody>*/}
            {/*            {scans.map((item, index) => (*/}
            {/*                <Table.Tr key={index}>*/}
            {/*                    <Table.Td>*/}
            {/*                        <Select*/}
            {/*                            placeholder={t(`Pick a Scan Type`)}*/}
            {/*                            data={[*/}
            {/*                                'Load',*/}
            {/*                                'Off Depot',*/}
            {/*                                'On Truck',*/}
            {/*                                'Off Location',*/}
            {/*                            ]}*/}
            {/*                            searchable*/}
            {/*                            required*/}
            {/*                            value={item.scan_type}*/}
            {/*                            defaultValue={"Load"}*/}
            {/*                            onChange={value => {*/}
            {/*                                const dataCopy = [...scans]*/}
            {/*                                dataCopy[index].scan_type = value*/}
            {/*                                setScans(dataCopy)*/}
            {/*                            }}*/}
            {/*                            variant="unstyled"*/}
            {/*                        />*/}
            {/*                    </Table.Td>*/}
            {/*                    <Table.Td>*/}
            {/*                        <NumberInput*/}
            {/*                            variant="unstyled"*/}
            {/*                            value={item.latitude}*/}
            {/*                            placeholder={t(`Enter Latitude`)}*/}
            {/*                            onChange={value => {*/}
            {/*                                const dataCopy = [...scans]*/}
            {/*                                dataCopy[index].latitude = value*/}
            {/*                                setScans(dataCopy)*/}
            {/*                            }}*/}
            {/*                        />*/}
            {/*                    </Table.Td>*/}
            {/*                    <Table.Td>*/}
            {/*                        <NumberInput*/}
            {/*                            variant="unstyled"*/}
            {/*                            value={item.longitude}*/}
            {/*                            placeholder={t(`Enter Longitude`)}*/}
            {/*                            onChange={value => {*/}
            {/*                                const dataCopy = [...scans]*/}
            {/*                                dataCopy[index].longitude = value*/}
            {/*                                setScans(dataCopy)*/}
            {/*                            }}*/}
            {/*                        />*/}
            {/*                    </Table.Td>*/}
            {/*                    <Table.Td>*/}
            {/*                        <TextInput*/}
            {/*                            variant="unstyled"*/}
            {/*                            value={item.foo}*/}
            {/*                            placeholder={t(`Enter Foo`)}*/}
            {/*                            onChange={e => {*/}
            {/*                                const dataCopy = [...scans]*/}
            {/*                                dataCopy[index].foo = e.target.value*/}
            {/*                                setScans(dataCopy)*/}
            {/*                            }}*/}
            {/*                        />*/}
            {/*                    </Table.Td>*/}
            {/*                    <Table.Td>*/}
            {/*                        <TextInput*/}
            {/*                            variant="unstyled"*/}
            {/*                            value={item.bar}*/}
            {/*                            placeholder={t(`Enter Bar`)}*/}
            {/*                            onChange={e => {*/}
            {/*                                const dataCopy = [...scans]*/}
            {/*                                dataCopy[index].bar = e.target.value*/}
            {/*                                setScans(dataCopy)*/}
            {/*                            }}*/}
            {/*                        />*/}
            {/*                    </Table.Td>*/}
            {/*                    <Table.Td>*/}
            {/*                        <TextArea*/}
            {/*                            variant="unstyled"*/}
            {/*                            value={item.notes}*/}
            {/*                            placeholder={t(`Enter Notes`)}*/}
            {/*                            onChange={e => {*/}
            {/*                                const dataCopy = [...scans]*/}
            {/*                                dataCopy[index].notes = e.target.value*/}
            {/*                                setScans(dataCopy)*/}
            {/*                            }}*/}
            {/*                        />*/}
            {/*                    </Table.Td>*/}

            {/*                    <Table.Td>*/}
            {/*                        <RecordSelect*/}
            {/*                            model="vehicle"*/}
            {/*                            displayField="name"*/}
            {/*                            searchFields={['name']}*/}
            {/*                            placeholder={t("Select a Vehicle")}*/}
            {/*                            value={item.vehicle_id}*/}
            {/*                            onChange={value => {*/}
            {/*                                const dataCopy = [...scans]*/}
            {/*                                dataCopy[index].vehicle_id = value*/}
            {/*                                setScans(dataCopy)*/}
            {/*                            }}*/}
            {/*                        />*/}
            {/*                    </Table.Td>*/}
            {/*                    <Table.Td>*/}
            {/*                        <RecordSelect*/}
            {/*                            model="depot"*/}
            {/*                            displayField="name"*/}
            {/*                            searchFields={['name']}*/}
            {/*                            placeholder={t("Select a Depot")}*/}
            {/*                            value={item.depot_id}*/}
            {/*                            onChange={value => {*/}
            {/*                                const dataCopy = [...scans]*/}
            {/*                                dataCopy[index].depot_id = value*/}
            {/*                                setScans(dataCopy)*/}
            {/*                            }}*/}
            {/*                        />*/}
            {/*                    </Table.Td>*/}
            {/*                    <Table.Td>*/}
            {/*                        <CloseButton disabled={loading} onClick={() => {*/}
            {/*                            const dataCopy = [...scans]*/}
            {/*                            dataCopy.splice(index, 1)*/}
            {/*                            setScans(dataCopy)*/}
            {/*                        }}/>*/}
            {/*                    </Table.Td>*/}
            {/*                </Table.Tr>))}*/}
            {/*        </Table.Tbody>*/}
            {/*    </Table>*/}
            {/*    <Button*/}
            {/*        className={`px-2 py-1 mt-4 bg-primary-main font-[600] text-[12px] text-primary-contrastText`}*/}
            {/*        onClick={() => {*/}
            {/*            const dataCopy = [...scans]*/}
            {/*            dataCopy.push({pallet_id: record.id})*/}
            {/*            setScans(dataCopy)*/}
            {/*        }} type={`button`} size={`xs`} disabled={loading}>*/}
            {/*        <FontAwesomeIcon icon={faPlus} className="mr-1 h-4 w-4 "/>*/}
            {/*        {t("Add item")}*/}
            {/*    </Button>*/}
            {/*</div>*/}
        </CreateFormWrapper>
    )
}