export interface TimeMap {
    "01": "8.30-10.00",
    "03": "10.20-11.50",
    "05": "14.00-15.30",
    "07": "15.50-17.20",
    "09": "18.40-20.10",
    "11": "20.20-21.50";

    [key: string]: string;
}

export interface DateArgs {
    day?: number;
    month?: number;
    year?: number;
    week?: string;
    weekDay?: number;
}

export interface MonthMap {
    1: 31;
    2: 28 | 29;
    3: 31;
    4: 30;
    5: 31;
    6: 30;
    7: 31;
    8: 31;
    9: 30;
    10: 31;
    11: 30;
    12: 31;

    [key: number]: number;
}

export interface CourseConfig {
    start_date: string;
    end_date: string;
    start_month: number;
    start_day: number;
    disDay: number;
}

export interface WeekDayMap {
    0: "星期日";
    1: "星期一";
    2: "星期二";
    3: "星期三";
    4: "星期四";
    5: "星期五";
    6: "星期六";

    [key: number]: string;
}

export interface WeekDayCnMap {
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
    7: "日";

    [key: number]: string;
}