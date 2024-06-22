import {Link, Outlet, useLocation} from "react-router-dom";
import WebsiteHeader from "../website/WebsiteHeader.jsx";
import Notification from "../../common/notification/Notification.jsx";
import WebsiteFooter from "../website/WebsiteFooter.jsx";
import {useEffect} from "react";
import {useHash, useDisclosure} from '@mantine/hooks';
import {AppShell} from '@mantine/core';

const links = [
    {
        name: 'Home',
        path: '/'
    },
    {
        name: 'Users',
        path: '/users'
    },
]

export default function WebsiteLayout() {
    const hash = useHash()[0]
    const location = useLocation();
    const [opened, {toggle}] = useDisclosure();

    // scroll to hash, if no hash scroll to top
    useEffect(() => {
        if (hash) {
            const el = document.getElementById(hash.replace('#', ''))
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({behavior: 'smooth'})
                }, 300)
            }
        } else {
            window.scrollTo(0, 0)
        }
    }, [hash, location])

    return (
        <AppShell
            header={{height: 60}}
            navbar={{width: 300, breakpoint: 'sm', collapsed: {desktop: true, mobile: !opened}}}
            padding="md"
        >
            {/*<AppShell.Header>*/}
            {/*    <WebsiteHeader opened={opened} toggle={toggle} links={links}/>*/}
            {/*</AppShell.Header>*/}
            <AppShell.Navbar p="md">
                {links.map((link, index) => (
                    <Link to={link.path} key={index} onClick={() => {if (opened) toggle()}}>
                        <div className={`p-2 hover:underline`}>
                            {link.name}
                        </div>
                    </Link>
                ))}
            </AppShell.Navbar>

            <AppShell.Main>
                <Outlet/>
            </AppShell.Main>

            {/*<AppShell.Footer>*/}
            {/*    <WebsiteFooter links={links}/>*/}
            {/*</AppShell.Footer>*/}

            <Notification/>
        </AppShell>
    )
}
