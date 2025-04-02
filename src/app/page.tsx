"use client";

import { useRouter } from "next/navigation";
import { Instagram, MessageCircle } from "lucide-react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cabeçalho */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push("/")}>
            <Image src="/blog/Logo.png" alt="Logo" width={100} height={80} priority />
            <h1 className="text-2xl font-bold">Blog Psicopedagógico</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li className="cursor-pointer hover:underline" onClick={() => router.push("/")}>Home</li>
              <li className="cursor-pointer hover:underline" onClick={() => router.push("/blog")}>Blog</li>
              <li className="cursor-pointer hover:underline" onClick={() => router.push("/login")}>Login</li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Seção de Destaque */}
      <section className="text-center py-16 px-4 bg-white">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">
        Apoio no desenvolvimento infantil e inclusão
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          No <strong>Blog Psicopedagógico</strong>, oferecemos recursos valiosos para pais, educadores e terapeutas que desejam melhorar o desenvolvimento infantil. Aqui, você encontrará <strong>atividades estruturadas</strong>, <strong>materiais gratuitos</strong> e <strong>vídeos explicativos</strong> para ajudar crianças a desenvolverem suas habilidades cognitivas e sociais de forma envolvente e eficiente. Junte-se a nós nessa jornada de aprendizado e inclusão!
        </p>
      </section>

      {/* Seção de Vídeos */}
      <section className="container mx-auto py-12 px-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">📹 Vídeos Explicativos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h4 className="font-semibold text-lg mb-2">Como usar atividades estruturadas?</h4>
            <iframe
              className="w-full h-40 rounded-lg"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Vídeo Explicativo"
              allowFullScreen
            ></iframe>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <h4 className="font-semibold text-lg mb-2">Dicas para estimular o aprendizado</h4>
            <iframe
              className="w-full h-40 rounded-lg"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Vídeo Explicativo"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Seção de Materiais Gratuitos */}
      <section className="bg-blue-100 py-12 px-6 text-center">
        <h3 className="text-2xl font-semibold text-gray-800">📂 Materiais Gratuitos</h3>
        <p className="text-gray-600 max-w-2xl mx-auto mb-4">
          Baixe gratuitamente materiais de apoio para ajudar no desenvolvimento das crianças.
        </p>
        <button className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition">
          Baixar Agora
        </button>
      </section>

      {/* Botões Fixos de Contato */}
      <div className="fixed bottom-4 right-4 flex flex-col space-y-3">
        {/* WhatsApp */}
        <a
          href="https://wa.me/5511958822954"
          target="_blank"
          className="bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition"
        >
          <FontAwesomeIcon icon={faWhatsapp} className="w-6 h-6" />
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/lr_espaco_pedagogico/?igsh=MTVzbXcxNXVqYnZkNg%3D%3D#"
          target="_blank"
          className="bg-pink-500 text-white p-3 rounded-full shadow-lg flex items-center space-x-2 hover:bg-pink-600 transition"
        >
          <Instagram className="w-8 h-8" />
        </a>
      </div>
    </div>
  );
}