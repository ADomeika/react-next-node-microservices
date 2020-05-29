import { Message } from 'node-nats-streaming'
import { Subjects, Listener, CartCreatedEvent } from '@admodosdesign/common'
import { Product, ProductDoc } from '../../models/product'
import { queueGroupName } from './queue-group-name'
import { ProductUpdatedPublisher } from '../publishers/product-updated-publisher'

export class CartCreatedListener extends Listener<CartCreatedEvent> {
  subject: Subjects.CartCreated = Subjects.CartCreated
  queueGroupName = queueGroupName

  async onMessage(data: CartCreatedEvent['data'], msg: Message) {
    const { products } = data

    await Promise.all(products.map(async prod => {
      const { id, quantity } = (prod as ProductDoc)
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
    }))

    msg.ack()
  }
}
