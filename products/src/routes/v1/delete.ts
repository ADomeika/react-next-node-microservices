import express, { Request, Response } from 'express'
import { requireAuth, NotFoundError } from '@admodosdesign/common'
import { Product } from '../../models/product'
import { ProductRemovedPublisher } from '../../events/publishers/product-removed-publisher'
import { natsWrapper } from '../../nats-wrapper'

const router = express.Router()

router.delete('/api/v1/products/:id', requireAuth, async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new NotFoundError()
  }

  await product.remove()

  new ProductRemovedPublisher(natsWrapper.client).publish({
    id: product.id
  })

  res.status(204).send({})
})

export { router as deleteRouter }
