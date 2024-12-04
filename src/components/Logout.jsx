import { useEffect } from "react";
import axios from "axios";


export default function Logout() {

    useEffect(() => {
        const logout = async () => {
            try {
                await axios.post("http://localhost:5868/api/auth/logout", null, {
                    headers: { "Authorization": 'Bearer ' + localStorage.getItem("refresh_token") }
                });
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
            } catch (error) {
                console.error("Failed to logout:", error);
            }
        };
        logout();
    }, []);
}

