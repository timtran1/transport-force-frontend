import {Table} from "@mantine/core";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import useModel from "../../../common/api/useModel.jsx";
import Card from "../../../common/ui/Card.jsx";
import Divider from "../../../common/ui/Divider.jsx";
import FormViewSkeleton from "../../../common/ui/FormViewSkeleton.jsx";
import H1 from "../../../common/ui/H1.jsx";
import H2 from "../../../common/ui/H2.jsx";
import ReadOnlyField from "../../../common/ui/ReadOnlyField.jsx";
import ViewFormActionBar from "../../../common/ui/ViewFormActionBar.jsx";

function snakeToHumanReadable(snakeCase) {
    return snakeCase.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function TrackingSessionView() {
    const {t} = useTranslation();
    const {id} = useParams();
    const query = useModel("xray", {
        id,
        autoFetch: true,
    });
    const {record} = query;
    return (
        <main className={`max-w-screen-xl m-auto my-[50px] px-[24px]`}>
            <ViewFormActionBar query={query} allowEdit={false} allowDelete={false} />

            {record ? (
                <form>
                    <Card>
                        <H1>{t("Tracking Session")}</H1>
                        <div className={`flex gap-4 my-4 flex-wrap`}>
                            <ReadOnlyField label={t("Domain")} value={record.origin} />
                            <ReadOnlyField label={t("User")} value={record.owner?.name || record.owner?.username} />
                        </div>
                        <div className={`flex gap-4 my-4 flex-wrap`}>
                            <ReadOnlyField
                                label={t("Start Time")}
                                value={dayjs(record.created_at).format("HH:mm DD.MM.YYYY")}
                            />
                            <ReadOnlyField label={t("Domain")} value={record.origin} />
                            <ReadOnlyField label={t("Start Path")} value={record.device_info?.location?.pathname} />
                            <ReadOnlyField label={t("Referrer")} value={record.device_info?.referrer} />
                            <ReadOnlyField label={t("Status")}>
                                {record.active_tab ? (
                                    <div className={`text-green-500 font-bold`}>{t("Active")}</div>
                                ) : record.duration ? (
                                    <div className={`text-gray-500 font-bold`}>{t("Closed")}</div>
                                ) : (
                                    <div className={`text-amber-500 font-bold`}>{t("Inactive")}</div>
                                )}
                            </ReadOnlyField>
                            <ReadOnlyField label={t("Duration")}>
                                {record.duration &&
                                    (record.duration < 60
                                        ? `${record.duration} seconds`
                                        : dayjs.duration(record.duration, "seconds").humanize())}
                            </ReadOnlyField>
                        </div>
                        <div className={`flex gap-4 my-4 flex-wrap`}>
                            <ReadOnlyField label={t("Country")} value={record.country} />
                            <ReadOnlyField label={t("City")} value={record.city} />
                            <ReadOnlyField label={t("IP Address")} value={record.ip_address} />
                        </div>
                        <div className={`flex gap-4 my-4 flex-wrap`}>
                            <ReadOnlyField label={t("Operating System")} value={record.device_info?.operatingSystem} />
                            <ReadOnlyField
                                label={t("Operating System Version")}
                                value={record.device_info?.osVersion}
                            />
                            <ReadOnlyField label={t("Model")} value={record.device_info?.model} />
                            <ReadOnlyField
                                label={t("CPU Architecture")}
                                value={record.device_info?.cpu?.architecture}
                            />
                        </div>
                        <div className={`flex gap-4 my-4 flex-wrap`}>
                            <ReadOnlyField label={t("Browser")} value={record.device_info?.browser?.name} />
                            <ReadOnlyField label={t("Browser Version")} value={record.device_info?.browser?.version} />
                            <ReadOnlyField label={t("Browser Platform")} value={record.device_info?.platform} />
                        </div>
                        <div className={`flex gap-4 my-4 flex-wrap`}>
                            <ReadOnlyField label={t("Network Ping")} value={record.device_info?.network?.rtt} />
                            <ReadOnlyField
                                label={t("Network Speed Equivalent")}
                                value={record.device_info?.network?.effectiveType}
                            />
                        </div>
                        <div className={`flex gap-4 my-4 flex-wrap`}>
                            <ReadOnlyField label={t("User Agent")} value={record.device_info?.user_agent} />
                        </div>

                        <div className={`my-6 overflow-y-auto`}>
                            <H2>{t("Events")}</H2>
                            <Divider />
                            <Table className={`mt-2`}>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>{t("Time")}</Table.Th>
                                        <Table.Th>{t("Event")}</Table.Th>
                                        <Table.Th>{t("Page")}</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {/*sort by date*/}
                                    {record?.events
                                        ?.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                                        .map((item, index) => (
                                            <Table.Tr key={index}>
                                                <Table.Td>
                                                    {dayjs.utc(item.created_at).local().format("HH:mm:ss")}
                                                </Table.Td>
                                                <Table.Td>{snakeToHumanReadable(item.type)}</Table.Td>
                                                <Table.Td>{item.data?.location?.pathname}</Table.Td>
                                            </Table.Tr>
                                        ))}
                                </Table.Tbody>
                            </Table>
                        </div>
                    </Card>
                </form>
            ) : (
                <FormViewSkeleton />
            )}
        </main>
    );
}
