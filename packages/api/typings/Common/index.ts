export type Asset = {
  _id: string
  tag: string
  filename: string
  metadata: { type: 'File' }
  content_type: string
  size: number
  deleted: boolean
  reported: boolean
  message_id: string
  server_id: string
  object_id: string
}

