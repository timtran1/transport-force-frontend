import {
    faEarthAmericas,
    faPenRuler,
    faShoePrints
} from "@fortawesome/free-solid-svg-icons";

export default [
    {
        label: 'Website',
        icon: faEarthAmericas,
        className: 'bg-green-300 text-gray-600 ',
        to: '/'
    },
    {
        label: 'CMS',
        icon: faPenRuler,
        className: 'bg-blue-500 text-white',
        to: '/theme_translations'
    },
    {
        label: "Tracking",
        icon: faShoePrints,
        className: "text-red-400 bg-white",
        to: "/tracking_overview",
        roleIds: ["tracking_manager_role"],
    },
]