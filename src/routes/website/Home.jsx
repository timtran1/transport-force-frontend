import {useTranslation} from "react-i18next";
import NotificationState from "../../common/stores/NotificationState.js";

export default function Home() {
    const {i18n} = useTranslation();
    const {notify} = NotificationState(state => state)


    return (
        <main className={`max-w-screen-xl mx-auto px-4 pt-10 grow`}>
            <h1 className={`font-bold text-4xl`}>Welcome to our site</h1>

            <div>Lorem ipsum, yes</div>

            <div className={`flex gap-4`}>
                <button onClick={() => i18n.changeLanguage('en')}>🇬🇧</button>
                <button onClick={() => i18n.changeLanguage('de')}>🇩🇪</button>
                <button onClick={() => i18n.changeLanguage('fr')}>🇫🇷</button>
            </div>

            <button
                className={`p-1 m-1 bg-gray-100`}
                onClick={() => notify({message: 'Success!', type: 'success'})}>
                Notify Success
            </button>
            <button
                className={`p-1 m-1 bg-gray-100`}
                onClick={() => notify({message: 'Error!', type: 'error'})}>
                Notify Error
            </button>
            <button
                className={`p-1 m-1 bg-gray-100`}
                onClick={() => notify({message: 'Info!', type: 'info'})}>
                Notify Info
            </button>
            <button
                className={`p-1 m-1 bg-gray-100`}
                onClick={() => notify({message: 'Warning!', type: 'warning'})}>
                Notify Warning
            </button>

        </main>
    )

}