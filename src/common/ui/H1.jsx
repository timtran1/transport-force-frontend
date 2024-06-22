export default function H1(props) {
    const {className, children, ...other} = props
    return (
        <h1 className={`text-3xl font-[700] ${className}`} {...other}>
            {children}
        </h1>
    )
}