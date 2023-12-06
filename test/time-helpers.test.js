const { getAvailablePeriod } = require('../helpers/time-helpers')
const { getClassTime } = require('../helpers/time-helpers')

// 模擬一些測試資料
const course = {
  startTime: '2023-12-06 18:00:00',
  endTime: '2023-12-13 19:00:00',
  spendTime: 60,
  bookingDay: '3'
}
const bookingData = [
  {
    classTime: '2023-12-06 18:00:00'
  }
  // 添加其他預訂資料
]

const availablePeriods = getAvailablePeriod(course, bookingData)

// 使用 console.log 來檢查生成的可用時間段
console.log('Available Periods:')
console.log(availablePeriods)

// 例如，如果您有一個時間字串 '2023-12-06 18:00' 和 spendTime 為 30
const timeString = '2023-12-06 18:00'
const spendTime = 60
const formattedTime = getClassTime(timeString, spendTime)

// 使用 console.log 來檢查格式化後的時間範圍
console.log('Formatted Time:')
console.log(formattedTime)
