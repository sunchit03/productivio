import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(function DashboardPage() {
  return (
    <>
        <div>Welcome to your dashboard!</div>
        <a href="api/auth/logout">
              Log Out
        </a>
    </>
  );
});