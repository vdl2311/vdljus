import app from "../server";

export default function handler(req: any, res: any) {
  // If req.url is rewritten to /api or /api/index by Vercel, restore original path if present
  if (req.url && (req.url.startsWith("/api/index") || req.url === "/api" || req.url === "/api/")) {
    const rawUrl = req.headers["x-forwarded-url"] || req.headers["x-invoke-path"] || req.headers["x-matched-path"];
    if (typeof rawUrl === "string" && rawUrl.length > 0) {
      req.url = rawUrl;
    }
  }

  return app(req, res);
}

