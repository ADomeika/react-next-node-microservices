import 'react-dropzone-uploader/dist/styles.css'

const AppComponent = ({ Component, pageProps }) => {
  return (
    <>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  )
}

export default AppComponent
