import {useTranslation} from "react-i18next";
import Card from "../../../common/ui/Card.jsx";
import TextInput from "../../../common/ui/TextInput.jsx";
import H1 from "../../../common/ui/H1.jsx";
import {useState} from "react";
import useModel from "../../../common/api/useModel.jsx";
import NotificationState from "../../../common/stores/NotificationState.js";
import {useNavigate} from "react-router-dom";
import CreateFormActionBar from "../../../common/ui/CreateFormActionBar.jsx";
export default function SiteContentCreate() {
    const {t} = useTranslation();
    const [record, setRecord] = useState({
        locale: null,
        content: null
    });
    const {create, siteContentLoading} = useModel("site_content");
    const loading = siteContentLoading;
    const {notify} = NotificationState((state) => state);
    const navigate = useNavigate();
    async function handleSubmit(e) {
        try {
            e.preventDefault();
            const created = await create(record);
            await Promise.all([]);
            notify({
                message: t("Theme Translation created successfully!"),
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
                <CreateFormActionBar
                    loading={loading}
                    title={t(`Create Theme Translation`)}
                />

                <Card>
                    <H1>{t("Theme Translation")}</H1>
                    <div className={`flex gap-2 my-2 flex-wrap`}></div>
                </Card>
            </form>
        </main>
    );
}
