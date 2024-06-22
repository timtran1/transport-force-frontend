import TextInput from "../../../common/ui/TextInput.jsx";
import H1 from "../../../common/ui/H1.jsx";
import {useState, useRef} from "react";
import useModel from "../../../common/api/useModel.jsx";
import NotificationState from "../../../common/stores/NotificationState.js";
import {useNavigate} from "react-router-dom";
import CreateFormWrapper from "../../../common/ui/CreateFormWrapper.jsx";
import TextArea from "../../../common/ui/TextArea.jsx";
import Switch from "../../../common/ui/Switch.jsx";
import FileInput from "../../../common/ui/FileInput.jsx";
import {useTranslation} from "react-i18next";
import RichTextInput from "../../../common/ui/RichTextInput.jsx";
import calculateReadingLength from "../../../common/utils/calculateReadingLength.js";

export default function BlogPostCreate(props) {
    const {t} = useTranslation()
    const {modalMode, onSuccess, parent} = props
    const richTextInputRef = useRef();

    const [record, setRecord] = useState({
        title: '',
        subtitle: '',
        content: '',
        reading_length: '',
        published: false,
        featured_image_attachment_id: null,
    })

    const {create, blogPostLoading} = useModel('blog_post')


    const loading = blogPostLoading
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

            const created = await create(record)
            await Promise.all([])
            notify({message: 'Blog Post created successfully!', type: 'success'})
            if (onSuccess) {
                onSuccess(created)
            } else {
                navigate(-1)
            }
        } catch (error) {
            console.error(error)
            notify({message: error.message, type: 'error'})
        }
    }

    return (
        <CreateFormWrapper onSubmit={handleSubmit} modalMode={modalMode} loading={loading}>
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
        </CreateFormWrapper>
    )
}