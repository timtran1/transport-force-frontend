import Card from "../../../common/ui/Card.jsx"
import H1 from "../../../common/ui/H1.jsx";
import useModel from "../../../common/api/useModel.jsx";
import {useParams} from "react-router-dom";
import ReadOnlyField from "../../../common/ui/ReadOnlyField.jsx";
import ViewFormActionBar from "../../../common/ui/ViewFormActionBar.jsx";
import FormViewSkeleton from "../../../common/ui/FormViewSkeleton.jsx";
import { useTranslation } from "react-i18next";
import RecordDisplay from "../../../common/ui/RecordDisplay.jsx";

export default function ScanView() {
    const {t} = useTranslation()
    const {id} = useParams()
    const query = useModel('scan', {id, autoFetch: true})
    const {record} = query

    return (
        <main className={`max-w-screen-xl m-auto my-[50px] px-[24px]`}>
            <ViewFormActionBar query={query}/>

            {record ?
                <form>
                    <Card>
                        <H1>{t("Scan")}</H1>

                        <div className={`flex gap-4 my-4 flex-wrap`}>
                            <ReadOnlyField
                                label={t("Barcode")}
                                value={record.barcode}
                            />
                            <ReadOnlyField
                                label={t("Scan Type")}
                                value={record.scan_type}
                            />
                            <ReadOnlyField
                                label={t("Latitude")}
                                value={record.latitude}
                            />
                            <ReadOnlyField
                                label={t("Longitude")}
                                value={record.longitude}
                            />
                            <ReadOnlyField
                                label={t("Foo")}
                                value={record.foo}
                            />
                            <ReadOnlyField
                                label={t("Bar")}
                                value={record.bar}
                            />
                            <ReadOnlyField
                                label={t("Notes")}
                                value={record.notes}
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