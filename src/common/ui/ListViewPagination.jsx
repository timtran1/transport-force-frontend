import {useTranslation} from "react-i18next";
import {Pagination} from "@mantine/core";
export default function ListViewPagination(props) {
    const {t} = useTranslation();
    const {query} = props;
    const {page, setPage, pageSize, total} = query;
    return (
        <div className={`flex mt-2 w-full justify-between items-center`}>
            <div className={`text-sm pl-2`}>
                {`${total > pageSize ? pageSize : total} ${t("of")} ${total} ${t("records")}`}
            </div>
            <Pagination
                value={page}
                onChange={setPage}
                total={
                    total % pageSize === 0
                        ? total / pageSize
                        : Math.floor(total / pageSize) + 1
                }
                color={`primary`}
            />
        </div>
    );
}
