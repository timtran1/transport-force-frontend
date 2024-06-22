import {Card as LakeUICard} from "@deepsel/lake-ui"

export default function Card(props) {
    const {className, hoverEffect, ...other} = props
    return <LakeUICard
        className={`border border-gray-border shadow cursor-auto p-[24px] ${className}`}
        hoverEffect={hoverEffect === undefined ? false : hoverEffect}
        {...other}
    />
}