// app/services/users.js

export async function saveUser(user) {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        connection: user.sub.split("|")[0], // e.g., "google-oauth2"
    }),
    });
    return res.json();
  }