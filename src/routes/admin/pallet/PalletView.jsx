import Card from "../../../common/ui/Card.jsx"
import H1 from "../../../common/ui/H1.jsx";
import useModel from "../../../common/api/useModel.jsx";
import {useParams} from "react-router-dom";
import ReadOnlyField from "../../../common/ui/ReadOnlyField.jsx";
import ViewFormActionBar from "../../../common/ui/ViewFormActionBar.jsx";
import FormViewSkeleton from "../../../common/ui/FormViewSkeleton.jsx";
import {Table} from '@mantine/core';
import Divider from "../../../common/ui/Divider.jsx";
import H2 from "../../../common/ui/H2.jsx";
import {useTranslation} from "react-i18next";
import FileDisplay from "../../../common/ui/FileDisplay.jsx";
import RecordDisplay from "../../../common/ui/RecordDisplay.jsx";
import {getAttachmentUrl} from "../../../common/utils/index.js";
import BackendHostURLState from "../../../common/stores/BackendHostURLState.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, faMapLocationDot} from "@fortawesome/free-solid-svg-icons";

export default function PalletView() {
    const {t} = useTranslation()
    const {id} = useParams()
    const query = useModel('pallet', {id, autoFetch: true})
    const {record} = query
    const {backendHost} = BackendHostURLState(state => state)

    return (
        <main className={`max-w-screen-xl m-auto my-[50px] px-[24px]`}>
            <ViewFormActionBar query={query}/>

            {record ?
                <form>
                    <Card>
                        <H1>{t("Pallet")}</H1>

                        <div className={`flex gap-4 my-4 flex-wrap`}>
                            <ReadOnlyField
                                label={t("Name")}
                                value={record.name}
                            />
                        </div>
                        <div className={`flex gap-4 my-4 flex-wrap`}>
                            <ReadOnlyField
                                label={t("Description")}
                                value={record.description}
                            />
                            <ReadOnlyField
                                label={t("Manifest")}
                                value={record.manifest}
                            />
                            <ReadOnlyField
                                label={t("Handling Notes")}
                                value={record.handling_notes}
                            />
                        </div>

                        <div className={`flex flex-col gap-4 my-4 flex-wrap`}>
                            <FileDisplay
                                width={200}
                                height={200}
                                label={t("Barcode")}
                                type="image"
                                src={record.barcode?.name}
                            />
                            {record.barcode?.name &&
                                <div>
                                    <a href={getAttachmentUrl(backendHost, record.barcode?.name)}
                                       download={record.barcode?.name}
                                       className={`bg-primary-main text-white text-sm px-4 py-2 rounded-md`}
                                    >
                                        <FontAwesomeIcon icon={faDownload} className={`mr-2`}/>
                                        Download
                                    </a>
                                </div>
                            }
                        </div>

                        <div className={`my-6 overflow-y-auto`}>
                            <H2>{t("Scans")}</H2>
                            <Divider/>
                            <Table className={`mt-2`}>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>{t("Scan Type")}</Table.Th>
                                        <Table.Th>{t("Location")}</Table.Th>
                                        <Table.Th>{t("Notes")}</Table.Th>
                                        <Table.Th>{t("Notes 2")}</Table.Th>
                                        <Table.Th>{t("Even More Notes")}</Table.Th>
                                        <Table.Th>{t("Notes Final")}</Table.Th>
                                        <Table.Th>{t("Vehicle")}</Table.Th>
                                        <Table.Th>{t("Depot")}</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {record?.scans.map((item, index) =>
                                        <Table.Tr key={index}>
                                            <Table.Td>
                                                {item.scan_type}
                                            </Table.Td>
                                            <Table.Td>
                                                <a href={`https://maps.google.com/?q=${item?.latitude},${item?.longitude}`}
                                                   target="_blank" rel="noopener noreferrer"
                                                   className={`text-sm  rounded py-2 px-4`}>
                                                    <FontAwesomeIcon icon={faMapLocationDot} className={`mr-2`}/>
                                                    Open in Google Maps
                                                </a>
                                            </Table.Td>
                                            <Table.Td>
                                                {item.notes}
                                            </Table.Td>
                                            <Table.Td>
                                                {item.notes2}

                                            </Table.Td>
                                            <Table.Td>
                                                {item.even_more_notes}
                                            </Table.Td>
                                            <Table.Td>
                                                {item.notes_final}
                                            </Table.Td>
                                            <Table.Td>
                                                <RecordDisplay
                                                    linkTo={`/vehicles/${item.vehicle?.id}`}
                                                    value={item.vehicle?.name}
                                                />
                                            </Table.Td>
                                            <Table.Td>
                                                <RecordDisplay
                                                    linkTo={`/depots/${item.depot?.id}`}
                                                    value={item.depot?.name}
                                                />
                                            </Table.Td>
                                        </Table.Tr>
                                    )}
                                </Table.Tbody>
                            </Table>
                        </div>
                    </Card>
                </form>
                :
                <FormViewSkeleton/>
            }
        </main>
    )
}