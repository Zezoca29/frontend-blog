'use client';
import { JSX, useEffect, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import * as dotenv from 'dotenv';
import { 
  Search, 
  X, 
  Heart, 
  Calendar, 
  Clock, 
  Plus, 
  Loader, 
  Bookmark, 
  BookOpen,
  User,
  Linkedin,
  Instagram,
  Youtube,
  Quote,
  Share2,
} from 'lucide-react';

dotenv.config();

interface BlogPost {
  id: number;
  title: string;
  created_at: string;
  updated_at?: string;
  slug?: string;
  excerpt?: string;
  content?: string; // Adicionamos o campo content
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: JSX.Element;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likedPosts, setLikedPosts] = useState<{[key: number]: boolean}>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const postsPerPage = 6;
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Função para lidar com o clique no card
  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
    // Desabilitar scroll do body quando modal estiver aberto
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  // Função para fechar o modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    // Habilitar scroll do body novamente
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  };

  // Exemplo de categorias
  const categories: Category[] = [
    { id: 1, name: 'Desenvolvimento Infantil', slug: 'desenvolvimento-infantil', icon: <BookOpen size={16} /> },
    { id: 2, name: 'Aprendizagem', slug: 'aprendizagem', icon: <BookOpen size={16} /> },
    { id: 3, name: 'Educação Inclusiva', slug: 'educacao-inclusiva', icon: <BookOpen size={16} /> },
    { id: 4, name: 'Orientação aos Pais', slug: 'orientacao-pais', icon: <BookOpen size={16} /> }
  ];

  // Exemplo de comentários
  const comments: Comment[] = [
    { id: 1, author: 'Maria Silva', content: 'Excelente artigo! As dicas foram muito úteis para aplicar com meu filho.', date: '12 de março, 2025' },
    { id: 2, author: 'João Torres', content: 'Como professor, encontrei várias estratégias que posso usar em sala de aula. Obrigado!', date: '10 de março, 2025' }
  ];

  // Exemplo de depoimentos
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!backendUrl) {
    throw new Error('API base URL não está definida no ambiente.');
  }

  // Removed duplicate declaration of testimonials
  const testimonials: Testimonial[] = [
    { 
      name: 'Carolina Mendes', 
      role: 'Mãe de Pedro, 8 anos', 
      content: 'Os artigos deste blog nos ajudaram a entender melhor as dificuldades do nosso filho e a trabalhar em conjunto com a escola para seu desenvolvimento.' 
    },
    { 
      name: 'Prof. Rafael Almeida', 
      role: 'Educador', 
      content: 'Como professor, encontro aqui conteúdo de qualidade e embasado que me ajuda a melhorar minha prática em sala de aula.' 
    }
  ];

  const mockContent = `
    <p>A dislexia é um transtorno específico de aprendizagem que afeta a capacidade de leitura e compreensão de textos. É importante entender que pessoas com dislexia não têm déficit de inteligência — na verdade, muitas são extremamente criativas e talentosas em diversas áreas.</p>
    
    <h3>Como identificar sinais de dislexia</h3>
    
    <p>Os sinais da dislexia podem aparecer desde cedo no desenvolvimento infantil, mesmo antes da alfabetização formal. Alguns indicadores incluem:</p>
    
    <ul>
      <li>Dificuldade em aprender rimas e sequências (dias da semana, meses do ano)</li>
      <li>Confusão entre letras com sons similares (b/d, p/q)</li>
      <li>Lentidão na aquisição da leitura comparada aos colegas</li>
      <li>Dificuldade em organizar ideias na escrita</li>
      <li>Resistência a atividades que envolvam leitura</li>
    </ul>
    
    <h3>Estratégias de intervenção</h3>
    
    <p>A intervenção precoce faz toda a diferença no desenvolvimento acadêmico da criança com dislexia. Algumas estratégias eficazes são:</p>
    
    <ol>
      <li><strong>Método fônico:</strong> trabalhar sistematicamente a relação entre sons e letras</li>
      <li><strong>Multissensorialidade:</strong> usar diferentes canais sensoriais para fixar o aprendizado</li>
      <li><strong>Tecnologia assistiva:</strong> utilizar recursos como leitores de texto e corretores ortográficos</li>
      <li><strong>Adaptações escolares:</strong> tempo adicional em avaliações, materiais adaptados</li>
    </ol>
    
    <p>Vale ressaltar que cada criança com dislexia é única e precisa de um planejamento individualizado que considere suas necessidades específicas.</p>
  `;

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

        // Adicionando slugs aos posts para demonstração e conteúdo mockado
        const postsWithSlugs = data.map(post => ({
          ...post,
          slug: generateSlug(post.title),
          excerpt: stripMarkdown(post.content || mockContent).substring(0, 160),
          content: post.content || mockContent // Adicionando conteúdo mockado para demonstração
        }));

        setPosts(postsWithSlugs);
        setHasMore(postsWithSlugs.length > postsPerPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  const stripMarkdown = (text: string): string => {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '$1')
      .replace(/#{1,6}\s?/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1');
  };

  const extractTags = (): string[] => {
      // Esta é uma função de exemplo para extrair tags de um conteúdo
      // Na implementação real, você poderia ter as tags como parte do modelo de dados
      const commonTags = ['desenvolvimento', 'aprendizagem', 'inclusão', 'educação'];
      const randomTags: string[] = [];
    
    // Seleciona de 1 a 3 tags aleatórias para este exemplo
    const numTags = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numTags; i++) {
      const randomIndex = Math.floor(Math.random() * commonTags.length);
      if (!randomTags.includes(commonTags[randomIndex])) {
        randomTags.push(commonTags[randomIndex]);
      }
    }
    
    return randomTags;
  };

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const loadMorePosts = () => {
    // Simulando carregamento de mais posts
    setLoading(true);
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      // Se chegarmos ao final, desativamos o botão de carregar mais
      if (currentPage >= totalPages - 1) {
        setHasMore(false);
      }
      setLoading(false);
    }, 800);
  };

  const filteredPosts = activeCategory 
    ? posts.filter(() => categories.find(cat => cat.id === activeCategory)?.name.toLowerCase() || '')
    : posts;

  const paginatedPosts = filteredPosts.slice(0, currentPage * postsPerPage);

  if (loading && currentPage === 1)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3e6fc6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#3e6fc6] font-medium">Carregando posts...</p>
        </div>
      </div>
    );

  if (error && currentPage === 1)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <X size={32} />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Erro ao carregar</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#3e6fc6] hover:bg-[#325aa8] text-white px-4 py-2 rounded-lg transition"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );

  return (
    <>
      {/* Estilos para o header e componentes */}
      <style jsx global>{`
        .text-xl {
            color: blue;
        }
        .header {
          background-color: #3e6fc6;
          padding: 1rem 0;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .logo-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .logo-text {
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
        }
        .nav-links {
          display: flex;
          gap: 2rem;
        }
        .nav-link {
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .nav-link:hover {
          color: #7fd13f;
        }
        .hamburger {
          display: none;
          flex-direction: column;
          cursor: pointer;
          background: none;
          border: none;
          padding: 5px;
        }
        .hamburger span {
          width: 25px;
          height: 3px;
          background-color: white;
          margin: 3px 0;
          border-radius: 3px;
          transition: all 0.3s ease;
        }
        .mobile-menu {
          position: absolute;
          right: 0;
          top: 100%;
          background-color: #3e6fc6;
          width: 100%;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-in-out;
          z-index: 1000;
          border-radius: 0 0 10px 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        .mobile-menu.open {
          max-height: 300px;
        }
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          padding: 1rem;
        }
        .mobile-nav-link {
          color: white;
          text-decoration: none;
          font-weight: 500;
          padding: 0.8rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        .mobile-nav-link:last-child {
          border-bottom: none;
        }
        .mobile-nav-link:hover {
          color: #7fd13f;
        }
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          .hamburger {
            display: flex;
          }
        }
        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2rem;
          }
          .section-title {
            font-size: 1.5rem;
          }
          .nav-links {
            display: none;
          }
          .hamburger {
            display: flex;
          }
          .post-card {
            max-width: 400px;
            margin: 0 auto;
          }

          .logo-text {
            font-size: 1rem;
          }
          .logo-container img {
            max-width: 80px;
            height: auto;
          }
        }
        .logo-container img {
          max-height: 40px;
          width: auto;
          transition: all 0.3s ease;
        }
        @media (max-width: 480px) {
          .logo-text {
            font-size: 1rem;
          }
          .logo-container img {
            max-width: 60px;
          }
        }
        .menu-button {
          display: none;
          align-items: center;
          gap: 0.5rem;
          background-color: var(--secondary);
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .menu-button:hover {
          background-color: #6dbc30;
        }
        .menu-button .hamburger {
          display: flex;
          margin-left: 0.3rem;
        }
        .menu-button .hamburger span {
          width: 18px;
          height: 2px;
          background-color: white;
          margin: 2px 0;
        }
        .menu-text {
          font-size: 0.9rem;
        }
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          .menu-button {
            display: flex;
          }
          .text-sm {
            font-size: 10px;
          }
        }
        
        /* Estilos para o modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 20px;
          overflow-y: auto;
        }
        .modal-content {
          background-color: white;
          border-radius: 12px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          position: relative;
          animation: modalFadeIn 0.3s ease-out;
        }
        .modal-header {
          position: sticky;
          top: 0;
          background-color: white;
          padding: 16px 24px;
          border-bottom: 1px solid #eaeaea;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1;
        }
        .modal-body {
          padding: 24px;
        }
        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }
        .modal-close:hover {
          background-color: #f5f5f5;
        }
        .article-content {
          line-height: 1.7;
        }
        .article-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: #333;
        }
        .article-content p {
          margin-bottom: 1rem;
          color: #444;
        }
        .article-content ul, .article-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .article-content li {
          margin-bottom: 0.5rem;
        }
        .article-content strong {
          font-weight: 600;
          color: #333;
        }
        
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <Head>
        <title>Blog Psicopedagógico | Insights para Desenvolvimento e Aprendizagem</title>
        <meta name="description" content="Descubra estratégias inovadoras para promover o desenvolvimento integral na infância e adolescência." />
        <meta property="og:title" content="Blog Psicopedagógico | Insights para Desenvolvimento e Aprendizagem" />
        <meta property="og:description" content="Descubra estratégias inovadoras para promover o desenvolvimento integral na infância e adolescência." />
        <meta property="og:image" content="/blog/og-image.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="/blog" />
      </Head>

      {/* Header */}
      <header className="header">
        <div className="nav-container">
          <div className="logo-container">
            <img src="/blog/Logo_LR_negativo.svg" alt="Logo" />
            <span className="logo-text">Blog Psicopedagógico</span>
          </div>
          <nav className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/blog" className="nav-link">Blog</Link>
            <Link href="/sobre" className="nav-link">Sobre Mim</Link>
            <Link href="/login" className="nav-link">Login</Link>
          </nav>
          <button className="hamburger" onClick={() => setIsMenuOpen(true)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute right-0 top-0 h-full w-64 bg-white shadow-xl transition-transform transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <Image src="/blog/Logo.png" alt="Logo" width={100} height={30} />
              <button onClick={() => setIsMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <Link 
                href="/"
                className="block text-lg font-medium text-gray-800 hover:text-[#3e6fc6]" 
              >
                Home
              </Link>
              <Link 
                href="/blog"
                className="block text-lg font-medium text-gray-800 hover:text-[#3e6fc6]" 
              >
                Blog
              </Link>
              <Link 
                href="/sobre"
                className="block text-lg font-medium text-gray-800 hover:text-[#3e6fc6]" 
              >
                Sobre Mim
              </Link>
              <Link 
                href="/login"
                className="block text-lg font-medium text-gray-800 hover:text-[#3e6fc6]" 
              >
                Login
              </Link>
            </div>
            
            <div className="mt-8 pt-8 border-t">
              <div className="relative">
                <input type="text" placeholder="Pesquisar..." className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm" />
                <Search size={16} className="absolute top-3 left-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-gray-50 min-h-screen">
        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Banner Principal */}
          <div className="relative rounded-xl overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-[#3e6fc6]/80 to-[#7fd13f]/60 z-10"></div>
            <Image 
              src="/blog/logo2.png" 
              alt="Desenvolvimento infantil e aprendizagem" 
              width={1200} 
              height={400} 
              className="object-cover w-full h-64 md:h-80"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">Transformando Desafios em Potencial</h1>
              <p className="text-white text-sm md:text-base mb-6 max-w-lg">Descubra estratégias inovadoras para promover o desenvolvimento integral na infância e adolescência</p>
              <button className="bg-[#7fd13f] hover:bg-[#6ac02e] text-white px-6 py-2 rounded-full transition w-fit">
                Explorar Artigos
              </button>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-8" id="articles-section">
                <button 
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium 
                            ${activeCategory === null 
                              ? 'bg-[#3e6fc6] text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setActiveCategory(null)}
                >
                  Todos
                </button>
                {categories.map(cat => (
                  <button key={cat.id} 
                          className={`flex items-center px-4 py-2 rounded-full text-sm font-medium 
                                    ${activeCategory === cat.id 
                                      ? 'bg-[#3e6fc6] text-white' 
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          onClick={() => setActiveCategory(cat.id)}>
                    {cat.icon}
                    <span className="ml-1">{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedPosts.length > 0 ? (
                  paginatedPosts.map((post) => (
                    <div 
                      key={post.id} 
                      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
                      onClick={() => handlePostClick(post)}
                    >
                      <div className="relative h-48">
                        <Image 
                          src="/blog/imagem 2.jpg" 
                          alt={post.title} 
                          fill 
                          className="object-cover" 
                        />
                        <div className="absolute top-0 right-0 m-2 px-2 py-1 text-xs bg-[#f9d56e] text-gray-800 rounded-full">
                          Nova perspectiva
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <div className="flex items-center text-xs text-gray-500 mb-3">
                          <Calendar size={14} className="mr-1" />
                          <span>
                            {new Date(post.created_at).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="mx-2">•</span>
                          <Clock size={14} className="mr-1" />
                          <span>7 min de leitura</span>
                        </div>
                        
                        <h2 className="font-semibold text-xl mb-2 line-clamp-2">{post.title}</h2>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            {extractTags().map(tag => (
                              <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              className="text-gray-400 hover:text-red-500 transition"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(post.id);
                              }}
                            >
                              <Heart size={18} className={likedPosts[post.id] ? "fill-red-500 text-red-500" : ""} />
                            </button>
                            <button 
                              className="text-gray-400 hover:text-[#3e6fc6] transition"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Bookmark size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-gray-500">Nenhum post disponível para esta categoria.</p>
                  </div>
                )}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-8">
                  <button 
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg inline-flex items-center"
                    onClick={loadMorePosts}
                    disabled={loading && currentPage > 1}
                  >
                    {loading && currentPage > 1 ? (
                      <Loader size={20} className="animate-spin mr-2" />
                    ) : (
                      <Plus size={20} className="mr-2" />
                    )}
                    Carregar mais artigos
                  </button>
                </div>
              )}

              {/* Newsletter Banner */}
              <div className="bg-gradient-to-r from-[#3e6fc6]/10 to-[#7fd13f]/10 p-6 rounded-xl my-12">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                    <h3 className="text-xl font-semibold mb-2">Receba Conteúdo Exclusivo</h3>
                    <p className="text-gray-600">
                      Inscreva-se para receber dicas práticas, atividades e os últimos artigos sobre desenvolvimento infantil.
                    </p>
                  </div>
                  <div className="md:w-1/3">
                    <div className="flex">
                      <input 
                        type="email" 
                        placeholder="Digite seu e-mail" 
                        className="px-3 py-3 rounded-l-lg w-full border-y border-l focus:outline-none focus:ring-1 focus:ring-[#3e6fc6]"
                      />
                      <button className="bg-[#3e6fc6] hover:bg-[#325aa8] text-white px-4 py-2 rounded-r-lg transition">
                        Inscrever
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Prometemos não enviar spam. Você pode cancelar a qualquer momento.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-8">
              {/* Author Profile */}
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="relative h-32 bg-gradient-to-r from-[#3e6fc6] to-[#7fd13f]">
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                    <div className="rounded-full border-4 border-white overflow-hidden">
                      <Image 
                        src="/blog/logo2.png" 
                        alt="Lidiane" 
                        width={104} 
                        height={104} 
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-20 pb-6 px-6 text-center">
                  <h3 className="font-semibold text-xl mb-1">Dra. Lidiane</h3>
                  <p className="text-[#3e6fc6] text-sm mb-3">Psicopedagoga • Mestre em Educação</p>
                  <p className="text-gray-600 text-sm mb-4">
                    Transformando vidas através do conhecimento e intervenções psicopedagógicas.
                  </p>
                  <div className="flex justify-center space-x-3">
                    <a className="text-gray-600 hover:text-[#3e6fc6]">
                      <Linkedin size={18} />
                    </a>
                    <a href="https://www.instagram.com/lr_espaco_pedagogico/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#3e6fc6]">
                      <Instagram size={18} />
                    </a>
                    <a className="text-gray-600 hover:text-[#3e6fc6]">
                      <Youtube size={18} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Popular Topics */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-4">Tópicos Populares</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition cursor-pointer">Dislexia</span>
                  <span className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition cursor-pointer">TDAH</span>
                  <span className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition cursor-pointer">Alfabetização</span>
                  <span className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition cursor-pointer">Educação Inclusiva</span>
                  <span className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition cursor-pointer">Desenvolvimento Cognitivo</span>
                  <span className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition cursor-pointer">Rotinas de Estudo</span>
                  <span className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition cursor-pointer">Tecnologia na Educação</span>
                </div>
              </div>
              {/* Featured Resources */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-4">Recursos em Destaque</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-[#3e6fc6]/10 rounded flex items-center justify-center mr-4">
                      <BookOpen size={24} className="text-[#3e6fc6]" />
                    </div>
                    <div>
                      <h4 className="font-medium">E-book Gratuito</h4>
                      <p className="text-xs text-gray-500">Guia de Estimulação Cognitiva para Crianças</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-[#7fd13f]/10 rounded flex items-center justify-center mr-4">
                      <BookOpen size={24} className="text-[#7fd13f]" />
                    </div>
                    <div>
                      <h4 className="font-medium">Webinar</h4>
                      <p className="text-xs text-gray-500">Desafios do TDAH na Escola</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-[#f9d56e]/10 rounded flex items-center justify-center mr-4">
                      <BookOpen size={24} className="text-[#f9d56e]" />
                    </div>
                    <div>
                      <h4 className="font-medium">Kit de Atividades</h4>
                      <p className="text-xs text-gray-500">10 Jogos para Alfabetização</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-4">O Que Dizem Sobre Nós</h3>
                <div className="relative">
                  <div className="absolute -top-1 left-0 text-[#3e6fc6] rotate-180">
                    <Quote size={32} />
                  </div>
                  <div className="absolute -top-1 left-0 text-[#3e6fc6] rotate-180">
                    <Quote size={32} />
                  </div>
                  
                  <div className="pt-4 pb-2 px-2">
                    <p className="italic text-gray-600 mb-4">
                      {testimonials[0].content}
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <Image 
                          src="/api/placeholder/40/40" 
                          alt={testimonials[0].name} 
                          width={40} 
                          height={40} 
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{testimonials[0].name}</h4>
                        <p className="text-xs text-gray-500">{testimonials[0].role}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 right-0 text-[#3e6fc6]">
                    <Quote size={32} />
                  </div>
                </div>
              </div>
              
              {/* Recent Comments */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-4">Comentários Recentes</h3>
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-gray-200 flex items-center justify-center">
                          <User size={16} className="text-gray-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{comment.author}</h4>
                          <p className="text-xs text-gray-500">{comment.date}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="bg-gradient-to-r from-[#3e6fc6] to-[#7fd13f] p-6 rounded-lg text-white">
                <h3 className="font-semibold text-lg mb-2">Precisa de Suporte Especializado?</h3>
                <p className="text-white/90 text-sm mb-4">
                  Nossa equipe está à disposição para auxiliar no desenvolvimento de crianças e adolescentes.
                </p>
                <button className="bg-white text-[#3e6fc6] hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition w-full">
                  Agende uma Consulta
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <Image src="/blog/Logo.png" alt="Logo" width={120} height={40} className="mb-4" />
                <p className="text-gray-600 text-sm mb-4">
                  Transformando vidas através do conhecimento e intervenção psicopedagógica.
                </p>
                <div className="flex space-x-4">
                  <a className="text-gray-400 hover:text-[#3e6fc6]">
                    <Linkedin size={20} />
                  </a>
                    <a 
                    href="https://www.instagram.com/lr_espaco_pedagogico/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-[#3e6fc6]"
                    >
                    <Instagram size={20} />
                    </a>
                  <a className="text-gray-400 hover:text-[#3e6fc6]">
                    <Youtube size={20} />
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Navegação</h4>
                <ul className="space-y-2">
                  <li><a className="text-gray-600 hover:text-[#3e6fc6] text-sm">Início</a></li>
                  <li><a className="text-gray-600 hover:text-[#3e6fc6] text-sm">Artigos</a></li>
                  <li><a className="text-gray-600 hover:text-[#3e6fc6] text-sm">Recursos</a></li>
                  <li><a className="text-gray-600 hover:text-[#3e6fc6] text-sm">Sobre</a></li>
                  <li><a className="text-gray-600 hover:text-[#3e6fc6] text-sm">Contato</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Categorias</h4>
                <ul className="space-y-2">
                  {categories.map(cat => (
                    <li key={cat.id}>
                      <a className="text-gray-600 hover:text-[#3e6fc6] text-sm">{cat.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Contato</h4>
                <ul className="space-y-2">
                  <li className="text-gray-600 text-sm">lidiane@psicopedagogia.com.br</li>
                  <li className="text-gray-600 text-sm">(11) 95882-2954</li>
                  <li className="text-gray-600 text-sm">São Paulo, SP</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} Blog Psicopedagógico. Todos os direitos reservados.
              </p>
              <div className="flex space-x-4">
                <a className="text-gray-500 hover:text-[#3e6fc6] text-sm">Política de Privacidade</a>
                <a className="text-gray-500 hover:text-[#3e6fc6] text-sm">Termos de Uso</a>
              </div>
            </div>
          </div>
        </footer>

        {/* Modal de Artigo */}
{isModalOpen && selectedPost && (
  <div className="modal-overlay" onClick={closeModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <button className="modal-close" onClick={closeModal}>
          <X size={24} />
        </button>
      </div>
      <div className="modal-body">
        <h1 className="text-3xl font-bold mb-4">{selectedPost.title}</h1>
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Calendar size={16} className="mr-1" />
          <span>
            {new Date(selectedPost.created_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <span className="mx-2">•</span>
          <Clock size={16} className="mr-1" />
          <span>7 min de leitura</span>
          <div className="flex ml-auto space-x-2">
            <button className="flex items-center text-gray-500 hover:text-[#3e6fc6]">
              <Share2 size={16} className="mr-1" />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>
        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: selectedPost.content || '' }}
        />
      </div>
    </div>
  </div>
)}
      </div>
    </>
  );
}