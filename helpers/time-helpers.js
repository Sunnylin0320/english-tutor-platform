const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')

dayjs.extend(customParseFormat)

module.exports = {
  // 計算出學生可選擇的時段
  getAvailablePeriod: (course, bookingData) => {
    const availablePeriod = []
    const startTime = dayjs(course.startTime)
    const endTime = dayjs(course.endTime)
    const spendTime = course.spendTime
    const bookingDay = course.bookingDay // bookingDay 格式：'0123456'

    let allTimePeriod = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30']

    // 如果 spendTime 是 60 分鐘，則只保留 '18:00', '19:00', '20:00'
    if (spendTime === 60) {
      allTimePeriod = ['18:00', '19:00', '20:00']
    }

    // 使用迴圈遍歷日期區間
    let currentDate = startTime
    while (
      currentDate.isBefore(endTime) ||
      currentDate.isSame(endTime, 'day')
    ) {
      // 檢查星期幾是否符合 bookingDay 的要求
      const currentDayOfWeek = currentDate.day().toString()
      if (bookingDay.includes(currentDayOfWeek)) {
        // 遍歷所有可能的上課時間
        for (const time of allTimePeriod) {
          // 將日期和時間合併成一個完整的日期時間字串
          const dateTimeString = currentDate.format('YYYY-MM-DD') + ' ' + time
          // 檢查是否與該course關聯的booking資料的classTime重疊
          const isTimeSlotAvailable = !bookingData.some(booking => {
            const bookingDateTime = dayjs(booking.classTime)
            const currentTime = dayjs(dateTimeString)
            return (
              booking.courseId === course.id &&
              (currentTime.isSame(bookingDateTime) ||
                (currentTime.isAfter(bookingDateTime) &&
                  currentTime.isBefore(
                    bookingDateTime.add(spendTime, 'minutes')
                  )))
            )
          })

          if (isTimeSlotAvailable) {
            availablePeriod.push(dateTimeString)
          } else {
            // 如果時間與預訂時間重疊，從可用時間中刪除它
            const index = availablePeriod.indexOf(dateTimeString)
            if (index !== -1) {
              availablePeriod.splice(index, 1)
            }
          }
        }
      }
      // 將日期增加一天，以繼續生成下一天的時間
      currentDate = currentDate.add(1, 'day')
    }
    return availablePeriod
  },

  // 計算出選課時間
  getClassTime: (timeString, spendTime) => {
    const startTime = dayjs(timeString)
    const endTime = startTime.add(spendTime, 'minutes')

    // 格式化時間字串，使用 "~" 來表示時間範圍
    const formattedStartTime = startTime.format('YYYY-MM-DD HH:mm')
    const formattedEndTime = endTime.format('HH:mm')

    return `${formattedStartTime} ~ ${formattedEndTime}`
  }
}
