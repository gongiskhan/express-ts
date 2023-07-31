import { createCookieSessionStorage } from '@remix-run/node'
import cookie from 'cookie'

export const authChallengeSession = createCookieSessionStorage({
  cookie: {
    name: '__code_challenge',

    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    // TODO: REMIX: FIX THIS - this should be an env var.
    secrets: ['s3cret1']
  }
})

const AUTH_COOKIE_NAME = '__xauth'
export const authSessionHelper = {
  getBearerToken(cookieHeader?: string | null | undefined) {
    const cookies = cookie.parse(cookieHeader ?? '')
    return cookies[AUTH_COOKIE_NAME]?.slice?.(7)
  },
  commitSession(access_token: string, expires_in: number) {
    // here because safari will only set a Secure cookie on https. Since localhost is not secure,
    // this was causing issues for local developers
    const security = process.env.REACT_APP_ENV === 'local' ? '' : 'Secure;'
    return `${AUTH_COOKIE_NAME}=Bearer ${access_token}; HttpOnly; Path=/; Max-Age=${expires_in}; ${security} SameSite=Lax;`
  },
  destroySession() {
    return `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
}

export const impersonateSession = createCookieSessionStorage({
  cookie: {
    name: 'impersonate_session',
    secrets: ['s3cret1']
  }
})

// export the whole sessionStorage object
export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session', // use any name you want here
    sameSite: 'lax', // this helps with CSRF
    path: '/', // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: ['s3cr3t'], // replace this with an actual secret
    secure: process.env.NODE_ENV === 'production' // enable this in prod only
  }
})

// you can also export the methods individually for your own usage
export let { getSession, commitSession, destroySession } = sessionStorage