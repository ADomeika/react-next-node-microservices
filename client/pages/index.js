import Hero from '../components/landing/hero'

const LandingPage = ({ products }) => {
  return (
    <div>
      <Hero />
    </div>
  )
}

LandingPage.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/v1/products')
  return { products: data }
}

export default LandingPage
