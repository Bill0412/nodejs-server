const net = require('net')

host = '0.0.0.0'
port = 2222

const server = net.createServer()

let obj

server.on('connection', (socket) => {

  console.log('connected')


  socket.on('connect', () => {
    console.log('A connection created with client: ' + socket.address)
  })

  socket.on('data', (chunk) => {
    console.log(chunk + ' from ' + socket.remoteAddress + ':' + socket.remotePort)
    socket.write('The data I received: ' + chunk)
  })

  socket.on('close', (had_error) =>{
    if(had_error){
      console.log('The socket closed because of error')
    } else {
      console.log('The socket closed')
    }
  })

  socket.once('close', () => {
    console.log('Client closed connection.')
  })

  socket.on('error', (err)=>{
    console.log('Socket Error: ' + err)
  })

  socket.pipe(socket)

  socket.end(`I've received your data`)
})

server.on('error', (err) => {
  console.log('Error message: ' + err)
})

server.on('close', () => {
  console.log('The server is closed')
})

server.listen({
  host: host,
  port: port,
  exclusive: true
})

console.log('listening on port ' + port)
