import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { NotFoundError, errorHandler, currentCartUser } from '@admodosdesign/common'

import { insertRouter } from './routes/v1/insert'
import { updateRouter } from './routes/v1/update'
import { showRouter } from './routes/v1/show'
// import { indexRouter } from './routes/index'
import { deleteRouter } from './routes/v1/delete'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
)
app.use(currentCartUser)

app.use(insertRouter)
app.use(updateRouter)
app.use(showRouter)
// app.use(indexRouter)
app.use(deleteRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
