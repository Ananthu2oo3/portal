// src/app/auth/auth.interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';

/**
 * AuthInterceptor adds the Authorization header with Bearer token
 * to outgoing HTTP requests if a token is found in localStorage.
 */
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
