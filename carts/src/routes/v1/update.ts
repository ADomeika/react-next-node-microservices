import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { validateRequest, NotFoundError, NotAuthorizedError, BadRequestError } from '@admodosdesign/common'
import { Cart } from '../../models/cart'
import { Product } from '../../models/product'
import { CartUpdatedPublisher } from '../../events/publishers/cart-updated-publisher'
import { natsWrapper } from '../../nats-wrapper'

const router = express.Router()

router.patch('/api/v1/carts/:id', [
  body('productId')
    .not()
    .isEmpty()
    .withMessage('Product ID is required'),
  body('quantity')
    .isInt({ gt: 0 })
    .withMessage('Quantity is required and should be more than 0')
], validateRequest, async (req: Request, res: Response) => {
  const { productId, quantity } = req.body

  const cart = await Cart.findById(req.params.id)
  if (!cart) {
    throw new NotFoundError()
  }
  if (cart.userId !== req.currentCartUser) {
    throw new NotAuthorizedError()
  }

  const product = await Product.findById(productId)
  if (!product) {
    throw new NotFoundError()
  }
  if (product.quantity < quantity) {
    throw new BadRequestError('Provided quantity is greater than actual')
  }

  const productInCart = cart.products.find(cartProduct => {
    return cartProduct.product.toString() === productId
  })

  if (productInCart) {
    const products = cart.products.map(product => {
      if (product.product.toString() === productId) {
        product.quantity += quantity
      }
      return product
    })
    cart.set({ products })
  } else {
    cart.set({ products: cart.products.push() })
  }

  await cart.save()

  new CartUpdatedPublisher(natsWrapper.client).publish({
    id: cart.id,
    userId: cart.userId,
    expiresAt: cart.expiresAt.toString(),
    version: cart.version,
    products: cart.products,
    product: {
      id: productId,
      quantity
    }
  })

  res.send(cart)
})

export { router as updateRouter }
