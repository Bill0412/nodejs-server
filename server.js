const http = require('http');
const fs = require('fs');
const port = 2222;
const server = '0.0.0.0';

http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.method);
  console.log(request.url);
  response.writeHead(200, {'Content-Type': 'text/html'});
  var myReadStream = fs.createStream(__dirname + '/index.html', 'utf8');
  myReadStream.pipe(res);
}).listen(port, server);
console.log('Server is now running at ${server}:${port}.');
