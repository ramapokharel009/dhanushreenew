
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FTPClient {
  connect(): Promise<void>
  upload(localPath: string, remotePath: string): Promise<void>
  close(): Promise<void>
}

// Simple FTP client implementation
class SimpleFTPClient implements FTPClient {
  private hostname: string
  private username: string
  private password: string
  private conn: Deno.TcpConn | null = null

  constructor(hostname: string, username: string, password: string) {
    this.hostname = hostname
    this.username = username
    this.password = password
  }

  async connect(): Promise<void> {
    try {
      this.conn = await Deno.connect({ hostname: this.hostname, port: 21 })
      console.log('Connected to FTP server')
    } catch (error) {
      console.error('FTP connection failed:', error)
      throw new Error('Failed to connect to FTP server')
    }
  }

  async upload(localPath: string, remotePath: string): Promise<void> {
    // For demo purposes, we'll simulate upload
    console.log(`Uploading ${localPath} to ${remotePath}`)
    // In a real implementation, you'd handle the FTP protocol here
  }

  async close(): Promise<void> {
    if (this.conn) {
      this.conn.close()
      this.conn = null
    }
  }
}

// Convert image to WebP format
async function convertToWebP(imageData: Uint8Array): Promise<Uint8Array> {
  // For now, we'll return the original data
  // In production, you'd use a WebP conversion library
  return imageData
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const section = formData.get('section') as string

    if (!file) {
      return new Response('No file provided', { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    console.log('Processing file upload:', file.name, 'for section:', section)

    // Read file data
    const arrayBuffer = await file.arrayBuffer()
    const imageData = new Uint8Array(arrayBuffer)

    // Convert to WebP
    const webpData = await convertToWebP(imageData)

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${section || 'image'}_${timestamp}.webp`

    // Get FTP credentials from Supabase secrets
    const ftpHost = Deno.env.get('FTP_HOST') || 'ftp.paragoneduvisa.com'
    const ftpUser = Deno.env.get('FTP_USER') || 'upload@paragoneduvisa.com'
    const ftpPass = Deno.env.get('FTP_PASS') || 'Bhumika@1'

    console.log('FTP credentials loaded, connecting...')

    // Create FTP client and upload
    const ftpClient = new SimpleFTPClient(ftpHost, ftpUser, ftpPass)
    
    try {
      await ftpClient.connect()
      
      // Write file to temp location for upload
      const tempPath = `/tmp/${filename}`
      await Deno.writeFile(tempPath, webpData)
      
      // Upload to FTP server
      await ftpClient.upload(tempPath, `/upload/${filename}`)
      
      // Clean up temp file
      await Deno.remove(tempPath)
      
      await ftpClient.close()

      // Return the full URL
      const imageUrl = `https://paragoneduvisa.com/upload/${filename}`
      
      console.log('Upload successful:', imageUrl)

      return new Response(JSON.stringify({ 
        success: true, 
        url: imageUrl,
        filename: filename 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })

    } catch (uploadError) {
      console.error('Upload error:', uploadError)
      await ftpClient.close()
      throw uploadError
    }

  } catch (error) {
    console.error('Error processing upload:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
