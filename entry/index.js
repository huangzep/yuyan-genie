
let fs = require('fs')
let path = require('path')
let ejs = require('ejs')

let wishJson = {
	lovers: [
		{
			content: 'kdsjfskdjf djkdjfksdf dsf',
			school: '华工大学城校区大er男生',
		},
		{
			content: 'kds343545454546565656ksdf dsf',
			school: '华工大dfdsf区大sdfsdf生',
		},
	],
	lookers:[],
	teamers: [],
	thingers: []
}


let templateHtml = fs.readFileSync(path.join(process.cwd(), '/template/index.html'), "utf8")
let resultHtml = ejs.render(templateHtml, wishJson)
fs.writeFileSync(path.join(process.cwd(), '/dist/index.html'), resultHtml)