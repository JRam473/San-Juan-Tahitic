import { Request } from 'express';

export function buildPhotoUrl(req: Request, photoUrl: string): string {
  const apiUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
  return photoUrl.startsWith('http') ? photoUrl : `${apiUrl}${photoUrl}`;
}
