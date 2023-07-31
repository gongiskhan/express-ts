// app/utils/auth.server.ts
import { Authenticator } from 'remix-auth'
import { Auth0Strategy } from 'remix-auth-auth0'
import { sessionStorage } from '~/services/session.server'

// Create an instance of the authenticator, pass a generic (optional) with what your
// strategies will return and will be stored in the session

export const authenticator = new Authenticator(sessionStorage)

let auth0Strategy = new Auth0Strategy(
  {
    callbackURL: process.env.AUTH0_CALLBACK_URL!,
    clientID: process.env.AUTH0_CLIENT_ID!,
    clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    domain: process.env.AUTH0_DOMAIN_URL!
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('extraParams', extraParams);
    const email = profile.emails?.[0]?.value
    // Get the user data from your DB or API using the tokens and profile
    return email;
  }
)

authenticator.use(auth0Strategy)
