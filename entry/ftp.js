var Client = require('ftp')
var fs = require('fs')
let path = require('path')

let connectionConfig = {
  host: '103.249.108.51',
  user: 'swallowg',
  password: 'DotZ1976qs',
  port: 21 //默认是21，这个看自己要连接的端口
}

module.exports = {
  push() {
    var c = new Client()
    c.on('ready', function() {
      c.put(path.join(process.cwd(), '/dist/index.php'), '/domains/swallowgod.com/public_html/wechat/index.php', function(err) {
        if (err) throw err
        console.log(`upload ${path.join(process.cwd(), '/dist/index.php')} okkkkkkkkkkkkkkkkk`)
        c.end()
      })
    })
    // connect to localhost:21 as anonymous
    c.connect(connectionConfig)
  }
}
