import {faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert, LoadingOverlay, Table} from "@mantine/core";
import dayjs from "dayjs";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import useModel from "../../../common/api/useModel.jsx";
import Checkbox from "../../../common/ui/Checkbox.jsx";
import ListViewPagination from "../../../common/ui/ListViewPagination.jsx";
import ListViewSearchBar from "../../../common/ui/ListViewSearchBar.jsx";
import ListViewSkeleton from "../../../common/ui/ListViewSkeleton.jsx";

export default function TrackingSessionList() {
    const {t} = useTranslation();
    const query = useModel("xray", {
        autoFetch: true,
        searchFields: ["origin", "country", "city"],
    });
    const {data: items, loading, error} = query;
    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState([]);
    return (
        <main className={`max-w-screen-xl m-auto my-[50px] px-[12px] sm:px-[24px]`}>
            <div className={`flex w-full justify-between gap-2`}>
                <h1 className={`text-[36px] font-[700] text-2xl text-pr`}>{t("Tracking Sessions")}</h1>
                {/*<Link to={`/tracking_sessions/create`}>*/}
                {/*    <Button className={`shadow bg-primary-main text-primary-contrastText`} color={`primary`}>*/}
                {/*        <FontAwesomeIcon icon={faPlus} className="sm:mr-1 h-4 w-4"/> <span*/}
                {/*        className={`hidden sm:inline`}>Create Tracking Session</span>*/}
                {/*    </Button>*/}
                {/*</Link>*/}
            </div>

            <ListViewSearchBar query={query} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />

            {error && (
                <Alert
                    color="red"
                    variant="light"
                    title="Error"
                    className={`mb-2`}
                    icon={<FontAwesomeIcon icon={faTriangleExclamation} />}
                >
                    {t(error)}
                </Alert>
            )}

            {items?.length > 0 ? (
                <div className={`relative border border-gray-border p-2 rounded-md shadow overflow-y-auto`}>
                    <LoadingOverlay
                        visible={loading}
                        zIndex={1000}
                        overlayProps={{
                            radius: "sm",
                            blur: 2,
                        }}
                        loaderProps={{
                            type: "bars",
                        }}
                    />

                    <Table verticalSpacing="sm" highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>
                                    <Checkbox
                                        aria-label="Select row"
                                        checked={selectedRows.length === items.length}
                                        onChange={(e) => setSelectedRows(e.currentTarget.checked ? items : [])}
                                    />
                                </Table.Th>
                                <Table.Th>{t("Start Time")}</Table.Th>
                                <Table.Th>{t("Domain")}</Table.Th>
                                <Table.Th>{t("User")}</Table.Th>
                                <Table.Th>{t("OS")}</Table.Th>
                                <Table.Th>{t("Country")}</Table.Th>
                                <Table.Th>{t("City")}</Table.Th>
                                <Table.Th>{t("Duration")}</Table.Th>
                                <Table.Th>{t("Status")}</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {items?.map((item) => (
                                <Table.Tr
                                    key={item.id}
                                    bg={selectedRows.includes(item) ? "var(--mantine-color-blue-light)" : undefined}
                                    onClick={() => navigate(`/tracking_sessions/${item.id}`)}
                                    className={`cursor-pointer`}
                                >
                                    <Table.Td onClick={(e) => e.stopPropagation()} className={`cursor-pointer`}>
                                        <Checkbox
                                            aria-label="Select row"
                                            checked={selectedRows.map((row) => row.id).includes(item.id)}
                                            onChange={(e) =>
                                                setSelectedRows(
                                                    e.currentTarget.checked
                                                        ? [...selectedRows, item]
                                                        : selectedRows.filter((row) => row.id !== item.id)
                                                )
                                            }
                                        />
                                    </Table.Td>
                                    <Table.Td>
                                        {dayjs.utc(item.created_at).local().format("HH:mm DD.MM.YYYY")}
                                    </Table.Td>
                                    <Table.Td>{item.origin}</Table.Td>
                                    <Table.Td>{item.owner.signed_up ? item.owner.name : `(Public User)`}</Table.Td>
                                    <Table.Td>{item.device_info?.operatingSystem}</Table.Td>
                                    <Table.Td>{item.country}</Table.Td>
                                    <Table.Td>{item.city}</Table.Td>
                                    <Table.Td>
                                        {item.duration &&
                                            (item.duration < 60
                                                ? `${item.duration} seconds`
                                                : dayjs.duration(item.duration, "seconds").humanize())}
                                    </Table.Td>
                                    <Table.Td>
                                        {item.active_tab ? (
                                            <div className={`text-green-500 font-bold`}>{t("Active")}</div>
                                        ) : item.duration ? (
                                            <div className={`text-gray-500 font-bold`}>{t("Closed")}</div>
                                        ) : (
                                            <div className={`text-amber-500 font-bold`}>{t("Inactive")}</div>
                                        )}
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>

                    <ListViewPagination query={query} />
                </div>
            ) : loading ? (
                <ListViewSkeleton />
            ) : (
                <div className={`py-4 text-gray-main`}>{t("Nothing here yet.")}</div>
            )}
        </main>
    );
}
