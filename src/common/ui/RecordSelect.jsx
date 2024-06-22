import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {
    InputBase,
    Combobox,
    useCombobox,
    CloseButton,
    Modal
} from "@mantine/core";
import useModel from "../api/useModel.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

export default function RecordSelect(props) {
    const {t} = useTranslation();
    const {
        label,
        placeholder,
        required,
        model,
        value: initialValue,
        onChange,
        searchFields = ["name"],
        renderOption,
        displayField = "name",
        createView,
        pageSize = 5,
        ...otherProps
    } = props;
    const CreateView = createView;
    const {data, searchTerm, setSearchTerm} = useModel(model, {
        autoFetch: true,
        pageSize,
        searchFields
    });
    const [value, setValue] = useState(initialValue || []);
    const [showModal, setShowModal] = useState(false);
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption()
    });
    const options = data.map((item) =>
        renderOption ? (
            renderOption(item)
        ) : (
            <Combobox.Option value={item.id} key={item.id}>
                {item[displayField]}
            </Combobox.Option>
        )
    );

    // run once on mount, set searchTerm to display name of initial value
    useEffect(() => {
        if (data.length > 0 && initialValue) {
            let initialRecord
            // check if integer
            if (!isNaN(initialValue)) {
                initialRecord = data.find(item => item.id === parseInt(initialValue))
            } else if (typeof initialValue === "string" && initialValue.includes('/')) {
                // this is a string_id
                const string_id = initialValue.split('/')[1]
                initialRecord = data.find(item => item.string_id === string_id)
            }
            if (initialRecord) {
                setSearchTerm(initialRecord[displayField]);
            }
        }
    }, [data, initialValue]);

    function clear() {
        setValue(null);
        setSearchTerm("");
        onChange(null);
    }

    return (
        <>
            <Combobox
                {...otherProps}
                store={combobox}
                onOptionSubmit={(val) => {
                    // on select an option
                    // set value to its id, and searchTerm to its display name
                    onChange(val);
                    setValue(val);
                    setSearchTerm(
                        data.find((item) => item.id === val)[displayField]
                    );
                    combobox.closeDropdown();
                }}
            >
                <Combobox.Target>
                    <InputBase
                        onClick={() => combobox.openDropdown()}
                        onFocus={() => combobox.openDropdown()}
                        onBlur={() => {
                            combobox.closeDropdown();
                            // when focus away
                            // if value is in data, set searchTerm to its display name, else clear searchTerm
                            if (data?.length > 0) {
                                const item = data.find(
                                    (item) => item.id === value
                                );
                                setSearchTerm(item ? item[displayField] : "");
                            }
                        }}
                        label={label}
                        placeholder={placeholder}
                        value={searchTerm}
                        required={required}
                        onChange={(event) => {
                            // when user types
                            // set searchTerm to input value
                            combobox.updateSelectedOptionIndex();
                            setSearchTerm(event.currentTarget.value);
                        }}
                        rightSection={
                            value !== null ? (
                                <CloseButton
                                    size="sm"
                                    onMouseDown={(event) =>
                                        event.preventDefault()
                                    }
                                    onClick={clear}
                                    aria-label="Clear value"
                                />
                            ) : (
                                <Combobox.Chevron/>
                            )
                        }
                        rightSectionPointerEvents={
                            value === null ? "none" : "all"
                        }
                    />
                </Combobox.Target>

                <Combobox.Dropdown>
                    <Combobox.Options>
                        {options.length > 0 ? (
                            options
                        ) : (
                            <Combobox.Empty>
                                {t("Nothing found")}
                            </Combobox.Empty>
                        )}
                        {createView && (
                            <button
                                className={`w-full border-t border-gray-border text-primary-main text-left p-2 hover:bg-primary-main hover:text-primary-contrastText rounded-b text-xs font-semibold`}
                                onClick={() => setShowModal(true)}
                            >
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className={`mr-1`}
                                />
                                {t("Create")}
                            </button>
                        )}
                    </Combobox.Options>
                </Combobox.Dropdown>
            </Combobox>

            <Modal
                opened={showModal}
                title={
                    <div className={`text-lg font-semibold`}>{t("Create")}</div>
                }
                onClose={() => setShowModal(false)}
                size={`2xl`}
            >
                {createView && (
                    <CreateView
                        modalMode={true}
                        onSuccess={(record) => {
                            setValue(record.id);
                            onChange(record.id);
                            setSearchTerm(record[displayField]);
                            setShowModal(false);
                        }}
                    />
                )}
            </Modal>
        </>
    );
}
