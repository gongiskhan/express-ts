import { GetAuth0Token, getCodeVerifier } from '../auth-helpers'

let latestRefreshToken = '';

export const AuthorizationService = {
  getLatestRefreshToken: () => latestRefreshToken,
  setLatestRefreshToken: (refreshToken: string) => latestRefreshToken = refreshToken,
  GetAuth0Token,
  getCodeVerifier
}
