import type { LoaderFunction } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { authenticator } from '~/auth.server'

// If the user lands on this page, we redirect back to / if they are already logged in.
export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/'
  })
}

// This form would take us to the auth0 route, which would redirect to the Auth0 login page.

export default function Login() {
  return (
    <Form action='/auth0' method='post'>
      <button>Login with Auth0</button>
    </Form>
  )
}
