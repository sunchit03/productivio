export async function getJWT() {
    try {
        const response = await fetch("/api/auth/token", { method: "POST" });
        if (!response.ok) {
            throw new Error("Failed to retrieve token");
        }

        const data = await response.json();
        return data.token; // Securely retrieved JWT
    } catch (error) {
        console.error("Error fetching JWT:", error);
        return null;
    }
}
