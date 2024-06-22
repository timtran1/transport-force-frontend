export default function ReadOnlyField(props) {
    const {label, value, description, className, children, ...other} = props

    return (
        <div className={`${className}`} {...other}>
            <div style={{
                fontSize: `var(--input-label-size,var(--mantine-font-size-sm))`,
                fontWeight: 500
            }}>
                {label}
            </div>

            <p style={{
                color: `var(--mantine-color-dimmed)`,
                fontSize: `var(--input-description-size,calc(var(--mantine-font-size-sm) - .125rem*var(--mantine-scale)))`
            }}>
                {description}
            </p>

            <div style={{
                color: `var(--_input-color)`,
                fontFamily: `var(--_input-font-family,var(--mantine-font-family))`,
                fontSize: `var(--_input-fz,var(--input-fz,var(--mantine-font-size-sm)))`,
                height: `var(--_input-size)`,
                lineHeight: `var(--_input-line-height)`,
                minHeight: `var(--_input-height)`,
                width: `100%`,
            }}>
                {children || value}
            </div>
        </div>
    )
}