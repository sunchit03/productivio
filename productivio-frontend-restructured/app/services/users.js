// app/services/users.js

export async function saveUser(user) {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        profilePicture: user.picture,
        connection: user.sub.split("|")[0], // e.g., "google-oauth2"
    }),
    });
    return res.json();
  }

export async function getAllUsers() {
  try {
    const res = await fetch("/api/users");
    const data = await res.json();
    return data.users;
  } catch (error) {
    console.error("Error fetching team data:", error);
    return [];
  }
}

export async function sendInvite(email) {
  const res = await fetch('/api/users/invite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  return res.json();
}