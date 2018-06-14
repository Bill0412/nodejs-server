// This is the two-socket-server version, for long term connection with wechat

const net = require('net')
const timer = require('timers')


// globals
host = '0.0.0.0'  // public ip
lowPort = 2222   // This is the port for the arm SoC
highPort = 80   // This is the port for wechat app

const lowServer = net.createServer()  // The low level server, for SoS
const highServer = net.createServer()  // The high level server, for WeChat

// The lowServer Part
let lowSocket = null


// The highServer Part
let highSocket = null


// Low level server
lowServer.on('connection', (socket) => {
  lowSocket = socket
  let isReady = false

  lowSocket.write('\nThis is the low lever server\r\n')
  console.log('connected to low level server')

  lowSocket.on('connect', () => {
    console.log('A connection created with client: ' + lowSocket.address)
  })

  lowSocket.on('data', (chunk) => {
    console.log(chunk + ' from ' + lowSocket.remoteAddress + ':' + lowSocket.remotePort)
    const str = chunk.toString()
    console.log("\n\nThe string is: " + str)

    // initilize, to make sure that the door is closed
    if(str.search('done') !== -1){  // The SoC says that it's ready
      if(!isReady){
        lowSocket.write("\nInitialization finished\r")
        console.log("Initialization finished")
        isReady = true
        // temporarily send it after wating for 3 secs.
        // later change it to receiving the Web API message from the Tecent Server(database api)

      } else {
        // when the user closes the door, do transaction
        console.log('The client put in a book and closed the door')


        // make sure that the WeChat app is connected
        if(highSocket !== null){
          lowSocket.write("\nTransaction recorded in database.\r")
          const transact = {
            do: true
          }
          highSocket.write(JSON.stringify(transact))  // There will be an error if using end method
          console.log('highSocket ends successfully')
        } else {
          console.log('WeChat App is not connected', '\nTransferring do transaction failed');
          lowSocket.write('\nError: WeChat App is not conneted.\r\n')
        }
        // Uninitialize ot initialize in the next loop
        isReady = false
      }
    }


  })

  lowSocket.on('close', (had_error) =>{
    if(had_error){
      console.log('The socket closed due to a transmission error')
    } else {
      console.log('The socket closed')
    }
  })

  lowSocket.on('error', (err)=>{
    console.log('Socket Error: ' + err)
  })

  lowSocket.write('\nConneted.\r')
  lowSocket.pipe(socket)
  // socket.end(`I've received your data`)
})

lowServer.on('error', (err) => {
  console.log('Error message: ' + err)
})

lowServer.on('close', () => {
  console.log('The server is closed')
})

lowServer.listen({
  host: host,
  port: lowPort,
  exclusive: true
})

console.log('Low level socket listening on port ' + lowPort)


// High level server

highServer.on('connection', (socket) => {
  highSocket = socket

  highSocket.write('\nThis is the high lever server\r\n')
  console.log('connected to high level server')

  highSocket.on('connect', () => {
    console.log('connected to high level server')
    highSocket.write('This is the high level server')
    console.log('A connection created with client: ' + highSocket.address)
  })

  highSocket.on('data', (chunk) => {
    // pass open: WeChat App --> Google Cloud --> ARM SoC
    console.log(chunk + ' from ' + highSocket.remoteAddress + ':' + highSocket.remotePort)

    const str = chunk.toString()  // very important, chunk is not a stirng
    if(str.search('open') !== -1){
      if(lowSocket !== null){
        lowSocket.write('open\r\n')
      } else {
          highSocket.write('error: low socket not connected')
          console.log('error: write open failed, low socket not connected')
        }
      }
    })

    highSocket.write('\rConneted.\r')
    highSocket.pipe(socket)
})

console.log('High level socket is listening on port ' + highPort)

highServer.listen({
  host: host,
  port: highPort,
  exclusive: true
})
