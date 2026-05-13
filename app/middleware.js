import { NextResponse } from 'next/server';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  
  // Routes protégées par rôle
  const merchantRoutes = ['/dashboard/merchant'];
  const customerRoutes = ['/dashboard/customer'];
  
  // Vérifier si c'est une route protégée
  const isMerchantRoute = merchantRoutes.some(route => pathname.startsWith(route));
  const isCustomerRoute = customerRoutes.some(route => pathname.startsWith(route));
  
  if (isMerchantRoute || isCustomerRoute) {
    // Récupérer le token depuis les cookies
    const token = request.cookies.get('authToken')?.value;
    
    if (!token) {
      // Pas de token - rediriger vers login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Note: Pour une validation complète du rôle, vous devriez décoder le JWT
    // et vérifier le rôle côté serveur. Pour maintenant, la validation se fait côté client
    // dans les composants React via localStorage.
    // 
    // TODO: Ajouter la validation JWT complète :
    // 1. Importer jsonwebtoken ou un équivalent Node.js
    // 2. Décoder le token
    // 3. Vérifier user.role depuis le token
    // 4. Bloquer l'accès si role !== route (merchant access customer route, etc.)
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
