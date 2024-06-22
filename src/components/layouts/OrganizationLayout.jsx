import {useTranslation} from "react-i18next";
import {
    faUser,
    faUsersGear,
    faSliders,
    faWrench,
    faEnvelopeOpenText,
    faClock,
    faPaperPlane
} from "@fortawesome/free-solid-svg-icons";
import AppLayout from "../../common/layouts/AppLayout.jsx";

const navbarLinks = [
    {
        label: "Users",
        to: "/users",
        icon: faUser
    },
    {
        label: "Roles",
        to: "/roles",
        icon: faUsersGear
    },
    {
        label: "Mail Templates",
        to: "/email_templates",
        icon: faEnvelopeOpenText
    },
    {
        label: "Settings",
        // to: "/organization-settings",
        icon: faWrench,
        children: [
            {
                label: "General",
                to: "/organization-settings",
                icon: faSliders,
            },
            {
                label: "SMTP Settings",
                to: "/smtp-settings",
                icon: faPaperPlane,
            },
            {
                label: "Scheduled Actions",
                to: "/crons",
                icon: faClock,
            }
        ]
    }
];
export default function OrganizationLayout() {
    const {t} = useTranslation();
    return <AppLayout navbarLinks={navbarLinks}/>;
}
