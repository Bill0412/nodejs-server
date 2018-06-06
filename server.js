const http = require('http')
const fs = require('fs')

const port = 2222
const server = '0.0.0.0'
http.createServer((request, response) => {
  console.log(request.headers)
  console.log(request.method)
  console.log(request.statusCode)
  console.log(request.url)
  if (request.method == 'GET'){
    response.writeHead(200, {'Content-Type': 'text/html'});
    let myReadStream = fs.createReadStream(__dirname + '/index.html', 'utf8');
    myReadStream.pipe(response);
  } else if (request.method == 'POST') {
    let buff = ''
    request.on('data', function (chunk) {
      buff += chunk
      response.write(`\nSignal Received: ${chunk}`)
    })
    request.on('end', function () {
      console.log(`Body: ${buff}`)
      response.end('\nAccepted body\n\n')
    })
  } else {
    response.writeHead(200, {'Content-Type': 'text/plain'})
    response.end('Hello World\n')
  }
}).listen(port, server)
