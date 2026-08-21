import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";

const BACKEND_URL = "https://anabaena-vaaksiddhi.hf.space";

// GoogleLogin's default flow returns a signed ID token (credentialResponse
// .credential) rather than an access token — that's what the backend
// verifies server-side via google-auth's verify_oauth2_token, so the
// frontend never has to be trusted on its own.
export default function GoogleAuthButton({ onSuccess, onError, darkMode }) {
  const [loading, setLoading] = useState(false);

  const handleCredential = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      onError("Google sign-in didn't return a credential. Please try again.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess(data);
      } else {
        onError(data.error || "Could not sign in with Google.");
      }
    } catch {
      onError("Could not connect. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", opacity: loading ? 0.6 : 1, pointerEvents: loading ? "none" : "auto" }}>
      <GoogleLogin
        onSuccess={handleCredential}
        onError={() => onError("Google sign-in was cancelled or failed.")}
        theme={darkMode ? "filled_black" : "outline"}
        shape="pill"
        width="100%"
      />
    </div>
  );
}
