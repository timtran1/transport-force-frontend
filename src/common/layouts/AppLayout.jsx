import {useDisclosure} from "@mantine/hooks";
import {AppShell, Avatar, Burger, Menu, NavLink, useMantineTheme} from "@mantine/core";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import useAuthentication from "../api/useAuthentication.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faUser,
    faUsers,
    faBell
} from "@fortawesome/free-solid-svg-icons";
import H3 from "../ui/H3.jsx";
import Card from "../ui/Card.jsx";
import Notification from "../notification/Notification.jsx";
import NotificationList from "../notification/NotificationList.jsx";
import Button from "../ui/Button.jsx";
import VisibilityControl from "../auth/VisibilityControl.jsx";
import apps from "../../constants/apps.js";
import trackingSettings from "../../constants/trackingSettings.js";
import LangSwitcher from "../ui/LangSwitcher.jsx";
import {useTranslation} from "react-i18next";
import gridIcon from "../../assets/images/grid.svg";
import {getAttachmentUrl} from "../utils/index.js";
import BackendHostURLState from "../stores/BackendHostURLState.js";

export default function AppLayout(props) {
    const {
        navbarLinks,
        navbarWidth = 160,
        headerHeight = 40
    } = props;
    const [opened, {toggle}] = useDisclosure();
    const {user, logout} = useAuthentication();
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const {t} = useTranslation();
    const {backendHost} = BackendHostURLState(state => state)

    const renderNavLinkRecursively = (links) => {

        return links.map((link, index) => {
            const userRoleIds = user?.all_roles?.map(rec => rec.string_id) || []
            const isVisible = link.roleIds ? link.roleIds.some(roleId => userRoleIds.includes(roleId)) : true

            if (!isVisible) {
                return null
            }

            if (link.children?.length > 0) {
                return (
                    <NavLink
                        key={index}
                        label={t(link.label)}
                        leftSection={
                            <FontAwesomeIcon
                                icon={link.icon}
                                className="h-4 w-4"
                            />
                        }
                        className={`hover:bg-white hover:text-primary-main`}
                        active={location.pathname.includes(link.to)}
                        variant={`filled`}
                        color={`black`}
                    >
                        {renderNavLinkRecursively(link.children)}
                    </NavLink>
                );
            } else {
                return (
                    <NavLink
                        key={index}
                        label={t(link.label)}
                        leftSection={
                            <FontAwesomeIcon
                                icon={link.icon}
                                className="h-4 w-4"
                            />
                        }
                        className={`hover:bg-white hover:text-primary-main`}
                        onClick={() => {
                            navigate(link.to);
                            if (opened) toggle();
                        }}
                        active={location.pathname.includes(link.to)}
                        variant={`filled`}
                        color={`blue`}
                    />
                );
            }
        });
    };
    return (
        <>
            <AppShell
                header={{
                    height: headerHeight
                }}
                navbar={{
                    width: navbarWidth,
                    breakpoint: "sm",
                    collapsed: {
                        mobile: !opened
                    }
                }}
                padding="md"
            >
                <AppShell.Header>
                    <div
                        className={`flex items-center justify-between h-full px-2`}
                    >
                        <div className={`flex items-center h-full gap-2`}>
                            <Burger
                                opened={opened}
                                onClick={toggle}
                                hiddenFrom="sm"
                                size="sm"
                            />

                            <Menu shadow="md" width={200}>
                                <Menu.Target>
                                    <button className={`max-w-full`}>
                                        <img
                                            src={gridIcon}
                                            alt=""
                                            className={`max-w-[16px]`}
                                        />
                                    </button>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <div className={`p-2`}>
                                        <H3>{t("Apps")}</H3>
                                        <div
                                            className={`flex gap-3 flex-wrap justify-center`}
                                        >
                                            {apps.map((link, index) => {
                                                const userRoleIds = user?.all_roles?.map(rec => rec.string_id) || []
                                                const isVisible = link.roleIds ? link.roleIds.some(roleId => userRoleIds.includes(roleId)) : true

                                                if (!isVisible) {
                                                    return null
                                                }
                                                return (
                                                    <Link
                                                        key={index}
                                                        to={link.to}
                                                        className={`w-[90px] flex flex-col items-center gap-2 mt-2 cursor-pointer`}
                                                    >
                                                        <Card
                                                            className={`w-[40px] h-[40px] p-0 flex justify-center items-center cursor-pointer ${link.className}`}
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={link.icon}
                                                            />
                                                        </Card>
                                                        <div
                                                            className={`text-[13px] font-[500] text-wrap text-center`}
                                                        >
                                                            {t(link.label)}
                                                        </div>
                                                    </Link>
                                                )
                                            })}
                                            <VisibilityControl
                                                roleIds={[`super_admin_role`, `admin_role`]}
                                            >
                                                <Link
                                                    to={`/users`}
                                                    className={`flex flex-col items-center gap-2 mt-2 cursor-pointer`}
                                                >
                                                    <Card
                                                        className={`w-[40px] h-[40px] p-0 flex justify-center items-center cursor-pointer bg-slate-500 text-white`}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faUsers}
                                                        />
                                                    </Card>
                                                    <div
                                                        className={`text-[13px] font-[500] text-wrap text-center`}
                                                    >
                                                        {t("Organization")}
                                                    </div>
                                                </Link>
                                            </VisibilityControl>
                                        </div>
                                    </div>
                                </Menu.Dropdown>
                            </Menu>

                            <div className={`hidden sm:block font-[500]`}>
                                {user?.organization?.name}
                            </div>
                        </div>
                        <div className={`flex items-center gap-2`}>
                            {(
                                trackingSettings.enableAnonUsers
                                    ? user?.signed_up === true
                                    : user
                            ) ? (
                                <>
                                    {/*<LangSwitcher/>*/}

                                    {/*notifications dropdown   */}
                                    <Menu shadow="md" width={300}>
                                        <Menu.Target>
                                            {/*<Indicator label="5" color="red" size={13}>*/}
                                            <div>
                                                <FontAwesomeIcon
                                                    icon={faBell}
                                                    className="cursor-pointer h-3.5 w-3.5"
                                                />
                                            </div>
                                            {/*</Indicator>*/}
                                        </Menu.Target>

                                        <Menu.Dropdown>
                                            <Menu.Label>
                                                {t("Notifications")}
                                            </Menu.Label>
                                            <NotificationList/>
                                        </Menu.Dropdown>
                                    </Menu>

                                    {/*profile dropdown*/}
                                    <Menu shadow="md" width={200}>
                                        <Menu.Target>
                                            <div
                                                className={`flex gap-1 items-center cursor-pointer font-[500] text-[13px]`}
                                            >
                                                <Avatar
                                                    src={user?.image?.name ? getAttachmentUrl(backendHost, user.image.name) : null}
                                                    size="sm"
                                                ></Avatar>
                                                <div>{user.username}</div>
                                            </div>
                                        </Menu.Target>

                                        <Menu.Dropdown>
                                            <Menu.Label>
                                                {t("My account")}
                                            </Menu.Label>
                                            <Menu.Item
                                                onClick={() =>
                                                    navigate(
                                                        `/profile/${user.id}/edit`
                                                    )
                                                }
                                                leftSection={
                                                    <FontAwesomeIcon
                                                        icon={faUser}
                                                        className="h-4 w-4"
                                                    />
                                                }
                                            >
                                                {t("Edit profile")}
                                            </Menu.Item>
                                            <Menu.Item
                                                onClick={logout}
                                                color="red"
                                                leftSection={
                                                    <FontAwesomeIcon
                                                        icon={faArrowLeft}
                                                        className="h-4 w-4"
                                                    />
                                                }
                                            >
                                                {t("Logout")}
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </>
                            ) : (
                                <Link to={`/login`}>
                                    <Button>{t("Login")}</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </AppShell.Header>

                {navbarLinks && (
                    <AppShell.Navbar
                        className={`text-primary-contrastText`}
                        style={{
                            "--mantine-color-body": theme.colors.primary[8]
                        }}
                    >
                        {renderNavLinkRecursively(navbarLinks)}
                    </AppShell.Navbar>
                )}

                <AppShell.Main>
                    <Outlet/>
                </AppShell.Main>
            </AppShell>

            <Notification/>
        </>
    );
}
