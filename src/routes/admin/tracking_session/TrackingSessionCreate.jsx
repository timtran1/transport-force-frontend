import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {CloseButton, Table} from "@mantine/core";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import useModel from "../../../common/api/useModel.jsx";
import useOne2many from "../../../common/api/useOne2many.js";
import NotificationState from "../../../common/stores/NotificationState.js";
import Button from "../../../common/ui/Button.jsx";
import Card from "../../../common/ui/Card.jsx";
import Checkbox from "../../../common/ui/Checkbox.jsx";
import CreateFormActionBar from "../../../common/ui/CreateFormActionBar.jsx";
import Divider from "../../../common/ui/Divider.jsx";
import H1 from "../../../common/ui/H1.jsx";
import H2 from "../../../common/ui/H2.jsx";
import TextInput from "../../../common/ui/TextInput.jsx";

export default function TrackingSessionCreate() {
    const {t} = useTranslation();
    const [record, setRecord] = useState({
        origin: "",
        country: "",
        ip_address: "",
        device_info: null,
        duration: null,
        live_websocket: false,
    });
    const {create, trackingSessionLoading} = useModel("tracking_session");
    const {create: createEvents, loading: eventsLoading} = useOne2many({
        parentRecord: record,
        childModel: "tracking_event",
        relationshipName: "events",
        foreignKeyField: "tracking_session_id",
    });
    const [events, setEvents] = useState([]);
    const loading = trackingSessionLoading || eventsLoading;
    const {notify} = NotificationState((state) => state);
    const navigate = useNavigate();
    async function handleSubmit(e) {
        try {
            e.preventDefault();
            const created = await create(record);
            await Promise.all([createEvents(events, created)]);
            notify({
                message: t("Tracking Session created successfully!"),
                type: "success",
            });
            navigate(-1);
        } catch (error) {
            console.error(error);
            notify({
                message: error.message,
                type: "error",
            });
        }
    }
    return (
        <main className={`max-w-screen-xl m-auto my-[20px] px-[24px]`}>
            <form onSubmit={handleSubmit}>
                <CreateFormActionBar loading={loading} title={t(`Create Tracking Session`)} />

                <Card>
                    <H1>{t("Tracking Session")}</H1>
                    <div className={`flex gap-2 my-2 flex-wrap`}>
                        <TextInput
                            label={t("Origin")}
                            placeholder={t("Enter Origin")}
                            value={record.origin}
                            onChange={(e) =>
                                setRecord({
                                    ...record,
                                    origin: e.target.value,
                                })
                            }
                        />
                        <TextInput
                            label={t("Country")}
                            placeholder={t("Enter Country")}
                            value={record.country}
                            onChange={(e) =>
                                setRecord({
                                    ...record,
                                    country: e.target.value,
                                })
                            }
                        />
                        <TextInput
                            label={t("IP Address")}
                            placeholder={t("Enter IP Address")}
                            value={record.ip_address}
                            onChange={(e) =>
                                setRecord({
                                    ...record,
                                    ip_address: e.target.value,
                                })
                            }
                        />
                        <Checkbox
                            label={t("Live Websocket")}
                            checked={record.live_websocket}
                            onChange={(e) =>
                                setRecord({
                                    ...record,
                                    live_websocket: e.target.checked,
                                })
                            }
                        />
                    </div>
                    <div className={`my-6 overflow-y-auto`}>
                        <H2>{t("Events")}</H2>
                        <Divider />
                        <Table className={`mt-2`}>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>{t("Name")}</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {events.map((item, index) => (
                                    <Table.Tr key={index}>
                                        <Table.Td>
                                            <TextInput
                                                className={`w-full`}
                                                required
                                                variant="unstyled"
                                                value={item.name}
                                                placeholder={t(`Item name`)}
                                                onChange={(e) => {
                                                    const dataCopy = [...events];
                                                    dataCopy[index].name = e.target.value;
                                                    setEvents(dataCopy);
                                                }}
                                            />
                                        </Table.Td>
                                        <Table.Td>
                                            <CloseButton
                                                disabled={loading}
                                                onClick={() => {
                                                    const dataCopy = [...events];
                                                    dataCopy.splice(index, 1);
                                                    setEvents(dataCopy);
                                                }}
                                            />
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                        <Button
                            className={`px-2 py-1 mt-4 bg-primary-main font-[600] text-[12px] text-primary-contrastText`}
                            onClick={() => {
                                const dataCopy = [...events];
                                dataCopy.push({
                                    tracking_session_id: record.id,
                                });
                                setEvents(dataCopy);
                            }}
                            type={`button`}
                            size={`xs`}
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-1 h-4 w-4 " />
                            {t("Add item")}
                        </Button>
                    </div>
                </Card>
            </form>
        </main>
    );
}
