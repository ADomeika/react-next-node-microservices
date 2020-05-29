import express, { Request, Response } from 'express'
import AWS from 'aws-sdk'
import { requireAuth } from '@admodosdesign/common'

const router = express.Router()

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',   
  region: 'eu-central-1'
})

router.post('/api/v1/images', requireAuth, async (req: Request, res: Response) => {
  const key = req.body.image
  s3.createPresignedPost({
    Bucket: 'modosdesign-photos',
    Fields: {
      Key: key
    }
  }, (err, data) => {
    res.send(data)
  })
})

export { router as insertRouter }
