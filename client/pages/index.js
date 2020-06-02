const LandingPage = ({ products }) => {
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          {product.name}
        </div>
      ))}
    </div>
  )
}

LandingPage.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/v1/products')
  return { products: data }
}

export default LandingPage
