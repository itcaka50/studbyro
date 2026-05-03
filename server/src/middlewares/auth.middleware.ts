import { RequestHandler } from 'express';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      user: User;
    }
  }
}

const userService = new UserService();
const jwtService = new JwtService()

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthenticationError('Unauthenticated');
  }
  const token = authHeader.replace('Bearer ', '');

  const payload = jwtService.verify(token);

  if (!payload) {
    throw new AuthenticationError('Unauthenticated');
  }

  const user = await userService.findById(payload.id);
  if (!user) {
    throw new AuthenticationError('Unauthenticated');
  }
  res.locals = { user };
  next();
};