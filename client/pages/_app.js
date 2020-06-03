import 'react-dropzone-uploader/dist/styles.css'
import '../styles/main.scss'
import Head from 'next/head'
import buildClient from '../api/build-client'
import Header from '../components/header'

const AppComponent = ({ Component, pageProps, cart }) => {
  return (
    <div>
      <Head>
        <title>MoDo's Design</title>
        <meta
          name="description"
          content="Unikalių drabužių parduotuvė VISIEMS."
        >
        </meta>
        <meta
          name="keywords"
          content="drabuziai internetu, rubai internetu, sukneles, suknele, sijonai, tunikos, palaidines, kelnes, megztiniai, drabuziu parduotuve, sukneles internetu, drabužiai visiems, unikalus rubai, unikalu, visoje lietuvoje, preke lietuviska, lietuviska preke"
        ></meta>
      </Head>
      <Header cart={cart} />
      <main>
        <Component {...pageProps} />
      </main>
    </div>
  )
}

AppComponent.getInitialProps = async ({ Component, ctx }) => {
  const client = buildClient(ctx)
  let cart = {}
  try {
    const response = await client.get('/api/v1/carts')
    cart = response.data
  } catch (e) {}

  let pageProps = {}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx, client)
  }
  
  return {
    pageProps,
    cart
  }
}


export default AppComponent
