import { withAuth } from '@auth0/nextjs-auth0/edge';

export default withAuth({
  onError(req, err) {
    console.error(err);
  },
  redirectTo: '/api/auth/login', // Redirect to login page if unauthenticated
});

export const config = {
  matcher: ['/dashboard/:path*'], // Protect the dashboard route
};
