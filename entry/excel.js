let fs = require('fs')
let path = require('path')

let excelTobeJson = require('excel-tobe-json')
let excelToJson = excelTobeJson.excelToJson
excelTobeJson.extendOnlineExcel(require('google-excel'))
excelTobeJson.extendOnlineExcel(require('qq-excel'))

let isHttpUrl = function(url) {
  return /^http(s)?:\/\/([\w-_]+\.)*[\w-_]+\.[a-zA-Z]+(:\d+)?/i.test(url)
}

// excel文件绝对路径
let excelPathName = path.join(process.cwd(), '/excel/1.xlsx')

let outputLangPath = path.join(process.cwd(), '/entry')

excelToJson(excelPathName, { isColOriented: true, sheet: 1 }, function(
  err,
  excelDatas
) {
  let bgyJson = {}
  if (err) {
    console.log(err)
  } else {
    excelDatas = excelDatas.filter(function(val, index, arr) {
      return val.filename || val.lang
    })
  }
})
