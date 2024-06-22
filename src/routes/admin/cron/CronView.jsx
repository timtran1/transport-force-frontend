import Card from "../../../common/ui/Card.jsx"
import H1 from "../../../common/ui/H1.jsx";
import useModel from "../../../common/api/useModel.jsx";
import {useParams} from "react-router-dom";
import ReadOnlyField from "../../../common/ui/ReadOnlyField.jsx";
import ViewFormActionBar from "../../../common/ui/ViewFormActionBar.jsx";
import FormViewSkeleton from "../../../common/ui/FormViewSkeleton.jsx";
import Checkbox from "../../../common/ui/Checkbox.jsx";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";

export default function CronView() {
    const {t} = useTranslation()
    const {id} = useParams()
    const query = useModel('cron', {id, autoFetch: true})
    const {record} = query

    return (
        <main className={`max-w-screen-xl m-auto my-[50px] px-[24px]`}>
            <ViewFormActionBar query={query}/>

            {record ?
                <form>
                    <Card>
                        <H1>{t("Scheduled Action")}</H1>

                        <div className={`flex gap-4 my-4 flex-wrap`}>
                            <ReadOnlyField
                                label={t("Name")}
                                value={record.name}
                            />
                            <ReadOnlyField
                                label={t("Interval")}
                                value={record.interval}
                            />
                            <ReadOnlyField
                                label={t("Interval Unit")}
                                value={record.interval_unit}
                            />
                            <Checkbox
                                label={t("Enabled")}
                                checked={record.enabled}
                            />
                        </div>
                        <div className={`flex gap-4 my-4 flex-wrap`}>
                            <ReadOnlyField
                                label={t("Model")}
                                value={record.model}
                            />
                            <ReadOnlyField
                                label={t("Method")}
                                value={record.method}
                            />
                            <ReadOnlyField
                                label={t("Arguments")}
                                value={record.arguments}
                            />
                        </div>
                        <div className={`flex gap-4 my-4 flex-wrap`}>
                            <ReadOnlyField
                                label={t("Last Run")}
                                value={record?.last_run && dayjs.utc(record.last_run).local().format('DD/MM/YYYY HH:mm:ss')}
                            />
                            <ReadOnlyField
                                label={t("Next Run")}
                                value={record?.next_run && dayjs.utc(record.next_run).local().format('DD/MM/YYYY HH:mm:ss')}
                            />
                        </div>
                    </Card>
                </form>
                :
                <FormViewSkeleton/>
            }
        </main>
    )
}