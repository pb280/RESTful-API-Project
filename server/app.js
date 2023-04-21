const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const feedRoutes = require('./routes/feed')

app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader('Allow-Access-Control-Origin', '*')
  res.setHeader('Allow-Access-Control-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Allow-Access-Control-Headers', 'Content-Type, Authorization')
  next()
})

app.use('/feed', feedRoutes)

app.listen(8000)
