import Head from 'next/head'

import Products from '../../components/shop/products'

const ShopPage = ({ products, cart }) => {
  return (
    <div>
      <Head>
        <title>MoDo's Design Shop Page</title>
        <meta name="robots" content="all"></meta>
      </Head>
      <Products products={products} cart={cart} />
    </div>
  )
}

ShopPage.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/v1/products')
  return { products: data }
}

export default ShopPage
