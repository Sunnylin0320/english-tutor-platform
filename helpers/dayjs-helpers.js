const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime') // 相對時間差
const zhTw = require('dayjs/locale/zh-tw') // 繁體中文

dayjs.extend(relativeTime)
dayjs.locale(zhTw)

const calculateRelativeTime = targetDate => {
  return dayjs(targetDate).fromNow()
}

const formatDate = datetime => {
  return dayjs(datetime).format('YYYY年MM月DD日')
}

const formatTime = datetime => {
  return dayjs(datetime)
    .format('A h:mm')
    .replace('AM', '上午')
    .replace('PM', '下午')
}

const randomAvaiDay = () => {
  const day = [0, 1, 2, 3, 4, 5, 6]
  let randomAvaiDay = ''
  // 隨機選出可上課的時間
  for (let i = 0; i < day.length; i++) {
    if (Math.floor(Math.random() * 2) === 1) {
      randomAvaiDay = randomAvaiDay + day[i]
    }
    if (i === 6 && randomAvaiDay === '') {
      randomAvaiDay =
        randomAvaiDay + day[Math.floor(Math.random() * day.length)]
    }
  }
  return randomAvaiDay
}

module.exports = {
  currentYear: () => dayjs().year(), // 取得當年年份作為 currentYear 的屬性值
  relativeTimeFromNow: calculateRelativeTime, // 計算與現在時間的相對時間差
  formatDate,
  formatTime,
  randomAvaiDay,
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
