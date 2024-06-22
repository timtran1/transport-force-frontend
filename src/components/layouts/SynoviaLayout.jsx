import {
    faBarcode,
    faWarehouse,
    faTruck,
    faLocationDot,
    faExpand
} from "@fortawesome/free-solid-svg-icons";
import AppLayout from "../../common/layouts/AppLayout.jsx";


const navbarLinks = [
    {
        label: 'Pallets',
        to: '/pallets',
        icon: faBarcode,
    },
    {
        label: 'Depots',
        to: '/depots',
        icon: faWarehouse,
    },
    {
        label: 'Vehicles',
        to: '/vehicles',
        icon: faTruck,
    },
    {
        label: 'Location Pings',
        to: '/location_logs',
        icon: faLocationDot,
    },
    {
        label: 'Scans',
        to: '/scans',
        icon: faExpand,
    },
]

export default function SynoviaLayout() {
    return (
        <AppLayout navbarLinks={navbarLinks}/>
    )
}