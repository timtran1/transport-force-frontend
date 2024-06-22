import {useTranslation} from "react-i18next";
import TextInput from "../../../common/ui/TextInput.jsx";
import H1 from "../../../common/ui/H1.jsx";
import {useState} from "react";
import NotificationState from "../../../common/stores/NotificationState.js";
import {useNavigate} from "react-router-dom";
import useAuthentication from "../../../common/api/useAuthentication.js";
import RecordSelectMulti from "../../../common/ui/RecordSelectMulti.jsx";
import useMany2Many from "../../../common/api/useMany2Many.js";
import useModel from "../../../common/api/useModel.jsx";
import FileInput from "../../../common/ui/FileInput.jsx";
import {getAttachmentUrl} from "../../../common/utils/index.js";
import CreateFormWrapper from "../../../common/ui/CreateFormWrapper.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAddressBook, faFingerprint} from "@fortawesome/free-solid-svg-icons";
import {Tabs} from "@mantine/core";
import VisibilityControl from "../../../common/auth/VisibilityControl.jsx";
import Select from "../../../common/ui/Select.jsx";
import H3 from "../../../common/ui/H3.jsx";
import Divider from "../../../common/ui/Divider.jsx";
import countries from "../../../constants/countries.js";
import BackendHostURLState from "../../../common/stores/BackendHostURLState.js";
export default function UserCreate(props) {
    const {modalMode} = props;
    const {backendHost} = BackendHostURLState((state) => state);
    const {t} = useTranslation();
    const [record, setRecord] = useState({
        string_id: null,
        username: null,
        email: null,
        signed_up: true,
        internal: true,
        image_id: null,
        cv_attachment_id: null,
        street: null,
        street2: null,
        city: null,
        state: null,
        zip: null,
        country: null,
        name: null,
        last_name: null,
        first_name: null,
        middle_name: null,
        title: null,
        phone: null,
        mobile: null,
        website: null
    });
    const [roles, setRoles] = useState([]);
    const {create: createRoles} = useMany2Many({
        junctionModel: "user_role",
        thisForeignKeyField: "user_id",
        thatForeignKeyField: "role_id",
        relationshipName: "roles"
    });
    const [loading, setLoading] = useState(false);
    const {notify} = NotificationState((state) => state);
    const navigate = useNavigate();
    const {create: createUser} = useModel("user");
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const created = await createUser(record);
            await Promise.all([createRoles(roles, created)]);
            notify({
                message: t("User created successfully!"),
                type: "success"
            });
            navigate(-1);
        } catch (e) {
            console.error(e);
            notify({
                message: e.message,
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    }
    return (
        <CreateFormWrapper
            onSubmit={handleSubmit}
            modalMode={modalMode}
            loading={loading}
        >
            <div className={`flex items-start justify-between gap-2`}>
                <div className={`flex items-center gap-2`}>
                    <FileInput
                        value={record.image?.name}
                        onChange={(file) =>
                            setRecord({
                                ...record,
                                image: file,
                                image_id: file?.id
                            })
                        }
                        type="image"
                    />
                    <H1>{record.username}</H1>
                </div>
            </div>

            <div className={`flex gap-2 my-2 flex-wrap`}>
                <TextInput
                    className={`grow`}
                    label={t("Username")}
                    description={t("Unique identifier for your user")}
                    placeholder={t(`john.doe`)}
                    required
                    value={record.username}
                    onChange={(e) =>
                        setRecord({
                            ...record,
                            username: e.target.value
                        })
                    }
                />
                <TextInput
                    className={`grow`}
                    label={t("Email")}
                    value={record.email}
                    description={t("Unique primary email")}
                    type={`email`}
                    placeholder={t("me@example.com")}
                    onChange={(e) =>
                        setRecord({
                            ...record,
                            email: e.target.value
                        })
                    }
                    required
                />
            </div>

            <div className={`flex gap-2 my-2 flex-wrap`}>
                <TextInput
                    label={t("Company name")}
                    value={record.company_name}
                    onChange={(e) =>
                        setRecord({
                            ...record,
                            company_name: e.target.value
                        })
                    }
                />
            </div>

            <Tabs variant="outline" defaultValue="contact" className={`mt-4`}>
                <Tabs.List>
                    <Tabs.Tab
                        value="contact"
                        leftSection={
                            <FontAwesomeIcon
                                icon={faAddressBook}
                                className="h-4 w-4 "
                            />
                        }
                    >
                        {t("Contact Info")}
                    </Tabs.Tab>
                    <VisibilityControl
                        roleIds={[`super_admin_role`, `admin_role`]}
                        render={false}
                    >
                        <Tabs.Tab
                            value="access"
                            leftSection={
                                <FontAwesomeIcon
                                    icon={faFingerprint}
                                    className="h-4 w-4 "
                                />
                            }
                        >
                            {t("Access")}
                        </Tabs.Tab>
                    </VisibilityControl>
                </Tabs.List>

                <VisibilityControl
                    roleIds={[`super_admin_role`, `admin_role`]}
                    render={false}
                >
                    <Tabs.Panel value="access" className={`mt-4`}>
                        <RecordSelectMulti
                            label={t(`Roles`)}
                            model={`role`}
                            value={roles}
                            onChange={setRoles}
                        />
                    </Tabs.Panel>
                </VisibilityControl>

                <Tabs.Panel value="contact">
                    <div className={`flex gap-2 my-2 flex-wrap`}>
                        <Select
                            label={t("Title")}
                            classNames={{
                                root: "max-w-[80px]"
                            }}
                            data={["Mr", "Mrs", "Ms", "Dr", "Prof"]}
                            searchable
                            value={record.title}
                            onChange={(value) =>
                                setRecord({
                                    ...record,
                                    title: value
                                })
                            }
                        />
                        <TextInput
                            label={t("Display name")}
                            value={record.name}
                            onChange={(e) =>
                                setRecord({
                                    ...record,
                                    name: e.target.value
                                })
                            }
                        />
                        <TextInput
                            label={t("First name")}
                            value={record.first_name}
                            onChange={(e) =>
                                setRecord({
                                    ...record,
                                    first_name: e.target.value
                                })
                            }
                        />
                        <TextInput
                            label={t("Last name")}
                            value={record.last_name}
                            onChange={(e) =>
                                setRecord({
                                    ...record,
                                    last_name: e.target.value
                                })
                            }
                        />
                    </div>

                    <div className={`flex gap-2 my-2 flex-wrap`}>
                        <TextInput
                            label={t("Website")}
                            value={record.website}
                            onChange={(e) =>
                                setRecord({
                                    ...record,
                                    website: e.target.value
                                })
                            }
                        />
                    </div>

                    <div className={`flex gap-2 my-2 flex-wrap`}>
                        <TextInput
                            label={t("Phone")}
                            value={record.phone}
                            onChange={(e) =>
                                setRecord({
                                    ...record,
                                    phone: e.target.value
                                })
                            }
                        />
                        <TextInput
                            label={t("Mobile")}
                            value={record.mobile}
                            onChange={(e) =>
                                setRecord({
                                    ...record,
                                    mobile: e.target.value
                                })
                            }
                        />
                    </div>

                    <H3 className={`mt-4`}>{t("Address")}</H3>
                    <Divider />

                    <div className={`flex gap-2 my-2 flex-wrap`}>
                        <TextInput
                            label={t("Street address")}
                            value={record.street}
                            onChange={(e) =>
                                setRecord({
                                    ...record,
                                    street: e.target.value
                                })
                            }
                        />
                        <TextInput
                            label={t("Street address line 2")}
                            value={record.street2}
                            onChange={(e) =>
                                setRecord({
                                    ...record,
                                    street2: e.target.value
                                })
                            }
                        />
                    </div>

                    <div className={`flex gap-2 my-2 flex-wrap`}>
                        <TextInput
                            label={t("City")}
                            value={record.city}
                            onChange={(e) =>
                                setRecord({
                                    ...record,
                                    city: e.target.value
                                })
                            }
                        />
                        <TextInput
                            label={t("State")}
                            value={record.state}
                            onChange={(e) =>
                                setRecord({
                                    ...record,
                                    state: e.target.value
                                })
                            }
                        />
                    </div>

                    <div className={`flex gap-2 my-2 flex-wrap`}>
                        <TextInput
                            label={t("Zip code")}
                            value={record.zip}
                            classNames={{
                                root: "max-w-[100px]"
                            }}
                            onChange={(e) =>
                                setRecord({
                                    ...record,
                                    zip: e.target.value
                                })
                            }
                        />
                        <Select
                            label={t("Country")}
                            placeholder={t("Pick a country")}
                            data={countries.map((country) => country.label)}
                            searchable
                            value={record.country}
                            onChange={(value) =>
                                setRecord({
                                    ...record,
                                    country: value
                                })
                            }
                        />
                    </div>
                </Tabs.Panel>
            </Tabs>
        </CreateFormWrapper>
    );
}
