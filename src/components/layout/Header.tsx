import { Button } from '@/components/ui/button';
import { Leaf, Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

/**
 * Enhanced Header component with animations, theme toggle, and improved accessibility
 */
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Monitoramento', href: '/monitoring' },
    { label: 'Financeiro', href: '/financial' },
    { label: 'Tarefas', href: '/tasks' },
    { 
      label: 'Mais', 
      href: '#',
      children: [
        { label: 'Equipamentos', href: '/equipment' },
        { label: 'Frota', href: '/fleet' },
        { label: 'Campos', href: '/costs-fields' },
        { label: 'IA Insights', href: '/ai-insights' },
      ]
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check system preference and localStorage
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemDark);
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled 
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-soft" 
          : "bg-transparent"
      )}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo with animation */}
          <a 
            href="/" 
            className="flex items-center gap-3 group focus-visible-ring rounded-xl"
            aria-label="Ir para página inicial - Sistema Argom"
          >
            <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-accent">
              <Leaf className="w-6 h-6 text-white transition-transform group-hover:scale-110" aria-hidden="true" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xl font-bold text-foreground tracking-tight">
                Argom
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
                Gestão Rural
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav 
            className="hidden lg:flex items-center gap-1"
            aria-label="Navegação principal"
          >
            {navLinks.map((link) => (
              <div 
                key={link.label} 
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-1",
                    "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    "focus-visible-ring"
                  )}
                  aria-haspopup={link.children ? "true" : undefined}
                  aria-expanded={link.children ? activeDropdown === link.label : undefined}
                >
                  {link.label}
                  {link.children && (
                    <ChevronDown 
                      className={cn(
                        "w-4 h-4 transition-transform duration-300",
                        activeDropdown === link.label && "rotate-180"
                      )} 
                      aria-hidden="true" 
                    />
                  )}
                </a>
                
                {/* Dropdown Menu */}
                {link.children && activeDropdown === link.label && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-48 py-2 bg-card rounded-xl border border-border shadow-large entrance-scale"
                    role="menu"
                  >
                    {link.children.map((child, idx) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        style={{ animationDelay: `${idx * 50}ms` }}
                        role="menuitem"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-muted/50 transition-all duration-300 focus-visible-ring group"
              aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-muted-foreground group-hover:text-warning transition-colors group-hover:rotate-180 duration-500" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:-rotate-12 duration-500" />
              )}
            </button>
            
            <Button 
              variant="ghost" 
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl"
              onClick={() => window.location.href = '/auth'}
            >
              Entrar
            </Button>
            <Button 
              className="gradient-primary text-white hover:opacity-90 hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-accent"
              onClick={() => window.location.href = '/auth'}
            >
              Começar Grátis
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-muted/50 transition-all duration-300 focus-visible-ring"
              aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            
            <button
              type="button"
              className="p-2.5 rounded-xl hover:bg-muted/50 transition-all duration-300 focus-visible-ring"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            >
              <span className="relative w-6 h-6 flex items-center justify-center">
                <Menu 
                  className={cn(
                    "w-6 h-6 absolute transition-all duration-300",
                    isMenuOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
                  )} 
                  aria-hidden="true" 
                />
                <X 
                  className={cn(
                    "w-6 h-6 absolute transition-all duration-300",
                    isMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
                  )} 
                  aria-hidden="true" 
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation with animation */}
        <nav 
          id="mobile-menu"
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-500 ease-out",
            isMenuOpen ? "max-h-[500px] opacity-100 py-4" : "max-h-0 opacity-0"
          )}
          aria-label="Menu de navegação móvel"
          aria-hidden={!isMenuOpen}
        >
          <ul className="space-y-1 stagger-children">
            {navLinks.map((link, index) => (
              <li key={link.label}>
                {link.children ? (
                  <div className="space-y-1">
                    <span className="block px-4 py-3 text-sm font-medium text-muted-foreground">
                      {link.label}
                    </span>
                    {link.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block px-8 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 focus-visible-ring"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                ) : (
                  <a
                    href={link.href}
                    className="block px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 focus-visible-ring"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ animationDelay: `${index * 75}ms` }}
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
            <li className="pt-4 border-t border-border mt-4">
              <div className="flex flex-col gap-3 px-4">
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl"
                  onClick={() => window.location.href = '/auth'}
                >
                  Entrar
                </Button>
                <Button 
                  className="w-full gradient-primary text-white rounded-xl"
                  onClick={() => window.location.href = '/auth'}
                >
                  Começar Grátis
                </Button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
