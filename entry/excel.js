let fs = require('fs')
let path = require('path')
let utils = require('./utils')
let excelTobeJson = require('excel-tobe-json')
let excelToJson = excelTobeJson.excelToJson
excelTobeJson.extendOnlineExcel(require('google-excel'))
excelTobeJson.extendOnlineExcel(require('qq-excel'))

let isHttpUrl = function(url) {
  return /^http(s)?:\/\/([\w-_]+\.)*[\w-_]+\.[a-zA-Z]+(:\d+)?/i.test(url)
}

// excel文件绝对路径 isColOriented 默认是true按列来
let excelPathName = path.join(process.cwd(), '/excel/1.xlsx')

let outputLangPath = path.join(process.cwd(), '/json')

excelToJson(excelPathName, { isColOriented: false, sheet: 1 }, function(
  err,
  excelDatas
) {
  let yyJson = {
    lovers: [],
    lookers: [],
    teamers: [],
    thingers: []
  }
  if (err) {
    console.log(err)
  } else {
    excelDatas.forEach(wish => {
      let obj = {}
      for (let key in wish) {
        let value = wish[key]
        if (/主人.+性别/.test(key)) {
          obj.gender = value
        } else if (/年级/.test(key)) {
          obj.grade = value
        } else if (/图片/.test(key)) {
          obj.image = value
        } else if (/心愿描述/.test(key)) {
          obj.content = value
        } else if (/序号/.test(key)) {
          obj.id = value
        } else if (/心愿类型/.test(key)) {
          if (/脱单/.test(value)) yyJson.llovers.push(obj)
          if (/找TA/.test(value)) yyJson.lookers.push(obj)
          if (/组队/.test(value)) yyJson.teamers.push(obj)
          if (/闲物/.test(value)) yyJson.thingers.push(obj)
        }
      }
    })
    fs.writeFileSync(outputLangPath + '/' + '525.json', JSON.stringify(yyJson))
  }
})
