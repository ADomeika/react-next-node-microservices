import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../../app'
import { Product } from '../../../models/product'
import { ProductSize } from '@admodosdesign/common'
import { natsWrapper } from '../../../nats-wrapper'

describe('Insert route', () => {
  it(`should have a route handler listening to ${global.url} for POST request`, async () => {
    const response = await request(app)
      .post(global.url)
      .send({})

    expect(response.status).not.toBe(404)
  })

  it('should return 404 if product provided as productId does not exist', async () => {
    await request(app)
      .post(global.url)
      .send({
        productId: mongoose.Types.ObjectId().toHexString(),
        size: 'xl',
        quantity: 1
      })
      .expect(404)
  })

  it('should return 400 if productId is not provided', async () => {
    await request(app)
      .post(global.url)
      .send({
        size: 'xl',
        quantity: 1
      })
      .expect(400)

    await request(app)
      .post(global.url)
      .send({
        productId: '',
        size: 'xl',
        quantity: 1
      })
      .expect(400)
  })

  it('should return 400 if size is not provided', async () => {
    await request(app)
      .post(global.url)
      .send({
        productId: mongoose.Types.ObjectId().toHexString(),
        size: '',
        quantity: 1
      })
      .expect(400)

    await request(app)
      .post(global.url)
      .send({
        productId: mongoose.Types.ObjectId().toHexString(),
        size: 'qwerty',
        quantity: 1
      })
      .expect(400)

    await request(app)
      .post(global.url)
      .send({
        productId: mongoose.Types.ObjectId().toHexString(),
        quantity: 1
      })
      .expect(400)
  })

  it('should return 400 if quantity is not provided or is less than 1', async () => {
    await request(app)
      .post(global.url)
      .send({
        productId: mongoose.Types.ObjectId().toHexString(),
        size: 'l'
      })
      .expect(400)

    await request(app)
      .post(global.url)
      .send({
        productId: mongoose.Types.ObjectId().toHexString(),
        size: 'l',
        quantity: 0
      })
      .expect(400)
  })

  it('should return 400 if size provided does not exist', async () => {
    const product = Product.build({
      id: mongoose.Types.ObjectId().toHexString(),
      name: 'Product name',
      price: 19.99,
      size: ProductSize.L,
      quantity: 1
    })

    await product.save()

    await request(app)
      .post(global.url)
      .send({
        productId: product.id,
        size: 'm',
        quantity: 1
      })
      .expect(400)
  })

  it('should return 400 if quantity provided is greater than actual amount', async () => {
    const product = Product.build({
      id: mongoose.Types.ObjectId().toHexString(),
      name: 'Product name',
      price: 19.99,
      size: ProductSize.L,
      quantity: 1
    })

    await product.save()

    await request(app)
      .post(global.url)
      .send({
        productId: product.id,
        size: 'l',
        quantity: 2
      })
      .expect(400)
  })

  it('should set a cookie after successful creation of cart (first item added to cart)', async () => {
    const product = Product.build({
      id: mongoose.Types.ObjectId().toHexString(),
      name: 'Product name',
      price: 19.99,
      size: ProductSize.L,
      quantity: 1
    })

    await product.save()

    const response = await request(app)
      .post(global.url)
      .send({
        productId: product.id,
        size: 'l',
        quantity: 1
      })
      .expect(201)
  
    expect(response.get('Set-Cookie')).toBeDefined()
  })

  it('should publish an event with successful creation of cart', async () => {
    const product = Product.build({
      id: mongoose.Types.ObjectId().toHexString(),
      name: 'Product name',
      price: 19.99,
      size: ProductSize.L,
      quantity: 1
    })

    await product.save()

    await request(app)
      .post(global.url)
      .send({
        productId: product.id,
        size: 'l',
        quantity: 1
      })
      .expect(201)
  
    expect(natsWrapper.client.publish).toHaveBeenCalled()
  })
})
