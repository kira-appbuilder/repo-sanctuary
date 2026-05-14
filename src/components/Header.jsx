import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Settings, 
  User, 
  LogOut, 
  Globe,
  Crown,
  GitBranch,
  Menu,
  X
} from 'lucide-react';
import { auth, logOut } from '../lib/firebase';
import { checkProEntitlement } from '../lib/revenuecat';

const Header = ({ language = 'en', onLanguageChange }) => {
  const [user, setUser] = useState(null);
  const [isProUser, setIsProUser] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        try {
          const hasProAccess = await checkProEntitlement();
          setIsProUser(hasProAccess);
        } catch (error) {
          console.error('Error checking pro status:', error);
        }
      } else {
        setIsProUser(false);
      }
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      await logOut();
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ja' : 'en';
    onLanguageChange?.(newLang);
  };

  const text = {
    en: {
      search: 'Search repositories...',
      newRepo: 'New Repository',
      dashboard: 'Dashboard',
      profile: 'Profile',
      settings: 'Settings',
      signOut: 'Sign Out',
      upgrade: 'Upgrade to Pro',
      tagline: 'Code sanctuary. Pure focus.'
    },
    ja: {
      search: 'リポジトリを検索...',
      newRepo: '新しいリポジトリ',
      dashboard: 'ダッシュボード',
      profile: 'プロフィール',
      settings: '設定',
      signOut: 'サインアウト',
      upgrade: 'プロにアップグレード',
      tagline: 'コードの聖域。純粋な集中。'
    }
  };

  const t = text[language];

  return (
    <>
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 -translate-y-32 w-96 h-96 bg-gradient-radial from-cyan-500/8 via-cyan-500/4 to-transparent rounded-full pointer-events-none" />
      
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-cyan-500/10 bg-[#0b0b0f]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <GitBranch className="w-8 h-8 text-cyan-400" />
                  <div className="absolute inset-0 bg-cyan-400/20 blur-lg group-hover:bg-cyan-400/30 transition-all duration-300" />
                </div>
                <div>
                  <h1 className="text-xl font-light text-[rgba(245,240,250,0.92)] tracking-tight" 
                      style={{fontFamily: 'Cormorant Garamond, serif'}}>
                    RepoSanctuary
                  </h1>
                  <p className="text-[10px] text-cyan-400/60 uppercase tracking-wide leading-none"
                     style={{fontFamily: 'Space Mono, monospace'}}>
                    {t.tagline}
                  </p>
                </div>
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgba(245,240,250,0.45)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.search}
                    className="w-full pl-12 pr-4 py-3 bg-[rgba(125,232,232,0.04)] border border-cyan-500/18 rounded-2xl text-[rgba(245,240,250,0.92)] placeholder-[rgba(245,240,250,0.45)] focus:outline-none focus:border-cyan-500/45 focus:bg-[rgba(125,232,232,0.06)] transition-all duration-300"
                  />
                </div>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-full bg-[rgba(125,232,232,0.06)] border border-cyan-500/15 text-cyan-400/70 hover:text-cyan-400 hover:bg-[rgba(125,232,232,0.12)] transition-all duration-200"
              >
                <Globe className="w-4 h-4" />
              </button>

              {user && (
                <>
                  {/* New Repository Button */}
                  <Link
                    to="/new"
                    className="hidden sm:flex items-center space-x-2 px-6 py-2.5 bg-[rgba(125,232,232,0.1)] border border-cyan-500/35 rounded-full text-cyan-400 hover:bg-[rgba(125,232,232,0.18)] hover:border-cyan-500/60 transition-all duration-200 transform hover:-translate-y-0.5"
                    style={{fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '0.15em'}}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="uppercase">{t.newRepo}</span>
                  </Link>

                  {/* Pro Status Badge */}
                  {isProUser && (
                    <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-[rgba(125,232,232,0.06)] border border-cyan-500/15 rounded-full">
                      <Crown className="w-3 h-3 text-cyan-400/70" />
                      <span className="text-[10px] text-[rgba(125,232,232,0.5)] uppercase tracking-wide"
                            style={{fontFamily: 'Space Mono, monospace'}}>
                        Pro
                      </span>
                    </div>
                  )}

                  {/* User Menu - Desktop */}
                  <div className="hidden md:flex relative">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="flex items-center space-x-2 p-2 rounded-full bg-[rgba(125,232,232,0.04)] border border-cyan-500/15 text-[rgba(245,240,250,0.92)] hover:bg-[rgba(125,232,232,0.08)] transition-all duration-200"
                    >
                      <User className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-[rgba(125,232,232,0.04)] border border-cyan-500/18 rounded-2xl p-2 backdrop-blur-xl">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-[rgba(245,240,250,0.92)] hover:bg-[rgba(125,232,232,0.08)] transition-all duration-200"
                        >
                          <User className="w-4 h-4" />
                          <span>{t.dashboard}</span>
                        </Link>
                        
                        <Link
                          to="/settings"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-[rgba(245,240,250,0.92)] hover:bg-[rgba(125,232,232,0.08)] transition-all duration-200"
                        >
                          <Settings className="w-4 h-4" />
                          <span>{t.settings}</span>
                        </Link>

                        {!isProUser && (
                          <Link
                            to="/upgrade"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-cyan-400 hover:bg-[rgba(125,232,232,0.08)] transition-all duration-200"
                          >
                            <Crown className="w-4 h-4" />
                            <span>{t.upgrade}</span>
                          </Link>
                        )}

                        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent my-2" />
                        
                        <button
                          onClick={handleSignOut}
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-[rgba(245,240,250,0.92)] hover:bg-[rgba(125,232,232,0.08)] transition-all duration-200 w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t.signOut}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 rounded-full bg-[rgba(125,232,232,0.04)] border border-cyan-500/15 text-[rgba(245,240,250,0.92)] hover:bg-[rgba(125,232,232,0.08)] transition-all duration-200"
                  >
                    {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && user && (
          <div className="md:hidden border-t border-cyan-500/10 bg-[#0b0b0f]/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgba(245,240,250,0.45)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.search}
                    className="w-full pl-12 pr-4 py-3 bg-[rgba(125,232,232,0.04)] border border-cyan-500/18 rounded-2xl text-[rgba(245,240,250,0.92)] placeholder-[rgba(245,240,250,0.45)] focus:outline-none focus:border-cyan-500/45 transition-all duration-300"
                  />
                </div>
              </form>

              <Link
                to="/new"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-cyan-400 hover:bg-[rgba(125,232,232,0.08)] transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>{t.newRepo}</span>
              </Link>

              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-[rgba(245,240,250,0.92)] hover:bg-[rgba(125,232,232,0.08)] transition-all duration-200"
              >
                <User className="w-4 h-4" />
                <span>{t.dashboard}</span>
              </Link>

              {!isProUser && (
                <Link
                  to="/upgrade"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-cyan-400 hover:bg-[rgba(125,232,232,0.08)] transition-all duration-200"
                >
                  <Crown className="w-4 h-4" />
                  <span>{t.upgrade}</span>
                </Link>
              )}

              <button
                onClick={handleSignOut}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-[rgba(245,240,250,0.92)] hover:bg-[rgba(125,232,232,0.08)] transition-all duration-200 w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.signOut}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;