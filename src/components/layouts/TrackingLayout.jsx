import {faChartLine, faShoePrints} from "@fortawesome/free-solid-svg-icons";
import AppLayout from "../../common/layouts/AppLayout.jsx";


const navbarLinks = [
    {
        label: 'Tracking Overview',
        to: '/tracking_overview',
        icon: faChartLine,
    },
    {
        label: 'Tracking Sessions',
        to: '/tracking_sessions',
        icon: faShoePrints,
    },
]

export default function TrackingLayout() {
    return (
        <AppLayout navbarLinks={navbarLinks}/>
    )
}