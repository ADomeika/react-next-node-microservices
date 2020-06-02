import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { ProductCreatedEvent, ProductSize } from '@admodosdesign/common'

import { ProductCreatedListener } from '../product-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Product } from '../../../models/product'

const setup = async () => {
  const listener = new ProductCreatedListener(natsWrapper.client)

  const data: ProductCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    name: 'new item',
    price: 10,
    size: ProductSize.L,
    quantity: 1,
    description: 'new item description'
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {
    listener,
    data,
    msg
  }
}

describe('ProductCreatedListener', () => {
  it('should create and save a product', async () => {
    const { listener, data, msg } = await setup()
  
    await listener.onMessage(data, msg)

    const product = await Product.findById(data.id)

    expect(product).not.toBeNull()
    expect(product!.id).toBe(data.id)
    expect(product!.name).toBe(data.name)
    expect(product!.price).toBe(data.price)
    expect(product!.size).toBe(data.size)
    expect(product!.quantity).toBe(data.quantity)
  })
  
  it('should ack the message', async () => {
    const { listener, data, msg } = await setup()
  
    // call the onMessage function with data object + message object
    await listener.onMessage(data, msg)
  
    // write assertions to make sure ack is called
    expect(msg.ack).toHaveBeenCalled()
  })
})
