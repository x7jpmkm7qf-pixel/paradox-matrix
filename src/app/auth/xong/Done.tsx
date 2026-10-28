"use client";

import { useEffect } from "react";
import { safeNext } from "@/lib/accounts";
import { track } from "@/lib/pixel";

/** Google sign-in opened in a popup: tell the page underneath and close, so numbers typed there are kept. */
export function Done() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = safeNext(params.get("next"));
    const isNew = params.get("moi") === "1";
    if (window.opener && !window.opener.closed) {
      try {
        // The page underneath records the registration; its pixel is already loaded.
        window.opener.postMessage({ type: "pm-auth", isNew }, window.location.origin);
        window.close();
        return;
      } catch {
        // fall through to a normal redirect
      }
    }
    if (isNew) track("CompleteRegistration", { content_name: "google" });
    // Give the pixel a moment to send before leaving.
    setTimeout(() => window.location.replace(next), isNew ? 1200 : 0);
  }, []);
  return <p className="p-10 text-center text-sm text-ink-600">Đăng nhập xong, đang quay lại...</p>;
}
