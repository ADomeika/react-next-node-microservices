import { Message } from 'node-nats-streaming'
import { Subjects, Listener, ProductRemovedEvent } from '@admodosdesign/common'
import { Product } from '../../models/product'
import { queueGroupName } from './queue-group-name'
import { Cart } from '../../models/cart'
import { CartUpdatedPublisher } from '../publishers/cart-updated-publisher'

export class ProductRemovedListener extends Listener<ProductRemovedEvent> {
  subject: Subjects.ProductRemoved = Subjects.ProductRemoved
  queueGroupName = queueGroupName

  async onMessage(data: ProductRemovedEvent['data'], msg: Message) {
    const product = await Product.findById(data.id)

    if (!product) {
      throw new Error('Product not found')
    }

    await product.remove()

    const carts = await Cart.find({ 'products.product': product.id })
    await Promise.all(carts.map(async cart => {
      cart.set({ products: cart.products.filter(prod => prod !== product.id ) })

      await cart.save()

      new CartUpdatedPublisher(this.client).publish({
        id: cart.id,
        userId: cart.userId,
        expiresAt: cart.expiresAt.toISOString(),
        version: cart.version,
        products: cart.products
      })
    }))

    msg.ack()
  }
}
