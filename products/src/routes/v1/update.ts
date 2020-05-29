import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  validateRequest,
  requireAuth,
  ProductSize,
  NotFoundError
} from '@admodosdesign/common'

import { Product } from '../../models/product'
import { ProductUpdatedPublisher } from '../../events/publishers/product-updated-publisher'
import { natsWrapper } from '../../nats-wrapper'

const router = express.Router()

router.put('/api/v1/products/:id', requireAuth, [
  body('name')
    .not()
    .isEmpty()
    .withMessage('Name is required'),
  body('description')
    .not()
    .isEmpty()
    .withMessage('Description is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price is required and should be greater than 0'),
  body('size')
    .not()
    .isEmpty()
    .custom((input: string) => {
      return input === ProductSize.L ||
        input === ProductSize.M ||
        input === ProductSize.S ||
        input === ProductSize.XL ||
        input === ProductSize.XS ||
        input === ProductSize.XXL ||
        input === ProductSize.XXS
    })
    .withMessage('Size is required and should be one of xxs|xs|s|m|l|xl|xxl'),
  body('quantity')
    .isInt({ gt: 0 })
    .withMessage('Quantity is required and should be greater than 0')
], validateRequest, async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new NotFoundError()
  }

  const {
    name,
    description,
    additionalInfo,
    price,
    quantity,
    size,
    images,
    cartId
  } = req.body

  product.set({
    name,
    description,
    additionalInfo,
    price,
    quantity,
    size,
    images,
    cartId
  })

  await product.save()

  new ProductUpdatedPublisher(natsWrapper.client).publish({
    id: product.id,
    name: product.name,
    price: product.price,
    size: product.size,
    quantity: product.quantity,
    description: product.description,
    additionalInfo: product.additionalInfo,
    version: product.version,
    cartId: product.cartId
  })

  res.send(product)
})

export { router as updateRouter }
