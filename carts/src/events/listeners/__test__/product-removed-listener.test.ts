import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { ProductRemovedEvent, ProductSize } from '@admodosdesign/common'

import { ProductRemovedListener } from '../product-removed-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Product } from '../../../models/product'

const setup = async () => {
  const listener = new ProductRemovedListener(natsWrapper.client)

  const product = Product.build({
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'new product',
    price: 19.99,
    size: ProductSize.S,
    quantity: 1
  })

  await product.save()

  const data: ProductRemovedEvent['data'] = {
    id: product.id
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

describe('ProductCreatedListener', () => {
  it('should remove a product', async () => {
    const { listener, data, msg } = await setup()
  
    await listener.onMessage(data, msg)

    const product = await Product.findById(data.id)

    expect(product).toBeNull()
  })
  
  it('should ack the message', async () => {
    const { listener, data, msg } = await setup()
  
    // call the onMessage function with data object + message object
    await listener.onMessage(data, msg)
  
    // write assertions to make sure ack is called
    expect(msg.ack).toHaveBeenCalled()
  })
})
