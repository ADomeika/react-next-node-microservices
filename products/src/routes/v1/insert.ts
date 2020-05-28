import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest, ProductSize } from '@admodosdesign/common'
import { Product } from '../../models/product'

const router = express.Router()

router.post('/api/v1/products', requireAuth, [
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
  const { name, description, price, size, quantity, additionalInfo, images } = req.body

  const product = Product.build({
    name,
    price,
    description,
    size,
    quantity,
    additionalInfo,
    images
  })

  await product.save()

  res.status(201).send(product)
})

export { router as insertRouter }
