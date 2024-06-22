import {useTranslation} from "react-i18next";
import {Menu} from "@mantine/core";
import useModel from "../api/useModel.jsx";

function onlyUnique(value, index, array) {
    return array.findIndex(item => item.id === value.id) === index;
}

export default function LangSwitcher() {
    const {i18n} = useTranslation();
    const {data: translations} = useModel("site_content", {autoFetch: true})
    const locales = translations.map(translation => translation.locale).filter(onlyUnique)

    const currentLocale = locales?.find(locale => locale.code === i18n.language.replace("-", "_"))

    return (
        <Menu trapFocus position="bottom" shadow="md" padding={"xs"}>
            {/*{i18n.language}*/}
            <Menu.Target>
                <div className={`cursor-pointer`}>
                    {currentLocale?.emoji_flag || i18n.language}
                </div>
            </Menu.Target>
            <Menu.Dropdown>
                {locales.map(locale => (
                    <Menu.Item key={locale.name}>
                        <div className={"text-[14px]"} onClick={() => i18n.changeLanguage(locale.iso_code)}>
                            {locale.emoji_flag} {locale.name}
                        </div>
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    )
}