import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../../app'
import { Product } from '../../../models/product'
import { ProductSize } from '@admodosdesign/common'

describe('Delete route', () => {
  it('should return 401 if user is not cart owner', async () => {
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
      .delete(`${global.url}/${cart.id}`)
      .set('Cookie', global.createCartUid())
      .expect(401)
  })

  it('should return 404 if cart does not exist', async () => {
    await request(app)
      .delete(`${global.url}/${mongoose.Types.ObjectId().toHexString()}`)
      .expect(404)
  })

  it('should remove cart', async () => {
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
      .delete(`${global.url}/${cart.id}`)
      .set('Cookie', cookie)
      .expect(204)

    await request(app)
      .get(`${global.url}/${cart.id}`)
      .set('Cookie', cookie)
      .expect(404)
  })
})
