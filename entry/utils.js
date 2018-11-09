module.exports = {
  //excel 日期毫秒数转换为具体日期
  excel2Date(difDay) {
    let yearStart = new Date('1900/01/01').getTime();
    let date = new Date(yearStart + (difDay - 1) * 24 * 3600 * 1000).getDate()
    return ('0' + date).slice(-2)
  },
  //选出今天
  pickToday(list, date) {
    let arr = []
    list.forEach(n => {
      if (n.date === date) {
        arr.push(n)
      }
    })
    return arr
  }
}