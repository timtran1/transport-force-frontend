import Card from "../../../common/ui/Card.jsx"
import H1 from "../../../common/ui/H1.jsx";
import useModel from "../../../common/api/useModel.jsx";
import {useParams} from "react-router-dom";
import ReadOnlyField from "../../../common/ui/ReadOnlyField.jsx";
import ViewFormActionBar from "../../../common/ui/ViewFormActionBar.jsx";
import FormViewSkeleton from "../../../common/ui/FormViewSkeleton.jsx";
import Checkbox from "../../../common/ui/Checkbox.jsx";
import {useTranslation} from "react-i18next";
import FileDisplay from "../../../common/ui/FileDisplay.jsx";
import Switch from "../../../common/ui/Switch.jsx";
import NotificationState from "../../../common/stores/NotificationState.js";

export default function BlogPostView() {
    const {t} = useTranslation()
    const {id} = useParams()
    const query = useModel('blog_post', {id, autoFetch: true})
    const {record, update} = query
    const {notify} = NotificationState(state => state)

    async function handleUpdatePublished(e) {
        await update({
            ...record,
            published: e.currentTarget.checked
        })
        notify({
            message: t('Blog Post updated successfully!'),
            type: 'success'
        })
    }

    return (
        <main className={`max-w-screen-xl m-auto my-[50px] px-[24px]`}>
            <ViewFormActionBar query={query}/>

            {record ?
                <form>
                    <Card>
                        <div className={`flex gap-4 mb-4 justify-between`}>
                            <H1>{t("Blog Post")}</H1>
                            <Switch
                                label={t("Published")}
                                checked={record.published}
                                onChange={handleUpdatePublished}
                            />
                        </div>
                        <div className={`flex gap-4 my-4 flex-wrap`}>
                            <FileDisplay
                                label={t("Featured Image")}
                                type="image"
                                src={record.featured_image?.name}
                                width={30}
                                height={30}
                            />
                        </div>
                        <div className={`flex gap-4 my-4 flex-wrap`}>
                            <ReadOnlyField
                                label={t("Title")}
                                value={record.title}
                            />
                            <ReadOnlyField
                                label={t("Sub-Title")}
                                value={record.subtitle}
                            />
                        </div>
                        <ReadOnlyField
                            label={t("Content")}
                        >
                            <div dangerouslySetInnerHTML={{__html: record.content}}/>

                        </ReadOnlyField>


                    </Card>
                </form>
                :
                <FormViewSkeleton/>
            }
        </main>
    )
}