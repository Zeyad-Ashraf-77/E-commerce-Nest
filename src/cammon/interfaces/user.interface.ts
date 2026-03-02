import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { hydratedUserDocument } from 'src/DB/model';
import { TokenType } from '../enume';

export interface userRequest extends Request {
  user: hydratedUserDocument;
  decoded: JwtPayload;
  typeToken?: TokenType;
}
