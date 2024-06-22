import useModel from "../../../common/api/useModel.jsx";
import Button from "../../../common/ui/Button.jsx"
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
import Checkbox from "../../../common/ui/Checkbox.jsx";
import {Table, Alert, Chip, LoadingOverlay} from '@mantine/core';
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import ListViewSearchBar from "../../../common/ui/ListViewSearchBar.jsx";
import ListViewPagination from "../../../common/ui/ListViewPagination.jsx";
import ListViewSkeleton from "../../../common/ui/ListViewSkeleton.jsx";
import NumberFormatter from "../../../common/ui/NumberFormatter.jsx";
import { useTranslation } from "react-i18next";

export default function BlogPostList() {
    const {t} = useTranslation()
    const query = useModel('blog_post', {
        autoFetch: true,
        searchFields: ['name'],
    })
    const {data: items, loading, error} = query

    const navigate = useNavigate()
    const [selectedRows, setSelectedRows] = useState([])

    return (
        <main className={`max-w-screen-xl m-auto my-[50px] px-[12px] sm:px-[24px]`}>
            <div className={`flex w-full justify-between gap-2`}>
                <h1 className={`text-[36px] font-[700] text-2xl text-pr`}>{t("Blog Posts")}</h1>
                <Link to={`/blog_posts/create`}>
                    <Button className={`shadow bg-primary-main text-primary-contrastText`} color={`primary`}>
                        <FontAwesomeIcon icon={faPlus} className="sm:mr-1 h-4 w-4"/> <span
                        className={`hidden sm:inline`}>{t("Create Blog Post")}</span>
                    </Button>
                </Link>
            </div>

            <ListViewSearchBar query={query} selectedRows={selectedRows} setSelectedRows={setSelectedRows}/>

            {error &&
                <Alert color="red" variant="light" title="Error" className={`mb-2`}
                       icon={<FontAwesomeIcon icon={faTriangleExclamation}/>}>{error}</Alert>
            }

            {items?.length > 0 ?
                <div className={`relative border border-gray-border p-2 rounded-md shadow overflow-y-auto`}>
                    <LoadingOverlay
                        visible={loading} zIndex={1000}
                        overlayProps={{radius: "sm", blur: 2}} loaderProps={{type: 'bars'}}/>

                    <Table verticalSpacing="sm" highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>
                                    <Checkbox
                                        aria-label="Select row"
                                        checked={selectedRows.length === items.length}
                                        onChange={e =>
                                            setSelectedRows(
                                                e.currentTarget.checked
                                                    ? items : []
                                            )
                                        }
                                    />
                                </Table.Th>
                                <Table.Th>{t("Title")}</Table.Th>
                                <Table.Th>{t("Reading Length")}</Table.Th>
                                <Table.Th>{t("Published")}</Table.Th>

                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{
                            items?.map(item => (
                                <Table.Tr
                                    key={item.id}
                                    bg={selectedRows.includes(item) ? 'var(--mantine-color-blue-light)' : undefined}
                                    onClick={() => navigate(`/blog_posts/${item.id}`)} className={`cursor-pointer`}
                                >
                                    <Table.Td onClick={e => e.stopPropagation()} className={`cursor-pointer`}>
                                        <Checkbox
                                            aria-label="Select row"
                                            checked={selectedRows.includes(item)}
                                            onChange={e =>
                                                setSelectedRows(
                                                    e.currentTarget.checked
                                                        ? [...selectedRows, item] : selectedRows.filter(row => row.id !== item.id)
                                                )
                                            }
                                        />
                                    </Table.Td>
                                    <Table.Td>{item.title}</Table.Td>
                                    <Table.Td>{item.reading_length}</Table.Td>
                                    <Table.Td><Checkbox checked={item.published}/></Table.Td>

                                </Table.Tr>
                            ))
                        }</Table.Tbody>
                    </Table>

                    <ListViewPagination query={query}/>
                </div>
                :
                loading
                    ?
                    <ListViewSkeleton/>
                    :
                    <div className={`py-4 text-gray-main`}>
                        {t("Nothing here yet.")}
                    </div>
            }
        </main>
    )
}