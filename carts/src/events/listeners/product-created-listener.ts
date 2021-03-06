import { Message } from 'node-nats-streaming'
import { Subjects, Listener, ProductCreatedEvent } from '@admodosdesign/common'
import { Product } from '../../models/product'
import { queueGroupName } from './queue-group-name'

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated
  queueGroupName = queueGroupName

  async onMessage(data: ProductCreatedEvent['data'], msg: Message) {
    const { id, name, price, size, quantity } = data

    const product = Product.build({
      id, name, price, size, quantity
    })

    await product.save()
    
    msg.ack()
  }
}
