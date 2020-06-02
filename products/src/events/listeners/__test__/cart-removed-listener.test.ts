import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { CartRemovedEvent, ProductSize } from '@admodosdesign/common'

import { CartRemovedListener } from '../cart-removed-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Product } from '../../../models/product'

const setup = async () => {
  const listener = new CartRemovedListener(natsWrapper.client)

  const product = Product.build({
    name: 'new product',
    price: 19.99,
    description: 'new product description',
    size: ProductSize.L,
    quantity: 1
  })

  await product.save()

  const data: CartRemovedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    products: [{
      product: product.id,
      quantity: 1
    }]
  }

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

describe('CartCreatedListener', () => {
  it('should update a product', async () => {
    const { listener, data, msg, product } = await setup()
  
    await listener.onMessage(data, msg)
  
    const updatedProduct = await Product.findById(product.id)
  
    expect(updatedProduct).not.toBeNull()
    expect(updatedProduct!.quantity).toBe(2)
  })

  it('should ack the message', async () => {
    const { listener, data, msg } = await setup()
  
    await listener.onMessage(data, msg)
  
    expect(msg.ack).toHaveBeenCalled()
  })

  it('should not ack the message if the product does not exist', async () => {
    const { listener, data, msg } = await setup()

    data.products = [{ product: mongoose.Types.ObjectId().toHexString(), quantity: 1 }]

    try {
      await listener.onMessage(data, msg)
    } catch (e) {}
  
    expect(msg.ack).not.toHaveBeenCalled()
  })

  it('should publish product updated event', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const productUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

    expect(productUpdatedData.id).toBe(data.products[0].product)
  })
})
