const net = require('net')
const timer = require('timers')
const http = require('http')  // to create an http server for WeChat App

host = '0.0.0.0'
port = 2222   // just try if socket and http servers can coexist in the same port

httpPort = 3333

const server = net.createServer()
const httpServer = http.createServer()

let obj = ''
let isReady = false
let transact = {do: false}
let gSocket = null
server.on('connection', (socket) => {

  console.log('connected')
  gSocket = socket

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
        // later change it to receiving the Web API message from the Tecent Server(database api)

      } else  { // when the user closes the door, do transaction
        console.log('The client door is closed after transaction')
        socket.write("Transaction recorded in database.\r")
        isReady = false
        transact.do = true
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

console.log('socket listening on port ' + port)

httpServer.on('request', (request, response) => {
  request.on('data', function (chunk) {
    if(chunk.toString().search('open') != -1){
      console.log('Received open the door instruction from WeChat App')
      gSocket.write("open\r")
      console.log('open is sent to the shelf')
    }
  })
  console.log("An HTTP request")
  response.writeHead(200, {'content-type': 'application/json'})
  response.write(JSON.stringify(transact))
  console.log(JSON.stringify(transact) + ' is sent')
  transact.do = false
})

console.log('http listening on port ' + httpPort)
httpServer.listen({
  host: host,
  port: httpPort,
  exclusive: true
})
