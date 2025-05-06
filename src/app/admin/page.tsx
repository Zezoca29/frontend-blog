'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import {
  FiBold, FiItalic, FiType, FiCopy, FiChevronDown, FiEdit, FiTrash,
  FiImage, FiLink, FiList, FiAlignLeft, FiAlignCenter, FiAlignRight,
  FiX, FiPlusCircle, FiSearch, FiRefreshCw, FiGrid, FiMenu
} from "react-icons/fi";
import TextAlign from '@tiptap/extension-text-align';
import { useRouter } from 'next/navigation';

const API_POSTS_LIST_URL = process.env.NEXT_PUBLIC_API_POSTS_LIST_URL ?? (() => { throw new Error("NEXT_PUBLIC_API_POSTS_LIST_URL não está definida."); })();
const API_UPLOAD_IMAGE_URL = process.env.NEXT_PUBLIC_API_UPLOAD_IMAGE_URL ?? (() => { throw new Error("NEXT_PUBLIC_API_UPLOAD_IMAGE_URL não está definida."); })();
const API_CREATE_POST_URL = process.env.NEXT_PUBLIC_API_CREATE_POST_URL ?? (() => { throw new Error("NEXT_PUBLIC_API_CREATE_POST_URL não está definida."); })();
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? (() => { throw new Error("NEXT_PUBLIC_API_BASE_URL não está definida."); })();

interface Post {
  id: number;
  title: string;
  content: string;
  created_at?: string;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const headingLevels: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];
  // Removed unused selectedHeadingLevel state
  const [showHeadingOptions, setShowHeadingOptions] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  // Verificação do token no localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login'); // Redireciona para o login caso o token não exista
    }
  }, [router]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '<p>Escreva aqui...</p>',
  });

  useEffect(() => {
    // Add any side effects or logic here if needed
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(API_POSTS_LIST_URL, {
          headers: token ? { Authorization: `Token ${token}` } : {},
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Erro ao carregar posts.');
        setPosts(await response.json());
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error('Erro desconhecido');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result?.toString();

      try {
        const response = await fetch(API_UPLOAD_IMAGE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image, file_name: file.name }),
        });

        const data = await response.json();
        if (response.ok) {
          const imageTag = `<img src="${data.image_url}" alt="Imagem" />`;
          editor?.chain().focus().insertContent(imageTag).run();
        } else {
          showNotification('Erro ao enviar imagem', 'error');
        }
      } catch (error) {
        console.error('Erro ao enviar imagem:', error);
        showNotification('Erro ao enviar imagem', 'error');
      }
    };
  };

  const handleCreateOrUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    const postData = JSON.stringify({ title, content: editor.getHTML() });

    try {
      let response;
      let updatedPost: Post;

      if (editingPostId) {
        response = await fetch(`${API_BASE_URL}/api/posts/${editingPostId}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: postData,
        });

        if (!response.ok) throw new Error('Erro ao editar post.');
        updatedPost = await response.json();

        setPosts(posts.map((post) => (post.id === editingPostId ? updatedPost : post)));
        setEditingPostId(null);
        setIsEditing(false);
        showNotification('Post atualizado com sucesso!', 'success');
      } else {
        response = await fetch(API_CREATE_POST_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: postData,
        });

        if (!response.ok) throw new Error('Erro ao criar post.');
        updatedPost = await response.json();

        setPosts([...posts, updatedPost]);
        showNotification('Post criado com sucesso!', 'success');
      }

      setTitle('');
      editor.commands.clearContent();
    } catch (err) {
      console.error(err);
      showNotification('Houve um erro. Tente novamente.', 'error');
    }
  };

  const handleEditPost = (post: Post) => {
    setTitle(post.title);
    editor?.commands.setContent(post.content);
    setEditingPostId(post.id);
    setIsEditing(true);
  };

  const handleDeletePost = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este post?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}/`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao excluir post.');
      setPosts(posts.filter(post => post.id !== id));
      showNotification('Post excluído com sucesso!', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Erro ao excluir post.', 'error');
    }
  };

  const setLink = () => {
    if (!linkUrl) return;
    
    editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    setShowLinkInput(false);
    setLinkUrl('');
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 p-4 rounded-lg text-white ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } shadow-lg z-50 transition-all duration-300 transform translate-y-0`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('translate-y-full', 'opacity-0');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-indigo-900 text-white ${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 fixed h-full z-20 shadow-lg`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-white">Painel Admin</h1>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 rounded-full hover:bg-indigo-800 transition-all"
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
        
        <nav className="mt-8">
          <ul>
            <li>
              <button 
                onClick={() => setIsEditing(true)} 
                className="flex items-center gap-3 w-full p-4 hover:bg-indigo-800 transition-colors"
              >
                <FiPlusCircle />
                {sidebarOpen && <span>Novo Post</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => {}} 
                className="flex items-center gap-3 w-full p-4 hover:bg-indigo-800 transition-colors"
              >
                <FiRefreshCw />
                {sidebarOpen && <span>Atualizar</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold text-indigo-900">Gerenciador de Conteúdo</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Buscar posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex border rounded-md overflow-hidden">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-500'}`}
                >
                  <FiMenu />
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-500'}`}
                >
                  <FiGrid />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto">
          {/* Renderiza o editor apenas se estiver editando */}
          {isEditing && editor && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
              <form
                onSubmit={handleCreateOrUpdatePost}
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
              >
                <div className="sticky top-0 bg-gradient-to-r from-indigo-700 to-purple-600 text-white px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">{editingPostId ? "Editar Post" : "Criar Novo Post"}</h2>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-auto p-6">
                  <input
                    type="text"
                    className="w-full px-4 py-3 text-lg border-b-2 border-indigo-200 focus:border-indigo-500 transition-colors focus:outline-none font-bold"
                    placeholder="Título do Post"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />

                  {/* Barra de ferramentas */}
                  <div className="flex flex-wrap gap-1 mt-6 p-2 bg-gray-50 rounded-lg text-gray-700 border border-gray-200">
                    <button 
                      type="button" 
                      onClick={() => editor?.chain().focus().toggleBold().run()} 
                      className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive('bold') ? 'bg-indigo-100 text-indigo-700' : ''}`}
                    >
                      <FiBold size={18} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => editor?.chain().focus().toggleItalic().run()} 
                      className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive('italic') ? 'bg-indigo-100 text-indigo-700' : ''}`}
                    >
                      <FiItalic size={18} />
                    </button>
                    
                    {/* Botão Dropdown para Títulos */}
                    <div className="relative">
                      <button
                        type="button"
                        className={`p-2 rounded hover:bg-gray-200 flex items-center gap-1 ${
                          editor?.isActive('heading') ? 'bg-indigo-100 text-indigo-700' : ''
                        }`}
                        onClick={() => setShowHeadingOptions((prev) => !prev)}
                        aria-expanded={showHeadingOptions}
                      >
                        <FiType size={18} />
                        <FiChevronDown size={14} />
                      </button>

                      {showHeadingOptions && (
                        <div className="absolute top-full left-0 mt-1 bg-white shadow-lg border rounded-lg z-10 w-24">
                          {headingLevels.map((level) => (
                            <button
                              key={level}
                              type="button"
                              className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                                editor?.isActive('heading', { level }) ? 'bg-indigo-50 text-indigo-700 font-medium' : ''
                              }`}
                              onClick={() => {
                                editor?.chain().focus().toggleHeading({ level }).run();
                                setShowHeadingOptions(false);
                                setShowHeadingOptions(false);
                              }}
                            >
                              H{level}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="h-6 w-px bg-gray-300 mx-1"></div>

                    {/* Alinhamento */}
                    <button 
                      type="button" 
                      onClick={() => editor?.chain().focus().setTextAlign('left').run()} 
                      className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive({ textAlign: 'left' }) ? 'bg-indigo-100 text-indigo-700' : ''}`}
                    >
                      <FiAlignLeft size={18} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => editor?.chain().focus().setTextAlign('center').run()} 
                      className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive({ textAlign: 'center' }) ? 'bg-indigo-100 text-indigo-700' : ''}`}
                    >
                      <FiAlignCenter size={18} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => editor?.chain().focus().setTextAlign('right').run()} 
                      className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive({ textAlign: 'right' }) ? 'bg-indigo-100 text-indigo-700' : ''}`}
                    >
                      <FiAlignRight size={18} />
                    </button>

                    <div className="h-6 w-px bg-gray-300 mx-1"></div>

                    {/* Listas */}
                    <button 
                      type="button" 
                      onClick={() => editor?.chain().focus().toggleBulletList().run()} 
                      className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive('bulletList') ? 'bg-indigo-100 text-indigo-700' : ''}`}
                    >
                      <FiList size={18} />
                    </button>

                    <div className="h-6 w-px bg-gray-300 mx-1"></div>

                    {/* Imagem e Link */}
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()} 
                      className="p-2 rounded hover:bg-gray-200"
                    >
                      <FiImage size={18} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowLinkInput(!showLinkInput)} 
                      className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive('link') ? 'bg-indigo-100 text-indigo-700' : ''}`}
                    >
                      <FiLink size={18} />
                    </button>

                    {/* Botão de Copiar */}
                    <button
                      type="button"
                      onClick={() => {
                        if (editor) {
                          navigator.clipboard.writeText(editor.getText());
                          showNotification('Texto copiado para a área de transferência', 'success');
                        }
                      }}
                      className="p-2 rounded hover:bg-gray-200 ml-auto"
                    >
                      <FiCopy size={18} />
                    </button>
                  </div>

                  {/* Input de URL para links */}
                  {showLinkInput && (
                    <div className="flex mt-2 gap-2">
                      <input
                        type="url"
                        placeholder="https://exemplo.com"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={setLink}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                      >
                        Aplicar
                      </button>
                    </div>
                  )}

                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  
                  <div className="mt-4 border rounded-lg overflow-hidden">
                    <EditorContent 
                      editor={editor} 
                      className="prose max-w-none p-4 min-h-[300px] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end gap-3">
                  <button 
                    type="button" 
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:opacity-90 transition-opacity"
                  >
                    {editingPostId ? 'Atualizar Post' : 'Publicar Post'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Posts Card View */}
          {!isEditing && !isLoading && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Seus Posts</h2>
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity shadow-md"
                >
                  <FiPlusCircle />
                  <span>Novo Post</span>
                </button>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-500 text-lg">Nenhum post encontrado. Comece criando um novo!</p>
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Criar Post
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {filteredPosts.map((post) => (
                    <div 
                      key={post.id} 
                      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      <div className={`bg-gradient-to-r from-indigo-600 to-purple-600 ${viewMode === 'list' ? 'w-2' : 'h-2'}`}></div>
                      <div className="p-5 flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => handleEditPost(post)} 
                              className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors"
                              title="Editar"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeletePost(post.id)} 
                              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                              title="Excluir"
                            >
                              <FiTrash size={18} />
                            </button>
                          </div>
                        </div>
                        
                        {viewMode === 'list' ? (
                          <div className="text-gray-600 line-clamp-2 text-sm" dangerouslySetInnerHTML={{ __html: post.content }}></div>
                        ) : (
                          <div className="text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: post.content }}></div>
                        )}
                        
                        {post.created_at && (
                          <div className="mt-4 text-xs text-gray-400">
                            {new Date(post.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}