import useModel from "../../../common/api/useModel.jsx";
import Button from "../../../common/ui/Button"
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
import Checkbox from "../../../common/ui/Checkbox.jsx";
import {Table, Alert, Chip, LoadingOverlay} from '@mantine/core';
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import ListViewSearchBar from "../../../common/ui/ListViewSearchBar.jsx";
import ListViewPagination from "../../../common/ui/ListViewPagination.jsx";
import ListViewSkeleton from "../../../common/ui/ListViewSkeleton.jsx";
import NumberFormatter from "../../../common/ui/NumberFormatter.jsx";
import { useTranslation } from "react-i18next";

export default function ScanList() {
    const {t} = useTranslation()
    const query = useModel('scan', {
        autoFetch: true,
        searchFields: ['name'],
    })
    const {data: items, loading, error} = query

    const navigate = useNavigate()
    const [selectedRows, setSelectedRows] = useState([])

    return (
        <main className={`max-w-screen-xl m-auto my-[50px] px-[12px] sm:px-[24px]`}>
            <div className={`flex w-full justify-between gap-2`}>
                <h1 className={`text-[36px] font-[700] text-2xl text-pr`}>{t("Scans")}</h1>
                <Link to={`/scans/create`}>
                    <Button className={`shadow bg-primary-main text-primary-contrastText`} color={`primary`}>
                        <FontAwesomeIcon icon={faPlus} className="sm:mr-1 h-4 w-4"/> <span
                        className={`hidden sm:inline`}>{t("Create Scan")}</span>
                    </Button>
                </Link>
            </div>

            <ListViewSearchBar query={query} selectedRows={selectedRows} setSelectedRows={setSelectedRows}/>

            {error &&
                <Alert color="red" variant="light" title="Error" className={`mb-2`}
                       icon={<FontAwesomeIcon icon={faTriangleExclamation}/>}>{error}</Alert>
            }

            {items?.length > 0 ?
                <div className={`relative border border-gray-border p-2 rounded-md shadow overflow-y-auto`}>
                    <LoadingOverlay
                        visible={loading} zIndex={1000}
                        overlayProps={{radius: "sm", blur: 2}} loaderProps={{type: 'bars'}}/>

                    <Table verticalSpacing="sm" highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>
                                    <Checkbox
                                        aria-label="Select row"
                                        checked={selectedRows.length === items.length}
                                        onChange={e =>
                                            setSelectedRows(
                                                e.currentTarget.checked
                                                    ? items : []
                                            )
                                        }
                                    />
                                </Table.Th>
                                <Table.Th>{t("Barcode")}</Table.Th>
                                <Table.Th>{t("Scan Type")}</Table.Th>
                                <Table.Th>{t("Latitude")}</Table.Th>
                                <Table.Th>{t("Longitude")}</Table.Th>
                                <Table.Th>{t("Foo")}</Table.Th>
                                <Table.Th>{t("Bar")}</Table.Th>
                                <Table.Th>{t("Notes")}</Table.Th>



                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{
                            items?.map(item => (
                                <Table.Tr
                                    key={item.id}
                                    bg={selectedRows.includes(item) ? 'var(--mantine-color-blue-light)' : undefined}
                                    onClick={() => navigate(`/scans/${item.id}`)} className={`cursor-pointer`}
                                >
                                    <Table.Td onClick={e => e.stopPropagation()} className={`cursor-pointer`}>
                                        <Checkbox
                                            aria-label="Select row"
                                            checked={selectedRows.includes(item)}
                                            onChange={e =>
                                                setSelectedRows(
                                                    e.currentTarget.checked
                                                        ? [...selectedRows, item] : selectedRows.filter(row => row.id !== item.id)
                                                )
                                            }
                                        />
                                    </Table.Td>
                                    <Table.Td>{item.barcode}</Table.Td>
                                    <Table.Td>{item.scan_type}</Table.Td>
                                    <Table.Td>
                                        <NumberFormatter
                                            value={item.latitude}
                                            thousandSeparator=","
                                        />
                                    </Table.Td>
                                    <Table.Td>
                                        <NumberFormatter
                                            value={item.longitude}
                                            thousandSeparator=","
                                        />
                                    </Table.Td>
                                    <Table.Td>{item.foo}</Table.Td>
                                    <Table.Td>{item.bar}</Table.Td>
                                    <Table.Td>{item.notes}</Table.Td>
                                    <Table.Td>
                                        <NumberFormatter
                                            value={item.pallet_id}
                                            thousandSeparator=","
                                        />
                                    </Table.Td>
                                    <Table.Td>
                                        <NumberFormatter
                                            value={item.vehicle_id}
                                            thousandSeparator=","
                                        />
                                    </Table.Td>
                                    <Table.Td>
                                        <NumberFormatter
                                            value={item.depot_id}
                                            thousandSeparator=","
                                        />
                                    </Table.Td>
                                </Table.Tr>
                            ))
                        }</Table.Tbody>
                    </Table>

                    <ListViewPagination query={query}/>
                </div>
                :
                loading
                    ?
                    <ListViewSkeleton/>
                    :
                    <div className={`py-4 text-gray-main`}>
                        {t("Nothing here yet.")}
                    </div>
            }
        </main>
    )
}