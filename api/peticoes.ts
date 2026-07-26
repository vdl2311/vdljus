import app from "../server";

export default function handler(req: any, res: any) {
  req.url = "/api/peticoes";
  return app(req, res);
}
