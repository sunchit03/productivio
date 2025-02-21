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

export async function isUser(email) {
  try {
    const res = await fetch(`/api/users/check?email=${email}`);
    const data = await res.json();
    if (data.exists) {
      return true
    } else {
      return false
    }
  } catch (error) {

  }
}

export async function inviteUser(email) {
  
}