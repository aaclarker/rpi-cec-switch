const express = require('express')
const app = express()
const child_process = require('child_process')

const ON_COMMAND = 'echo on 0 | cec-client -s -d 1'
const OFF_COMMAND = 'echo standby 0 | cec-client -s -d 1'
const STATUS_COMMAND = 'echo pow 0 | cec-client -s -d 1'

app.all('*', function (req, res, next) {
  console.log(`${new Date().toJSON()}: Incoming ${req.method} ${req.originalUrl}`)
  next() // pass control to the next handler
});

app.get('/', function (req, res) {
  res.send('Hello World!')
})


app.post('/on', function (req, res) {
  child_process.exec(ON_COMMAND, (error, stdout, stderr) => {
    if(stderr) {
      console.log('Error from on')    
    } else {
      console.log('successful on')
    }
      res.send('On!')
  })
})

app.post('/off', function (req, res) {
  child_process.exec(OFF_COMMAND, (error, stdout, stderr) => {
    if(stderr) {
      console.log('Error from off')    
    } else {
      console.log('successful off')
    }
      res.send('Off!')
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})