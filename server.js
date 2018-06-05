const http = require('http')
const port = 2222
const server = '0.0.0.0'
http.createServer((request, response) => {
  console.log(request.headers)
  console.log(request.method)
  console.log(request.url)
  response.writeHead(200, {'Content-Type': 'text/html'})
  response.write('<!DOCTYPE html><html><head><title>ARM book API</title></head><body><h1>Welcome here, this is where our team will flourish.</h1><a href="http://thecatapi.com"><img src="http://thecatapi.com/api/images/get?format=src&type=gif"></a></body></html>')
  response.end()
}).listen(port, server)
