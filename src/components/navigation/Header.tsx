
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useShoppingCart } from '../../contexts/ShoppingCartContext';
import { useAuth } from '../../contexts/AuthContext';
import CartDropdown from './CartDropdown';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { WineIcon } from '../icons/WineIcon';

const Header: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { cartCount } = useShoppingCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setShowMobileMenu(false);
  }, [location]);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-2'
          : 'bg-gradient-to-r from-orange-700 to-amber-600 text-white py-3'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center mr-4">
              <div style={{ fontSize: '1.125rem' }} className={`${isScrolled ? 'text-orange-600' : 'text-white'}`}>
                <div className="flex items-center">
                  <WineIcon className={`mr-2 h-7 w-7 ${isScrolled ? 'text-orange-600' : 'text-white'}`} />
                  DDS-CI DISTRIBUTION
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex space-x-6">
              <Link
                to="/"
                className={`hover:text-orange-200 transition ${
                  isScrolled
                    ? 'text-gray-700 hover:text-orange-600'
                    : 'text-white hover:text-orange-200'
                } ${location.pathname === '/' ? 'border-b-2 border-current pb-1' : ''}`}
              >
                Accueil
              </Link>
              <Link
                to="/catalog"
                className={`hover:text-orange-200 transition ${
                  isScrolled
                    ? 'text-gray-700 hover:text-orange-600'
                    : 'text-white hover:text-orange-200'
                } ${location.pathname === '/catalog' ? 'border-b-2 border-current pb-1' : ''}`}
              >
                Catalogue
              </Link>
              <Link
                to="/promotions"
                className={`hover:text-orange-200 transition ${
                  isScrolled
                    ? 'text-gray-700 hover:text-orange-600'
                    : 'text-white hover:text-orange-200'
                } ${location.pathname === '/promotions' ? 'border-b-2 border-current pb-1' : ''}`}
              >
                Promotions
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div
              className="relative cursor-pointer"
              onClick={() => setShowCart(!showCart)}
            >
              <ShoppingCart size={20} className={isScrolled ? 'text-gray-700' : 'text-white'} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              {showCart && <CartDropdown onClose={() => setShowCart(false)} />}
            </div>

            <button
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X size={24} className={isScrolled ? 'text-gray-700' : 'text-white'} />
              ) : (
                <Menu size={24} className={isScrolled ? 'text-gray-700' : 'text-white'} />
              )}
            </button>
          </div>
        </div>
      </div>

      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200 mt-3">
          <nav className="px-4 py-2 space-y-1">
            <Link
              to="/"
              className={`block py-2 ${location.pathname === '/' ? 'text-orange-600 font-medium' : 'text-gray-700'}`}
            >
              Accueil
            </Link>
            <Link
              to="/catalog"
              className={`block py-2 ${location.pathname === '/catalog' ? 'text-orange-600 font-medium' : 'text-gray-700'}`}
            >
              Catalogue
            </Link>
            <Link
              to="/promotions"
              className={`block py-2 ${location.pathname === '/promotions' ? 'text-orange-600 font-medium' : 'text-gray-700'}`}
            >
              Promotions
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
