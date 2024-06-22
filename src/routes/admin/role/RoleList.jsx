import {useTranslation} from "react-i18next";
import useModel from "../../../common/api/useModel.jsx";
import Button from "../../../common/ui/Button";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
import Checkbox from "../../../common/ui/Checkbox.jsx";
import {Table, Alert} from "@mantine/core";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {LoadingOverlay} from "@mantine/core";
import Chip from "../../../common/ui/Chip.jsx";
import VisibilityControl from "../../../common/auth/VisibilityControl.jsx";
import ListViewSearchBar from "../../../common/ui/ListViewSearchBar.jsx";
import ListViewPagination from "../../../common/ui/ListViewPagination.jsx";
import ListViewSkeleton from "../../../common/ui/ListViewSkeleton.jsx";

export default function RoleList() {
    const {t} = useTranslation();
    const query = useModel("role", {
        autoFetch: true,
        searchFields: ["name"]
    });
    const {data: items, loading, error} = query;
    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState([]);
    return (
        <main
            className={`max-w-screen-xl m-auto my-[50px] px-[12px] sm:px-[24px]`}
        >
            <div className={`flex w-full justify-between gap-2`}>
                <h1 className={`text-[36px] font-[700] text-2xl text-pr`}>
                    {t("Roles")}
                </h1>
                <VisibilityControl roleIds={["super_admin_role", "admin_role"]}>
                    <Link to={`/roles/create`}>
                        <Button
                            className={`shadow bg-primary-main text-primary-contrastText`}
                            color={`primary`}
                        >
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="sm:mr-1 h-4 w-4"
                            />
                            {t("")}
                            <span className={`hidden sm:inline`}>
                                {t("Create role")}
                            </span>
                        </Button>
                    </Link>
                </VisibilityControl>
            </div>

            {/*Filter, actions row*/}
            <ListViewSearchBar
                query={query}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
            />

            {error && (
                <Alert
                    color="red"
                    variant="light"
                    title="Error"
                    className={`mb-2`}
                    icon={<FontAwesomeIcon icon={faTriangleExclamation}/>}
                >
                    {t(error)}
                </Alert>
            )}

            {items?.length > 0 ? (
                <div
                    className={`relative border border-gray-border p-2 rounded-md shadow overflow-y-auto`}
                >
                    <LoadingOverlay
                        visible={loading}
                        zIndex={1000}
                        overlayProps={{
                            radius: "sm",
                            blur: 2
                        }}
                        loaderProps={{
                            type: "bars"
                        }}
                    />

                    <Table verticalSpacing="sm" highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>
                                    <Checkbox
                                        aria-label="Select row"
                                        checked={
                                            selectedRows.length === items.length
                                        }
                                        onChange={(e) =>
                                            setSelectedRows(
                                                e.currentTarget.checked
                                                    ? items
                                                    : []
                                            )
                                        }
                                    />
                                </Table.Th>
                                <Table.Th>{t("Name")}</Table.Th>
                                <Table.Th>{t("Description")}</Table.Th>
                                {/*<Table.Th>{t("Implied Roles")}</Table.Th>*/}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {items?.map((item) => (
                                <Table.Tr
                                    key={item.id}
                                    bg={
                                        selectedRows.includes(item.id)
                                            ? "var(--mantine-color-blue-light)"
                                            : undefined
                                    }
                                    onClick={() =>
                                        navigate(`/roles/${item.id}`)
                                    }
                                    className={`cursor-pointer`}
                                >
                                    <Table.Td
                                        onClick={(e) => e.stopPropagation()}
                                        className={`cursor-pointer`}
                                    >
                                        <Checkbox
                                            aria-label="Select row"
                                            checked={selectedRows
                                                .map((row) => row.id)
                                                .includes(item.id)}
                                            onChange={(e) =>
                                                setSelectedRows(
                                                    e.currentTarget.checked
                                                        ? [
                                                            ...selectedRows,
                                                            item
                                                        ]
                                                        : selectedRows.filter(
                                                            (row) =>
                                                                row.id !==
                                                                item.id
                                                        )
                                                )
                                            }
                                        />
                                    </Table.Td>
                                    <Table.Td>{item.name}</Table.Td>
                                    <Table.Td>{item.description}</Table.Td>
                                    {/*<Table.Td>*/}
                                    {/*    <div*/}
                                    {/*        className={`flex gap-1 items-center flex-wrap`}*/}
                                    {/*    >*/}
                                    {/*        {item.implied_roles?.map((role) => (*/}
                                    {/*            <Chip*/}
                                    {/*                size={`xs`}*/}
                                    {/*                key={role.id}*/}
                                    {/*                variant="outline"*/}
                                    {/*            >*/}
                                    {/*                {role.name}*/}
                                    {/*            </Chip>*/}
                                    {/*        ))}*/}
                                    {/*    </div>*/}
                                    {/*</Table.Td>*/}
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>

                    <ListViewPagination query={query}/>
                </div>
            ) : loading ? (
                <ListViewSkeleton/>
            ) : (
                <div className={`py-4 text-gray-main`}>
                    {t("Nothing here yet.")}
                </div>
            )}
        </main>
    );
}
