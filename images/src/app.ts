import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { NotFoundError, errorHandler, currentUser } from '@admodosdesign/common'

import { insertRouter } from './routes/v1/insert'
// import { showRouter } from './routes/v1/show'
// import { indexRouter } from './routes/v1/index'
// import { updateRouter } from './routes/v1/update'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
)
app.use(currentUser)

app.use(insertRouter)
// app.use(showRouter)
// app.use(indexRouter)
// app.use(updateRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
