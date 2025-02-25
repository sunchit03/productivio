export async function preLogOut() {
    try {
        const response = await fetch("/api/auth/token/clear");
        if (!response.ok) {
            throw new Error("Failed to clear tokens")
        }
        return true;
    }
    catch (error) {
        console.error("Error clearing tokens:", error);
        return false;
    }
}