import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight,
  Leaf,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Star,
  Play,
  ChevronRight,
  Sparkles,
  BarChart3,
  Cloud,
  Cpu,
  CheckCircle2,
  Quote
} from "lucide-react";
import { SEOHead } from "@/components/seo/SEOHead";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Lazy load images for better performance
const heroImage = new URL("@/assets/hero-farm.jpg", import.meta.url).href;
const dashboardPreview = new URL("@/assets/dashboard-preview.jpg", import.meta.url).href;
const automationFeature = new URL("@/assets/automation-feature.jpg", import.meta.url).href;

const Index = () => {
  const navigate = useNavigate();
  const stats = [
    { value: "10k+", label: "Produtores Ativos", icon: Users, ariaLabel: "Mais de 10 mil produtores ativos" },
    { value: "95%", label: "Satisfação", icon: Star, ariaLabel: "95 porcento de satisfação dos clientes" },
    { value: "40%", label: "Aumento de Produtividade", icon: TrendingUp, ariaLabel: "40 porcento de aumento de produtividade" },
    { value: "24/7", label: "Monitoramento", icon: Shield, ariaLabel: "Monitoramento 24 horas por dia, 7 dias por semana" }
  ];

  const features = [
    {
      icon: Cloud,
      title: "Previsão Meteorológica",
      description: "Sistema avançado de previsão do tempo com alertas em tempo real para proteger sua produção."
    },
    {
      icon: BarChart3,
      title: "Análise de Dados",
      description: "Dashboards interativos com métricas detalhadas e insights acionáveis sobre sua fazenda."
    },
    {
      icon: Cpu,
      title: "Automação Inteligente",
      description: "IoT e IA para automatizar irrigação, controle de pragas e otimizar recursos."
    },
    {
      icon: Shield,
      title: "Gestão Completa",
      description: "Controle financeiro, estoque, equipamentos e equipes em uma plataforma única."
    }
  ];

  const benefits = [
    "Redução de custos operacionais em até 35%",
    "Aumento da produtividade de 30-50%",
    "Economia de água em até 40%",
    "Tomada de decisão baseada em dados",
    "Monitoramento em tempo real 24/7",
    "Suporte técnico especializado"
  ];

  const testimonials = [
    {
      quote: "O sistema revolucionou a gestão da nossa fazenda. Conseguimos aumentar a produtividade em 45% no primeiro ano.",
      author: "João Silva",
      role: "Fazenda Santa Maria - 500ha",
      rating: 5
    },
    {
      quote: "A automação inteligente nos permitiu reduzir custos com água em 38% e ter muito mais controle sobre nossa produção.",
      author: "Maria Santos",
      role: "Fazenda Boa Vista - 800ha",
      rating: 5
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <SEOHead 
        title="Sistema Argom - Gestão Rural Inteligente | Agricultura 4.0"
        description="Revolucione sua propriedade rural com tecnologia de ponta. Sistema completo de gestão agrícola com IA, IoT, monitoramento em tempo real. Aumente sua produtividade em até 45%."
        keywords="gestão rural, agricultura inteligente, agronegócio, fazenda inteligente, IoT agrícola"
      />
      
      <Header />
      
      <main id="main-content" className="min-h-screen bg-background overflow-x-hidden">
        {/* Hero Section */}
        <section 
          className="relative overflow-hidden min-h-screen flex items-center pt-16 lg:pt-20"
          aria-labelledby="hero-heading"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0" aria-hidden="true">
            <img 
              src={heroImage} 
              alt=""
              loading="eager"
              className="w-full h-full object-cover scale-105 animate-[pulse-gentle_20s_ease-in-out_infinite]"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-primary/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
            <div className="absolute inset-0 pattern-dots opacity-[0.08]" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-6 py-24 w-full">
            <div className="max-w-3xl">
              <Badge 
                className="mb-8 px-6 py-3 bg-white/15 text-white border-white/25 hover:bg-white/25 backdrop-blur-xl text-base transition-all duration-700 hover:scale-105 entrance-scale rounded-full shadow-lg"
                aria-label="Tecnologia Agricultura Inteligente 4.0"
              >
                <Sparkles className="w-5 h-5 mr-2 animate-pulse" aria-hidden="true" />
                Agricultura Inteligente 4.0
              </Badge>
              
              <h1 
                id="hero-heading"
                className="text-5xl sm:text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight leading-[1.1] entrance-slide-up"
              >
                Fazenda
                <span className="block text-accent entrance-slide-up" style={{ animationDelay: '0.3s' }}>
                  Inteligente
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-white/85 mb-12 leading-relaxed max-w-2xl entrance-fade" style={{ animationDelay: '0.5s' }}>
                Revolucione sua propriedade rural com tecnologia de ponta. 
                Monitore, analise e otimize sua produção em tempo real com IA e IoT.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 entrance-scale" style={{ animationDelay: '0.7s' }}>
                <Button 
                  size="lg" 
                  className="group bg-white text-primary hover:bg-white/95 text-lg px-8 py-6 shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.4)] rounded-2xl"
                  onClick={() => handleNavigation("/dashboard")}
                  aria-label="Ver demonstração do dashboard"
                >
                  <Play className="w-6 h-6 mr-2 transition-all duration-500 group-hover:scale-110" aria-hidden="true" />
                  Ver Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 transition-all duration-500 group-hover:translate-x-2" aria-hidden="true" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 border-white/25 text-white hover:bg-white/20 backdrop-blur-xl text-lg px-8 py-6 transition-all duration-500 hover:scale-105 rounded-2xl"
                  onClick={() => handleNavigation("/auth")}
                  aria-label="Criar conta gratuita"
                >
                  Começar Agora
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16 sm:mt-20"
              role="region"
              aria-label="Estatísticas do sistema"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card 
                    key={index} 
                    className="bg-white/10 backdrop-blur-xl p-5 sm:p-6 text-center border-white/20 hover:border-white/40 hover:bg-white/15 group transition-all duration-700 hover:-translate-y-2 entrance-scale rounded-2xl"
                    style={{ animationDelay: `${0.8 + index * 0.15}s` }}
                    role="article"
                    aria-label={stat.ariaLabel}
                  >
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white/90 mx-auto mb-3 group-hover:scale-125 group-hover:text-accent transition-all duration-500" aria-hidden="true" />
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-2 group-hover:text-accent transition-all duration-500">
                      {stat.value}
                    </div>
                    <p className="text-white/70 text-xs sm:text-sm font-medium">{stat.label}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section 
          className="py-24 sm:py-32 bg-gradient-to-b from-muted/40 via-muted/20 to-background"
          aria-labelledby="features-heading"
        >
          <div className="max-w-7xl mx-auto px-6">
            <header className="text-center mb-16 sm:mb-20">
              <Badge className="mb-6 gradient-primary text-white px-5 py-2.5 rounded-full shadow-lg entrance-scale">
                Recursos Avançados
              </Badge>
              <h2 
                id="features-heading"
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight entrance-slide-up"
              >
                Tecnologia que Transforma
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed entrance-fade" style={{ animationDelay: '0.2s' }}>
                Ferramentas completas para gestão inteligente da sua propriedade rural
              </p>
            </header>

            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
              role="list"
              aria-label="Lista de recursos"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card 
                    key={index} 
                    className="bg-card/80 backdrop-blur-sm p-7 sm:p-8 border-primary/10 hover:border-primary/25 group transition-all duration-700 hover:-translate-y-3 hover:shadow-large entrance-scale rounded-2xl"
                    style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                    role="listitem"
                  >
                    <div 
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 shadow-accent"
                      aria-hidden="true"
                    >
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-500">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                      {feature.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section 
          className="py-32 bg-background relative overflow-hidden"
          aria-labelledby="dashboard-heading"
        >
          <div className="absolute inset-0 gradient-primary opacity-[0.03]" aria-hidden="true" />
          
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="animate-slide-in-left">
                <Badge className="mb-6 gradient-secondary text-white px-4 py-2 hover:scale-105 transition-transform duration-300">
                  Dashboard Completo
                </Badge>
                <h2 
                  id="dashboard-heading"
                  className="text-5xl font-bold text-foreground mb-8 leading-tight"
                >
                  Controle Total da sua Fazenda
                </h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Acesse todas as informações importantes em um só lugar. 
                  Tome decisões inteligentes baseadas em dados precisos e em tempo real.
                </p>

                <ul className="space-y-4 mb-8" role="list" aria-label="Benefícios do sistema">
                  {benefits.map((benefit, index) => (
                    <li 
                      key={index} 
                      className="flex items-start gap-3 animate-fade-in group hover:translate-x-2 transition-transform duration-300" 
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1 group-hover:scale-125 transition-transform duration-300" aria-hidden="true" />
                      <span className="text-lg text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  size="lg" 
                  className="gradient-primary text-white hover:opacity-90 hover:scale-105 hover:shadow-2xl group transition-all duration-300"
                  onClick={() => handleNavigation("/dashboard")}
                  aria-label="Explorar o dashboard do sistema"
                >
                  Explorar Dashboard
                  <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-2 duration-300" aria-hidden="true" />
                </Button>
              </div>

              <div className="relative animate-slide-in-right">
                <div className="absolute inset-0 gradient-primary blur-3xl opacity-20 animate-pulse-gentle" aria-hidden="true" />
                <figure className="relative group">
                  <img 
                    src={dashboardPreview}
                    alt="Prévia do dashboard do Sistema Argom mostrando métricas de produção, clima e finanças"
                    loading="lazy"
                    className="relative rounded-2xl shadow-large group-hover:scale-[1.02] group-hover:shadow-2xl transition-all duration-500 border border-primary/20 group-hover:border-primary/40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* Automation Section */}
        <section 
          className="py-32 bg-muted/30"
          aria-labelledby="automation-heading"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <figure className="relative order-2 lg:order-1">
                <div className="absolute inset-0 gradient-secondary blur-3xl opacity-20 animate-pulse-glow" aria-hidden="true" />
                <img 
                  src={automationFeature} 
                  alt="Sistema de automação inteligente com sensores IoT em plantação"
                  loading="lazy"
                  className="relative rounded-2xl shadow-large hover:scale-105 transition-transform duration-500 border border-accent/20"
                />
              </figure>

              <div className="order-1 lg:order-2 animate-slide-in-right">
                <Badge className="mb-6 gradient-forest text-white px-4 py-2 hover:scale-105 transition-transform duration-300">
                  Automação Inteligente
                </Badge>
                <h2 
                  id="automation-heading"
                  className="text-5xl font-bold text-foreground mb-8 leading-tight"
                >
                  IA & IoT Trabalhando por Você
                </h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Sistemas automatizados que aprendem e se adaptam às necessidades específicas 
                  da sua propriedade, maximizando eficiência e reduzindo custos.
                </p>

                <div 
                  className="grid grid-cols-2 gap-6"
                  role="list"
                  aria-label="Métricas de automação"
                >
                  {[
                    { icon: Zap, label: "Irrigação Automática", value: "40%" },
                    { icon: Leaf, label: "Economia de Água", value: "38%" },
                    { icon: TrendingUp, label: "Produtividade", value: "+45%" },
                    { icon: Shield, label: "Monitoramento", value: "24/7" }
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <Card 
                        key={index} 
                        className="p-6 border-primary/10 hover:border-primary/30 card-hover group animate-scale-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        role="listitem"
                      >
                        <Icon className="w-8 h-8 text-primary mb-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" aria-hidden="true" />
                        <div className="text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                          {item.value}
                        </div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section 
          className="py-32 bg-background"
          aria-labelledby="testimonials-heading"
        >
          <div className="max-w-7xl mx-auto px-6">
            <header className="text-center mb-20">
              <Badge className="mb-6 gradient-ocean text-white px-4 py-2">
                Depoimentos
              </Badge>
              <h2 
                id="testimonials-heading"
                className="text-5xl font-bold text-foreground mb-6"
              >
                Produtores que Confiam
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Veja o que nossos clientes têm a dizer sobre a transformação em suas fazendas
              </p>
            </header>

            <div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              role="list"
              aria-label="Depoimentos de clientes"
            >
              {testimonials.map((testimonial, index) => (
                <Card 
                  key={index} 
                  className="glass-card p-10 hover:scale-105 transition-all border-primary/10 hover:border-primary/30"
                  role="listitem"
                >
                  <Quote className="w-12 h-12 text-primary/30 mb-6" aria-hidden="true" />
                  <blockquote>
                    <p className="text-lg text-foreground mb-6 leading-relaxed italic">
                      "{testimonial.quote}"
                    </p>
                  </blockquote>
                  <footer className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold"
                      aria-hidden="true"
                    >
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <cite className="font-semibold text-foreground not-italic">{testimonial.author}</cite>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <div className="flex gap-1 mt-1" aria-label={`Avaliação: ${testimonial.rating} de 5 estrelas`}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-accent text-accent" aria-hidden="true" />
                        ))}
                      </div>
                    </div>
                  </footer>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section 
          className="py-32 relative overflow-hidden"
          aria-labelledby="cta-heading"
        >
          <div className="absolute inset-0 gradient-sunset opacity-20" aria-hidden="true" />
          <div className="absolute inset-0 pattern-dots opacity-10" aria-hidden="true" />
          
          <div className="max-w-5xl mx-auto text-center px-6 relative">
            <div className="inline-block p-3 rounded-2xl bg-accent/10 mb-8 animate-float" aria-hidden="true">
              <Sparkles className="w-16 h-16 text-accent" />
            </div>
            
            <h2 
              id="cta-heading"
              className="text-5xl md:text-6xl font-bold text-foreground mb-8"
            >
              Pronto para Transformar sua Fazenda?
            </h2>
            <p className="text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
              Junte-se a milhares de produtores que já revolucionaram suas propriedades rurais 
              com tecnologia de ponta e gestão inteligente.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="gradient-primary text-white hover:opacity-90 group shadow-large text-lg px-10 py-7"
                onClick={() => handleNavigation("/auth")}
                aria-label="Começar teste gratuito de 14 dias"
              >
                <Play className="w-6 h-6 mr-2" aria-hidden="true" />
                Começar Agora Gratuitamente
                <ArrowRight className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 text-lg px-10 py-7 hover:bg-muted/50"
                aria-label="Falar com um especialista em gestão rural"
              >
                <Users className="w-6 h-6 mr-2" aria-hidden="true" />
                Falar com Especialista
              </Button>
            </div>

            <p className="text-muted-foreground mt-8">
              <span aria-label="Celebração">🎉</span> Teste grátis por 14 dias • Sem cartão de crédito • Suporte em português
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default Index;