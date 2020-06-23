import Product from './product'

export default ({ products, cart }) => {
  const productList = products.map(product => (
    <Product key={product.id} product={product} cart={cart} />
  ))

  return (
    <div className="product-wrapper">
      {productList}
    </div>
  )
}
