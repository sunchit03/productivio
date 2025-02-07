import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

function Teams( {user} ) {
    <h1>Teams Pageeee</h1>
}

export default withPageAuthRequired(Teams, {
    onRedirecting: () => <Loading />,
    onError: error => <ErrorMessage>{error.message}</ErrorMessage>
  });