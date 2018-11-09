let fs = require('fs')
let path = require('path')
let ejs = require('ejs')
let utils = require('./utils')
let excelTobeJson = require('excel-tobe-json')
let excelToJson = excelTobeJson.excelToJson
excelTobeJson.extendOnlineExcel(require('google-excel'))
excelTobeJson.extendOnlineExcel(require('qq-excel'))

let isHttpUrl = function(url) {
  return /^http(s)?:\/\/([\w-_]+\.)*[\w-_]+\.[a-zA-Z]+(:\d+)?/i.test(url)
}

// excel文件绝对路径 isColOriented 默认是true按列来
let excelPathName1 = path.join(process.cwd(), '/excel/1.xlsx')
let excelPathName2 = path.join(process.cwd(), '/excel/2.xlsx')

let outputLangPath = path.join(process.cwd(), '/json')


//生成心愿
excelToJson(excelPathName1, { isColOriented: false, sheet: 1 }, function(
  err,
  excelDatas
) {
  let seq = 0
  let yyJson = {
    lovers: [],
    lookers: [],
    teamers: [],
    thingers: [],
    todaylovers: [],
    todaylookers: [],
    todayteamers: [],
    todaythingers: [],
    date: ('0' + new Date().getDate()).slice(-2),
    title: '',
    imgUrl: '',
    musicPart: ''
  }
  if (err) {
    console.log(err)
  } else {
    //读取新页面
    const REG = /灯神说.+"(https?.+=jpe?g)"[^\u300a\u300b\u4e00-\u9fa5]+([\u300a\u300b\u4e00-\u9fa5]+).+(<iframe.+div>)/
    let currentHtml = fs.readFileSync(
      path.join(process.cwd(), '/template/current.html'),
      'utf8'
    )
    let smallHmtl = currentHtml.replace(/\s/g, ' ')
    let endIndex = smallHmtl.indexOf('accept_music')
    let result = smallHmtl.slice(100, Math.max(10000, endIndex + 1000)).match(REG)
    yyJson.imgUrl = result[1]
    yyJson.title = result[2]
    yyJson.musicPart = result[3]
    //读取excel
    excelDatas.forEach((wish, index) => {
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
          obj.id = index + 1
        } else if (/报答/.test(key)) {
          obj.reward = value
        } else if (/微信号/.test(key)) {
          obj.weixin = value
        } else if (/创建时间/.test(key)) {
          obj.date = utils.excel2Date(value)
        } else if (/心愿类型/.test(key)) {
          if (/脱单/.test(value)) yyJson.lovers.push(obj)
          if (/找Ta/.test(value)) yyJson.lookers.push(obj)
          if (/组队/.test(value)) yyJson.teamers.push(obj)
          if (/闲物/.test(value)) yyJson.thingers.push(obj)
        }
      }
    })
    //添加序号
    yyJson.lovers.forEach(n => {
      n.id = seq++
    })
    yyJson.lookers.forEach(n => {
      n.id = seq++
    })
    yyJson.teamers.forEach(n => {
      n.id = seq++
    })
    yyJson.thingers.forEach(n => {
      n.id = seq++
    })
    //选出今天
    yyJson.todaylovers = utils.pickToday(yyJson.lovers, yyJson.date)
    yyJson.todaylookers = utils.pickToday(yyJson.lookers, yyJson.date)
    yyJson.todayteamers = utils.pickToday(yyJson.teamers, yyJson.date)
    yyJson.todaythingers = utils.pickToday(yyJson.thingers, yyJson.date)

    fs.writeFileSync(outputLangPath + '/' + '1.json', JSON.stringify(yyJson))
    //模板生成wish.html
    let templateWish = fs.readFileSync(
      path.join(process.cwd(), '/template/wish.html'),
      'utf8'
    )
    let resultWish = ejs.render(templateWish, yyJson)
    fs.writeFileSync(path.join(process.cwd(), '/dist/wish.html'), resultWish)
    //模板生成index.php
    let templatePhp = fs.readFileSync(
      path.join(process.cwd(), '/template/index.php'),
      'utf8'
    )
    let resultPhp = ejs.render(templatePhp, yyJson)
    fs.writeFileSync(path.join(process.cwd(), '/dist/index.php'), resultPhp)
    fs.writeFileSync(
      path.join(
        process.cwd(),
        '../GenieRemote/domains/swallowgod.com/public_html/wechat/index.php'
      ),
      resultPhp
    )
  }
})

//生成悄悄话
excelToJson(excelPathName2, { isColOriented: false, sheet: 1 }, function(
  err,
  excelDatas
) {
  let qqJson = {
    talkers: []
  }
  if (err) {
    console.log(err)
  } else {
    excelDatas.forEach((item, index) => {
      let obj = {}
      obj.letter = String.fromCharCode(65 + index)
      for (let key in item) {
        let value = item[key]
        if (/故事/.test(key)) {
          obj.content = value
        }
      }
      qqJson.talkers.push(obj)
    })
    fs.writeFileSync(outputLangPath + '/' + '2.json', JSON.stringify(qqJson))
    //模板生成talk.html
    let templateTalk = fs.readFileSync(
      path.join(process.cwd(), '/template/talk.html'),
      'utf8'
    )
    let resultTalk = ejs.render(templateTalk, qqJson)
    fs.writeFileSync(path.join(process.cwd(), '/dist/talk.html'), resultTalk)
  }
})
