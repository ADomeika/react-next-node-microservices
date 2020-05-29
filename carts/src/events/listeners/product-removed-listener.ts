import { Message } from 'node-nats-streaming'
import { Subjects, Listener, ProductRemovedEvent } from '@admodosdesign/common'
import { Product } from '../../models/product'
import { queueGroupName } from './queue-group-name'

export class ProductRemovedListener extends Listener<ProductRemovedEvent> {
  subject: Subjects.ProductRemoved = Subjects.ProductRemoved
  queueGroupName = queueGroupName

  async onMessage(data: ProductRemovedEvent['data'], msg: Message) {
    const product = await Product.findById(data.id)

    if (!product) {
      throw new Error('Product not found')
    }

    await product.remove()

    msg.ack()
  }
}
