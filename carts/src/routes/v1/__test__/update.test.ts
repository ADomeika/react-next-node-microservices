import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../../app'
import { Cart } from '../../../models/cart'
import { ProductSize } from '@admodosdesign/common'
import { Product } from '../../../models/product'

describe('Update route', () => {
  it('should return 401 if cart does not belong to user making request', async () => {
    const cookie = global.createCartUid()
    const product = Product.build({
      id: mongoose.Types.ObjectId().toHexString(),
      name: 'Product name',
      price: 19.99,
      size: ProductSize.L,
      quantity: 1
    })

    await product.save()

    const { body: cart } = await request(app)
      .post(global.url)
      .set('Cookie', cookie)
      .send({
        productId: product.id,
        quantity: 1
      })

    await request(app)
      .patch(`${global.url}/${cart.id}`)
      .set('Cookie', global.createCartUid())
      .send({
        productId: product.id,
        quantity: 1
      })
      .expect(401)
  })

  it('should return 404 if cart does not exist', async () => {
    await request(app)
      .patch(`${global.url}/${mongoose.Types.ObjectId().toHexString()}`)
      .set('Cookie', global.createCartUid())
      .send({
        productId: 'asdf',
        quantity: 1
      })
      .expect(404)
  })

  it('should return 404 if product does not exist', async () => {
    const cookie = global.createCartUid()
    const product = Product.build({
      id: mongoose.Types.ObjectId().toHexString(),
      name: 'Product name',
      price: 19.99,
      size: ProductSize.L,
      quantity: 1
    })

    await product.save()

    const { body: cart } = await request(app)
      .post(global.url)
      .set('Cookie', cookie)
      .send({
        productId: product.id,
        quantity: 1
      })

    await request(app)
      .patch(`${global.url}/${cart.id}`)
      .set('Cookie', cookie)
      .send({
        productId: mongoose.Types.ObjectId().toHexString(),
        quantity: 1
      })
      .expect(404)
  })

  it('should return 400 if productId is not provided', async () => {
    const cookie = global.createCartUid()
    const product = Product.build({
      id: mongoose.Types.ObjectId().toHexString(),
      name: 'Product name',
      price: 19.99,
      size: ProductSize.L,
      quantity: 1
    })

    await product.save()

    const { body: cart } = await request(app)
      .post(global.url)
      .set('Cookie', cookie)
      .send({
        productId: product.id,
        quantity: 1
      })

    await request(app)
      .patch(`${global.url}/${cart.id}`)
      .set('Cookie', cookie)
      .send({
        quantity: 1
      })
      .expect(400)

    await request(app)
      .patch(`${global.url}/${cart.id}`)
      .set('Cookie', cookie)
      .send({
        productId: '',
        quantity: 1
      })
      .expect(400)
  })

  it('should return 400 if quantity is not provided or is less than 1', async () => {
    const cart = Cart.build({
      userId: 'asdf',
      expiresAt: new Date(),
      products: [{
        product: mongoose.Types.ObjectId().toHexString(),
        quantity: 1
      }]
    })

    await cart.save()
    
    await request(app)
      .patch(`${global.url}/${cart.id}`)
      .send({
        productId: mongoose.Types.ObjectId().toHexString()
      })
      .expect(400)

    await request(app)
      .patch(`${global.url}/${cart.id}`)
      .send({
        productId: mongoose.Types.ObjectId().toHexString(),
        quantity: 0
      })
      .expect(400)
  })
})
