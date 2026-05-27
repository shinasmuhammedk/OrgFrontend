import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (!accessToken) {
            navigate("/login");
            return;
        }

        localStorage.setItem("token", accessToken);

        if (refreshToken) {
            localStorage.setItem("refresh_token", refreshToken);
        }

        navigate("/dashboard");
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            Logging you in...
        </div>
    );
}

export default OAuthCallback;