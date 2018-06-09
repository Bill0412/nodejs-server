const net = require('net')

host = '127.0.0.1'
port = 2222

const server = net.createServer()

let obj = ''
let count = 0
server.on('connection', (socket) => {

  console.log('connected')


  socket.on('connect', () => {
    console.log('A connection created with client: ' + socket.address)
  })

  socket.on('data', (chunk) => {
    console.log(chunk + ' from ' + socket.remoteAddress + ':' + socket.remotePort)
    let str = chunk.toString()
    console.log("\n\nThe string is: " + str)
    // initilize
    if(str.search('done') !== -1){
      if(count == 0){
        socket.write("Initialization finished")
        console.log("Initialization finished")
        socket.write("open")  // request the client to open the door
        count ++
      } else if (count == 1) {
        console.log('The client door is closed after transaction')
        socket.write("Transaction recorded in database.")
      }
    }

    // The door closed, transaction finished.

    // initialize
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

  socket.write('Conneted.')
  socket.pipe(socket)
  // socket.end(`I've received your data`)
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
