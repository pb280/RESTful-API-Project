const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const multer = require('multer')

const app = express()

const MONGO_URI =
  'mongodb+srv://prathamesh:cLxcgxkqCaQwIgJ9@cluster0.p7tfc4h.mongodb.net/messages?retryWrites=true'

const authRoutes = require('./routes/auth')
const feedRoutes = require('./routes/feed')

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`)
  }
})
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

app.use(bodyParser.json())
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
)
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(cors())

app.use('/feed', feedRoutes)
app.use('/auth', authRoutes)

app.use((error, req, res, next) => {
  const status = error.statusCode || 500
  const message = error.message
  const data = error.data
  res.status(status).json({ message: message, data: data })
})

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    const server = app.listen(8000)
    const io = require('./socket').init(server)
    io.on('connection', () => {})
  } catch (err) {
    console.log(err)
  }
}

start()
