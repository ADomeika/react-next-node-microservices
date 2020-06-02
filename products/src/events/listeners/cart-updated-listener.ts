import { Message } from 'node-nats-streaming'
import { Subjects, Listener, CartUpdatedEvent } from '@admodosdesign/common'
import { Product } from '../../models/product'
import { queueGroupName } from './queue-group-name'
import { ProductUpdatedPublisher } from '../publishers/product-updated-publisher'

export class CartUpdatedListener extends Listener<CartUpdatedEvent> {
  subject: Subjects.CartUpdated = Subjects.CartUpdated
  queueGroupName = queueGroupName

  async onMessage(data: CartUpdatedEvent['data'], msg: Message) {
    if (!data.product) {
      return msg.ack()
    }
    
    const { product: { id, quantity } } = data

    const product = await Product.findById(id)
    if (!product) {
      throw new Error('Not found')
    }

    product.set({ quantity: product.quantity - quantity })

    await product.save()
    
    await new ProductUpdatedPublisher(this.client).publish({
      id: product.id,
      name: product.name,
      size: product.size,
      quantity: product.quantity,
      additionalInfo: product.additionalInfo,
      version: product.version,
      description: product.description,
      price: product.price
    })

    msg.ack()
  }
}
