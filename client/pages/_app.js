import 'react-dropzone-uploader/dist/styles.css'
import '../styles/main.scss'
import buildClient from '../api/build-client'
import Header from '../components/header'

const AppComponent = ({ Component, pageProps }) => {
  return (
    <div>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
    </div>
  )
}

AppComponent.getInitialProps = async ({ Component, ctx }) => {
  const client = buildClient(ctx)
  let data = {}
  try {
    const response = await client.get('/api/v1/carts')
    data = response.data
    console.log(data)
  } catch (e) {}

  let pageProps = {}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx, client)
  }
  
  return {
    pageProps,
    ...data
  }
}


export default AppComponent
