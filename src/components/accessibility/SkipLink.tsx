interface SkipLinkProps {
  targetId?: string;
  label?: string;
}

/**
 * SkipLink component for keyboard accessibility
 * Allows users to skip navigation and jump to main content
 */
export const SkipLink = ({ 
  targetId = 'main-content', 
  label = 'Pular para o conteúdo principal' 
}: SkipLinkProps) => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:font-medium transition-all"
      aria-label={label}
    >
      {label}
    </a>
  );
};

export default SkipLink;
