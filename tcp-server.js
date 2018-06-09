const net = require('net')
const timer = require('timers')
host = '0.0.0.0'
port = 2222

const server = net.createServer()

let obj = ''
let isReady = false
server.on('connection', (socket) => {

  console.log('connected')


  socket.on('connect', () => {
    console.log('A connection created with client: ' + socket.address)
  })

  socket.on('data', (chunk) => {
    console.log(chunk + ' from ' + socket.remoteAddress + ':' + socket.remotePort)
    let str = chunk.toString()
    console.log("\n\nThe string is: " + str)

    // initilize, to make sure that the door is closed
    if(str.search('done') !== -1){  // The SoC says that it's ready
      if(!isReady){
        socket.write("Initialization finished\r")
        console.log("Initialization finished")
        isReady = true
        // temporarily send it after wating for 3 secs.
        timer.setInterval(() => {
          socket.write("open\r")
        }, 3000);
      } else  { // when the user closes the door
        console.log('The client door is closed after transaction')
        socket.write("Transaction recorded in database.\r")
        isReady = false
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
