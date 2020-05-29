import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../../app'

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

describe('Show route', () => {
  it('should return 404 if product can not be found', async () => {
    await request(app)
      .get(`${global.url}/${mongoose.Types.ObjectId().toHexString()}`)
      .expect(404)
  })

  it('should return product if it is found', async () => {
    const { body: product } = await createProduct()
    
    const { body: foundProduct } = await request(app)
      .get(`${global.url}/${product.id}`)
      .expect(200)

    expect(foundProduct.name).toBe(product.name)
    expect(foundProduct.price).toBe(product.price)
    expect(foundProduct.description).toBe(product.description)
  })
})
