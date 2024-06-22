import {Link} from "react-router-dom";
import useAuthentication from "../../common/api/useAuthentication.js";
import Button from "../../common/ui/Button.jsx";
import {Avatar, Burger, Menu} from "@mantine/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

export default function WebsiteHeader({opened, toggle, links}) {
    const {user, logout} = useAuthentication()

    return (
        <div className={`px-2 gap-4 flex justify-center items-center h-full`}>
            <div className={`flex gap-2 grow`}>
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
                {links.map((link, index) => (
                    <Link to={link.path} key={index}>
                        <div className={`hidden md:block p-2 hover:underline`}>
                            {link.name}
                        </div>
                    </Link>
                ))}
            </div>

            {user?.signed_up ?
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <div
                            className={`flex gap-1 items-center cursor-pointer font-[500] text-[13px]`}>
                            <Avatar src={null} size="sm"></Avatar>
                            <div>{user.name}</div>
                        </div>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Label>My account</Menu.Label>
                        <Menu.Item
                            onClick={logout}
                            color="red"
                            leftSection={<FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4"/>}
                        >
                            Logout
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
                :
                <Link to={`/login`}>
                    <Button>
                        Login
                    </Button>
                </Link>
            }


        </div>
    )
}