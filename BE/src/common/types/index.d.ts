// src/types/express.d.ts

import { User } from "../types/types";


declare global {
  namespace Express {
    interface Request {
      user?: Partial<User>;
    }
  }
}
