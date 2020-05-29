import request from 'supertest'
import { app } from '../../../app'
import { Product } from '../../../models/product'
import { natsWrapper } from '../../../nats-wrapper'

describe('Insert route', () => {
  it(`should have a route handler listening to ${global.url} for POST request`, async () => {
    const response = await request(app)
      .post(global.url)
      .send({})
  
    expect(response.status).not.toBe(404)
  })

  it('should be only accessed if user is signed in', async () => {
    await request(app)
      .post(global.url)
      .send({})
      .expect(401)
  })

  it('should return an error with response code 400 if name is not provided', async () => {
    await request(app)
      .post(global.url)
      .set('Cookie', global.signin())
      .send({
        description: 'Test description',
        size: 'xs',
        quantity: 1,
        price: 6.99
      })
      .expect(400)

    await request(app)
      .post(global.url)
      .set('Cookie', global.signin())
      .send({
        name: '',
        description: 'Test description',
        size: 'xs',
        quantity: 1,
        price: 6.99
      })
      .expect(400)
  })

  it('should return an error with response code 400 if price is not provided or is less than 0', async () => {
    await request(app)
      .post(global.url)
      .set('Cookie', global.signin())
      .send({
        name: 'Test product',
        description: 'Test description',
        size: 'xs',
        quantity: 1,
        price: -6.99
      })
      .expect(400)

    await request(app)
      .post(global.url)
      .set('Cookie', global.signin())
      .send({
        name: 'Test product',
        description: 'Test description',
        size: 'xs',
        quantity: 1,
      })
      .expect(400)
  })

  it('should return an error with response code 400 if description is not provided', async () => {
    await request(app)
      .post(global.url)
      .set('Cookie', global.signin())
      .send({
        name: 'Test product',
        size: 'xs',
        quantity: 1,
        price: 6.99
      })
      .expect(400)

    await request(app)
      .post(global.url)
      .set('Cookie', global.signin())
      .send({
        name: 'Test product',
        description: '',
        size: 'xs',
        quantity: 1,
        price: 6.99
      })
      .expect(400)
  })

  it('should return an error with response code 400 if size is not provided', async () => {
    await request(app)
      .post(global.url)
      .set('Cookie', global.signin())
      .send({
        name: 'Test product',
        description: 'Test description',
        quantity: 1,
        price: 6.99
      })
      .expect(400)

    await request(app)
      .post(global.url)
      .set('Cookie', global.signin())
      .send({
        name: 'Test product',
        description: 'Test description',
        size: '',
        quantity: 1,
        price: 6.99
      })
      .expect(400)
  })

  it('should return an error with response code 400 if quantity is not provided or is less than 0', async () => {
    await request(app)
      .post(global.url)
      .set('Cookie', global.signin())
      .send({
        name: 'Test product',
        description: 'Test description',
        size: 'xs',
        price: 6.99
      })
      .expect(400)

    await request(app)
      .post(global.url)
      .set('Cookie', global.signin())
      .send({
        name: 'Test product',
        description: 'Test description',
        size: 'xs',
        quantity: -1,
        price: 6.99
      })
      .expect(400)
  })

  it('should create a product with valid inputs', async () => {
    let products = await Product.find({})
    expect(products.length).toBe(0)

    const data = {
      name: 'Test item',
      price: 19.99,
      description: 'Test description',
      size: 'xs',
      quantity: 1
    }

    await request(app)
      .post(global.url)
      .set('Cookie', global.signin())
      .send(data)
      .expect(201)
  
    products = await Product.find({})
    expect(products.length).toBe(1)
    expect(products[0].name).toBe(data.name)
    expect(products[0].description).toBe(data.description)
    expect(products[0].price).toBe(data.price)
  })

  it('should publish an event with successful creation of product', async () =>{
    const data = {
      name: 'Test item',
      price: 19.99,
      description: 'Test description',
      size: 'xs',
      quantity: 1
    }

    await request(app)
      .post(global.url)
      .set('Cookie', global.signin())
      .send(data)
      .expect(201)
  
    expect(natsWrapper.client.publish).toHaveBeenCalled()
  })
})
