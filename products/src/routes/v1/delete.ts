import express, { Request, Response } from 'express'
import { requireAuth, NotFoundError } from '@admodosdesign/common'
import { Product } from '../../models/product'

const router = express.Router()

router.delete('/api/v1/products/:id', requireAuth, async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new NotFoundError()
  }

  await product.remove()

  res.status(204).send({})
})

export { router as deleteRouter }
