import jwt from 'jsonwebtoken';

// Definir una interfaz para el payload del token
export interface JwtPayload {
  userId: string;
  email: string;
  [key: string]: any;
}

export const generateToken = (payload: object): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions); // <-- Añadir el tipo SignOptions aquí
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
  }

  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};