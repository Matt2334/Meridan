// exporter
export * from './content';
export * from './session';
export * from './bookmark';
export * from './ai';

enum UserRole {
  ADMIN,
  USER,
}

interface JwtPayload {
  userId?: string;
  email?: string;
  role?: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}