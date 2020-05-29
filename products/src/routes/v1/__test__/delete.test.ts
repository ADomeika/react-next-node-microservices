import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../../app'
import { natsWrapper } from '../../../nats-wrapper'

const createProduct = () => {
  return request(app)
    .post(global.url)
    .set('Cookie', global.signin())
    .send({
      name: 'New product',
      price: 19.99,
      description: 'New product description',
      size: 'xl',
      quantity: 2
    })
    .expect(201)
}

describe('Delete route', () => {
  it('should return 401 if user is not logged in', async () => {
    const { body: product } = await createProduct()

    await request(app)
      .delete(`${global.url}/${product.id}`)
      .send()
      .expect(401)
  })

  it('should return 404 if product cannot be found', async () => {
    await request(app)
      .delete(`${global.url}/${mongoose.Types.ObjectId().toHexString()}`)
      .set('Cookie', global.signin())
      .send()
      .expect(404)
  })

  it('should remove a product', async () => {
    const { body: product } = await request(app)
      .post(global.url)
      .set('Cookie', global.signin())
      .send({
        name: 'New product',
        price: 19.99,
        description: 'New product description',
        size: 'xl',
        quantity: 2
      })
      .expect(201)

    await request(app)
      .delete(`${global.url}/${product.id}`)
      .set('Cookie', global.signin())
      .send()
      .expect(204)

    await request(app)
      .get(`${global.url}/${product.id}`)
      .expect(404)
  })

  it('should publish an event with successful deletion of product', async () => {
    const { body: product } = await request(app)
      .post(global.url)
      .set('Cookie', global.signin())
      .send({
        name: 'New product',
        price: 19.99,
        description: 'New product description',
        size: 'xl',
        quantity: 2
      })
      .expect(201)

    await request(app)
      .delete(`${global.url}/${product.id}`)
      .set('Cookie', global.signin())
      .send()
      .expect(204)

    await request(app)
      .get(`${global.url}/${product.id}`)
      .expect(404)
  
    expect(natsWrapper.client.publish).toHaveBeenCalled()
  })
})
