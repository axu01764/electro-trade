import { useState } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: '首页', href: '#hero' },
    { label: '合作机会', href: '#opportunities' },
    { label: '产品系列', href: '#products' },
    { label: '合作权益', href: '#benefits' },
    { label: '申请流程', href: '#application' },
    { label: '常见问题', href: '#faq' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-muted-gray/30">
      <div className="max-w-[100rem] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => scrollToSection('#hero')}
              className="font-heading text-2xl md:text-3xl text-primary font-bold hover:text-primary/80 transition-colors"
            >
              Locanex
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="font-paragraph text-base text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              className="border-2 border-muted-gray text-foreground hover:bg-muted-gray/20"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              LINE咨询
            </Button>
            <Button 
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => scrollToSection('#application')}
            >
              申请样品
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-secondary/95 backdrop-blur-sm border-t border-muted-gray/30"
          >
            <nav className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left font-paragraph text-base text-foreground hover:text-primary transition-colors py-2"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-4 space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-muted-gray text-foreground hover:bg-muted-gray/20"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  LINE咨询
                </Button>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => scrollToSection('#application')}
                >
                  申请样品
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
