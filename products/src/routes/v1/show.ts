import express, { Request, Response } from 'express'
import { Product } from '../../models/product'
import { NotFoundError } from '@admodosdesign/common'

const router = express.Router()

router.get('/api/v1/products/:id', async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new NotFoundError()
  }

  res.send(product)
})

export { router as showRouter }
