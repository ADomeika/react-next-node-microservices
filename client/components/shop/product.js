import Link from 'next/link'

import useRequest from '../../hooks/use-request'

export default ({ product, cart }) => {
  const { doRequest, errors } = useRequest({
    url: `/api/v1/carts/${cart.id}`,
    method: 'patch',
    body: {
      productId: product.id,
      quantity: 1
    },
    onSuccess: (cart) => console.log(cart)
  })

  return (
    <div className="product">
      <Link
        href='/products/[productId]'
        as={`/products/${product.id}`}
      >
        <a className="product__link">
          <img
            className="product__image"
            src={product.images[0]}
            alt={product.name}
          />
          <h1>{product.name}</h1>
          <p className="product__price">£{product.price}</p>
          <p>{product.description}</p>
        </a>
      </Link>
      <div>
        <button
          className="product__action-button"
          onClick={() => doRequest()}
        >Add to Cart</button>
      </div>
    </div>
  )
}
