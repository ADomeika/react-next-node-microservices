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

describe('Update route', () => {
  it('should return 401 if user is not logged in', async () => {
    const { body: product } = await createProduct()

    await request(app)
      .put(`${global.url}/${product.id}`)
      .send()
      .expect(401)
  })

  it('should return 404 if product cannot be found', async () => {
    await request(app)
      .put(`${global.url}/${mongoose.Types.ObjectId().toHexString()}`)
      .set('Cookie', global.signin())
      .send({
        name: 'Test product',
        description: 'Test description',
        size: 'xs',
        quantity: 1,
        price: 6.99
      })
      .expect(404)
  })

  it('should return an error with response code 400 if name is not provided', async () => {
    const { body: product } = await createProduct()
    await request(app)
      .put(`${global.url}/${product.id}`)
      .set('Cookie', global.signin())
      .send({
        description: 'Test description',
        size: 'xs',
        quantity: 1,
        price: 6.99
      })
      .expect(400)

    await request(app)
      .put(`${global.url}/${product.id}`)
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
    const { body: product } = await createProduct()
    await request(app)
      .put(`${global.url}/${product.id}`)
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
      .put(`${global.url}/${product.id}`)
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
    const { body: product } = await createProduct()
    await request(app)
      .put(`${global.url}/${product.id}`)
      .set('Cookie', global.signin())
      .send({
        name: 'Test product',
        size: 'xs',
        quantity: 1,
        price: 6.99
      })
      .expect(400)

    await request(app)
      .put(`${global.url}/${product.id}`)
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
    const { body: product } = await createProduct()
    await request(app)
      .put(`${global.url}/${product.id}`)
      .set('Cookie', global.signin())
      .send({
        name: 'Test product',
        description: 'Test description',
        quantity: 1,
        price: 6.99
      })
      .expect(400)

    await request(app)
      .put(`${global.url}/${product.id}`)
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
    const { body: product } = await createProduct()
    await request(app)
      .put(`${global.url}/${product.id}`)
      .set('Cookie', global.signin())
      .send({
        name: 'Test product',
        description: 'Test description',
        size: 'xs',
        price: 6.99
      })
      .expect(400)

    await request(app)
      .put(`${global.url}/${product.id}`)
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

  it('should successfuly update a product', async () => {
    const { body: product } = await createProduct()

    const newProd = {
      name: 'Updated product name',
      description: 'Updated description',
      size: 'xl',
      price: 16.99,
      quantity: 1,
      additionalInfo: 'Some new info'
    }

    await request(app)
      .put(`${global.url}/${product.id}`)
      .set('Cookie', global.signin())
      .send(newProd)
      .expect(200)

    const response = await request(app)
      .get(`${global.url}/${product.id}`)
      .set('Cookie', global.signin())
      .send()
      .expect(200)

    expect(response.body.name).toBe(newProd.name)
    expect(response.body.description).toBe(newProd.description)
    expect(response.body.size).toBe(newProd.size)
    expect(response.body.price).toBe(newProd.price)
    expect(response.body.quantity).toBe(newProd.quantity)
    expect(response.body.additionalInfo).toBe(newProd.additionalInfo)
  })
})
