import express, { Request, Response } from 'express'
import { NotFoundError } from '@admodosdesign/common'
import { Cart } from '../../models/cart'

const router = express.Router()

router.get('/api/v1/carts', async (req: Request, res: Response) => {
  const cart = await Cart.findOne({
    userId: req.currentCartUser
  }).populate('products.product')
  
  if (!cart) {
    throw new NotFoundError()
  }

  res.send(cart)
})

export { router as showRouter }
