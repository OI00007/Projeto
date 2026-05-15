import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
}

/**
 * SEOHead component for managing page-level meta tags
 * Updates document title and meta description dynamically
 */
export const SEOHead = ({
  title = 'Sistema Argom - Gestão Rural Inteligente',
  description = 'Sistema completo de gestão agrícola com IA, IoT e monitoramento em tempo real.',
  keywords = 'gestão rural, agricultura inteligente, agronegócio',
  image = '/og-image.jpg',
  url = '/',
  type = 'website',
  noindex = false,
}: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    const fullTitle = title.includes('Argom') ? title : `${title} | Sistema Argom`;
    document.title = fullTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Robots
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    }

    // Open Graph tags
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);

    // Twitter tags
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Cleanup function to restore default title
    return () => {
      document.title = 'Sistema Argom - Gestão Rural Inteligente';
    };
  }, [title, description, keywords, image, url, type, noindex]);

  return null;
};

export default SEOHead;
