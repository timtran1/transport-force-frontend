import {useTranslation} from "react-i18next";
import {
    faUpload,
    faXmark,
    faPenToSquare,
    faCheckDouble
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {FileButton, Modal} from "@mantine/core";
import {useEffect, useRef, useState} from "react";
import useModel from "../api/useModel.jsx";
import useUpload from "../api/useUpload.js";
import {getAttachmentUrl} from "../utils/index.js";
import Button from "./Button.jsx";
import Checkbox from "./Checkbox.jsx";
import NotificationState from "../stores/NotificationState.js";
import BackendHostURLState from "../stores/BackendHostURLState.js";
import documentIcon from '../../assets/images/document.png';

function FileImage({file, onClick, isSelectMode, checked = false}) {
    const {backendHost} = BackendHostURLState((state) => state);

    return (
        <div
            onClick={onClick}
            className={`relative hover:outline cursor-pointer hover:outline-2`}
        >
            {isSelectMode && (
                <Checkbox
                    className="absolute top-2 left-2 bg-white rounded-md"
                    variant="outline"
                    checked={checked}
                    readOnly
                />
            )}

            {file.content_type?.startsWith("image") ? (
                <img
                    src={getAttachmentUrl(backendHost, file.name)}
                    className="h-[150px] w-full object-cover"
                />
            ) : (
                <div
                    className="flex flex-col border items-center h-[150px] p-2"
                    title={file.name}
                >
                    <img src={documentIcon} className="w-[100px]"/>
                    <div className="mt-2 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                        {file.name}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ChooseAttachmentModal({isOpen, close, onChange, type}) {
    const {t} = useTranslation();
    const scrollRef = useRef();
    let filters = [];
    if (type === "image") {
        filters = [
            {
                field: "content_type",
                operator: "like",
                value: "image%"
            }
        ];
    }
    const {
        data: files,
        setData: setFiles,
        get: getFiles,
        deleteWithConfirm
    } = useModel("attachment", {
        pageSize: null,
        filters
    });
    const {uploadFileModel} = useUpload();
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState(new Set());
    const {notify} = NotificationState((state) => state);
    const {backendHost} = BackendHostURLState((state) => state);
    useEffect(() => {
        if (isOpen) {
            setIsSelectMode(false);
            setSelectedFiles(new Set());
            const fetchFiles = async () => {
                await getFiles();
            };
            fetchFiles();
        }
    }, [isOpen]);

    async function handleFileChange(file) {
        try {
            if (file) {
                const newFile = await uploadFileModel("attachment/", file);
                setFiles([...files, newFile]);
                setTimeout(scrollToBottom, 100);
            }
        } catch (err) {
            notify({
                message: err.message,
                type: "error"
            });
            console.error(err);
        }
    }

    function handleSelectFile(file) {
        if (onChange) {
            onChange({
                ...file,
                attachUrl: getAttachmentUrl(backendHost, file.name)
            });
        }
        close();
    }

    function scrollToBottom() {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({
                behavior: "smooth"
            });
        }
    }

    function handleToggleEdit() {
        setSelectedFiles(new Set());
        setIsSelectMode((state) => !state);
    }

    function handleFileClick(fileId) {
        const selectFilesClone = new Set(selectedFiles);
        if (selectFilesClone.has(fileId)) {
            selectFilesClone.delete(fileId);
        } else {
            selectFilesClone.add(fileId);
        }
        setSelectedFiles(selectFilesClone);
    }

    function isSelectAll() {
        return selectedFiles.size === files.length;
    }

    function toggleSelectAll() {
        if (isSelectAll()) {
            setSelectedFiles(new Set());
        } else {
            setSelectedFiles(new Set(files.map((img) => img.id)));
        }
    }

    function handleDelete() {
        deleteWithConfirm(Array.from(selectedFiles), () => {
            setSelectedFiles(new Set());
            getFiles();
        });
    }

    return (
        <Modal
            opened={isOpen}
            onClose={close}
            title={
                <div className={`font-semibold text-lg`}>
                    {t("Select attachment")}
                </div>
            }
            size={700}
        >
            <div className="border-t py-4">
                {!files.length ? (
                    <div className="text-center">
                        {t("No recent file uploads")}
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                {selectedFiles.size > 0 && (
                                    <div className={`flex items-center ml-2`}>
                                        <span
                                            className={`text-[12px] text-gray-500 mx-2`}
                                        >
                                            {selectedFiles.size}
                                            {t("selected")}
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
                                )}
                            </div>
                            <div className="flex items-center">
                                {isSelectMode && (
                                    <Button onClick={toggleSelectAll}>
                                        <FontAwesomeIcon
                                            icon={faCheckDouble}
                                            className="mr-1 h-3 w-3"
                                        />
                                        {isSelectAll()
                                            ? "Deselect all"
                                            : "Select all"}
                                    </Button>
                                )}
                                <Button
                                    onClick={handleToggleEdit}
                                    className="ml-2"
                                    variant={`outline`}
                                >
                                    <FontAwesomeIcon
                                        icon={faPenToSquare}
                                        className="mr-1 h-3 w-3"
                                    />
                                    {t("Toggle edit")}
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 max-h-[500px] overflow-y-auto my-4 p-2">
                            {files.map((file, index) => (
                                <FileImage
                                    key={index}
                                    file={file}
                                    onClick={() =>
                                        isSelectMode
                                            ? handleFileClick(file.id)
                                            : handleSelectFile(file)
                                    }
                                    isSelectMode={isSelectMode}
                                    checked={selectedFiles.has(file.id)}
                                />
                            ))}
                            <div ref={scrollRef}></div>
                        </div>
                    </>
                )}

                <div className="flex justify-center mt-8 w-full">
                    <FileButton
                        onChange={handleFileChange}
                        accept={type === "image" ? "image/png,image/jpeg" : ""}
                        className={`grow`}
                    >
                        {(props) => (
                            <Button
                                {...props}
                                leftSection={
                                    <FontAwesomeIcon icon={faUpload}/>
                                }
                            >
                                {t("Upload from your computer")}
                            </Button>
                        )}
                    </FileButton>
                </div>
            </div>
        </Modal>
    );
}
