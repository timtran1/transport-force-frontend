import Card from "../../../common/ui/Card.jsx"
import H1 from "../../../common/ui/H1.jsx";
import useModel from "../../../common/api/useModel.jsx";
import {useParams} from "react-router-dom";
import ReadOnlyField from "../../../common/ui/ReadOnlyField.jsx";
import ViewFormActionBar from "../../../common/ui/ViewFormActionBar.jsx";
import FormViewSkeleton from "../../../common/ui/FormViewSkeleton.jsx";
import {useTranslation} from "react-i18next";

export default function VehicleView() {
    const {t} = useTranslation()
    const {id} = useParams()
    const query = useModel('vehicle', {id, autoFetch: true})
    const {record} = query

    return (
        <main className={`max-w-screen-xl m-auto my-[50px] px-[24px]`}>
            <ViewFormActionBar query={query}/>

            {record ?
                <form>
                    <Card>
                        <H1>{t("Vehicle")}</H1>

                        <div className={`flex gap-4 my-4 flex-wrap`}>
                            <ReadOnlyField
                                label={t("Name")}
                                value={record.name}
                            />
                            <ReadOnlyField
                                label={t("License Plate")}
                                value={record.license_plate}
                            />
                        </div>
                        <div className={`flex gap-4 my-4 flex-wrap`}>
                            <ReadOnlyField
                                label={t("Make")}
                                value={record.make}
                            />
                            <ReadOnlyField
                                label={t("Model")}
                                value={record.model}
                            />

                            <ReadOnlyField
                                label={t("Year")}
                                value={record.year}
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