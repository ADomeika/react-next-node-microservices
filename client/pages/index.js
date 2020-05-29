import { useState } from 'react'
import Dropzone from 'react-dropzone-uploader'

import useRequest from '../hooks/use-request'

const LandingPage = () => {
  const [images, setImages] = useState([])
  const { doRequest, errors } = useRequest({
    url: '/api/v1/images',
    method: 'post',
    body: {}
  })

  const getUploadParams = async ({ meta: { name } }) => {
    const { fields, url } = await doRequest({ image: name })

    return { fields, url }
  }

  const handleChangeStatus = ({ meta }, status) => {
    if (status === 'done') {
      setImages([...images, `https://s3.eu-central-1.amazonaws.com/modosdesign-photos/${meta.name}`])
    }
    if (status === 'removed') {
      setImages(images.filter(image => {
        return image !== `https://s3.eu-central-1.amazonaws.com/modosdesign-photos/${meta.name}`
      }))
    }
  }

  return (
    <div>
      <Dropzone
        accept="image/*"
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        styles={{ dropzone: { minHeight: 200 } }}
      />
      {errors}
    </div>
  )
}

// LandingPage.getInitialProps = async (context, client, currentUser) => {
//   const { data } = await client.get('/api/tickets')
//   return { tickets: data }
// }

export default LandingPage
