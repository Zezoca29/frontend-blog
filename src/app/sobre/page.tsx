"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Instagram, Linkedin, MessageCircle } from 'lucide-react';

const SobreMim = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    setIsVisible(true);
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = parseInt(entry.target.getAttribute('data-section') || '0');
          console.log('Section visible:', id); // Log para debugging
          setActiveSection(id);
        }
      });
    }, { threshold: 0.2 });
    
    const sections = document.querySelectorAll('.animate-section');
    console.log('Found sections:', sections.length); // Verificar se está encontrando todas as seções
    
    sections.forEach(section => {
      sectionObserver.observe(section);
    });
    
    return () => {
      sections.forEach(section => {
        sectionObserver.unobserve(section);
      });
    };
  }, []);

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sobre Mim - Blog Psicopedagógico</title>
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
          .page-title {
            background-color: var(--primary);
            color: white;
            padding: 4rem 0;
            text-align: center;
          }
          .page-title h1 {
            font-size: 3rem;
            margin: 0;
            font-family: 'Georgia', serif;
            position: relative;
            display: inline-block;
          }
          .page-title h1::after {
            content: '';
            display: block;
            width: 100px;
            height: 4px;
            background-color: var(--secondary);
            margin: 1rem auto 0;
          }
          .section {
            padding: 5rem 0;
            scroll-margin-top: 80px;
          }
          .bio-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            align-items: center;
          }
          .bio-content {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.8s ease;
          }
          .bio-content.visible {
            opacity: 1;
            transform: translateY(0);
          }
          .bio-title {
            font-size: 2rem;
            color: var(--primary);
            margin-bottom: 1.5rem;
            font-family: 'Georgia', serif;
          }
          .bio-text {
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
          }
          .animation-container {
            position: relative;
            height: 400px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .brain-animation {
            width: 300px;
            height: 300px;
            position: relative;
          }
          .brain-outer {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 3px solid var(--primary);
            animation: pulse 4s infinite alternate;
          }
          .brain-middle {
            position: absolute;
            width: 75%;
            height: 75%;
            top: 12.5%;
            left: 12.5%;
            border-radius: 50%;
            border: 3px solid var(--secondary);
            animation: pulse 4s infinite alternate-reverse;
          }
          .brain-inner {
            position: absolute;
            width: 50%;
            height: 50%;
            top: 25%;
            left: 25%;
            border-radius: 50%;
            border: 3px solid var(--accent);
            animation: pulse 4s infinite alternate;
          }
          .connection {
            position: absolute;
            background-color: var(--primary);
            width: 3px;
            height: 50px;
            animation: grow 2s infinite alternate;
          }
          .connection:nth-child(1) {
            top: 0;
            left: 50%;
            transform: translateX(-50%);
          }
          .connection:nth-child(2) {
            top: 50%;
            left: 0;
            transform: translateY(-50%) rotate(90deg);
          }
          .connection:nth-child(3) {
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
          }
          .connection:nth-child(4) {
            top: 50%;
            right: 0;
            transform: translateY(-50%) rotate(90deg);
          }
          .connection:nth-child(5) {
            top: 15%;
            left: 15%;
            transform: rotate(45deg);
          }
          .connection:nth-child(6) {
            top: 15%;
            right: 15%;
            transform: rotate(-45deg);
          }
          .connection:nth-child(7) {
            bottom: 15%;
            right: 15%;
            transform: rotate(45deg);
          }
          .connection:nth-child(8) {
            bottom: 15%;
            left: 15%;
            transform: rotate(-45deg);
          }
          .papers-animation {
            position: relative;
            width: 300px;
            height: 300px;
          }
          .paper {
            position: absolute;
            width: 80px;
            height: 100px;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }
          .paper:nth-child(1) {
            top: 50px;
            left: 50px;
            transform: rotate(-15deg);
            animation: float 4s infinite alternate;
          }
          .paper:nth-child(2) {
            top: 70px;
            left: 150px;
            transform: rotate(10deg);
            animation: float 4.5s infinite alternate-reverse;
          }
          .paper:nth-child(3) {
            top: 150px;
            left: 100px;
            transform: rotate(-5deg);
            animation: float 5s infinite alternate;
          }
          .paper-line {
            position: absolute;
            height: 2px;
            background-color: #ddd;
            left: 10%;
            width: 80%;
          }
          .paper-line:nth-child(1) { top: 20%; }
          .paper-line:nth-child(2) { top: 40%; }
          .paper-line:nth-child(3) { top: 60%; }
          .paper-line:nth-child(4) { top: 80%; }
          
          .heart-animation {
            position: relative;
            width: 300px;
            height: 300px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .heart {
            position: relative;
            width: 100px;
            height: 90px;
            animation: heartbeat 1.5s infinite;
          }
          .heart:before,
          .heart:after {
            position: absolute;
            content: "";
            left: 50px;
            top: 0;
            width: 50px;
            height: 80px;
            background: var(--accent);
            border-radius: 50px 50px 0 0;
            transform: rotate(-45deg);
            transform-origin: 0 100%;
          }
          .heart:after {
            left: 0;
            transform: rotate(45deg);
            transform-origin: 100% 100%;
          }
          .values-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
          }
          .value-card {
            background-color: white;
            border-radius: 10px;
            padding: 2rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            text-align: center;
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(20px);
          }
          .value-card.visible {
            opacity: 1;
            transform: translateY(0);
          }
          .value-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          .value-icon {
            font-size: 2.5rem;
            color: var(--primary);
            margin-bottom: 1rem;
          }
          .value-title {
            font-size: 1.2rem;
            margin-bottom: 1rem;
            color: var(--dark);
          }
          .journey-timeline {
            position: relative;
            max-width: 800px;
            margin: 3rem auto;
            padding: 2rem 0;
          }
          .timeline-line {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 50%;
            width: 3px;
            background-color: var(--primary);
            transform: translateX(-50%);
          }
          .timeline-item {
            position: relative;
            margin-bottom: 3rem;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.8s ease;
          }
          .timeline-item.visible {
            opacity: 1;
            transform: translateY(0);
          }
          .timeline-item:nth-child(odd) {
            padding-right: calc(50% + 2rem);
            text-align: right;
          }
          .timeline-item:nth-child(even) {
            padding-left: calc(50% + 2rem);
          }
          .timeline-dot {
            position: absolute;
            top: 10px;
            width: 20px;
            height: 20px;
            background-color: var(--secondary);
            border-radius: 50%;
            box-shadow: 0 0 0 4px var(--primary);
          }
          .timeline-item:nth-child(odd) .timeline-dot {
            right: calc(50% - 10px);
          }
          .timeline-item:nth-child(even) .timeline-dot {
            left: calc(50% - 10px);
          }
          .timeline-date {
            font-weight: bold;
            color: var(--primary);
            margin-bottom: 0.5rem;
          }
          .timeline-content {
            background-color: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          }
          .timeline-title {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
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
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.7; }
            100% { transform: scale(1.05); opacity: 1; }
          }
          @keyframes grow {
            0% { height: 30px; opacity: 0.5; }
            100% { height: 50px; opacity: 1; }
          }
          @keyframes float {
            0% { transform: translateY(0) rotate(-15deg); }
            50% { transform: translateY(-10px) rotate(-12deg); }
            100% { transform: translateY(0) rotate(-15deg); }
          }
          @keyframes heartbeat {
            0% { transform: scale(1); }
            25% { transform: scale(1.1); }
            50% { transform: scale(1); }
            75% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          @media (max-width: 768px) {
            .bio-grid {
              grid-template-columns: 1fr;
            }
            .nav-links {
              display: none;
            }
            .hamburger {
              display: flex;
            }
            .timeline-item:nth-child(odd),
            .timeline-item:nth-child(even) {
              padding: 0 0 0 2rem;
              text-align: left;
            }
            .timeline-line {
              left: 0;
            }
            .timeline-item:nth-child(odd) .timeline-dot,
            .timeline-item:nth-child(even) .timeline-dot {
              left: -10px;
              right: auto;
            }
            span.logo-text{
            font-size: .5rem;
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
            <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/blog" className="nav-link">Blog</Link>
            <Link href="/contato" className="nav-link">Contato</Link>
            </div>
            <button className="hamburger" onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
              <div className="mobile-nav-links">
                <Link href="/" className="mobile-nav-link">Home</Link>
                <Link href="/blog" className="mobile-nav-link">Blog</Link>
                <Link href="/contato" className="mobile-nav-link">Contato</Link>
              </div>
            </div>
          </div>
        </header>

        <div className="page-title">
          <div className="container">
            <h1>Sobre Mim</h1>
          </div>
        </div>

        <section className="section animate-section" data-section="0">
          <div className="container">
            <div className="bio-grid">
              <div className={`bio-content ${isVisible && activeSection === 0 ? 'visible' : ''}`}>
                <h2 className="bio-title">Quem é Lidiane Rodrigues</h2>
                <p className="bio-text">
                  Sou Lidiane Rodrigues, psicopedagoga com mais de 15 anos de experiência dedicados à compreensão das 
                  diversas formas de aprender. Minha jornada começou quando percebi que cada criança possui um universo 
                  único de possibilidades que, muitas vezes, apenas precisa ser descoberto e potencializado da maneira adequada.
                </p>
                <p className="bio-text">
                  Especializada em dificuldades de aprendizagem, TDAH, dislexia e inclusão educacional, dedico minha vida 
                  profissional a criar pontes que conectam crianças a suas verdadeiras capacidades, superando desafios 
                  e transformando obstáculos em oportunidades de crescimento.
                </p>
                <p className="bio-text">
                  Acredito profundamente que todo ser humano possui um potencial extraordinário para aprender, e minha 
                  missão é desvendar e nutrir esse potencial, especialmente quando ele se manifesta de maneiras singulares.
                </p>
              </div>
              <div className="animation-container">
                <div className="brain-animation">
                  <div className="brain-outer"></div>
                  <div className="brain-middle"></div>
                  <div className="brain-inner"></div>
                  <div className="connection"></div>
                  <div className="connection"></div>
                  <div className="connection"></div>
                  <div className="connection"></div>
                  <div className="connection"></div>
                  <div className="connection"></div>
                  <div className="connection"></div>
                  <div className="connection"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section animate-section" data-section="1" style={{ backgroundColor: 'var(--light)' }}>
          <div className="container">
            <h2 className="section-title">Minha Missão e Valores</h2>
            <div className="bio-grid">
              <div className="animation-container">
                <div className="heart-animation">
                  <div className="heart"></div>
                </div>
              </div>
              <div className={`bio-content ${isVisible && activeSection === 1 ? 'visible' : ''}`}>
                <h2 className="bio-title">Por que Escolhi a Psicopedagogia</h2>
                <p className="bio-text">
                  A psicopedagogia entrou em minha vida como uma verdadeira vocação. Sempre fui fascinada pela 
                  forma única como cada pessoa processa informações e constrói conhecimento. Ver o brilho nos olhos 
                  de uma criança quando ela finalmente compreende algo que antes parecia impossível é o que me 
                  move todos os dias.
                </p>
                <p className="bio-text">
                  Meu compromisso é transformar dificuldades em possibilidades, promover a autoconfiança e 
                  desenvolver o potencial máximo de cada indivíduo. Acredito que a educação inclusiva e 
                  personalizada é um direito, não um privilégio.
                </p>
              </div>
            </div>

            <div className="values-grid">
              <div className={`value-card ${isVisible && activeSection === 1 ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
                <div className="value-icon">💫</div>
                <h3 className="value-title">Respeito à Individualidade</h3>
                <p>
                  Cada pessoa tem seu ritmo e estilo de aprendizagem único. Respeitar e trabalhar a partir dessa 
                  singularidade é fundamental para o desenvolvimento pleno.
                </p>
              </div>
              <div className={`value-card ${isVisible && activeSection === 1 ? 'visible' : ''}`} style={{ transitionDelay: '0.4s' }}>
                <div className="value-icon">🔍</div>
                <h3 className="value-title">Olhar Investigativo</h3>
                <p>
                  Vejo além dos comportamentos aparentes, buscando sempre compreender as causas subjacentes às 
                  dificuldades de aprendizagem.
                </p>
              </div>
              <div className={`value-card ${isVisible && activeSection === 1 ? 'visible' : ''}`} style={{ transitionDelay: '0.6s' }}>
                <div className="value-icon">🌱</div>
                <h3 className="value-title">Crescimento Contínuo</h3>
                <p>
                  Acredito no potencial de desenvolvimento de cada pessoa, independentemente de diagnósticos 
                  ou rótulos limitantes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section animate-section" data-section="2">
  <div className="container">
    <h2 className="section-title">Minha Trajetória</h2>
    
    <div className="journey-timeline">
      <div className="timeline-line"></div>
      
      <div className={`timeline-item ${isVisible && activeSection === 2 ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
        <div className="timeline-dot"></div>
        <div className="timeline-date">2005</div>
        <div className="timeline-content">
          <h3 className="timeline-title">Graduação em Pedagogia</h3>
          <p>Formação inicial com ênfase em educação inclusiva e processos de desenvolvimento infantil.</p>
        </div>
      </div>
              
              <div className={`timeline-item ${isVisible && activeSection === 2 ? 'visible' : ''}`} style={{ transitionDelay: '0.4s' }}>
                <div className="timeline-dot"></div>
                <div className="timeline-date">2007</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">Especialização em Psicopedagogia</h3>
                  <p>Aprofundamento nos estudos sobre processos de aprendizagem e suas dificuldades.</p>
                </div>
              </div>
              
              <div className={`timeline-item ${isVisible && activeSection === 2 ? 'visible' : ''}`} style={{ transitionDelay: '0.6s' }}>
                <div className="timeline-dot"></div>
                <div className="timeline-date">2010</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">Mestrado em Educação Especial</h3>
                  <p>Pesquisa sobre intervenções precoces em crianças com dificuldades de aprendizagem.</p>
                </div>
              </div>
              
              <div className={`timeline-item ${isVisible && activeSection === 2 ? 'visible' : ''}`} style={{ transitionDelay: '0.8s' }}>
                <div className="timeline-dot"></div>
                <div className="timeline-date">2013</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">Fundação do Espaço Pedagógico LR</h3>
                  <p>Criação do meu próprio espaço para atendimento psicopedagógico personalizado.</p>
                </div>
              </div>
              
              <div className={`timeline-item ${isVisible && activeSection === 2 ? 'visible' : ''}`} style={{ transitionDelay: '1s' }}>
                <div className="timeline-dot"></div>
                <div className="timeline-date">2018</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">Lançamento do Blog Psicopedagógico</h3>
                  <p>Criação de um espaço digital para compartilhar conhecimentos e apoiar famílias e educadores.</p>
                </div>
              </div>
              
              <div className={`timeline-item ${isVisible && activeSection === 2 ? 'visible' : ''}`} style={{ transitionDelay: '1.2s' }}>
                <div className="timeline-dot"></div>
                <div className="timeline-date">2023</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">Biblioteca de Materiais Psicopedagógicos</h3>
                  <p>Desenvolvimento de uma biblioteca de recursos e atividades para uso de profissionais e famílias.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section animate-section" data-section="3" style={{ backgroundColor: 'var(--light)' }}>
          <div className="container">
            <div className="bio-grid">
              <div className={`bio-content ${isVisible && activeSection === 3 ? 'visible' : ''}`}>
                <h2 className="bio-title">Minha Abordagem</h2>
                <p className="bio-text">
                  Trabalho com uma visão integrativa e personalizada, compreendendo que cada dificuldade de 
                  aprendizagem exige um olhar único e específico. Minhas intervenções são baseadas em evidências 
                  científicas, mas sempre humanizadas e adaptadas à realidade de cada criança e família.
                </p>
                <p className="bio-text">
                  Acredito no poder da parceria entre famílias, escola e profissionais. A transformação real acontece 
                  quando todos os envolvidos no desenvolvimento da criança trabalham em sintonia, com objetivos claros 
                  e estratégias consistentes.
                </p>
                <p className="bio-text"></p>
                <p className="bio-text">
                  Estou aqui para apoiar, orientar e caminhar junto com você nessa jornada de descobertas e 
                  aprendizados. Vamos juntos transformar desafios em conquistas!
                </p>
                </div>
                <div className="animation-container">
                    <div className="papers-animation">
                        <div className="paper"></div>
                        <div className="paper"></div>
                        <div className="paper"></div>
                        <div className="paper-line"></div>
                        <div className="paper-line"></div>
                        <div className="paper-line"></div>
                        <div className="paper-line"></div>
                    </div>
                </div>
            </div>
            </div>
        </section>
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-col">
            <h3>Sobre o Blog</h3>
            <p>
              O Blog Psicopedagógico é um espaço dedicado a compartilhar conhecimentos, experiências e recursos para apoiar famílias, educadores e profissionais na jornada de aprendizagem.
            </p>
              </div>
              <div className="footer-col">
            <h3>Links Úteis</h3>
            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/contato">Contato</a></li>
            </ul>
              </div>
              <div className="footer-col">
            <h3>Redes Sociais</h3>
            <div className="social-links">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Instagram />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Linkedin />
              </a>
              <a href="mailto:contato@blogpsicopedagogico.com" className="social-icon">
                <MessageCircle />
              </a>
            </div>
              </div>
            </div>
            <div className="copyright">
              &copy; {new Date().getFullYear()} Blog Psicopedagógico. Todos os direitos reservados.
            </div>
          </div>
        </footer>
          </body>
        </html>
      );
    };

    export default SobreMim;