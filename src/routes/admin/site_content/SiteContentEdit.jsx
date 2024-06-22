import {useTranslation} from "react-i18next";
import Card from "../../../common/ui/Card.jsx";
import TextInput from "../../../common/ui/TextInput.jsx";
import H1 from "../../../common/ui/H1.jsx";
import useModel from "../../../common/api/useModel.jsx";
import NotificationState from "../../../common/stores/NotificationState.js";
import {useNavigate, useParams} from "react-router-dom";
import FormViewSkeleton from "../../../common/ui/FormViewSkeleton.jsx";
import EditFormActionBar from "../../../common/ui/EditFormActionBar.jsx";
import {JsonInput, Table} from "@mantine/core";
import Divider from "../../../common/ui/Divider.jsx";
import H2 from "../../../common/ui/H2.jsx";
import TextArea from "../../../common/ui/TextArea.jsx";
import {useState} from "react";
import VisibilityControl from "../../../common/auth/VisibilityControl.jsx";
import Button from "../../../common/ui/Button.jsx";
import {useDisclosure} from "@mantine/hooks";
import useDevMode from "../../../common/api/useDevMode.js";

export default function SiteContentEdit() {
    const {t} = useTranslation();
    const {id} = useParams();
    const devMode = useDevMode();
    const query = useModel("site_content", {
        id,
        autoFetch: true
    });
    const {record, setRecord, update, loading} = query;
    const content = record?.content;
    const {notify} = NotificationState((state) => state);
    const navigate = useNavigate();
    const [rawEnabled, {close: closeRawEnabled, open: openRawEnabled}] =
        useDisclosure(false);
    const [rawContent, setRawContent] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const filteredContent = searchTerm ?
        Object.keys(content || {}).filter(key => {
                const val = content[key];
                const term = searchTerm.toLowerCase();
                return key.toLowerCase().includes(term) || val.toLowerCase().includes(term)
            }
        ).reduce((obj, key) => {
            obj[key] = content[key];
            return obj;
        }, {})
        :
        content

    async function handleSubmit(e) {
        try {
            e.preventDefault();

            const recordData = {...record}
            if (rawContent) {
                recordData.content = JSON.parse(rawContent)
            }

            await update(recordData)
            notify({
                message: t("Theme Translation updated successfully!"),
                type: "success"
            });
            navigate(-1);
        } catch (e) {
            console.error(e);
            notify({
                message: e.message,
                type: "error"
            });
        }
    }

    function enableRawMode() {
        setRawContent(JSON.stringify(record.content, null, 2));
        openRawEnabled();
    }

    function disableRawMode() {
        closeRawEnabled();
        setRecord({
            ...record,
            content: JSON.parse(rawContent)
        });
        setRawContent("")
    }

    return (
        <form className={`max-w-screen-xl m-auto my-[20px] px-[24px]`} onSubmit={handleSubmit}>

            <EditFormActionBar query={query}/>

            {record ?
                <Card>
                    <div className={`flex justify-between`}>
                        <H1>{t("Theme Translation")}</H1>
                        {devMode &&
                            <VisibilityControl roleIds={[`super_admin_role`, `admin_role`]} render={false}>
                                {rawEnabled ?
                                    <Button onClick={disableRawMode}>
                                        {t("Disable raw edit")}
                                    </Button>
                                    :
                                    <Button onClick={enableRawMode}>
                                        {t("Enable raw edit")}
                                    </Button>
                                }
                            </VisibilityControl>
                        }
                    </div>

                    {rawEnabled &&
                        <div className={`flex gap-2 my-2 flex-wrap w-full`}>
                            <JsonInput
                                className={`w-full`}
                                label="Content"
                                description={`In JSON object format`}
                                validationError="Invalid JSON"
                                formatOnBlur
                                autosize
                                required
                                minRows={20}
                                value={rawContent}
                                onChange={setRawContent}
                            />
                        </div>
                    }

                    {!rawEnabled &&
                        <div className={`my-6 overflow-y-auto`}>
                            <H2>{t("Content Keys")}</H2>
                            <Divider/>
                            <div className={`flex gap-2 my-2 flex-wrap`}>
                                <TextInput
                                    classNames={{input: "shadow-sm"}}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={t(`Search...`)}
                                />
                            </div>
                            <Table className={`mt-2`}>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>{t("Key")}</Table.Th>
                                        <Table.Th>{t("Value")}</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {Object.keys(filteredContent).map((key, index) =>
                                        <Table.Tr key={index}>
                                            <Table.Td className={`w-1/3`}>
                                                {key}
                                            </Table.Td>
                                            <Table.Td>
                                                <TextArea
                                                    autosize
                                                    className={`w-full`}
                                                    required
                                                    variant="filled"
                                                    value={content[key]}
                                                    placeholder={t(`Item description`)}
                                                    onChange={e => {
                                                        const dataCopy = {...content}
                                                        dataCopy[key] = e.target.value;
                                                        setRecord({
                                                            ...record,
                                                            content:
                                                            dataCopy
                                                        });
                                                    }}
                                                />
                                            </Table.Td>
                                        </Table.Tr>
                                    )}
                                </Table.Tbody>
                            </Table>
                        </div>
                    }
                </Card>
                :
                <FormViewSkeleton/>
            }
        </form>
    );
}
