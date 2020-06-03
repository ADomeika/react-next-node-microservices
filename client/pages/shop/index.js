import Head from 'next/head'

const ShopPage = ({ products }) => {
  return (
    <div>
      <Head>
        <title>MoDo's Design Shop Page</title>
        <meta name="robots" content="all"></meta>
      </Head>
      <div>
        {products.map(product => (
          <div key={product.id}>
            {product.name}
          </div>
        ))}
      </div>
    </div>
  )
}

ShopPage.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/v1/products')
  return { products: data }
}

export default ShopPage
