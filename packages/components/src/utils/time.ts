import type {DateArgs, MonthMap, TimeMap, WeekDayCnMap, WeekDayMap} from "../types/time";

export const COURSE_CONFIG = {
    start_date: "2024-09-01",
    end_date: "2025-02-20",
    start_month: 9,
    start_day: 2,
    disDay: 246
};
export default (index = 'data') => {
    const time = new Date();
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();
    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();
    if (index === 'data') {
        return `${year}年${month}月${day}日${hour}时${minute}分${second}秒`;
    } else if (index === 'yearmonth') {
        return `${year}年${month}月${day}日`;
    } else {
        return Date.parse(new Date().toString());
    }
};

// formatTime的计算[1-2,3-4]节次数据的辅助变量
let i = 0;

export function formatTime(timeData: string, type: string) {
    const timeMap: TimeMap = {
        "01": "8.30-10.00",
        "03": "10.20-11.50",
        "05": "14.00-15.30",
        "07": "15.50-17.20",
        "09": "18.40-20.10",
        "11": "20.20-21.50"
    };

    const t = timeData.split(' ');
    const section = t[2];
    const s = section.split("-");
    if (section.split('-').length <= 2) {
        const index = s[0].replace("[", "");
        return () => {
            return type === "easy" ? timeMap[index] : timeMap[index] + " " + section;
        };
    } else {
        return () => {
            const index = s[i].replace("[", "");
            i += 2;
            i = i === 4 ? 0 : i;
            return type === "easy" ? timeMap[index] : timeMap[index] + " " + section;
        };
    }
}


export const timeStampMap = {
    "第一大节": "8:30 10:00",
    "第二大节": "10:20 11:50",
    "第三大节": "14:00 15:30",
    "第四大节": "15:50 17:20",
    "第五大节": "18:40 20:10",
    "第六大节": "20:20 21:50"
};

function genMonthMap(): MonthMap {

    const defaultMonthMap: MonthMap = {
        1: 31,
        2: 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31
    };

    const year = new Date().getFullYear();

    if ((year % 4 === 0 && year % 100 != 0) || year % 400 === 0) {
        defaultMonthMap[2] = 29;
    }
    return defaultMonthMap;
}

export const monthMap = genMonthMap();
const weekDayMap: WeekDayMap = {
    "0": "星期日",
    "1": "星期一",
    "2": "星期二",
    "3": "星期三",
    "4": "星期四",
    "5": "星期五",
    "6": "星期六",
};


export function calcTotal(date: DateArgs) {
    const {
        month,
        day
    } = date;
    let result = 0;
    for (let d = 0; d < month! - 1; d++) {
        result += monthMap[d + 1];
    }
    result += day!;
    return result;
}

export function calcTimeInterval(year: number, date1: DateArgs, date2: DateArgs) {

    function isLeapYear(year: number) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    if (isLeapYear(year)) monthMap['2'] = 29;
    const date1DayTotal = calcTotal(date1);
    const date2DayTotal = calcTotal(date2);

    return date1DayTotal - date2DayTotal;
}

export function getCurrentDate(data: DateArgs) {
    const date = new Date();
    if (data) {
        if (data.month! >= 13) {
            date.setFullYear(date.getFullYear() + 1);
            date.setMonth(data.month! - 13);
            date.setDate(data.day!);
        } else {
            date.setFullYear(data.year || 2024);
            date.setMonth(data.month! - 1);
            date.setDate(data.day!);
        }
    }
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDay = date.getDay();
    const d: DateArgs = {
        month,
        day,
    };
    if (month === 12) {
        // debugger
    }
    let week = calcTotal(d) - COURSE_CONFIG.disDay;
    if (week < 2) {
        week = calcTotal(d) + 120;
    }
    const index = Math.floor(week / 7) + 1;
    return {
        week: `第${index}周`,
        weekDay: `${weekDayMap[weekDay]}`,
    };
}

export function getDateByWeek(week: number) {
    const result = [];
    const date = new Date();

    date.setDate(COURSE_CONFIG.start_day);
    date.setMonth(COURSE_CONFIG.start_month - 1);
    const weekDayMap: WeekDayCnMap = {
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五",
        6: "六",
        7: "日"
    };
    for (let i = 1; i < week; i++) {
        date.setDate(date.getDate() + 7);
        if (date.getDate() > monthMap[date.getMonth()]) {
            date.setMonth(date.getMonth() + 1);
        }
    }

    for (let i = 0; i < 7; i++) {
        result.push({
            weekDay: weekDayMap[i + 1],
            day: date.getDate()
        });
        date.setDate(date.getDate() + 1);
    }
    return result;
}

export function getDateByWeekandWeekDay(data: DateArgs) {
    // console.log(data);
    let week = 0;
    if (data.week!.length === 4) {
        week = +(data.week!.substring(1, 3)) - 1;
    } else {
        week = +(data.week!.substring(1, 2)) - 1;
    }
    const weekDay = Object.values(weekDayMap).indexOf(data.weekDay);
    const date = new Date();
    date.setDate(COURSE_CONFIG.start_day);
    date.setMonth(COURSE_CONFIG.start_month - 1);
    for (let i = 0; i < week; i++) {
        date.setDate(date.getDate() + 7);
    }
    const day = weekDay === 0 ? 7 : weekDay - 1;
    date.setDate(date.getDate() + day);
    const month = date.getMonth() + 1;
    const m = month.toString().padStart(2, '0');
    const d = date.getDate();
    const y = date.getFullYear();
    return `${y}-${m}-${d}`;
}