import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import NotificationState from "../../common/stores/NotificationState.js";
import useAuthentication from "../../common/api/useAuthentication.js";
import {useTranslation} from "react-i18next";
import {Modal, Tabs} from "@mantine/core";
import TextInput from "../../common/ui/TextInput.jsx";
import Button from "../../common/ui/Button.jsx";
import H2 from "../../common/ui/H2.jsx";
import BackendHostURLState from "../../common/stores/BackendHostURLState.js";
export default function Login() {
    const location = useLocation();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const {backendHost} = BackendHostURLState((state) => state);
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [signupUsername, setSignupUsername] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("");
    const {notify} = NotificationState((state) => state);
    const {login, signup} = useAuthentication();
    const [loading, setLoading] = useState(false);
    const [isOpenModel, setIsOpenModel] = useState(false);
    const [email, setEmail] = useState("");
    const [loginOtp, setLoginOtp] = useState("");
    const [isUseOtpField, setIsUseOtpField] = useState(false);
    const [isPasswordResetLoading, setIsPasswordResetLoading] = useState(false);
    const [isOpenResetPasswordModalToConfig2Fa, setIsOpenResetPasswordModalToConfig2Fa] = useState(false);
    async function handleLogin(e) {
        try {
            e.preventDefault();
            setLoading(true);
            const result = await login({
                username: loginUsername,
                password: loginPassword,
                otp: loginOtp
            });

            if (result?.is_require_user_config_2fa) {
                setIsOpenModel(true);
                setIsOpenResetPasswordModalToConfig2Fa(true);
                return;
            }

            notify({
                message: t("Logged in successfully!"),
                type: "success"
            });
            const redirect = new URLSearchParams(location.search).get("redirect");
            navigate(redirect || "/");
        } catch (err) {
            if (err?.message === "Incorrect OTP" && !isUseOtpField) {
                notify({
                    message: t("Please input OTP"),
                    type: "info"
                });
                setIsUseOtpField(true);
            } else {
                notify({
                    message: err.message,
                    type: "error"
                });
            }
        } finally {
            setLoading(false);
        }
    }
    async function handleSignup(e) {
        try {
            e.preventDefault();
            setLoading(true);
            await signup(
                {
                    username: signupUsername,
                    password: signupPassword
                },
                true
            );
            notify({
                message: t("Signed up successfully!"),
                type: "success"
            });
            const redirect = new URLSearchParams(location.search).get("redirect");
            navigate(redirect || "/");
        } catch (err) {
            notify({
                message: err.message,
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    }
    function closeModal() {
        setIsOpenModel(false);
        setEmail("");
    }
    async function handleResetPasswordSubmit(e) {
        e.preventDefault();
        const isValid = e.target.reportValidity();
        if (!isValid) {
            return;
        }
        try {
            setIsPasswordResetLoading(true);
            const headers = {
                "Content-Type": "application/json"
            };
            const response = await fetch(`${backendHost}/reset-password-request`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    mixin_id: email
                })
            });
            if (response.status !== 200) {
                const {detail} = await response.json();
                if (typeof detail === "string") {
                    notify({
                        message: detail,
                        type: "error"
                    });
                }
            } else {
                notify({
                    type: "success",
                    message: t("Password reset email sent!")
                });
                closeModal();
            }
        } catch (err) {
            console.error(err);
            notify({
                message: t("An error occurred"),
                type: "error"
            });
        } finally {
            setIsPasswordResetLoading(false);
        }
    }
    return (
        <main className={`max-w-screen-xl grow mx-auto pt-10 w-full`}>
            <Tabs defaultValue="login" variant="outline" className={`max-w-[400px] mx-auto`}>
                <Tabs.List justify="start">
                    <Tabs.Tab value="login">{t("Login")}</Tabs.Tab>
                    <Tabs.Tab value="signup">{t("Signup")}</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="login">
                    <form className={`flex flex-col gap-2 pt-2`} onSubmit={handleLogin}>
                        <TextInput
                            label={t(`Username`)}
                            type="text"
                            required
                            value={loginUsername}
                            onChange={(e) => setLoginUsername(e.target.value)}
                        />
                        <TextInput
                            label={t(`Password`)}
                            type="password"
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        {isUseOtpField && (
                            <TextInput
                                label={t(`OTP`)}
                                type="text"
                                value={loginOtp}
                                onChange={(e) => setLoginOtp(e.target.value)}
                            />
                        )}
                        <Button type="submit" loading={loading} disabled={loading}>
                            {t("Login")}
                        </Button>
                        <Button
                            onClick={() => {
                                setIsOpenModel(true);
                                setIsOpenResetPasswordModalToConfig2Fa(false);
                            }}
                            variant="light"
                        >
                            {t("Reset password")}
                        </Button>
                    </form>
                </Tabs.Panel>

                <Tabs.Panel value="signup">
                    <form className={`flex flex-col gap-2 pt-2`} onSubmit={handleSignup}>
                        <TextInput
                            label={t(`Username`)}
                            type="text"
                            required
                            value={signupUsername}
                            onChange={(e) => setSignupUsername(e.target.value)}
                        />
                        <TextInput
                            label={t(`Password`)}
                            type="password"
                            required
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                        />
                        <TextInput
                            label={t("Confirm Password")}
                            type="password"
                            required
                            value={signupPasswordConfirm}
                            onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                        />
                        <Button type="submit" loading={loading} disabled={loading}>
                            {t("Signup")}
                        </Button>
                    </form>
                </Tabs.Panel>
            </Tabs>

            <Modal
                opened={isOpenModel}
                onClose={closeModal}
                title={
                    <div className={`text-lg font-semibold`}>
                        {isOpenResetPasswordModalToConfig2Fa ? t("Two-Factor-Authentication") : t("Reset Password")}
                    </div>
                }
            >
                {isOpenResetPasswordModalToConfig2Fa && (
                    <div className="mb-4">
                        {t(
                            "Your organization require Two-Factor-Authentication. Please enter your email to set up new login credentials"
                        )}
                    </div>
                )}
                <form onSubmit={handleResetPasswordSubmit} className={`flex items-center gap-2`}>
                    <TextInput
                        className="grow"
                        type="email"
                        label={t("Email")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Button
                        type={`submit`}
                        loading={isPasswordResetLoading}
                        disabled={isPasswordResetLoading}
                        className="mt-3 self-end"
                    >
                        {t("Submit")}
                    </Button>
                </form>
            </Modal>
        </main>
    );
}
