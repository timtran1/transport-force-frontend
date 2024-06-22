import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import Button from "../../common/ui/Button.jsx";

export default function NotFound404() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    return (
        <main>
            <h1 className={`p-10 font-bold text-5xl text-center`}>
                {t("404 Not Found")}
            </h1>
            <div className={`mx-auto flex justify-center mb-4`}>
                <Button
                    className={`p-2 bg-gray-200 mx-auto`}
                    onClick={() => navigate(-1)}
                >
                    {t("Go back")}
                </Button>
            </div>
        </main>
    );
}
