export default function H3(props) {
    const {className, children, ...other} = props
    return (
        <h3 className={`text-lg font-[600] ${className}`} {...other}>
            {children}
        </h3>
    )
}