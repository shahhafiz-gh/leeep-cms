import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow SVG logos (e.g. the /demo emblem) through next/image. Safe here
    // because we only serve our own / Frappe assets; the CSP below neutralises
    // any scripting and forces optimized SVGs to download rather than execute.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "iei.leeep.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "kcs.leeep.in",
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
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
    ],
  },
};

export default nextConfig;
