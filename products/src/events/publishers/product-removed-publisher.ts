import { Publisher, Subjects, ProductRemovedEvent } from '@admodosdesign/common'

export class ProductRemovedPublisher extends Publisher<ProductRemovedEvent> {
  subject: Subjects.ProductRemoved = Subjects.ProductRemoved
}
