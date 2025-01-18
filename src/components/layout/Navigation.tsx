import React, { useState } from 'react';
import { Menu, X, Image } from 'lucide-react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#1E1E1E] border-b border-gray-800 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <Image className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">CMD Image Compressor</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="#" icon={<Image className="w-4 h-4" />}>
              Compress Images
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 p-2 rounded-lg"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="py-4 space-y-4">
            <MobileNavLink href="#" icon={<Image className="w-4 h-4" />}>
              Compress Images
            </MobileNavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-gray-300 hover:text-white flex items-center space-x-2 transition-colors duration-200"
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}

function MobileNavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-gray-300 hover:text-white flex items-center space-x-2 px-4 py-2 transition-colors duration-200"
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}