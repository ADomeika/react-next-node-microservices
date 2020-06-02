import { Message } from 'node-nats-streaming'
import { Subjects, Listener, CartRemovedEvent } from '@admodosdesign/common'
import { Product } from '../../models/product'
import { queueGroupName } from './queue-group-name'
import { ProductUpdatedPublisher } from '../publishers/product-updated-publisher'

export class CartRemovedListener extends Listener<CartRemovedEvent> {
  subject: Subjects.CartRemoved = Subjects.CartRemoved
  queueGroupName = queueGroupName

  async onMessage(data: CartRemovedEvent['data'], msg: Message) {
    const { products } = data

    await Promise.all(products.map(async ({ product: id, quantity }) => {
      const product = await Product.findById(id)
      if (!product) {
        throw new Error('Product not found')
      }

      product.set({ quantity: product.quantity + quantity })

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
