import Card from "../../../common/ui/Card.jsx";
import TextInput from "../../../common/ui/TextInput.jsx";
import H1 from "../../../common/ui/H1.jsx";
import useModel from "../../../common/api/useModel.jsx";
import NotificationState from "../../../common/stores/NotificationState.js";
import {useNavigate, useParams} from "react-router-dom";
import FormViewSkeleton from "../../../common/ui/FormViewSkeleton.jsx";
import EditFormActionBar from "../../../common/ui/EditFormActionBar.jsx";
import {useRef} from "react";
import TextArea from "../../../common/ui/TextArea.jsx";
import Switch from "../../../common/ui/Switch.jsx";
import FileInput from "../../../common/ui/FileInput.jsx";
import {useTranslation} from "react-i18next";
import RichTextInput from "../../../common/ui/RichTextInput.jsx";
import calculateReadingLength from "../../../common/utils/calculateReadingLength.js";

export default function BlogPostEdit() {
    const {t} = useTranslation()
    const {id} = useParams()
    const richTextInputRef = useRef();
    const query = useModel('blog_post', {id, autoFetch: true})
    const {record, setRecord, update, loading: recordLoading} = query

    const loading = recordLoading
    const {notify} = NotificationState(state => state)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        try {
            e.preventDefault()
            if (richTextInputRef.current) {
                const html = richTextInputRef.current.getHTML()
                record.content = html
                record.reading_length = calculateReadingLength(html)
            }

            await Promise.all([
                update(record),
            ])
            notify({message: 'Blog Post updated successfully!', type: 'success'})
            navigate(-1)
        } catch (e) {
            console.error(e)
            notify({message: e.message, type: 'error'})
        }
    }

    return (
        <form className={`max-w-screen-xl m-auto my-[20px] px-[24px]`} onSubmit={handleSubmit}>
            <EditFormActionBar query={query}/>
            {record ?
                <Card>
                    <div className={`flex justify-between`}>
                        <H1>{t("Blog Post")}</H1>
                        <Switch
                            label={t("Published")}
                            checked={record.published}
                            onChange={e => setRecord({...record, published: e.currentTarget.checked})}
                        />
                    </div>
                    <div className={`flex gap-2 my-2 flex-wrap`}>
                        <FileInput
                            label={t("Featured Image")}
                            value={record.featured_image?.name}
                            onChange={file =>
                                setRecord({
                                    ...record,
                                    featured_image: file,
                                    featured_image_attachment_id: file?.id
                                })
                            }
                            type="image"
                        />

                    </div>
                    <div className={`flex gap-2 my-2 flex-col max-w-screen-xl`}>
                        <TextInput
                            className={`grow`}
                            label={t("Title")}
                            placeholder={t("Enter Title")}
                            value={record.title}
                            onChange={e => setRecord({...record, title: e.target.value})}
                            required
                        />
                        <TextArea
                            required
                            label={t("Sub-Title")}
                            placeholder={t("Enter Sub-Title")}
                            value={record.subtitle}
                            onChange={e => setRecord({...record, subtitle: e.target.value})}
                        />

                        <div>
                            <RichTextInput
                                label={t("Content")}
                                ref={richTextInputRef}
                                content={record.content}
                            />
                        </div>
                    </div>
                </Card>
                :
                <FormViewSkeleton/>
            }
        </form>
    )
}