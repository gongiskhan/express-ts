import { redirect } from '@remix-run/node'
import type { LoaderArgs } from '@remix-run/node'
import { AuthorizationService } from '~/services/AuthorizationService'
import { authSessionHelper } from '~/services/session.server'
import qs from 'qs';

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url)
  const authData = await AuthorizationService.GetAuth0Token({
    refreshToken: AuthorizationService.getLatestRefreshToken()
  })

  const headers = new Headers()
  headers.append('Set-Cookie', authSessionHelper.commitSession(authData.access_token, authData.expires_in))

  const stateParam = decodeURIComponent(url.searchParams.get('state') ?? '')

  const appState = qs.parse(stateParam) as {
    customerId?: string
    pathname?: string
    search?: string
    hash?: string
  }

  const searchString = decodeURIComponent(appState.search ?? '')
  return redirect((appState.pathname ?? '/account/dashboard') + searchString + (appState.hash ?? ''), {
    headers
  })
}
