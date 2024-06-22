import {useTranslation} from "react-i18next";
import Card from "../../../common/ui/Card.jsx";
import TextInput from "../../../common/ui/TextInput.jsx";
import H1 from "../../../common/ui/H1.jsx";
import useModel from "../../../common/api/useModel.jsx";
import NotificationState from "../../../common/stores/NotificationState.js";
import {useNavigate} from "react-router-dom";
import FormViewSkeleton from "../../../common/ui/FormViewSkeleton.jsx";
import EditFormActionBar from "../../../common/ui/EditFormActionBar.jsx";
import NumberInput from "../../../common/ui/NumberInput.jsx";
import PasswordInput from "../../../common/ui/PasswordInput.jsx";
import Switch from "../../../common/ui/Switch.jsx";

export default function SMTPSettings() {
    const {t} = useTranslation();
    const query = useModel("organization", {
        id: 1,
        autoFetch: true
    });
    const {record, setRecord, update, loading} = query;
    const {notify} = NotificationState();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        try {
            e.preventDefault();
            await Promise.all([update(record)]);
            notify({
                message: t("SMTP Settings updated successfully!"),
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
        <form
            className={`max-w-screen-xl m-auto my-[20px] px-[24px]`}
            onSubmit={handleSubmit}
        >
            <EditFormActionBar loading={loading}/>

            {record ? (
                <Card className={`shadow-none border-none`}>
                    <H1>{t('SMTP Settings')}</H1>
                    {/*Row 1*/}
                    <div className={`flex gap-2 my-2 flex-col max-w-[300px]`}>
                        <TextInput
                            label={t("SMTP Server")}
                            value={record.mail_server}
                            onChange={(e) =>
                                setRecord({
                                    ...record,
                                    mail_server: e.target.value
                                })
                            }
                        />
                        <NumberInput
                            label={t("SMTP Port")}
                            value={record.mail_port}
                            onChange={value =>
                                setRecord({
                                    ...record,
                                    mail_port: value
                                })
                            }
                            min={0}
                            step={1}
                        />
                        <TextInput
                            label={t("SMTP Username")}
                            value={record.mail_username}
                            onChange={(e) =>
                                setRecord({
                                    ...record,
                                    mail_username: e.target.value
                                })
                            }
                        />
                        <PasswordInput
                            label={t("SMTP Password")}
                            value={record.mail_password}
                            onChange={(e) =>
                                setRecord({
                                    ...record,
                                    mail_password: e.target.value
                                })
                            }
                        />
                        <TextInput
                            label={t("From Name")}
                            value={record.mail_from_name}
                            onChange={(e) =>
                                setRecord({
                                    ...record,
                                    mail_from_name: e.target.value
                                })
                            }
                        />
                        <TextInput
                            label={t("From Email")}
                            value={record.mail_from}
                            onChange={(e) =>
                                setRecord({
                                    ...record,
                                    mail_from: e.target.value
                                })
                            }
                            type="email"
                        />
                        <Switch
                            className={`my-2`}
                            label={t('Validate Certificates')}
                            value={record.mail_validate_certs}
                            checked={e => setRecord({...record, mail_validate_certs: e.currentTarget.checked})}
                        />
                        <Switch
                            className={`my-2`}
                            label={t('SSL/TLS')}
                            value={record.mail_ssl_tls}
                            checked={e => setRecord({...record, mail_ssl_tls: e.currentTarget.checked})}
                        />
                        <Switch
                            className={`my-2`}
                            label={t('STARTTLS')}
                            value={record.mail_starttls}
                            checked={e => setRecord({...record, mail_starttls: e.currentTarget.checked})}
                        />
                    </div>
                </Card>
            ) : (
                <FormViewSkeleton/>
            )}
        </form>
    );
}
