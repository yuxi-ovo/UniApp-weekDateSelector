<template>
  <view class="week-date">
    <view class="time-list">
      <view
          v-for="(date, i) in weekDayTimeList"
          :key="i"
          :class="{ select: currentWeekDay === weekDayMap[date.weekDay!] }"
          class="date-item"
          @click="changeDay(date)"
      >
        <view class="weekDay">
          <span>{{ (date.weekDay === 7 ? weekDayMap[0] : weekDayMap[date.weekDay!]).substring(2) }}</span>
        </view>
        <view class="day">
          <span>{{ date.day }}</span>
        </view>
      </view>
    </view>
  </view>
  <week-select ref="weekSelectComponent" :date="props.date" @changeWeek="changeWeek"></week-select>
</template>

<script lang="ts" setup>
import {defineEmits, defineExpose, defineProps, onMounted, ref, watch} from "vue";
import {monthMap} from "../utils/time";
import WeekSelect from "./weekSelect.vue";
import type {DateArgs, WeekDayMap} from "../types/time";


const props = defineProps({
  modelValue: {
    type: String
  },
  date: {
    default: new Date(),
    type: Date
  }
})
const emit = defineEmits(["update:modelValue", "changeWeekDay", "changeWeek"]);
const currentDate = ref<Date>()
const weekDayTimeList = ref<DateArgs[]>();
const currentDay = ref(0);
const currentWeekDay = ref();
const weekSelectComponent = ref()
const weekDayMap: WeekDayMap = {
  0: "星期日",
  1: "星期一",
  2: "星期二",
  3: "星期三",
  4: "星期四",
  5: "星期五",
  6: "星期六",
};

function getWeekDayTime() {
  const date = props.date;
  let month = props.date.getMonth() + 1;
  // 月的当前日
  const day = date.getDate();
  currentDay.value = day;
  // 当前星期几
  const weekDay = date.getDay()
  currentWeekDay.value = weekDayMap[weekDay];
  const result: DateArgs[] = [];
  const right = 7 - weekDay;
  const left = 7 - right;
  // debugger
  // 生成左边日期
  for (let d = left - 1; d >= 0; d--) {
    let prevDay = day - d;
    const prevWeekDay = weekDay - d;
    let m = month;
    if (prevDay <= 0) {
      if (month === 1) {
        prevDay = monthMap[12] + prevDay;
        m = 12;
      } else {
        prevDay = monthMap[month - 1] + prevDay;
        m = m - 1;
      }
    }
    result.push({
      day: prevDay,
      weekDay: prevWeekDay,
      month: m,
    });
  }
  // 生成右边的日期
  for (let d = right; d > 0; d--) {
    let nextDay = day + d;
    const nextWeekDay = weekDay + d;
    let m = month;

    // 判断是否跨年
    if (m === 12 && nextDay > monthMap[m]) {
      nextDay = day + d - monthMap[month];
      m = 1;
    }
    // 判断是否跨月
    if (nextDay > monthMap[month]) {
      nextDay = nextDay - monthMap[month];
      m = m + 1;
    }

    result.push({
      day: nextDay,
      weekDay: nextWeekDay,
      month: m,
    });
  }
  result.sort((a, b) => {
    return a.weekDay! - b.weekDay!
  });
  weekDayTimeList.value = result;
}

function nextWeekDay() {
  const currentIndex = props.date.getDay();
  const newDate = {
    day: props.date.getDate() + 1,
    weekDay: currentIndex + 1,
    month: props.date.getMonth() + 1,
  };
  changeDay(newDate);
}

function prevWeekDay() {
  let currentIndex = props.date.getDay() === 0 ? 7 : props.date.getDay();
  if (currentIndex === 1) {
    currentIndex = 8;
  }
  const newDate = {
    day: props.date.getDate() - 1,
    weekDay: currentIndex - 1,
    month: props.date.getMonth() + 1,
  };
  changeDay(newDate);
}

function changeDay(date: DateArgs) {
  currentDay.value = date.day!;
  currentWeekDay.value = weekDayMap[date.weekDay!];
  emit("update:modelValue", currentWeekDay.value);
  weekSelectComponent.value.setCurrentTime(date);
}

function changeWeek(date: Date) {
  currentDate.value = date
  emit("changeWeek", date)
}

defineExpose({
  nextWeekDay,
  prevWeekDay,
});

watch(
    () => props.date,
    () => {
      getWeekDayTime();
    }
);

onMounted(() => {
  getWeekDayTime();
  // 设置默认值
  currentDate.value = props.date;
  currentWeekDay.value = weekDayMap[props.date.getDay() === 0 ? 7 : props.date.getDay()]
});
</script>

<style lang="scss">
.week-date {
  .time-list {
    width: 90vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;

    > .date-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
      padding: 15rpx 20rpx;
      border-radius: 10rpx;
      color: #333;
      font-size: 30rpx;
      font-weight: bold;

      .hasC {
        position: relative;

        &::after {
          content: "";
          width: 15rpx;
          height: 15rpx;
          border-radius: 50%;
          background-color: red;
          position: absolute;
          right: -5rpx;
          top: -10rpx;
        }
      }
    }

    .select {
      background-color: #0497ff;
      color: #fff;
    }
  }
}
</style>
