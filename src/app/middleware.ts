import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Verifica o token no cookie 'authToken' (você pode ajustar o nome do cookie se necessário)
  const authToken = req.cookies.get('authToken')?.value;

  // Protege a rota /admin
  if (req.nextUrl.pathname.startsWith('/admin') && !authToken) {
    // Se não houver token, redireciona para a página de login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// Define as rotas que o middleware deve monitorar
export const config = {
  matcher: ['/admin/:path*'],  // Aplica o middleware para todas as rotas dentro de /admin
};
