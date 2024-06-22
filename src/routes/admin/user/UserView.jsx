import {useTranslation} from "react-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAddressBook, faFingerprint} from "@fortawesome/free-solid-svg-icons";
import Card from "../../../common/ui/Card.jsx";
import Divider from "../../../common/ui/Divider.jsx";
import H1 from "../../../common/ui/H1.jsx";
import H3 from "../../../common/ui/H3.jsx";
import {Tabs} from "@mantine/core";
import useModel from "../../../common/api/useModel.jsx";
import {useParams} from "react-router-dom";
import ReadOnlyField from "../../../common/ui/ReadOnlyField.jsx";
import Chip from "../../../common/ui/Chip.jsx";
import ViewFormActionBar from "../../../common/ui/ViewFormActionBar.jsx";
import FormViewSkeleton from "../../../common/ui/FormViewSkeleton.jsx";
import FileDisplay from "../../../common/ui/FileDisplay.jsx";

export default function UserView() {
    const {t} = useTranslation();
    const {id} = useParams();
    const query = useModel("user", {
        id,
        autoFetch: true
    });
    const {record} = query;
    return (
        <main className={`max-w-screen-xl m-auto my-[20px] px-[24px]`}>
            <ViewFormActionBar query={query}/>

            {record ? (
                <Card>
                    <H1>
                        {record.username}
                    </H1>
                    <div className={`flex gap-2 my-2`}>
                        <ReadOnlyField>
                            <FileDisplay
                                type="image"
                                src={record.image?.name}
                            />
                        </ReadOnlyField>

                        <ReadOnlyField
                            label={t("Username")}
                            value={record.username}
                        />
                    </div>

                    <div className={`flex gap-2 my-2`}>
                        <ReadOnlyField
                            label={t("Company name")}
                            value={record.company_name}
                        />
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
                        </Tabs.List>

                        <Tabs.Panel value="access" className={`mt-4`}>
                            <ReadOnlyField label={t(`Roles`)}>
                                <div className={`flex gap-1 items-center`}>
                                    {record.roles?.map((role) => (
                                        <Chip
                                            size={`xs`}
                                            key={role.id}
                                            variant="outline"
                                            checked={false}
                                        >
                                            {role.name}
                                        </Chip>
                                    ))}
                                </div>
                            </ReadOnlyField>
                        </Tabs.Panel>

                        <Tabs.Panel value="contact">
                            <div className={`flex gap-2 my-2 flex-wrap`}>
                                <ReadOnlyField
                                    label={t("Title")}
                                    value={record.title}
                                />
                                <ReadOnlyField
                                    label={t("Diplay name")}
                                    value={record.name}
                                />
                                <ReadOnlyField
                                    label={t("First name")}
                                    value={record.first_name}
                                />
                                <ReadOnlyField
                                    label={t("Last name")}
                                    value={record.last_name}
                                />
                            </div>

                            <div className={`flex gap-2 my-2 flex-wrap`}>
                                <ReadOnlyField
                                    label={t("Email")}
                                    value={record.email}
                                />
                                <ReadOnlyField
                                    label={t("Website")}
                                    value={record.website}
                                />
                            </div>

                            <div className={`flex gap-2 my-2 flex-wrap`}>
                                <ReadOnlyField
                                    label={t("Phone")}
                                    value={record.phone}
                                />
                                <ReadOnlyField
                                    label={t("Mobile")}
                                    value={record.mobile}
                                />
                            </div>

                            <H3 className={`mt-4`}>{t("Address")}</H3>
                            <Divider/>

                            <div className={`flex gap-2 my-2 flex-wrap`}>
                                <ReadOnlyField
                                    label={t("Street address")}
                                    value={record.street}
                                />
                                <ReadOnlyField
                                    label={t("Street address line 2")}
                                    value={record.street2}
                                />
                            </div>

                            <div className={`flex gap-2 my-2 flex-wrap`}>
                                <ReadOnlyField
                                    label={t("City")}
                                    value={record.city}
                                />
                                <ReadOnlyField
                                    label={t("State")}
                                    value={record.state}
                                />
                            </div>

                            <div className={`flex gap-2 my-2 flex-wrap`}>
                                <ReadOnlyField
                                    label={t("Zip code")}
                                    value={record.zip}
                                />
                                <ReadOnlyField
                                    label={t("Country")}
                                    value={record.country}
                                />
                            </div>

                            <div className={`flex gap-2 my-2 flex-wrap`}>
                                <FileDisplay
                                    label={t('CV')}
                                    src={record.cv?.name}
                                />
                            </div>
                        </Tabs.Panel>
                    </Tabs>
                </Card>

            ) : (
                <FormViewSkeleton/>
            )}
        </main>
    );
}
