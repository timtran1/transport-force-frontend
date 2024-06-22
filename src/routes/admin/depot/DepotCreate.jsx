import {useTranslation} from "react-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAddressBook} from "@fortawesome/free-solid-svg-icons";
import Card from "@/common/ui/Card.jsx";
import TextInput from "@/common/ui/TextInput.jsx";
import Divider from "@/common/ui/Divider.jsx";
import H1 from "@/common/ui/H1.jsx";
import {useState} from "react";
import useModel from "../../../common/api/useModel.jsx";
import NotificationState from "../../../common/stores/NotificationState.js";
import {useNavigate} from "react-router-dom";
import H3 from "@/common/ui/H3.jsx";
import Select from "@/common/ui/Select.jsx";
import {Tabs} from "@mantine/core";
import countries from "../../../constants/countries.js";
import CreateFormActionBar from "../../../common/ui/CreateFormActionBar.jsx";

export default function DepotCreate(props) {
    const {t} = useTranslation();
    const {onSuccess, modalMode} = props;
    const [record, setRecord] = useState({
        street: "",
        street2: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        image: "",
        name: "",
        email: "",
        phone: "",
        mobile: "",
        website: ""
    });
    const {create, loading} = useModel("depot");
    const {notify} = NotificationState((state) => state);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        try {
            const created = await create(record);
            notify({
                message: t("Depot created successfully!"),
                type: "success"
            });
            if (onSuccess) {
                onSuccess(created);
            } else {
                navigate(-1);
            }
        } catch (err) {
            console.error(err);
            notify({
                message: err.message,
                type: "error"
            });
        }
    }

    return (
        <main
            className={`max-w-screen-xl m-auto ${
                !modalMode && "px-[24px] my-[20px]"
            }`}
        >
            <form
                onSubmit={handleSubmit}
                className={`flex ${
                    modalMode ? "flex-col-reverse" : "flex-col"
                }`}
            >
                <CreateFormActionBar
                    loading={loading}
                    title={t(`Create company`)}
                    modalMode={modalMode}
                />

                <Card className={modalMode && "border-none shadow-none !p-0"}>
                    <H1>{record.name}</H1>
                    {/*Row 1*/}
                    <div className={`flex gap-2 my-2`}>
                        {/*Column 1*/}
                        <div className={`flex flex-col grow max-w-screen-sm`}>
                            <TextInput
                                label={t("Display name")}
                                placeholder={t("ICG AG")}
                                required
                                value={record.name}
                                onChange={(e) =>
                                    setRecord({
                                        ...record,
                                        name: e.target.value
                                    })
                                }
                            />
                        </div>
                    </div>

                    <Tabs
                        variant="outline"
                        defaultValue="contact"
                        className={`mt-4`}
                    >
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
                        </Tabs.List>

                        <Tabs.Panel value="contact">
                            <div className={`flex gap-2 my-2 flex-wrap`}>
                                <TextInput
                                    label={t("Email")}
                                    value={record.email}
                                    type={`email`}
                                    onChange={(e) =>
                                        setRecord({
                                            ...record,
                                            email: e.target.value
                                        })
                                    }
                                />
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
                            </div>

                            <H3 className={`mt-4`}>{t("Address")}</H3>
                            <Divider/>

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
                                    data={countries.map(
                                        (country) => country.label
                                    )}
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
                </Card>
            </form>
        </main>
    );
}
