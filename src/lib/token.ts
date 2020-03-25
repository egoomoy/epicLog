import jwt, { SignOptions } from 'jsonwebtoken';
import { Context, Middleware } from 'koa';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

type ACCESSTOKENTYPE = {
  iat: number; // issued at
  exp: number; // expire
  sub: string; // subject
  iss: string; // issuer
  user_id: string;
};

type REFRESHTOKENTYPE = {
  iat: number;
  exp: number;
  sub: string;
  iss: string;
  user_id: string;
  token_id: string;
};

const { SECRET_KEY } = process.env;

if (!SECRET_KEY) {
  const error = new Error('InvalidSecretKeyError');
  error.message = 'Secret key is missing.';
  if (process.env.npm_lifecycle_event !== 'typeorm') throw error;
}

export const generateToken = (paylaod: any, option: SignOptions): Promise<string> => {
  const jwtOptions: SignOptions = {
    issuer: '.epiclo.io',
    expiresIn: '7d',
    ...option
  };

  if (!jwtOptions.expiresIn) {
    delete jwtOptions.expiresIn;
  }

  return new Promise((resolve, reject) => {
    if (!SECRET_KEY) return;
    jwt.sign(paylaod, SECRET_KEY, jwtOptions, (err, encoded) => {
      if (err) reject(err);
      resolve(encoded);
    });
  });
};

export const verifyToken = <T = any>(token: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    if (!SECRET_KEY) return;
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded as any);
    });
  });
};

export const setTokenCookie = (ctx: Context, tokens: { accessToken: string; refreshToken: string }) => {
  ctx.cookies.set('access_token', tokens.accessToken, {
    httpOnly: true,
    maxAge: 2000 * 60 * 60, // 2H
    domain: process.env.NODE_ENV === 'development' ? 'localhost' : '.epiclo.io'
  });

  ctx.cookies.set('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30D
    domain: process.env.NODE_ENV === 'development' ? undefined : '.epiclo.io'
  });
};

export const refresh = async (ctx: Context, refreshToken: any) => {
  try {
    const decoded = await verifyToken<REFRESHTOKENTYPE>(refreshToken);
    const user = await getRepository(User).findOne(decoded.user_id);
    if (!user) {
      const error = new Error('InvalidUserError');
      throw error;
    }
    const tokens = await user.refreshUserToken(decoded.token_id, decoded.exp, refreshToken);
    setTokenCookie(ctx, tokens);
  } catch (error) {
    throw error;
  }
};

export const tokenCheckMiddleware: Middleware = async (ctx: Context, next) => {
  const accessToken: string | undefined = ctx.cookies.get('access_token');
  const refreshToken: string | undefined = ctx.cookies.get('refresh_token');

  try {
    if (!accessToken) {
      console.log('No Access Token');
      throw new Error('NoAccessToken');
    }
    const accessTokenData = await verifyToken<ACCESSTOKENTYPE>(accessToken);
    ctx.state.user_id = accessTokenData.user_id;

    // refresh token when life < 30mins
    const diff = accessTokenData.exp * 1000 - new Date().getTime();

    if (diff < 1000 * 60 * 30 && refreshToken) {
      await refresh(ctx, refreshToken);
    }
  } catch (e) {
    // invalid token! try token refresh...
    if (!refreshToken) return next();
    try {
      const userId = await refresh(ctx, refreshToken);
      // set user_id if succeeds
      ctx.state.user_id = userId;
    } catch (e) {}
  }

  return next();
};
