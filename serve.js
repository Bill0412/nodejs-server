const net = require('net');

const port = 8080;
const host = '0.0.0.0'
const server = net.createServer((socket) => {
  // 'connection' listener
  console.log('client connected');
  socket.on('end', () => {
    console.log('client disconnected');
  });
  socket.on('data', (obj) => {
    const str = obj.toString();
    const identifier = 'x-www-form-urlencoded';
    iIndex = str.search(identifier);
    if(iIndex != -1){
      const index =  iIndex + identifier.length  + 2;
      const data = str.slice(index);
      socket.write(`\nHello, your data is: ${data}\r\n`);
    } else {
      socket.write('No data received.\n');
    }

    socket.pipe(socket);
    socket.end();
  });
});
server.on('error', (err) => {
  throw err;
});
server.listen(port,  () => {
  console.log('server bound');
});
