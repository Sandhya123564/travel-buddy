import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { 
  Plane, 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard,
  Settings
} from 'lucide-react';

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'buddy': return '/buddy/dashboard';
      default: return '/traveler/dashboard';
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 text-xl font-heading font-bold text-foreground"
              data-testid="nav-logo"
            >
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span>Travel<span className="text-primary-600">Buddy</span></span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors hover:text-primary-600 ${isActive('/') ? 'text-primary-600' : 'text-slate-600'}`}
                data-testid="nav-home"
              >
                Home
              </Link>
              <Link 
                to="/how-it-works" 
                className={`text-sm font-medium transition-colors hover:text-primary-600 ${isActive('/how-it-works') ? 'text-primary-600' : 'text-slate-600'}`}
                data-testid="nav-how-it-works"
              >
                How It Works
              </Link>
              <Link 
                to="/search" 
                className={`text-sm font-medium transition-colors hover:text-primary-600 ${isActive('/search') ? 'text-primary-600' : 'text-slate-600'}`}
                data-testid="nav-search"
              >
                Find a Buddy
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-2"
                      data-testid="user-menu-trigger"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="text-sm font-medium">{user.email.split('@')[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => navigate(getDashboardLink())} data-testid="menu-dashboard">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')} data-testid="menu-settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600" data-testid="menu-logout">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/login')}
                    data-testid="nav-login"
                  >
                    Log in
                  </Button>
                  <Button 
                    onClick={() => navigate('/register')}
                    className="bg-primary-600 hover:bg-primary-700 rounded-full px-6 btn-primary-shadow"
                    data-testid="nav-register"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200 animate-slide-up">
              <nav className="flex flex-col gap-4">
                <Link 
                  to="/" 
                  className="text-sm font-medium text-slate-600 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/how-it-works" 
                  className="text-sm font-medium text-slate-600 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link 
                  to="/search" 
                  className="text-sm font-medium text-slate-600 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find a Buddy
                </Link>
                {user ? (
                  <>
                    <Link 
                      to={getDashboardLink()} 
                      className="text-sm font-medium text-slate-600 hover:text-primary-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="text-sm font-medium text-red-600 text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                    >
                      Log in
                    </Button>
                    <Button 
                      onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 text-xl font-heading font-bold mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
                  <Plane className="w-5 h-5 text-white" />
                </div>
                <span>TravelBuddy</span>
              </Link>
              <p className="text-slate-400 text-sm max-w-md">
                Connect with verified travel companions for a safer, more enjoyable journey. 
                Whether you're a first-time flyer or frequent traveler, find your perfect buddy.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/search" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Find a Buddy
                </Link>
                <Link to="/how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">
                  How It Works
                </Link>
                <Link to="/register" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Become a Buddy
                </Link>
              </nav>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Support</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/help" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Help Center
                </Link>
                <Link to="/safety" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Safety Guidelines
                </Link>
                <Link to="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </nav>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} TravelBuddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
