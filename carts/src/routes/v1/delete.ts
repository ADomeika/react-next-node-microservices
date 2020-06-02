import express, { Request, Response } from 'express'
import { NotFoundError, NotAuthorizedError } from '@admodosdesign/common'
import { Cart } from '../../models/cart'
import { CartRemovedPublisher } from '../../events/publishers/cart-removed-publisher'
import { natsWrapper } from '../../nats-wrapper'

const router = express.Router()

router.delete('/api/v1/carts/:id', async (req: Request, res: Response) => {
  const cart = await Cart.findById(req.params.id)
  if (!cart) {
    throw new NotFoundError()
  }
  if (cart.userId !== req.currentCartUser) {
    throw new NotAuthorizedError()
  }

  await cart.remove()
  
  new CartRemovedPublisher(natsWrapper.client).publish({
    id: cart.id,
    userId: cart.userId,
    version: cart.version,
    products: cart.products
  })

  res.status(204).send()
})

export { router as deleteRouter }
