import { LoginForm } from 'wasp/client/auth';
// Wasp's type-safe Link component
import { Link } from 'wasp/client/router';
import { Button } from '../components/ui/button';

export function LoginPage() {
  return (
    <main>
      {/** Wasp has built-in auth forms & flows, which you can customize or opt-out of, if you wish :)
       * https://wasp-lang.dev/docs/guides/auth-ui
       */}
      <LoginForm />
      <br />
      <span>
        I don't have an account yet (<Link to="/signup">go to signup</Link>).
      </span>
    </main>
  );
}
