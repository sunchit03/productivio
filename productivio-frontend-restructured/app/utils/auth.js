export async function getJWT() {
    try {
      const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          audience: process.env.API_IDENTIFIER,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to retrieve token: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.access_token; // JWT Token
    } catch (error) {
      console.error("Error fetching JWT:", error);
      return null;
    }
  }
  