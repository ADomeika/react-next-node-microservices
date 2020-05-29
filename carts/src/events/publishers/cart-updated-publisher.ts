import { Publisher, Subjects, CartUpdatedEvent } from '@admodosdesign/common'

export class CartUpdatedPublisher extends Publisher<CartUpdatedEvent> {
  subject: Subjects.CartUpdated = Subjects.CartUpdated
}
