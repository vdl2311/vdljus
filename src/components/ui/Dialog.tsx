import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, description, children, maxWidth = "max-w-md" }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    
    // Focus trap setup
    const focusableElements = modalRef.current?.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    ) as NodeListOf<HTMLElement>;
    
    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];

    if (firstElement) {
      firstElement.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    
    // Prevent scrolling on body
    document.body.style.overflow = "hidden";
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "dialog-title" : undefined}
        aria-describedby={description ? "dialog-description" : undefined}
        className={`w-full ${maxWidth} bg-card border border-border rounded-xl shadow-2xl p-6 relative`}
      >
        {(title || description) && (
          <div className="flex justify-between items-start mb-6 text-center relative">
            <div className="w-full">
              {title && (
                <h3 id="dialog-title" className="text-lg font-bold text-foreground">
                  {title}
                </h3>
              )}
              {description && (
                <p id="dialog-description" className="text-sm text-muted-foreground mt-2 max-w-[280px] mx-auto leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="absolute right-0 top-0 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-sm"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
};
