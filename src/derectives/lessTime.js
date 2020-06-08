/**
 * 将接口返回的日期实时转换为几分钟前、几小时前、几天前
 * 实时时间转换指令，大于一个月则返回具体的年月日
 * @param { string } timeStamp - 时间 格式：年-月-日 时:分:秒 或 时间戳
 * @returns { string }
 */
function getDateDiff (dateTimeStamp) {
  var minute = 1000 * 60
  var hour = minute * 60
  var day = hour * 24
  // var halfamonth = day * 15
  var month = day * 30
  var now = new Date().getTime()
  var old = new Date(dateTimeStamp).getTime()
  var diffValue = now - old
  if (diffValue < 0) return
  var monthC = diffValue / month
  var weekC = diffValue / (7 * day)
  var dayC = diffValue / day
  var hourC = diffValue / hour
  var minC = diffValue / minute
  var result
  if (monthC >= 1) {
    result = '' + parseInt(monthC) + '月前'
  } else if (weekC >= 1) {
    result = '' + parseInt(weekC) + '周前'
  } else if (dayC >= 1) {
    result = '' + parseInt(dayC) + '天前'
  } else if (hourC >= 1) {
    result = '' + parseInt(hourC) + '小时前'
  } else if (minC >= 1) {
    result = '' + parseInt(minC) + '分钟前'
  } else {
    result = '刚刚'
  }
  return result
}
export default {
  bind: function (el, binding) {
    el.innerHTML = getDateDiff(binding.value)
    // 每隔一分钟更新一次
    el.__timeout__ = setInterval(function () {
      el.innerHTML = getDateDiff(binding.value)
    }, 60000)
  },
  unbind: function (el) {
    clearInterval(el.__timeout__)
    delete el.__timeout__
  }
}
