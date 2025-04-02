'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { FiBold, FiItalic, FiType, FiCopy, FiChevronDown, FiEdit, FiTrash } from "react-icons/fi";
import { useRouter } from 'next/navigation';

const API_POSTS_LIST_URL = process.env.NEXT_PUBLIC_API_POSTS_LIST_URL ?? (() => { throw new Error("NEXT_PUBLIC_API_POSTS_LIST_URL não está definida."); })();
const API_UPLOAD_IMAGE_URL = process.env.NEXT_PUBLIC_API_UPLOAD_IMAGE_URL ?? (() => { throw new Error("NEXT_PUBLIC_API_UPLOAD_IMAGE_URL não está definida."); })();
const API_CREATE_POST_URL = process.env.NEXT_PUBLIC_API_CREATE_POST_URL ?? (() => { throw new Error("NEXT_PUBLIC_API_CREATE_POST_URL não está definida."); })();
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? (() => { throw new Error("NEXT_PUBLIC_API_BASE_URL não está definida."); })();

interface Post {
  id: number;
  title: string;
  content: string;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [editorMounted, setEditorMounted] = useState(false);
  const headingLevels: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];
  const [selectedHeadingLevel, setSelectedHeadingLevel] = useState<1 | 2 | 3 | 4>(1);
  const [showHeadingOptions, setShowHeadingOptions] = useState(false);

  // Verificação do token no localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login'); // Redireciona para o login caso o token não exista
    }
  }, [router]);


  useEffect(() => {
    setEditorMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: '<p>Escreva aqui...</p>',
  });


  useEffect(() => {
    const fetchPosts = async () => {
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
          console.error(err.message); // Agora você pode acessar `err.message` com segurança
        } else {
          console.error('Erro desconhecido');
        }
      }
    };
    fetchPosts();
  }, []);
  

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file); // Converte para Base64

    reader.onload = async () => {
      const base64Image = reader.result?.toString(); // Remove header do Base64

      try {
        const response = await fetch(API_UPLOAD_IMAGE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image, file_name: file.name }), // Envia o nome do arquivo
        });

        const data = await response.json();
        if (response.ok) {
          // Aqui, inserimos a imagem no conteúdo do editor
          const imageTag = `<img src="${data.image_url}" alt="Imagem" />`;
          editor?.chain().focus().insertContent(imageTag).run();
        } else {
          alert('Erro ao enviar imagem');
        }
      } catch (error) {
        console.error('Erro ao enviar imagem:', error);
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
      }

      setTitle('');
      editor.commands.clearContent();
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Painel de Administração</h1>
      {editorMounted ? <p>Editor montado!</p> : <p>Editor ainda não montado.</p>}
      {/* Renderiza o editor apenas se estiver editando */}
      {isEditing && editor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <form
            onSubmit={handleCreateOrUpdatePost}
            className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl max-h-[85vh] flex flex-col"
          >
            <div className="sticky top-0 bg-white pb-4 border-b z-10">
              <h2 className="text-xl font-bold">{editingPostId ? "Editar Post" : "Criar Novo Post"}</h2>
            </div>

            <div className="flex-1 overflow-auto mt-4">
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg text-black"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              {/* Barra de ferramentas */}
              <div className="flex gap-2 mt-4 text-black relative">
                <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className="btn">
                  <FiBold size={20} />
                </button>
                <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className="btn">
                  <FiItalic size={20} />
                </button>
                
                {/* Botão Dropdown para Títulos */}
                <div className="relative">
                  <button
                    type="button"
                    className="btn flex items-center gap-1"
                    onClick={() => setShowHeadingOptions((prev) => !prev)}
                    aria-expanded={showHeadingOptions}
                  >
                    <FiType size={20} className="relative top-0.5" />
                    <FiChevronDown size={16} />
                  </button>

                  {showHeadingOptions && (
                    <div className="absolute top-12 left-0 bg-white shadow-lg border rounded-lg z-10 w-24">
                      {headingLevels.map((level) => (
                        <button
                          key={level}
                          type="button"
                          className={`block w-full text-left px-4 py-2 hover:bg-gray-200 ${selectedHeadingLevel === level ? 'border-l-4 border-blue-500 font-bold' : ''
                            }`}
                          onClick={() => {
                            editor?.chain().focus().toggleHeading({ level }).run();
                            setSelectedHeadingLevel(level);
                            setShowHeadingOptions(false);
                          }}
                        >
                          H{level}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botão para Mostrar o Nível Selecionado */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHeadingLevel((prev) => {
                      const newLevel: 1 | 2 | 3 | 4 = prev < 4 ? (prev + 1 as 1 | 2 | 3 | 4) : 1;
                      editor?.chain().focus().toggleHeading({ level: newLevel }).run();
                      return newLevel;
                    });
                  }}
                  className={`btn px-4 py-2 border-l-4 ${selectedHeadingLevel === 1 ? 'border-blue-500' :
                      selectedHeadingLevel === 2 ? 'border-green-500' :
                        selectedHeadingLevel === 3 ? 'border-yellow-500' :
                          'border-red-500'
                    }`}
                >
                  H{selectedHeadingLevel}
                </button>



                {/* Botão de Copiar */}
                <button
                  type="button"
                  onClick={() => {
                    if (editor) {
                      navigator.clipboard.writeText(editor.getText());
                    }
                  }}
                  className="btn"
                >
                  <FiCopy size={20} />
                </button>
              </div>

              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              <EditorContent editor={editor} className="border p-2 min-h-[200px] mt-4 text-black" />
            </div>

            <div className="sticky bottom-0 bg-white pt-4 border-t">
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">
                Salvar
              </button>
              <button type="button" className="w-full bg-gray-500 text-white py-2 rounded-lg mt-2" onClick={() => setIsEditing(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {!isEditing && (
        <button onClick={() => setIsEditing(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg mb-4">
          Criar Novo Post
        </button>
      )}

      {/* Lista de Posts Criados */}
      <div className="w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-4 text-black">Posts Criados</h2>
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-md mb-4 text-black">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-black">{post.title}</h3>
              <div className="flex gap-2">
                <button onClick={() => handleEditPost(post)} className="text-blue-500">
                  <FiEdit size={20} />
                </button>
                <button onClick={() => handleDeletePost(post.id)} className="text-red-500">
                  <FiTrash size={20} />
                </button>
              </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        ))}
      </div>
    </div>
  );
}