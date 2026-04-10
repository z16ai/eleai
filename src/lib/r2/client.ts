import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListBucketsCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const R2_CLIENT = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.R2_BUCKET_NAME!

export interface UploadResult {
  key: string
  url: string
  etag: string
}

export async function uploadToR2(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  folder: string = 'images'
): Promise<UploadResult> {
  const key = `${folder}/${Date.now()}-${fileName}`
  
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    })
    
    await R2_CLIENT.send(command)
    
    const publicUrl = getPublicUrl(key)
    
    return {
      key,
      url: publicUrl,
      etag: key,
    }
  } catch (error) {
    console.error('Failed to upload to R2:', error)
    throw new Error('Failed to upload file to R2')
  }
}

export async function getR2SignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
    
    const signedUrl = await getSignedUrl(R2_CLIENT, command, { expiresIn })
    return signedUrl
  } catch (error) {
    console.error('Failed to get signed URL:', error)
    throw new Error('Failed to generate signed URL')
  }
}

export async function deleteFromR2(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
    
    await R2_CLIENT.send(command)
  } catch (error) {
    console.error('Failed to delete from R2:', error)
    throw new Error('Failed to delete file from R2')
  }
}

export function getPublicUrl(key: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
  
  if (baseUrl) {
    return `${baseUrl}/${key}`
  }
  
  return `https://${BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`
}

export function parseR2Url(url: string): { folder: string; fileName: string } | null {
  const key = url.split(`/${BUCKET_NAME}/`)[1]
  
  if (!key) return null
  
  const parts = key.split('/')
  const fileName = parts.pop() || ''
  
  return {
    folder: parts.join('/'),
    fileName,
  }
}
