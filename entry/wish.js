
let fs = require('fs')
let path = require('path')
let ejs = require('ejs')

let wishJson = {
	lovers: [
		{
			content: 'kdsjfskdjf djkdjfksdf dsf',
			grade: 'ddfk',
			gender: '男生',
			image: ''
		}
	],
	lookers:[
		{
			content: 'kdsjfskdjf djkdjfksdf dsf',
			grade: 'ddfk',
			gender: '男生',
			reward: '3'
		}
	],
	teamers: [],
	thingers: []
}


let templateHtml = fs.readFileSync(path.join(process.cwd(), '/template/index.html'), "utf8")
let resultHtml = ejs.render(templateHtml, wishJson)
fs.writeFileSync(path.join(process.cwd(), '/dist/index.html'), resultHtml)