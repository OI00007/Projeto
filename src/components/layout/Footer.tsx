import {
  Leaf,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * Enhanced Footer component with animations, back-to-top, and improved accessibility
 */
export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = {
    produto: [
      {
        label: "Dashboard",
        href: "/dashboard",
        description: "Painel de controle completo",
      },
      {
        label: "Monitoramento",
        href: "/monitoring",
        description: "Acompanhe em tempo real",
      },
      {
        label: "Financeiro",
        href: "/financial",
        description: "Gestão financeira inteligente",
      },
      {
        label: "Equipamentos",
        href: "/equipment",
        description: "Controle de maquinário",
      },
    ],
    recursos: [
      {
        label: "Tarefas",
        href: "/tasks",
        description: "Gerenciamento de atividades",
      },
      { label: "Frota", href: "/fleet", description: "Gestão de veículos" },
      {
        label: "Campos",
        href: "/costs-fields",
        description: "Mapeamento de áreas",
      },
    ],
    empresa: [
      { label: "Sobre Nós", href: "#", description: "Conheça nossa história" },
      { label: "Contato", href: "#", description: "Fale conosco" },
      { label: "Blog", href: "#", description: "Novidades e artigos" },
      { label: "Carreiras", href: "#", description: "Trabalhe conosco" },
    ],
    legal: [
      {
        label: "Termos de Uso",
        href: "#",
        description: "Condições de uso do serviço",
      },
      {
        label: "Privacidade",
        href: "#",
        description: "Política de privacidade",
      },
      { label: "Cookies", href: "#", description: "Política de cookies" },
      { label: "LGPD", href: "#", description: "Proteção de dados" },
    ],
  };

  const socialLinks = [
    {
      icon: Facebook,
      href: "#",
      label: "Facebook",
      color: "hover:bg-[#1877f2]",
    },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:bg-[#1da1f2]" },
    {
      icon: Linkedin,
      href: "#",
      label: "LinkedIn",
      color: "hover:bg-[#0a66c2]",
    },
    {
      icon: Instagram,
      href: "#",
      label: "Instagram",
      color:
        "hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888]",
    },
  ];

  return (
    <footer
      className="relative bg-card border-t border-border overflow-hidden"
      role="contentinfo"
      aria-label="Rodapé do site"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-[0.02]" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="col-span-2">
            <a
              href="/"
              className="inline-flex items-center gap-3 mb-6 group focus-visible-ring rounded-xl"
              aria-label="Ir para página inicial"
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                <Leaf className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">
                  Argom
                </span>
                <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
                  Gestão Rural Inteligente
                </span>
              </div>
            </a>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs leading-relaxed">
              Revolucionando a gestão rural com tecnologia de ponta. Agricultura
              inteligente para o produtor moderno do Brasil.
            </p>

            {/* Contact Info */}
            <address className="not-italic space-y-3 text-sm text-muted-foreground">
              <a
                href="mailto:contato@argom.com"
                className="flex items-center gap-3 hover:text-primary transition-colors group focus-visible-ring rounded-lg p-1 -ml-1"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Mail className="w-4 h-4" aria-hidden="true" />
                </div>
                contato@argom.com
              </a>
              <a
                href="tel:+5511999999999"
                className="flex items-center gap-3 hover:text-primary transition-colors group focus-visible-ring rounded-lg p-1 -ml-1"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Phone className="w-4 h-4" aria-hidden="true" />
                </div>
                (11) 99999-9999
              </a>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>São Paulo, SP - Brasil</span>
              </div>
            </address>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Links do produto">
            <h3 className="font-bold text-foreground mb-5 text-sm uppercase tracking-wider">
              Produto
            </h3>
            <ul className="space-y-3">
              {footerLinks.produto.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 underline-animate focus-visible-ring rounded-lg inline-block"
                    title={link.description}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Links de recursos">
            <h3 className="font-bold text-foreground mb-5 text-sm uppercase tracking-wider">
              Recursos
            </h3>
            <ul className="space-y-3">
              {footerLinks.recursos.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 underline-animate focus-visible-ring rounded-lg inline-block"
                    title={link.description}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Links da empresa">
            <h3 className="font-bold text-foreground mb-5 text-sm uppercase tracking-wider">
              Empresa
            </h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 underline-animate focus-visible-ring rounded-lg inline-block"
                    title={link.description}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Links legais">
            <h3 className="font-bold text-foreground mb-5 text-sm uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 underline-animate focus-visible-ring rounded-lg inline-block"
                    title={link.description}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              © {currentYear} Argom. Feito pela
              <Leaf
                className="w-4 h-4 text-primary ml-1 animate-pulse-gentle"
                aria-label="Argom"
              />
              no Brasil.
            </p>

            {/* Social Links */}
            <nav aria-label="Redes sociais">
              <ul className="flex items-center gap-3">
                {socialLinks.map(({ icon: Icon, href, label, color }) => (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={`Siga-nos no ${label}`}
                      className={cn(
                        "w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground transition-all duration-300 focus-visible-ring",
                        "hover:text-white hover:scale-110 hover:shadow-lg",
                        color,
                      )}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-8 right-8 w-12 h-12 rounded-xl gradient-primary text-white shadow-lg flex items-center justify-center transition-all duration-500 focus-visible-ring z-50",
          "hover:scale-110 hover:shadow-xl",
          showBackToTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none",
        )}
        aria-label="Voltar ao topo da página"
      >
        <ArrowUp className="w-5 h-5" aria-hidden="true" />
      </button>
    </footer>
  );
};

export default Footer;
