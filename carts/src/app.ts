import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { NotFoundError, errorHandler, currentCartUser } from '@admodosdesign/common'

import { insertRouter } from './routes/v1/insert'
// import { showRouter } from './routes/show'
// import { indexRouter } from './routes/index'
// import { destroyRouter } from './routes/update'

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
// app.use(showRouter)
// app.use(indexRouter)
// app.use(destroyRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
