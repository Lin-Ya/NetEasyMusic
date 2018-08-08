var http = require('http'),path = require('path') ,fs = require('fs'), url = require('url')
function staticRoot(staticPath, req, res){
	var pathObj = url.parse(req.url, true)
	if(pathObj.pathname === '/'){
		pathObj.pathname += 'index.html'
	}

	var filePath = path.join(staticPath, pathObj.pathname)
	fs.readFile(filePath, 'binary', function(err,fileContent){
		if(err){
			console.log('404')
			res.writeHead(404, 'not found')
			res.end('<h1>404 Not Found<h1>')
		}else {
			console.log('ok')
			res.writeHead(200, 'Ok')
			res.write(fileContent, 'binary')
			res.end()
		}
	})
}

var server = http.createServer(function(req, res){
	staticRoot(path.join(__dirname, ''), req, res)
})

server.listen(3003)
console.log('visit http://localhost:3003, 163music.fengxiaoyong.work')
