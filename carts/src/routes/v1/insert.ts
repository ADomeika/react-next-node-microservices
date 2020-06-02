import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { validateRequest, NotFoundError, BadRequestError } from '@admodosdesign/common'
import { Cart } from '../../models/cart'
import { Product } from '../../models/product'
import { CartCreatedPublisher } from '../../events/publishers/cart-created-publisher'
import { natsWrapper } from '../../nats-wrapper'

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 1800 // 30 min

router.post('/api/v1/carts', [
  body('productId')
    .not()
    .isEmpty()
    .withMessage('Product ID is required'),
  body('quantity')
    .isInt({ gt: 0 })
    .withMessage('Quantity is required and should be more than 0')
], validateRequest, async (req: Request, res: Response) => {
  const { productId, quantity } = req.body

  const product = await Product.findById(productId)
  if (!product) {
    throw new NotFoundError()
  }
  if (product.quantity < quantity) {
    throw new BadRequestError('Provided quantity is greater than actual')
  }

  const expiration = new Date()
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

  const cart = Cart.build({
    userId: req.currentCartUser!,
    expiresAt: expiration,
    products: [{
      product: productId,
      quantity
    }]
  })

  await cart.save()

  new CartCreatedPublisher(natsWrapper.client).publish({
    id: cart.id,
    userId: cart.userId,
    expiresAt: cart.expiresAt.toISOString(),
    version: cart.version,
    products: cart.products,
    product: {
      id: productId,
      quantity
    }
  })

  res.status(201).send(cart)
})

export { router as insertRouter }
