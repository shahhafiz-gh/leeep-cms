import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Dev-only: skip server-side optimization. The Frappe backend is on
    // localhost (127.0.0.1), and Next 16's image optimizer hard-blocks any
    // upstream that resolves to a private/loopback IP (SSRF protection),
    // returning `"url" parameter is not allowed`. With optimization off the
    // browser loads the backend URL directly, which is unrestricted. In
    // production FRAPPE_URL is a public host, so optimization stays ON.
    unoptimized: process.env.NODE_ENV !== "production",
    // Allow SVG logos (e.g. the /demo emblem) through next/image. Safe here
    // because we only serve our own / Frappe assets; the CSP below neutralises
    // any scripting and forces optimized SVGs to download rather than execute.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        // Every school runs its own Frappe site at <label>.leeep.in and serves
        // its uploaded logo/images from /files/**. One wildcard covers them all,
        // so we never have to whitelist schools one by one. (`**.` matches any
        // subdomain depth; the apex leeep.in is covered separately below.)
        protocol: "https",
        hostname: "**.leeep.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "leeep.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/**",
      },
      {
        // Stock photography used by the neutral /demo preview only.
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        // Frappe backend (dev): uploaded files (/files/**) and bundled
        // assets (/assets/**). pathname must lead with "/" to match.
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
