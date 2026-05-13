import { NextResponse } from 'next/server';

export function middleware(request) {
  // Le middleware n'utilise pas le token car nous utilisons localStorage (côté client)
  // La vérification d'authentification et les redirections sont gérées côté client
  // via les hooks useAuth() et les composants (useEffect)
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
