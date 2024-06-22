import {useTranslation} from "react-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faCheck} from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button.jsx";
import {useNavigate} from "react-router-dom";
export default function CreateFormActionBar(props) {
    const {t} = useTranslation();
    const {loading, modalMode} = props;
    const navigate = useNavigate();
    return (
        <div
            className={`flex w-full justify-between fields-end mb-[12px] items-end`}
        >
            {!modalMode && (
                <div>
                    <Button
                        className={`shadow text-[14px] font-[600] `}
                        variant={`outline`}
                        onClick={() => navigate(-1)}
                    >
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            className="mr-1 h-3 w-3"
                            size={`sm`}
                        />
                        {t("Back")}
                    </Button>
                </div>
            )}

            <Button
                className={`shadow text-[14px] font-[600] bg-primary-main text-primary-contrastText ${
                    modalMode ? "grow" : ""
                }`}
                disabled={loading}
                loading={loading}
                variant={`filled`}
                type={`submit`}
            >
                <FontAwesomeIcon
                    icon={faCheck}
                    className="mr-1 h-4 w-4"
                    size={`sm`}
                />
                {t("Save")}
            </Button>
        </div>
    );
}
