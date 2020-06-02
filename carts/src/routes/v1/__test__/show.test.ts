import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../../app'
import { Product } from '../../../models/product'
import { ProductSize } from '@admodosdesign/common'

describe('Show route', () => {
  it('should return 404 if cart does not exist', async () => {
    await request(app)
      .get(`${global.url}/${mongoose.Types.ObjectId().toHexString()}`)
      .expect(404)
  })

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
      .get(`${global.url}/${cart.id}`)
      .set('Cookie', global.createCartUid())
      .expect(401)
  })

  it('should respond with cart details', async () => {
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

    const response = await request(app)
      .get(`${global.url}/${cart.id}`)
      .set('Cookie', cookie)
      .expect(200)

    expect(response.body.products.length).toBe(1)
    expect(response.body.products[0].product.id).toBe(product.id)
    expect(response.body.products[0].quantity).toBe(1)
  })
})
