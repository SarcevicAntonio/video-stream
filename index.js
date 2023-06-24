const express = require('express')
const fs = require('fs')

const app = express()

app.listen(3000, function () {
	console.log('localhost:3000')
})

app.get('/', function (_, res) {
	res.sendFile(__dirname + '/index.html')
})

app.get('/video', function (req, res) {
	const range = req.headers.range
	if (!range) {
		res.status(400).send('Requires Range header')
	}
	const path = 'SvelteKit Offline PWA.mp4'
	const size = fs.statSync(path).size
	console.log(size)

	const chunk_size = 10 ** 6 // 1MB
	const start = Number(range.replace(/\D/g, ''))
	const end = Math.min(start + chunk_size, size - 1)
	const headers = {
		'Content-Range': `bytes ${start}-${end}/${size}`,
		'Accept-Ranges': 'bytes',
		'Content-Length': end - start + 1,
		'Content-Type': 'video/mp4',
	}
	res.writeHead(206 /* partial content */, headers)

	const stream = fs.createReadStream(path, { start, end })
	stream.pipe(res)
})
