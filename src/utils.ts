import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export function authProtected(req: Request, res: Response, next: NextFunction) {
  try {
    // Tomar usuario de petición
    const authHeader = req.headers.authorization;
    if (typeof authHeader !== "string") {
      return res.status(401).json({ error: "No autorizado" });
    }
    // Extraer token y validarlo
    const token = authHeader.split(" ")[1];
    const user = jwt.verify(
      token,
      process.env.JWT_SECRET as jwt.Secret
    ) as jwt.JwtPayload;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "No autorizado" });
  }
}
