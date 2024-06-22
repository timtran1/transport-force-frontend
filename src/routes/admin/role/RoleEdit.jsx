import {useTranslation} from "react-i18next";
import Card from "../../../common/ui/Card.jsx";
import TextInput from "../../../common/ui/TextInput.jsx";
import {JsonInput} from "@mantine/core";
import H1 from "../../../common/ui/H1.jsx";
import useModel from "../../../common/api/useModel.jsx";
import NotificationState from "../../../common/stores/NotificationState.js";
import {useNavigate, useParams} from "react-router-dom";
import FormViewSkeleton from "../../../common/ui/FormViewSkeleton.jsx";
import EditFormActionBar from "../../../common/ui/EditFormActionBar.jsx";
import useMany2Many from "../../../common/api/useMany2Many.js";
import {useState, useEffect} from "react";
import {usePrevious} from "@mantine/hooks";
import RecordSelectMulti from "../../../common/ui/RecordSelectMulti.jsx";
import TextArea from "../../../common/ui/TextArea.jsx";
export default function RoleEdit() {
    const {t} = useTranslation();
    const {id} = useParams();
    const query = useModel("role", {
        id,
        autoFetch: true
    });
    const {record, setRecord, update, loading: recordLoading} = query;
    const {notify} = NotificationState((state) => state);
    const navigate = useNavigate();
    const {update: updateImpliedRoles, loading: impliedRolesLoading} =
        useMany2Many({
            junctionModel: "implied_role",
            thisForeignKeyField: "role_id",
            thatForeignKeyField: "implied_role_id",
            relationshipName: "implied_roles"
        });
    const [impliedRoles, setImpliedRoles] = useState([]);
    const loading = recordLoading || impliedRolesLoading;
    const previousRecordValue = usePrevious(record);
    useEffect(() => {
        if (!previousRecordValue && record) {
            setImpliedRoles(record.implied_roles);
        }
    }, [record]);
    async function handleSubmit(e) {
        try {
            e.preventDefault();
            // validate JSON
            try {
                JSON.parse(record.permissions);
            } catch (e) {
                notify({
                    message: t("Invalid JSON"),
                    type: "error"
                });
                return;
            }
            await Promise.all([
                update(record),
                updateImpliedRoles(impliedRoles, record)
            ]);
            notify({
                message: t("Role updated successfully!"),
                type: "success"
            });
            navigate(-1);
        } catch (error) {
            console.error(error);
            notify({
                message: error.message,
                type: "error"
            });
        }
    }
    return (
        <main className={`max-w-screen-xl m-auto my-[20px] px-[24px]`}>
            <form onSubmit={handleSubmit}>
                <EditFormActionBar title={t(`Edit role`)} loading={loading} />

                {record ? (
                    <Card>
                        <H1>{t("Role")}</H1>
                        {/*Row 1*/}
                        <div className={`flex gap-2 my-2`}>
                            {/*Column 1*/}
                            <div
                                className={`flex flex-col grow max-w-screen-xl gap-2`}
                            >
                                <TextInput
                                    label={t("Display name")}
                                    description={t(`Must be unique`)}
                                    placeholder={t("Invoice Manager")}
                                    required
                                    value={record.name}
                                    onChange={(e) =>
                                        setRecord({
                                            ...record,
                                            name: e.target.value
                                        })
                                    }
                                />
                                <TextArea
                                    label={t("Description")}
                                    placeholder={t("Enter Description")}
                                    value={record.description}
                                    onChange={(e) =>
                                        setRecord({
                                            ...record,
                                            description: e.target.value
                                        })
                                    }
                                />
                                <RecordSelectMulti
                                    model="role"
                                    displayField="name"
                                    searchFields={["name"]}
                                    label={t("Implied roles")}
                                    placeholder="Select implied roles"
                                    value={impliedRoles}
                                    onChange={(value) => setImpliedRoles(value)}
                                />
                                <JsonInput
                                    label="Permissions"
                                    description={`In JSON format`}
                                    validationError="Invalid JSON"
                                    formatOnBlur
                                    autosize
                                    required
                                    minRows={10}
                                    value={record.permissions}
                                    onChange={(value) =>
                                        setRecord({
                                            ...record,
                                            permissions: value
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </Card>
                ) : (
                    <FormViewSkeleton />
                )}
            </form>
        </main>
    );
}
