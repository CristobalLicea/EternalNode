const aws = require('aws-sdk');
const crypto = require('crypto');

const region = 'us-east-1';
const bucketName = 'bookstabucket';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'
})

exports.generateUploadURL = async (title) => {
  const rawBytes = await crypto.randomBytes(16);
  const imageName = rawBytes.toString('hex');

  const params = ({
    Bucket: bucketName,
    Key: imageName
  })

  const uploadURL = await s3.getSignedUrlPromise('putObject', params)
  return uploadURL
}