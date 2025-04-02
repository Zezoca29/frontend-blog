'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import * as dotenv from 'dotenv';
dotenv.config();


interface BlogPost {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsUrl = process.env.NEXT_PUBLIC_API_POSTS_LIST_URL;

        if (!postsUrl) {
          throw new Error('API posts list URL não está definida no ambiente.');
        }

        const response = await fetch(postsUrl);

        if (!response.ok) {
          throw new Error('Erro ao buscar posts');
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Formato de dados inválido');
        }

        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const renderContent = (text: string) => {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!backendUrl) {
      throw new Error('API base URL não está definida no ambiente.');
    }
  
    return text
      .replace(/!\[.*?\]\((.*?)\)/g, (match, p1) => {
        const imageUrl = p1.startsWith('http') ? p1 : `${backendUrl}${p1}`;
        return `<img src="${imageUrl}" alt="Imagem do post" class="w-full h-auto rounded-lg my-4" />`;
      })
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mt-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mt-2">$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-normal mt-2">$1</h4>')
      .replace(/<h1>(.*?)<\/h1>/g, '<h1 class="text-3xl font-bold mt-4">$1</h1>')
      .replace(/<h2>(.*?)<\/h2>/g, '<h2 class="text-2xl font-semibold mt-3">$1</h2>')
      .replace(/<h3>(.*?)<\/h3>/g, '<h3 class="text-xl font-medium mt-2">$1</h3>')
      .replace(/<h4>(.*?)<\/h4>/g, '<h4 class="text-lg font-normal mt-2">$1</h4>');
  };
  

  if (loading)
    return <p className="text-center text-[#3e6fc6] animate-pulse">Carregando posts...</p>;

  if (error)
    return <p className="text-center text-red-500 font-semibold">Erro: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#3e6fc6] min-h-screen">
      <div className="relative flex items-center justify-between mb-6">
        <Image src="/blog/Logo.png" alt="Logo" width={150} height={150} priority />
        <button
          onClick={() => router.back()}
          className="bg-[#7fd13f] text-white p-2 rounded-full shadow-md hover:bg-green-600"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <h1 className="text-3xl font-bold text-center mb-6 text-[#ededed]">Blog Psicopedagógico</h1>

      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="p-6 bg-white shadow-md rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-black">{post.title}</h2>
              <p className="text-[#FFD700] text-sm mb-2">
                {new Date(post.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <div className="text-black" dangerouslySetInnerHTML={{ __html: renderContent(post.content) }} />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Nenhum post disponível.</p>
        )}
      </div>
    </div>
  );
}