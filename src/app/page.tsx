"use client";

import React, { useState } from 'react';
import { Instagram, Linkedin, MessageCircle } from 'lucide-react';

const Page = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Blog Psicopedagógico</title>
        <style>{`
          :root {
            --primary: #3e6fc6;
            --secondary: #7fd13f;
            --accent: #FFB6C1;
            --light: #f8f9fa;
            --dark: #343a40;
            --text: #333333;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            color: var(--text);
            line-height: 1.6;
          }
          .header {
            background-color: var(--primary);
            padding: 1rem 0;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
          }
          .nav-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
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
            color: var(--secondary);
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
            background-color: var(--primary);
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
            color: var(--secondary);
          }
          .hero {
            background-image: linear-gradient(rgba(62, 111, 198, 0.7), rgba(62, 111, 198, 0.7)), url('/api/placeholder/1200/500');
            background-size: cover;
            background-position: center;
            color: white;
            padding: 5rem 0;
            text-align: center;
          }
          .hero h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            font-family: 'Georgia', serif;
          }
          .hero p {
            font-size: 1.2rem;
            max-width: 800px;
            margin: 0 auto 2rem auto;
          }
          .btn {
            display: inline-block;
            padding: 0.8rem 1.8rem;
            border-radius: 30px;
            text-decoration: none;
            transition: all 0.3s ease;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.9rem;
          }
          .btn-primary {
            background-color: var(--secondary);
            color: white;
          }
          .btn-primary:hover {
            background-color: #6dbc30;
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
          .section {
            padding: 5rem 0;
          }
          .section-title {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 3rem;
            color: var(--primary);
            font-family: 'Georgia', serif;
          }
          .section-title::after {
            content: '';
            display: block;
            width: 100px;
            height: 4px;
            background-color: var(--secondary);
            margin: 1rem auto 0 auto;
          }
          .featured-posts {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
          }
          .post-card {
            background-color: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
          }
          .post-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          .post-image {
            height: 200px;
            width: 100%;
            object-fit: cover;
          }
          .post-content {
            padding: 1.5rem;
          }
          .post-title {
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
            color: var(--dark);
            font-family: 'Georgia', serif;
          }
          .post-excerpt {
            color: #666;
            margin-bottom: 1rem;
          }
          .post-meta {
            font-size: 0.85rem;
            color: #999;
          }
          .info-boxes {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
          }
          .info-box {
            background-color: white;
            border-radius: 10px;
            padding: 2rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            text-align: center;
          }
          .info-icon {
            font-size: 2.5rem;
            color: var(--primary);
            margin-bottom: 1rem;
          }
          .info-title {
            font-size: 1.2rem;
            margin-bottom: 1rem;
            color: var(--dark);
          }
          .cta {
            background-color: var(--accent);
            color: var(--dark);
            text-align: center;
            padding: 5rem 0;
          }
          .cta h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
            font-family: 'Georgia', serif;
          }
          .testimonials {
            background-color: var(--light);
          }
          .testimonial-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
          }
          .testimonial {
            background-color: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            position: relative;
          }
          .testimonial::before {
            content: '"';
            font-size: 5rem;
            position: absolute;
            top: -20px;
            left: 20px;
            color: rgba(62, 111, 198, 0.1);
            font-family: 'Georgia', serif;
          }
          .testimonial-text {
            font-style: italic;
            margin-bottom: 1rem;
          }
          .testimonial-author {
            font-weight: bold;
            color: var(--primary);
          }
          .footer {
            background-color: var(--dark);
            color: white;
            padding: 3rem 0;
          }
          .footer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
          }
          .footer-col h3 {
            font-size: 1.2rem;
            margin-bottom: 1.5rem;
          }
          .footer-links {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .footer-links li {
            margin-bottom: 0.5rem;
          }
          .footer-links li {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .footer-links a {
            color: #ddd;
            text-decoration: none;
            transition: all 0.3s ease;
          }
          .footer-links a:hover {
            color: var(--secondary);
          }
          .social-links {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
          }
          .social-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background-color: #444;
            border-radius: 50%;
            color: white;
            text-decoration: none;
            transition: all 0.3s ease;
            font-size: 1.2rem;
          }
          .social-icon:hover {
            background-color: var(--secondary);
            transform: translateY(-3px);
          }
          .copyright {
            margin-top: 3rem;
            text-align: center;
            color: #aaa;
            font-size: 0.9rem;
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
          }
        `}</style>
      </head>
      <body>
        <header className="header">
          <div className="container nav-container">
            <div className="logo-container">
              <img src="/blog/Logo_LR_negativo.svg" alt="Logo" />
              <span className="logo-text">Blog Psicopedagógico</span>
            </div>
            <nav className="nav-links">
              <a href="/" className="nav-link">Home</a>
              <a href="/blog" className="nav-link">Blog</a>
              <a href="/sobre" className="nav-link">Sobre Mim</a>
              <a href="/login" className="nav-link">Login</a>
            </nav>
            <button className="hamburger" onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
              <div className="mobile-nav-links">
                <a href="/" className="mobile-nav-link">Home</a>
                <a href="/blog" className="mobile-nav-link">Blog</a>
                <a href="/sobre" className="mobile-nav-link">Sobre Mim</a>
                <a href="/login" className="mobile-nav-link">Login</a>
              </div>
            </div>
          </div>
        </header>
        <section className="hero">
          <div className="container">
            <h1>Apoio especializado para o desenvolvimento infantil</h1>
            <p>Descubra estratégias, recursos e orientações para ajudar crianças a desenvolverem todo seu potencial de aprendizagem.</p>
            <a href="/blog" className="btn btn-primary">Explorar Blog</a>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <h2 className="section-title">Artigos em Destaque</h2>
            <div className="featured-posts">
              <div className="post-card">
                <img src="/blog/image.png" alt="Artigo sobre desenvolvimento infantil" className="post-image" />
                <div className="post-content">
                  <h3 className="post-title">Atividades estruturadas para crianças com TDAH</h3>
                  <p className="post-excerpt">Descubra 5 atividades práticas que ajudam a desenvolver foco e concentração em crianças com TDAH.</p>
                  <p className="post-meta">15 de abril, 2025</p>
                </div>
              </div>
              <div className="post-card">
                <img src="/blog/imagem  3.jpg" alt="Artigo sobre inclusão escolar" className="post-image" />
                <div className="post-content">
                  <h3 className="post-title">Inclusão escolar: Como preparar o ambiente</h3>
                  <p className="post-excerpt">Guia prático para educadores sobre como criar um ambiente escolar verdadeiramente inclusivo.</p>
                  <p className="post-meta">10 de abril, 2025</p>
                </div>
              </div>
              <div className="post-card">
                <img src="/blog/imagem 2.jpg" alt="Artigo sobre dislexia" className="post-image" />
                <div className="post-content">
                  <h3 className="post-title">Sinais de alerta para dislexia em idade pré-escolar</h3>
                  <p className="post-excerpt">Aprenda a identificar os primeiros sinais que podem indicar dislexia em crianças pequenas.</p>
                  <p className="post-meta">5 de abril, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <h2 className="section-title">Como podemos ajudar</h2>
            <div className="info-boxes">
              <div className="info-box">
                <div className="info-icon">📝</div>
                <h3 className="info-title">Avaliação Psicopedagógica</h3>
                <p>Identificação precoce de dificuldades de aprendizagem e potencialidades da criança.</p>
              </div>
              <div className="info-box">
                <div className="info-icon">🧩</div>
                <h3 className="info-title">Intervenção Especializada</h3>
                <p>Abordagens personalizadas para diferentes dificuldades de aprendizagem e desenvolvimento.</p>
              </div>
              <div className="info-box">
                <div className="info-icon">👨‍👩‍👧‍👦</div>
                <h3 className="info-title">Orientação Familiar</h3>
                <p>Suporte para pais e cuidadores lidarem com os desafios do desenvolvimento infantil.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="cta">
          <div className="container">
            <h2>Materiais gratuitos para download</h2>
            <p>Baixe nossos guias práticos e atividades estruturadas para usar em casa ou na escola.</p>
            <a href="/materiais" className="btn btn-primary">Acessar Materiais</a>
          </div>
        </section>
        <section className="section testimonials">
          <div className="container">
            <h2 className="section-title">O que dizem sobre nós</h2>
            <div className="testimonial-grid">
              <div className="testimonial">
                <p className="testimonial-text">As orientações recebidas transformaram a forma como meu filho aprende. Nunca imaginei que pequenas adaptações fariam tanta diferença!</p>
                <p className="testimonial-author">Ana, mãe de Pedro (8 anos)</p>
              </div>
              <div className="testimonial">
                <p className="testimonial-text">Como professora, os recursos disponibilizados aqui me ajudaram a criar um ambiente mais inclusivo em sala de aula.</p>
                <p className="testimonial-author">Mariana, professora do Ensino Fundamental</p>
              </div>
            </div>
          </div>
        </section>
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-col">
                <h3>Blog Psicopedagógico</h3>
                <p>Apoio especializado para o desenvolvimento infantil e inclusão educacional.</p>
              </div>
              <div className="footer-col">
                <h3>Links Rápidos</h3>
                <ul className="footer-links">
                  <li><a href="/">Home</a></li>
                  <li><a href="/blog">Blog</a></li>
                  <li><a href="/sobre">Sobre Mim</a></li>
                  <li><a href="/materiais">Materiais Gratuitos</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h3>Contato</h3>
                <ul className="footer-links">
                  <li>Email: lidiane@blogpsicopedagogico.com.br</li>
                  <li>
                    <MessageCircle size={16} />
                    WhatsApp: (11) 95882-2954
                  </li>
                </ul>
                <div className="social-links">
                  <a href="https://wa.me/5511958822954" className="social-icon" title="WhatsApp">
                    <MessageCircle size={20} />
                  </a>
                  <a href="https://www.instagram.com/lr_espaco_pedagogico/" className="social-icon" title="Instagram">
                    <Instagram size={20} />
                  </a>
                  <a href="https://www.linkedin.com/" className="social-icon" title="LinkedIn">
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
            </div>
            <div className="copyright">
              &copy; 2025 Blog Psicopedagógico. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
};

export default Page;