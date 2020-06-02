import express, { Request, Response } from 'express'
import { NotFoundError, NotAuthorizedError } from '@admodosdesign/common'
import { Cart } from '../../models/cart'

const router = express.Router()

router.get('/api/v1/carts/:id', async (req: Request, res: Response) => {
  const cart = await Cart.findById(req.params.id).populate('products.product')
  if (!cart) {
    throw new NotFoundError()
  }
  if (cart.userId !== req.currentCartUser) {
    throw new NotAuthorizedError()
  }

  res.send(cart)
})

export { router as showRouter }
