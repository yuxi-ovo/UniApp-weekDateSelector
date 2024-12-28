<template>
  <view class='week'>
    <view class="prev-week">
      <span @click="prevWeek">上一周</span>
    </view>
    <view class="current-week">
      <div class="uni-input">{{ currentTime }}</div>
    </view>
    <view class="next-week">
      <span @click="nextWeek">下一周</span>
    </view>
  </view>
</template>

<script setup>
import {calcTotal, COURSE_CONFIG, monthMap} from "@/utils/time"
import {defineEmits, defineProps, onMounted, ref, watch,} from "vue"

const props = defineProps({
  modelValue: {
    default: "第17周",
    type: String
  },
  date: {
    default: new Date(),
    type: Date
  }
})
const emit = defineEmits(["update:modelValue", "changeWeek", "selectDate"])
const currentWeek = ref()
const currentTime = ref()
const currentDate = ref()
const cacheWeek = ref()
const courseConfig = ref({})

function nextWeek() {
  if (currentWeek.value >= 25) {
    uni.showToast({
      title: "已是最大周数",
      icon: "error"
    })
    return
  }
  uni.showLoading({
    title: "加载中...",
  })
  currentWeek.value += 1

  const nextWeekDate = new Date(currentDate.value)
  const nextDay = currentDate.value.getDate() + 7
  let month = null
  console.log(nextWeekDate.getMonth() + 1, nextDay)
  if (nextWeekDate.getMonth() + 1 === 12 && nextDay > monthMap[nextWeekDate.getMonth() + 1]) {
    nextWeekDate.setFullYear(nextWeekDate.getFullYear() + 1)
    let day = nextDay - monthMap[12]
    nextWeekDate.setMonth(0)
    nextWeekDate.setDate(day)
    month = 1
  } else {
    month = currentDate.value.getMonth() + 1
    if (nextDay > monthMap[month]) {
      nextWeekDate.setDate(nextDay - monthMap[month])
      month++
      nextWeekDate.setMonth(month - 1)
    } else {
      nextWeekDate.setDate(nextDay)
    }
  }
  currentDate.value = nextWeekDate
  const day = currentDate.value.getDate()
  currentTime.value = `${month}月${day}日`;
  emit("update:modelValue", `第${currentWeek.value}周`)
  emit("changeWeek", nextWeekDate)
  setTimeout(() => {
    uni.hideLoading()
  }, 50)
}

function prevWeek() {
  if (currentWeek.value <= 1) {
    uni.showToast({
      title: "已是最小周数",
      icon: "error"
    })
    return
  }
  uni.showLoading({
    title: "加载中...",
  })
  currentWeek.value -= 1

  const prevWeekDate = new Date(currentDate.value)
  const prevDay = currentDate.value.getDate() - 7
  const month = currentDate.value.getMonth() + 1
  if (prevWeekDate.getMonth() + 1 === 1 && prevDay <= 0) {
    prevWeekDate.setFullYear(prevWeekDate.getFullYear() - 1)
    let day = monthMap[12] - Math.abs(prevDay)
    prevWeekDate.setMonth(11)
    prevWeekDate.setDate(day)
  } else {
    if (prevDay <= 0) {
      prevWeekDate.setMonth(month - 2)
      prevWeekDate.setDate(monthMap[month - 1] + prevDay)
    } else {
      prevWeekDate.setDate(prevDay)
    }
  }
  currentDate.value = prevWeekDate
  currentTime.value = `${currentDate.value.getMonth() + 1}月${currentDate.value.getDate()}日`;
  emit("update:modelValue", `第${currentWeek.value}周`)
  emit("changeWeek", prevWeekDate)
  setTimeout(() => {
    uni.hideLoading()
  }, 50)
}

function getCurrentTime() {
  const cMonth = currentDate.value.getMonth() + 1
  const cDay = currentDate.value.getDate()
  currentTime.value = `${cMonth}月${cDay}日`
}

function setCurrentTime(date) {
  currentDate.value = new Date(currentDate.value)
  currentDate.value.setDate(date.day)
  currentDate.value.setMonth(date.month - 1)
  currentTime.value = `${date.month}月${date.day}日`
}

function getCurrentWeek() {
  const cMonth = currentDate.value.getMonth() + 1
  const cDay = currentDate.value.getDate()
  const d = {
    month: cMonth,
    day: cDay
  }
  let week = calcTotal(d) - courseConfig.value.disDay;
  currentWeek.value = Math.floor(week / 7) + 1
}

watch(() => props.modelValue, (_, nv) => {
  if (nv.modelValue === cacheWeek.value) {
    getCurrentTime()
  }
})

defineExpose({
  setCurrentTime,
  getCurrentWeek,
  nextWeek,
  prevWeek
})

onMounted(async () => {
  const data = COURSE_CONFIG
  currentDate.value = props.date
  courseConfig.value = data
  getCurrentWeek()
  getCurrentTime()
  cacheWeek.value = props.modelValue
})
</script>

<style lang="scss">
.week {
  width: 100vw;
  height: 100rpx;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 34rpx;
  font-weight: bold;

  > view {
    margin: 0 25rpx;
    text-decoration: underline;
  }

  .current-week {
    font-size: 30rpx;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>