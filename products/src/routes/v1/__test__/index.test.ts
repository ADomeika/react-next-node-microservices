import request from 'supertest'
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

describe('Index route', () => {
  it(`should have a route handler listening to ${global.url} for GET request`, async () => {
    const response = await request(app)
      .get(global.url)
  
    expect(response.status).not.toBe(404)
  })

  it('should be able get all existing products', async () => {
    await createProduct()
    await createProduct()
    await createProduct()
  
    const response = await request(app)
      .get(global.url)
      .expect(200)
  
    expect(response.body.length).toBe(3)
  })
})
