const dayjs = require('dayjs')

module.exports = {
  BCRYPT_SALT_LENGTH: 10,
  STUDENT_AMOUNT: 5,
  TUTOR_AMOUNT: 10,
  BOOKING_PER_STUDENT: 4, // 每個使用者有至少 4 個 Lesson History 可以打分
  TUTOR_PER_COMMENT: 2, // 每個老師有至少 2 個過往上課評價
  TUTOR_PER_NEWBOOKING: 2, // 每個老師有至少 2 個 New Lesson

  getAvailableTime: (getDay, lastMonth = 0) => {
    return dayjs()
      .add(getDay, 'day')
      .subtract(lastMonth, 'month')
      .format('YYYY-MM-DD')
  },
  getMinuteDuration: () => (Math.random() < 0.5 ? 30 : 60)
}
