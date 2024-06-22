import {useTranslation} from "react-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAddressBook} from "@fortawesome/free-solid-svg-icons";
import Card from "@/common/ui/Card.jsx";
import Divider from "@/common/ui/Divider.jsx";
import H1 from "@/common/ui/H1.jsx";
import H3 from "@/common/ui/H3.jsx";
import {Tabs} from "@mantine/core";
import useModel from "../../../common/api/useModel.jsx";
import {useParams} from "react-router-dom";
import ReadOnlyField from "@/common/ui/ReadOnlyField.jsx";
import ViewFormActionBar from "../../../common/ui/ViewFormActionBar.jsx";
import FormViewSkeleton from "../../../common/ui/FormViewSkeleton.jsx";

export default function DepotView() {
    const {t} = useTranslation();
    const {id} = useParams();
    const query = useModel("depot", {
        id,
        autoFetch: true
    });
    const {record} = query;
    return (
        <main className={`max-w-screen-xl m-auto my-[20px] px-[24px]`}>
            <ViewFormActionBar query={query}/>

            {record ? (
                <form>
                    <Card>
                        <H1>{record.name}</H1>
                        {/*Row 1*/}
                        <div className={`flex gap-2 my-2`}>
                            {/*Column 1*/}
                            <div
                                className={`flex flex-col grow max-w-screen-sm`}
                            >
                                <ReadOnlyField
                                    label={t("Display name")}
                                    value={record.name}
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
                                        classNames={{
                                            root: "max-w-[100px]"
                                        }}
                                    />
                                    <ReadOnlyField
                                        label={t("Country")}
                                        value={record.country}
                                    />
                                </div>
                            </Tabs.Panel>
                        </Tabs>
                    </Card>
                </form>
            ) : (
                <FormViewSkeleton/>
            )}
        </main>
    );
}
