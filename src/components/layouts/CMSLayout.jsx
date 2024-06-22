import {faFont, faNewspaper} from "@fortawesome/free-solid-svg-icons";
import AppLayout from "../../common/layouts/AppLayout.jsx";


const navbarLinks = [
    {
        label: 'Theme Translation',
        to: '/theme_translations',
        icon: faFont,
    },
    {
        label: 'Blog Posts',
        to: '/blog_posts',
        icon: faNewspaper,
    }
]

export default function CMSLayout() {
    return (
        <AppLayout navbarLinks={navbarLinks}/>
    )
}