import Card from "../../../common/ui/Card.jsx"
import H1 from "../../../common/ui/H1.jsx";
import useModel from "../../../common/api/useModel.jsx";
import {useParams} from "react-router-dom";
import ReadOnlyField from "../../../common/ui/ReadOnlyField.jsx";
import ViewFormActionBar from "../../../common/ui/ViewFormActionBar.jsx";
import FormViewSkeleton from "../../../common/ui/FormViewSkeleton.jsx";
import {useTranslation} from "react-i18next";
import RecordDisplay from "../../../common/ui/RecordDisplay.jsx";
import dayjs from "dayjs";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMapLocationDot} from "@fortawesome/free-solid-svg-icons";

export default function LocationLogView() {
    const {t} = useTranslation()
    const {id} = useParams()
    const query = useModel('location_log', {id, autoFetch: true})
    const {record} = query
    const googleMapsLink = `https://maps.google.com/?q=${record?.latitude},${record?.longitude}`

    return (
        <main className={`max-w-screen-xl m-auto my-[50px] px-[24px]`}>
            <ViewFormActionBar query={query}/>

            {record ?
                <form>
                    <Card>
                        <H1>{t("Location Log")}</H1>

                        <div className={`flex gap-4 my-4 flex-wrap`}>
                            <ReadOnlyField
                                label={t("Time")}
                            >
                                {dayjs.utc(record.created_at).local().format('DD/MM/YYYY (HH:mm)')}
                            </ReadOnlyField>
                            <RecordDisplay
                                label={t("User")}
                                linkTo={`/users/${record.owner?.id}`}
                                value={record.owner?.name || record.owner?.username}
                            />
                            <ReadOnlyField
                                label={t("Latitude")}
                                value={record.latitude}
                            />
                            <ReadOnlyField
                                label={t("Longitude")}
                                value={record.longitude}
                            />
                        </div>

                        <div className={`flex gap-4 my-4 flex-wrap`}>
                            {record?.latitude && record?.longitude &&
                                <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className={`text-sm bg-primary-main text-primary-contrastText rounded py-2 px-4`}>
                                    <FontAwesomeIcon icon={faMapLocationDot} className={`mr-2`}/>
                                    Open in Google Maps
                                </a>
                            }
                        </div>

                    </Card>
                </form>
                :
                <FormViewSkeleton/>
            }
        </main>
    )
}