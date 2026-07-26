import app from "../server";

export default function handler(req: any, res: any) {
  req.url = "/api/search-jurisprudence";
  return app(req, res);
}
