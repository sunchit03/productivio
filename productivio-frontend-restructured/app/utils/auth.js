export async function getJWT() {
    try {
        const response = await fetch("/api/auth/token", { method: "POST", credentials: "include" }); // ✅ Include credentials (cookies)
        if (!response.ok) {
            throw new Error("Failed to authenticate");
        }
        return true;
    } catch (error) {
        console.error("Error fetching JWT:", error);
        return false;
    }
}
