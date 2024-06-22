import {useTranslation} from "react-i18next";
import {LineChart} from "@mantine/charts";
import {Button} from "@mantine/core";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import {useEffect, useState} from "react";
import useFetch from "../../../common/api/useFetch.js";
import NotificationState from "../../../common/stores/NotificationState.js";
import ChartViewSkeleton from "../../../common/ui/ChartViewSkeleton.jsx";
import DatePickerInput from "../../../common/ui/DatePickerInput.jsx";
import Select from "../../../common/ui/Select.jsx";
dayjs.extend(weekOfYear);
const timeRanges = [
    {
        value: "last7days",
        label: "Last 7 days"
    },
    {
        value: "last15days",
        label: "Last 15 days"
    },
    {
        value: "1month",
        label: "1 month"
    },
    {
        value: "6months",
        label: "6 months"
    },
    {
        value: "1year",
        label: "1 year"
    },
    {
        value: "all",
        label: "All"
    },
    {
        value: "customRange",
        label: "Custom range"
    }
];
const GROUP_BY = {
    DAY: "day",
    WEEK: "week",
    MONTH: "month",
    YEAR: "year"
};
const MAX_NUMBER_OF_GROUPS = 15;
export default function TrackingOverview() {
    const {t} = useTranslation();
    const [data, setData] = useState([]);
    const [timeRangeType, setTimeRangeType] = useState("last7days");
    const [groupBy, setGroupBy] = useState("day");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const {notify} = NotificationState((state) => state);
    const {
        record: counts,
        loading,
        setParams
    } = useFetch("analytics/count", {
        autoFetch: true,
        params: {
            from_date: dayjs()
                .utc()
                .subtract(7, "day")
                .startOf("day")
                .toISOString(),
            to_date: dayjs().utc().endOf("day").toISOString(),
            group_by: "day"
        }
    });
    useEffect(() => {
        if (counts) {
            updateDataGraph();
        }
    }, [counts]);
    function updateDataGraph() {
        const {tracking_session: sessions, tracking_event: events} = counts;
        if (!sessions || !sessions.length) {
            setData([]);
            return;
        }
        const eventCountMap = events.reduce((map, item) => {
            if (!map[item.time_point]) {
                map[item.time_point] = item.count;
            }
            return map;
        }, {});
        const data = sessions.map((session) => ({
            timePoint: formatByGroup(session.time_point),
            sessionCount: session.count,
            userCount: session.owner_count,
            eventCount: eventCountMap[session.time_point]
        }));
        if (data.length < MAX_NUMBER_OF_GROUPS) {
            setData(data);
            return;
        }
        const dataGroup = categorizeByNumOfGroup(data, MAX_NUMBER_OF_GROUPS);
        setData(dataGroup);
    }
    function formatByGroup(dateString) {
        if (groupBy === GROUP_BY.DAY || groupBy === GROUP_BY.WEEK) {
            return dayjs(dateString).format("YYYY/MM/DD");
        } else if (groupBy === GROUP_BY.MONTH) {
            return dayjs(dateString).format("YYYY/MM");
        } else if (groupBy === GROUP_BY.YEAR) {
            return dayjs(dateString).format("YYYY");
        }
        return dateString;
    }
    function categorizeByNumOfGroup(arr, numOfGroup) {
        const avgGroupSize = Math.ceil(arr.length / numOfGroup);
        const category = {};
        for (let i = 0; i < numOfGroup; i++) {
            const startIndex = i * avgGroupSize;
            const endIndex = Math.min((i + 1) * avgGroupSize, arr.length);
            const sum = {
                sessionCount: 0,
                eventCount: 0,
                userCount: 0
            };
            for (let j = startIndex; j < endIndex; j++) {
                sum.sessionCount += arr[j].sessionCount;
                sum.eventCount += arr[j].eventCount;
                sum.userCount += arr[j].userCount;
            }
            if (startIndex < endIndex) {
                const key = `${arr[startIndex].timePoint} ~ ${
                    arr[endIndex - 1].timePoint
                }`;
                category[key] = sum;
            }
        }
        const result = Object.entries(category).map(([timePoint, count]) => ({
            timePoint,
            ...count
        }));
        return result;
    }
    function handleTimeRangeTypeChange(timeRangeType) {
        setTimeRangeType(timeRangeType);
        if (timeRangeType === "customRange") {
            return;
        }
        const today = dayjs().utc();
        const params = {
            to_date: today.endOf("day").toISOString(),
            group_by: groupBy
        };
        if (timeRangeType === "all" || !timeRangeType) {
            setParams(params);
            return;
        }
        if (timeRangeType === "last7days") {
            params.from_date = today
                .subtract(7, "day")
                .startOf("day")
                .toISOString();
        } else if (timeRangeType === "last15days") {
            params.from_date = today
                .subtract(15, "day")
                .startOf("day")
                .toISOString();
        } else if (timeRangeType === "1month") {
            params.from_date = today
                .subtract(1, "month")
                .startOf("day")
                .toISOString();
        } else if (timeRangeType === "6months") {
            params.from_date = today
                .subtract(6, "month")
                .startOf("day")
                .toISOString();
        } else if (timeRangeType === "1year") {
            params.from_date = today
                .subtract(1, "year")
                .startOf("day")
                .toISOString();
        }
        setParams(params);
    }
    function handleSearchByCustomRange(event) {
        event.preventDefault();
        const isValid = event.target.reportValidity();
        if (!isValid) {
            return;
        }
        if (!fromDate || !toDate) {
            notify({
                message: t("The From date and the To date can not be null."),
                type: "error"
            });
            return;
        }
        if (fromDate > toDate) {
            notify({
                message: t("The From date must be earlier than the To date."),
                type: "error"
            });
            return;
        }
        setParams((params) => ({
            ...params,
            from_date: dayjs(fromDate).utc().startOf("day").toISOString(),
            to_date: dayjs(toDate).utc().endOf("day").toISOString()
        }));
    }
    return (
        <main className={`max-w-screen-xl m-auto my-[50px] px-[24px]`}>
            <div className={`flex w-full justify-between gap-2 `}>
                <h1 className={`text-[36px] font-[700] text-2xl text-pr`}>
                    {t("Tracking Overview")}
                </h1>
            </div>

            <div className={`mt-8 flex`}>
                <Select
                    allowDeselect={false}
                    className={`w-[300px]`}
                    label={t("Time ranges")}
                    data={timeRanges}
                    value={timeRangeType}
                    onChange={handleTimeRangeTypeChange}
                />

                <Select
                    className={`w-[300px] ml-4`}
                    label={t("Show by")}
                    data={Object.values(GROUP_BY)}
                    value={groupBy}
                    onChange={(value) => {
                        setGroupBy(value);
                        setParams((params) => ({
                            ...params,
                            group_by: value
                        }));
                    }}
                />
            </div>

            {timeRangeType === "customRange" && (
                <form
                    className={`mt-2 flex`}
                    onSubmit={handleSearchByCustomRange}
                >
                    <DatePickerInput
                        required
                        clearable
                        className="w-[146px]"
                        label={t("From date")}
                        value={fromDate}
                        onChange={setFromDate}
                    />
                    <DatePickerInput
                        required
                        clearable
                        className="w-[146px] ml-2"
                        label={t("To date")}
                        value={toDate}
                        onChange={setToDate}
                    />
                    <Button
                        type="submit"
                        variant="filled"
                        className="self-end ml-4"
                    >
                        {t("Search")}
                    </Button>
                </form>
            )}

            <div className="mt-10">
                {loading ? (
                    <ChartViewSkeleton height={500} />
                ) : (
                    <LineChart
                        h={500}
                        data={data}
                        dataKey="timePoint"
                        tooltipAnimationDuration={200}
                        withLegend
                        legendProps={{
                            verticalAlign: "bottom",
                            height: 50
                        }}
                        series={[
                            {
                                name: "sessionCount",
                                label: "Session",
                                color: "red.6"
                            },
                            {
                                name: "userCount",
                                label: "User",
                                color: "blue.6"
                            },
                            {
                                name: "eventCount",
                                label: "Event",
                                color: "green.6"
                            }
                        ]}
                        curveType="linear"
                    />
                )}
            </div>
        </main>
    );
}
