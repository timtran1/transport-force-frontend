import CreateFormActionBar from "./CreateFormActionBar.jsx";
import Card from "./Card.jsx";

export default function CreateFormWrapper(props) {
    const {
        modalMode,
        onSubmit,
        loading,
        className,
        children
    } = props

    return (
        <form
            onSubmit={onSubmit}
            className={`max-w-screen-xl m-auto flex ${modalMode ? 'flex-col-reverse' : 'px-[24px] my-[20px] flex-col'} ${className}`}
        >
            <CreateFormActionBar loading={loading} modalMode={modalMode}/>

            <Card className={modalMode && 'border-none shadow-none !p-0'}>
                {children}
            </Card>
        </form>
    )
}