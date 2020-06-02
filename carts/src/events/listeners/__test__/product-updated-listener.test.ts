import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { ProductUpdatedEvent, ProductSize } from '@admodosdesign/common'

import { ProductUpdatedListener } from '../product-updated-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Product } from '../../../models/product'

const setup = async () => {
  const listener = new ProductUpdatedListener(natsWrapper.client)

  const product = Product.build({
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'new product',
    price: 19.99,
    size: ProductSize.S,
    quantity: 1
  })

  await product.save()

  const data: ProductUpdatedEvent['data'] = {
    version: 1,
    id: product.id,
    name: 'new item name',
    price: 9.99,
    size: ProductSize.S,
    quantity: 2,
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
    product,
    msg
  }
}

describe('ProductUpdatedListener', () => {
  it('should find, update and save a product', async () => {
    const { msg, data, product, listener } = await setup()
  
    await listener.onMessage(data, msg)
  
    const updatedProduct = await Product.findById(product.id)

    expect(updatedProduct!.name).toBe(data.name)
    expect(updatedProduct!.price).toBe(data.price)
    expect(updatedProduct!.quantity).toBe(data.quantity)
  })

  it('should ack the message', async () => {
    const { msg, data, listener } = await setup()
  
    await listener.onMessage(data, msg)
  
    expect(msg.ack).toHaveBeenCalled()
  })

  it('should not call ack if the event has a skipped version number', async () => {
    const { msg, data, listener } = await setup()
  
    data.version = 10
  
    try {
      await listener.onMessage(data, msg)
    } catch (e) {}
  
    expect(msg.ack).not.toHaveBeenCalled()
  })
})
