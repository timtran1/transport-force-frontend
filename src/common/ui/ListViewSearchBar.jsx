import {useTranslation} from "react-i18next";
import {Button as MantineButton, Chip, FileButton, Group, Menu, Modal, Tooltip} from "@mantine/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowsRotate,
    faArrowUpFromBracket,
    faCog,
    faFileArrowDown,
    faPlus,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {useDisclosure} from "@mantine/hooks";
import H2 from "./H2.jsx";
import TextInput from "./TextInput.jsx";
import Button from "./Button.jsx";
import Select from "./Select.jsx";
import {useEffect, useState} from "react";
import useModel from "../api/useModel.jsx";
import NotificationState from "../stores/NotificationState.js";
import ormOperators from "../../constants/ormOperators.js";

export default function ListViewSearchBar(props) {
    const {t} = useTranslation();
    const {
        query,
        // enableAdvanced = false,
        // list of string_id of filters to be enabled by default
        // defaultEnabledFilters = [],
        allowSearch = true,
        // allowAdvanced = true,
        selectedRows,
        setSelectedRows,
        slots
    } = props;
    const {
        modelName: model,
        searchTerm,
        setSearchTerm,
        pageSize,
        setPageSize,
        // filters: initialFilters,
        // setFilters: setQueryFilters,
        deleteWithConfirm,
        get,
        exportCSV,
        importCSV
    } = query;
    const {notify} = NotificationState((state) => state)
    // const [advanceSearchOpened, {toggle}] = useDisclosure(enableAdvanced);
    // const [
    //     editFilterModalOpened,
    //     {open: openEditFilterModal, close: closeEditFilterModal}
    // ] = useDisclosure(false);
    // const [
    //     createFilterModalOpened,
    //     {open: openCreateFilterModal, close: closeCreateFilterModal}
    // ] = useDisclosure(false);
    // const [editingFilter, setEditingFilter] = useState(null);
    // const [creatingFilter, setCreatingFilter] = useState({
    //     model,
    //     name: "",
    //     field: "",
    //     operator: "",
    //     value: ""
    // });
    // const [enabledFilters, setEnabledFilters] = useState([]);
    // const [initializedDefaultFilters, setInitializedDefaultFilters] =
    //     useState(false);
    // const {
    //     data: filterRecords,
    //     update: updateFilter,
    //     create: createFilter,
    //     deleteWithConfirm: deleteFilter
    // } = useModel("filter", {
    //     autoFetch: true,
    //     filters: [
    //         {
    //             field: "model",
    //             operator: "=",
    //             value: model
    //         }
    //     ]
    // });

    // initialize default filter
    // if (
    //     defaultEnabledFilters.length > 0 &&
    //     filterRecords.length > 0 &&
    //     enabledFilters.length === 0 &&
    //     !initializedDefaultFilters
    // ) {
    //     const defaultEnabledFiltersRecords = filterRecords.filter((f) =>
    //         defaultEnabledFilters.includes(f.string_id)
    //     );
    //     const defaultEnabledFiltersIds = defaultEnabledFiltersRecords.map(
    //         (f) => f.id
    //     );
    //     setEnabledFilters(defaultEnabledFiltersIds);
    //     setInitializedDefaultFilters(true);
    // }

    // function makeQuery() {
    //     if (enabledFilters.length > 0) {
    //         const enabledFiltersRecords = filterRecords.filter((f) =>
    //             enabledFilters.includes(f.id)
    //         );
    //         const queryFilters = enabledFiltersRecords.map(f => {
    //             const {field, operator, value} = f;
    //             return {
    //                 field,
    //                 operator,
    //                 value
    //             }
    //         });
    //         setQueryFilters([...initialFilters, ...queryFilters]);
    //     } else {
    //         setQueryFilters(initialFilters);
    //     }
    // }

    // // insert make query from list of enabled filters
    // useEffect(() => {
    //     makeQuery()
    // }, [filterRecords, enabledFilters])

    // function toggleAdvanceSearch() {
    //     toggle();
    // }

    function handleDelete() {
        deleteWithConfirm(
            selectedRows.map(row => row.id),
            () => {
                setSelectedRows([]);
                get();
            }
        );
    }
    //
    // async function handleSubmitFilterEdit(e) {
    //     e.preventDefault();
    //     try {
    //         updateFilter(editingFilter);
    //         closeEditFilterModal();
    //         notify({
    //             type: "success",
    //             message: t("Filter updated!")
    //         });
    //     } catch (e) {
    //         console.error(e);
    //         notify({
    //             type: "error",
    //             message: e.message
    //         });
    //     }
    // }

    // async function handleSubmitFilterCreate(e) {
    //     e.preventDefault();
    //     try {
    //         await createFilter(creatingFilter);
    //         closeCreateFilterModal();
    //         notify({
    //             type: "success",
    //             message: t("Filter created!")
    //         });
    //     } catch (e) {
    //         console.error(e);
    //         notify({
    //             type: "error",
    //             message: e.message
    //         });
    //     }
    // }
    //
    // function handleDeleteFilter() {
    //     return deleteFilter([editingFilter?.id], () => {
    //         closeEditFilterModal();
    //     });
    // }

    async function downloadSelectedRows() {
        try {
            if (selectedRows.length > 0) {
                const data = await exportCSV(selectedRows)
                return triggerDownload(data, `${model}.csv`)
            } else {
                notify({
                    type: "warning",
                    message: t("No rows selected!")
                });
            }
        } catch (e) {
            console.error(e);
            notify({
                type: "error",
                message: e.message
            });
        }
    }

    async function downloadAllRows() {
        try {
            const data = await exportCSV()
            return triggerDownload(data, `${model}.csv`)
        } catch (e) {
            notify({
                type: "error",
                message: e.message
            })
        }
    }

    function triggerDownload(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async function uploadFile(file) {
        try {
            await importCSV(file)
            get()
            notify({
                type: "success",
                message: t("Imported successfully!")
            })
        } catch (e) {
            console.error(e);
            notify({
                type: "error",
                message: e.message
            })
        }
    }

    return (
        <>
            {/*/!*Filter Edit modal*!/*/}
            {/*<Modal*/}
            {/*    opened={editFilterModalOpened}*/}
            {/*    onClose={closeEditFilterModal}*/}
            {/*    title={<H2>{t("Edit Filter")}</H2>}*/}
            {/*>*/}
            {/*    <form*/}
            {/*        className={`flex flex-col gap-2`}*/}
            {/*        onSubmit={handleSubmitFilterEdit}*/}
            {/*    >*/}
            {/*        <TextInput*/}
            {/*            label={t(`Filter Name`)}*/}
            {/*            value={editingFilter?.name}*/}
            {/*            onChange={(e) =>*/}
            {/*                setEditingFilter({*/}
            {/*                    ...editingFilter,*/}
            {/*                    name: e.target.value*/}
            {/*                })*/}
            {/*            }*/}
            {/*            required*/}
            {/*        />*/}
            {/*        <TextInput*/}
            {/*            label={t(`Field`)}*/}
            {/*            value={editingFilter?.field}*/}
            {/*            onChange={(e) =>*/}
            {/*                setEditingFilter({*/}
            {/*                    ...editingFilter,*/}
            {/*                    field: e.target.value*/}
            {/*                })*/}
            {/*            }*/}
            {/*            required*/}
            {/*        />*/}
            {/*        <Select*/}
            {/*            label={t(`Operator`)}*/}
            {/*            data={ormOperators}*/}
            {/*            value={editingFilter?.operator}*/}
            {/*            onChange={(value) =>*/}
            {/*                setEditingFilter({*/}
            {/*                    ...editingFilter,*/}
            {/*                    operator: value*/}
            {/*                })*/}
            {/*            }*/}
            {/*            required*/}
            {/*        />*/}
            {/*        <TextInput*/}
            {/*            label={t(`Value`)}*/}
            {/*            value={editingFilter?.value}*/}
            {/*            onChange={(e) =>*/}
            {/*                setEditingFilter({*/}
            {/*                    ...editingFilter,*/}
            {/*                    value: e.target.value*/}
            {/*                })*/}
            {/*            }*/}
            {/*            required*/}
            {/*        />*/}
            {/*        <Button*/}
            {/*            type={`button`}*/}
            {/*            variant={`outline`}*/}
            {/*            color={`red`}*/}
            {/*            onClick={handleDeleteFilter}*/}
            {/*        >*/}
            {/*            {t("Delete")}*/}
            {/*        </Button>*/}
            {/*        <Button type={`submit`}>{t("Save")}</Button>*/}
            {/*    </form>*/}
            {/*</Modal>*/}

            {/*/!*Filter Create modal*!/*/}
            {/*<Modal*/}
            {/*    opened={createFilterModalOpened}*/}
            {/*    onClose={closeCreateFilterModal}*/}
            {/*    title={<div className={`text-lg font-semibold`}>{t("Create Filter")}</div>}*/}
            {/*>*/}
            {/*    <form*/}
            {/*        className={`flex flex-col gap-2`}*/}
            {/*        onSubmit={handleSubmitFilterCreate}*/}
            {/*    >*/}
            {/*        <TextInput*/}
            {/*            label={t(`Filter Name`)}*/}
            {/*            value={creatingFilter?.name}*/}
            {/*            onChange={(e) =>*/}
            {/*                setCreatingFilter({*/}
            {/*                    ...creatingFilter,*/}
            {/*                    name: e.target.value*/}
            {/*                })*/}
            {/*            }*/}
            {/*            required*/}
            {/*        />*/}
            {/*        <TextInput*/}
            {/*            label={t(`Field`)}*/}
            {/*            value={creatingFilter?.field}*/}
            {/*            onChange={(e) =>*/}
            {/*                setCreatingFilter({*/}
            {/*                    ...creatingFilter,*/}
            {/*                    field: e.target.value*/}
            {/*                })*/}
            {/*            }*/}
            {/*            required*/}
            {/*        />*/}
            {/*        <Select*/}
            {/*            label={t(`Operator`)}*/}
            {/*            data={ormOperators}*/}
            {/*            value={creatingFilter?.operator}*/}
            {/*            onChange={(value) =>*/}
            {/*                setCreatingFilter({*/}
            {/*                    ...creatingFilter,*/}
            {/*                    operator: value*/}
            {/*                })*/}
            {/*            }*/}
            {/*            required*/}
            {/*        />*/}
            {/*        <TextInput*/}
            {/*            label={t(`Value`)}*/}
            {/*            value={creatingFilter?.value}*/}
            {/*            onChange={(e) =>*/}
            {/*                setCreatingFilter({*/}
            {/*                    ...creatingFilter,*/}
            {/*                    value: e.target.value*/}
            {/*                })*/}
            {/*            }*/}
            {/*            required*/}
            {/*        />*/}

            {/*        <Button type={`submit`}>{t("Create")}</Button>*/}
            {/*    </form>*/}
            {/*</Modal>*/}

            {/*Filter, actions row*/}
            <div className={`flex my-2 min-h-[30px] items-end justify-between flex-wrap`}>
                <div className={`flex items-center flex-wrap gap-2`}>

                    <div className={`flex gap-2 items-center flex-wrap`}>
                        {allowSearch && <TextInput
                            classNames={{input: "shadow-sm"}}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t(`Search...`)}
                        />}
                        {slots?.appendSearch && slots.appendSearch}
                        {/*{advanceSearchOpened ?*/}
                        {/*    filterRecords.map((filter) => (*/}
                        {/*        <Chip*/}
                        {/*            checked={enabledFilters.includes(filter.id)}*/}
                        {/*            key={filter.id}*/}
                        {/*            onChange={() => {*/}
                        {/*                if (enabledFilters.includes(filter.id)) {*/}
                        {/*                    setEnabledFilters(enabledFilters.filter(id => id !== filter.id))*/}
                        {/*                } else {*/}
                        {/*                    setEnabledFilters([*/}
                        {/*                        ...enabledFilters,*/}
                        {/*                        filter.id*/}
                        {/*                    ])*/}
                        {/*                }*/}
                        {/*            }}*/}
                        {/*        >*/}
                        {/*            {filter.name}*/}
                        {/*        </Chip>*/}
                        {/*    ))*/}
                        {/*    :*/}
                        {/*    allowAdvanced && <button*/}
                        {/*        className={`text-xs text-gray-500 underline`}*/}
                        {/*        onClick={toggleAdvanceSearch}*/}
                        {/*    >*/}
                        {/*        {t("Advanced")}*/}
                        {/*    </button>*/}
                        {/*}*/}
                    </div>

                    {selectedRows?.length > 0 &&
                        <div className={`flex items-center`}>
                            <span className={`text-[12px] text-gray-500 mx-2`}>
                                {`${selectedRows.length} ${t("selected")}`}
                            </span>

                            <Button
                                size={`xs`}
                                onClick={handleDelete}
                                color={`red`}
                            >
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="mr-1 h-3 w-3"
                                />
                                {t("Delete")}
                            </Button>
                        </div>
                    }
                </div>

                <div className={`flex items-end gap-1`}>
                    {/*<Group justify="center">*/}
                    {/*    <FileButton onChange={uploadFile} accept=".csv">*/}
                    {/*        {props =>*/}
                    {/*            <MantineButton*/}
                    {/*                {...props}*/}
                    {/*                size={`xs`}*/}
                    {/*                variant={`outline`}*/}
                    {/*                className={`shadow`}*/}
                    {/*            >*/}
                    {/*                <FontAwesomeIcon icon={faArrowUpFromBracket}/>*/}
                    {/*            </MantineButton>}*/}
                    {/*    </FileButton>*/}
                    {/*</Group>*/}


                    {/*Export*/}
                    {/*<Menu shadow="md" width={200}>*/}
                    {/*    <Menu.Target>*/}
                    {/*        <Tooltip label="Export" withArrow>*/}
                    {/*            <MantineButton*/}
                    {/*                size={`xs`}*/}
                    {/*                variant={`outline`}*/}
                    {/*                className={`shadow`}*/}
                    {/*            >*/}
                    {/*                <FontAwesomeIcon icon={faFileArrowDown}/>*/}
                    {/*            </MantineButton>*/}
                    {/*        </Tooltip>*/}
                    {/*    </Menu.Target>*/}

                    {/*    <Menu.Dropdown>*/}
                    {/*        <Menu.Label>Export</Menu.Label>*/}
                    {/*        <a>*/}
                    {/*            <Menu.Item onClick={downloadAllRows}>*/}
                    {/*                All results*/}
                    {/*            </Menu.Item>*/}
                    {/*        </a>*/}
                    {/*        <a>*/}
                    {/*            <Menu.Item onClick={downloadSelectedRows}>*/}
                    {/*                Selected rows*/}
                    {/*            </Menu.Item>*/}
                    {/*        </a>*/}
                    {/*    </Menu.Dropdown>*/}
                    {/*</Menu>*/}

                    <MantineButton onClick={() => get()} size={`xs`} variant={`outline`} className={`shadow`}>
                        <FontAwesomeIcon icon={faArrowsRotate}/>
                    </MantineButton>

                    {/*Page Size*/}
                    <Select
                        size={`xs`}
                        classNames={{
                            root: "max-w-[63px]",
                            input: "shadow"
                        }}
                        data={["20", "30", "40", "50"]}
                        label={t(`Show max`)}
                        value={pageSize?.toString()}
                        onChange={setPageSize}
                    />
                </div>
            </div>

            {/*{advanceSearchOpened && (*/}
            {/*    <div className={`flex gap-2 items-center flex-wrap mb-2`}>*/}
            {/*        <Menu shadow="md" width={200} position={`bottom-start`}>*/}
            {/*            <Menu.Target>*/}
            {/*                <MantineButton*/}
            {/*                    variant={`outline`}*/}
            {/*                    size={`xs`}*/}
            {/*                    className={`text-sm`}*/}
            {/*                >*/}
            {/*                    <FontAwesomeIcon*/}
            {/*                        icon={faCog}*/}
            {/*                        className={`mr-1`}*/}
            {/*                    />*/}
            {/*                    {t("Filter Settings")}*/}
            {/*                </MantineButton>*/}
            {/*            </Menu.Target>*/}

            {/*            <Menu.Dropdown>*/}
            {/*                <Menu.Item onClick={openCreateFilterModal}>*/}
            {/*                    <FontAwesomeIcon*/}
            {/*                        icon={faPlus}*/}
            {/*                        className={`mr-1`}*/}
            {/*                    />*/}
            {/*                    {t("Add Filter")}*/}
            {/*                </Menu.Item>*/}


            {/*                {filterRecords?.length > 0 &&*/}
            {/*                    <>*/}
            {/*                        <Menu.Divider/>*/}
            {/*                        <Menu.Label>*/}
            {/*                            {t("Available Filters")}*/}
            {/*                        </Menu.Label>*/}
            {/*                    </>*/}
            {/*                }*/}

            {/*                {filterRecords.map((filter) => (*/}
            {/*                    <Menu.Item*/}
            {/*                        key={filter.id}*/}
            {/*                        onClick={() => {*/}
            {/*                            setEditingFilter(filter);*/}
            {/*                            openEditFilterModal();*/}
            {/*                        }}*/}
            {/*                    >*/}
            {/*                        {filter.name}*/}
            {/*                    </Menu.Item>*/}
            {/*                ))}*/}
            {/*            </Menu.Dropdown>*/}
            {/*        </Menu>*/}
            {/*        <button*/}
            {/*            className={`text-xs text-gray-500 underline`}*/}
            {/*            onClick={toggleAdvanceSearch}*/}
            {/*        >*/}
            {/*            {t("Hide Advanced")}*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*)}*/}
        </>
    );
}
