import {useTranslation} from "react-i18next";
import Card from "../../../common/ui/Card.jsx";
import H1 from "../../../common/ui/H1.jsx";
import useModel from "../../../common/api/useModel.jsx";
import {useParams} from "react-router-dom";
import ReadOnlyField from "../../../common/ui/ReadOnlyField.jsx";
import ViewFormActionBar from "../../../common/ui/ViewFormActionBar.jsx";
import FormViewSkeleton from "../../../common/ui/FormViewSkeleton.jsx";
import H2 from "../../../common/ui/H2.jsx";
import {Table} from "@mantine/core";
import Divider from "../../../common/ui/Divider.jsx";
export default function SiteContentView() {
    const {t} = useTranslation();
    const {id} = useParams();
    const query = useModel("site_content", {
        id,
        autoFetch: true
    });
    const {record} = query;
    const content = record?.content;
    return (
        <main className={`max-w-screen-xl m-auto my-[50px] px-[24px]`}>
            <ViewFormActionBar query={query} />

            {record ? (
                <form>
                    <Card>
                        <H1>{t("Theme Translation")}</H1>

                        <div className={`flex gap-4 my-4 flex-wrap`}>
                            <ReadOnlyField
                                label={t("Locale")}
                                value={`${record.locale?.name} (${record.locale?.iso_code})`}
                            />
                        </div>

                        <div className={`my-6 overflow-y-auto`}>
                            <H2>{t("Content Keys")}</H2>
                            <Divider />
                            <Table className={`mt-2`}>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>{t("Key")}</Table.Th>
                                        <Table.Th>{t("Value")}</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {Object.keys(content).map((key) => (
                                        <Table.Tr key={key}>
                                            <Table.Td>{key}</Table.Td>
                                            <Table.Td>{content[key]}</Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </div>
                    </Card>
                </form>
            ) : (
                <FormViewSkeleton />
            )}
        </main>
    );
}
