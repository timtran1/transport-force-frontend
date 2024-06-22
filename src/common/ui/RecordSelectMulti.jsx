import {useTranslation} from "react-i18next";
import {useState, useEffect} from "react";
import {
    PillsInput,
    Pill,
    Combobox,
    CheckIcon,
    Group,
    useCombobox
} from "@mantine/core";
import useModel from "../api/useModel.jsx";

export default function RecordSelectMulti(props) {
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
        pageSize= 5
    } = props;
    const {data, searchTerm, setSearchTerm} = useModel(model, {
        autoFetch: true,
        pageSize,
        searchFields
    });
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex("active")
    });
    const [value, setValue] = useState(initialValue || []);

    // set initial value when initialValue changes
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    function handleValueSelect(itemToAdd) {
        const newValue = value.includes(itemToAdd)
            ? value.filter((item) => item !== itemToAdd)
            : [...value, itemToAdd];
        setValue(newValue);
        if (onChange) onChange(newValue);
    }

    function handleValueRemove(itemToRemove) {
        const newValue = value.filter((item) => item !== itemToRemove);
        setValue(newValue);
        if (onChange) onChange(newValue);
    }

    const values = value?.map((item) => (
        <Pill
            key={item.id}
            withRemoveButton
            onRemove={() => handleValueRemove(item)}
        >
            {item[displayField]}
        </Pill>
    ));
    const options = data.map((item) =>
        renderOption ? (
            renderOption(item)
        ) : (
            <Combobox.Option
                value={item}
                key={item.id}
                active={value?.includes(item)}
            >
                <Group gap="sm">
                    {value?.find((v) => v.id === item.id) ? (
                        <CheckIcon size={12}/>
                    ) : null}
                    <span>{item[displayField]}</span>
                </Group>
            </Combobox.Option>
        )
    );
    return (
        <Combobox
            store={combobox}
            onOptionSubmit={handleValueSelect}
            withinPortal={false}
        >
            <Combobox.DropdownTarget>
                <PillsInput
                    onClick={() => combobox.openDropdown()}
                    label={label}
                >
                    <Pill.Group>
                        {values}

                        <Combobox.EventsTarget>
                            <PillsInput.Field
                                onFocus={() => combobox.openDropdown()}
                                onBlur={() => combobox.closeDropdown()}
                                value={searchTerm}
                                placeholder={placeholder}
                                required={required}
                                onChange={(event) => {
                                    combobox.updateSelectedOptionIndex();
                                    setSearchTerm(event.currentTarget.value);
                                }}
                                onKeyDown={(event) => {
                                    if (
                                        event.key === "Backspace" &&
                                        searchTerm.length === 0
                                    ) {
                                        event.preventDefault();
                                        handleValueRemove(
                                            value[value.length - 1]
                                        );
                                    }
                                }}
                            />
                        </Combobox.EventsTarget>
                    </Pill.Group>
                </PillsInput>
            </Combobox.DropdownTarget>

            <Combobox.Dropdown>
                <Combobox.Options>
                    {options.length > 0 ? (
                        options
                    ) : (
                        <Combobox.Empty>{t("Nothing found...")}</Combobox.Empty>
                    )}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}
