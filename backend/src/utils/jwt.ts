import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  email: string;
}

export const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
  }

  // ✅ SOLUCIÓN SIMPLE: Usar 'as any' para evitar problemas de tipos
  return jwt.sign(payload as any, secret, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  } as any);
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
  }

  try {
    const decoded = jwt.verify(token, secret) as { [key: string]: any };
    
    return {
      userId: decoded.userId,
      email: decoded.email
    };
    
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Token inválido');
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expirado');
    }
    throw new Error('Error al verificar el token');
  }
};