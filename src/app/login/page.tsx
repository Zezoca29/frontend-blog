'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import * as dotenv from 'dotenv';
dotenv.config();


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_LOGIN_URL;
    if (!baseUrl) {
      throw new Error('API base URL não está definida no ambiente.');
    }
    
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',  // Usa cookies de sessão
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas. Tente novamente.');
      }

      // Obtém o token da resposta JSON
      const data = await response.json();
      const token = data.token;  // Assumindo que o token esteja no campo 'token' da resposta

      if (token) {
        // Armazena o token no localStorage para futuras requisições
        localStorage.setItem('authToken', token);

        // Define um cookie seguro com o token
        document.cookie = `authToken=${token}; path=/; secure; SameSite=Strict`;

        // Redireciona para /admin após login bem-sucedido
        router.push('/admin');
      } else {
        throw new Error('Erro ao obter o token.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => router.push('/')} className="text-gray-700 hover:text-gray-900 flex items-center">
            <ArrowLeft className="w-5 h-5 mr-2" /> Voltar para Home
          </button>
        </div>
        <div className="flex justify-center mb-4">
          <Image src="/blog/logo2.png" alt="Logo" width={150} height={150} />
        </div>
        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Senha</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-lg shadow-md hover:bg-pink-600 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}