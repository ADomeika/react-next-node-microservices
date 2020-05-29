k create secret generic s3-secret --from-literal=S3_ACCESS_KEY_ID={key}
k create secret generic s3-access --from-literal=S3_SECRET_ACCESS_KEY={key}
