import axios from 'axios'
import crypto from 'crypto'

export function getCodeVerifier() {
  return new Promise<string>((resolve, reject) => {
    crypto.randomBytes(24, function (err, buffer) {
      if (err) {
        reject(err)
      }
      resolve(buffer.toString('hex'))
    })
  })
}

export async function GetAuth0RefreshToken({
  refreshToken
}: {
  refreshToken: string
}) {
  const response = await axios.request({
    url: '/authorize',
    baseURL: process.env.AUTH0_BASE_URL,
    method: 'post',
    data: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: 'offline_access',
      client_id: process.env.AUTH0_CLIENT_ID,
      redirect_uri: process.env.AUTH0_REDIRECT_URI,
      state: 'OPAQUE_VALUE'
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return response.data as {
      access_token: string,
      refresh_token: string,
      id_token: string,
      scope: string,
      expires_in: number,
      token_type: string
    }
}

export async function GetAuth0Token({
  refreshToken
}: {
  refreshToken: string
}) {
  const response = await axios.request({
    url: '/oauth/token',
    baseURL: process.env.AUTH0_BASE_URL,
    method: 'post',
    data: {
      grant_type: 'authorization_code',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      redirect_uri: process.env.AUTH0_REDIRECT_URI,
      refresh_token: refreshToken
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return response.data as {
      access_token: string,
      refresh_token: string,
      id_token: string,
      scope: string,
      expires_in: number,
      token_type: string
    }
}
