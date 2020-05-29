import { app } from './app'

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  if (!process.env.S3_ACCESS_KEY_ID) {
    throw new Error('S3_ACCESS_KEY_ID must be defined')
  }

  if (!process.env.S3_SECRET_ACCESS_KEY) {
    throw new Error('S3_SECRET_ACCESS_KEY must be defined')
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000')
  })
}

start()
