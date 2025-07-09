import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthenticationService } from 'src/services/authentication.service';

@Injectable()
export class TokenRefresherMiddleware implements NestMiddleware {
  constructor(private authenticationService: AuthenticationService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization.replace('Bearer ', '');
      let validated: any = jwt.verify(token, process.env.JWT_KEY);
      let newToken = await this.authenticationService.generateToken(validated.email);
      res.set({ 'Authorization': 'Bearer ' + newToken });
    }
    catch {
      delete req.headers.authorization;
    }
    next();
  }
}