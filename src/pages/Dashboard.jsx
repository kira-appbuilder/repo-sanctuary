import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { checkEntitlements } from '../lib/revenuecat';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Plus, Search, GitBranch, Lock, Globe } from 'lucide-react';
import RepositoryCard from '../components/RepositoryCard';

export default function Dashboard() {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [language, setLanguage] = useState('en');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      // Check subscription status
      const proStatus = await checkEntitlements();
      setIsPro(proStatus);

      // Listen to user's repositories
      const q = query(
        collection(db, 'repositories'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('updatedAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const repos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRepositories(repos);
        setLoading(false);
      });

      return unsubscribe;
    };

    loadData();
  }, [navigate]);

  const filteredRepositories = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const privateRepos = repositories.filter(repo => repo.private);
  const canCreatePrivate = isPro || privateRepos.length < 3;

  const text = {
    en: {
      title: "Your Repositories",
      subtitle: "Clean code, focused development",
      search: "Search repositories...",
      createNew: "New Repository",
      upgrade: "Upgrade to Pro",
      noRepos: "No repositories yet",
      getStarted: "Create your first repository to get started",
      privateLimit: "Free tier: {count}/3 private repositories",
      unlimited: "Unlimited private repositories"
    },
    ja: {
      title: "リポジトリ",
      subtitle: "美しいコード、集中した開発",
      search: "リポジトリを検索...",
      createNew: "新規作成",
      upgrade: "Pro にアップグレード",
      noRepos: "リポジトリがありません",
      getStarted: "最初のリポジトリを作成して始めましょう",
      privateLimit: "無料プラン: {count}/3 プライベートリポジトリ",
      unlimited: "無制限のプライベートリポジトリ"
    }
  };

  const t = text[language];

  return (
    <div className="dashboard-page">
      {/* Background Glow */}
      <div className="glow-top" />
      <div className="glow-bottom" />

      <div className="container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="title-section">
              <span className="eyebrow">Dashboard</span>
              <h1 className="title">{t.title}</h1>
              <p className="subtitle">{t.subtitle}</p>
            </div>
            
            <div className="header-actions">
              <button 
                className="pill-button primary"
                onClick={() => navigate('/create-repository')}
              >
                <Plus size={14} />
                {t.createNew}
              </button>
              
              <button 
                className="language-toggle"
                onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
              >
                {language.toUpperCase()}
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="search-section">
            <div className="search-input">
              <Search size={16} />
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Status Bar */}
          <div className="status-bar">
            <div className="repo-stats">
              <div className="stat">
                <GitBranch size={14} />
                <span>{repositories.length} repositories</span>
              </div>
              <div className="divider" />
              <div className="stat">
                <Globe size={14} />
                <span>{repositories.filter(r => !r.private).length} public</span>
              </div>
              <div className="stat">
                <Lock size={14} />
                <span>{privateRepos.length} private</span>
              </div>
            </div>

            <div className="subscription-status">
              {isPro ? (
                <span className="status-badge pro">
                  <span className="status-dot pro" />
                  Pro
                </span>
              ) : (
                <span className="status-badge free">
                  <span className="status-dot" />
                  {t.privateLimit.replace('{count}', privateRepos.length)}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-main">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <span>Loading repositories...</span>
            </div>
          ) : filteredRepositories.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <GitBranch size={48} />
              </div>
              <h2>{t.noRepos}</h2>
              <p>{t.getStarted}</p>
              <button 
                className="pill-button primary"
                onClick={() => navigate('/create-repository')}
              >
                <Plus size={14} />
                {t.createNew}
              </button>
            </div>
          ) : (
            <div className="repositories-grid">
              {filteredRepositories.map((repo, index) => (
                <RepositoryCard 
                  key={repo.id}
                  repository={repo}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                />
              ))}
            </div>
          )}
        </main>

        {/* Upgrade CTA */}
        {!isPro && (
          <div className="upgrade-section">
            <div className="upgrade-card">
              <div className="upgrade-content">
                <h3>Unlock Your Full Potential</h3>
                <p className="japanese-copy">無限の可能性を解き放つ</p>
                <ul>
                  <li>Unlimited private repositories</li>
                  <li>Advanced code review tools</li>
                  <li>Team collaboration features</li>
                  <li>Priority support</li>
                </ul>
              </div>
              <div className="upgrade-actions">
                <span className="price">$8<span>/month</span></span>
                <button 
                  className="pill-button primary"
                  onClick={() => navigate('/upgrade')}
                >
                  {t.upgrade}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          background: #0b0b0f;
          color: rgba(245, 240, 250, 0.92);
          position: relative;
          overflow-x: hidden;
        }

        .glow-top {
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(ellipse, rgba(125, 232, 232, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .glow-bottom {
          position: absolute;
          bottom: -120px;
          right: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(106, 176, 245, 0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px;
          position: relative;
          z-index: 1;
        }

        .dashboard-header {
          margin-bottom: 48px;
          animation: fadeInUp 0.6s ease both;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.25em;
          color: rgba(125, 232, 232, 0.7);
          text-transform: uppercase;
          margin-bottom: 8px;
          display: block;
        }

        .title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 48px;
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, rgba(245, 240, 250, 0.92), rgba(125, 232, 232, 0.8));
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 16px;
          color: rgba(245, 240, 250, 0.45);
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .language-toggle {
          background: rgba(125, 232, 232, 0.1);
          border: 0.5px solid rgba(125, 232, 232, 0.25);
          border-radius: 8px;
          padding: 8px 12px;
          color: rgba(125, 232, 232, 0.8);
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s;
        }

        .language-toggle:hover {
          background: rgba(125, 232, 232, 0.15);
          border-color: rgba(125, 232, 232, 0.4);
        }

        .search-section {
          margin-bottom: 24px;
        }

        .search-input {
          position: relative;
          max-width: 400px;
        }

        .search-input svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(125, 232, 232, 0.4);
        }

        .search-input input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          background: rgba(125, 232, 232, 0.04);
          border: 0.5px solid rgba(125, 232, 232, 0.18);
          border-radius: 16px;
          color: rgba(245, 240, 250, 0.92);
          font-size: 14px;
          transition: all 0.3s;
        }

        .search-input input:focus {
          outline: none;
          border-color: rgba(125, 232, 232, 0.45);
          background: rgba(125, 232, 232, 0.06);
        }

        .search-input input::placeholder {
          color: rgba(245, 240, 250, 0.3);
        }

        .status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          background: rgba(125, 232, 232, 0.04);
          border: 0.5px solid rgba(125, 232, 232, 0.18);
          border-radius: 12px;
        }

        .repo-stats {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: rgba(245, 240, 250, 0.6);
        }

        .divider {
          width: 1px;
          height: 16px;
          background: linear-gradient(to bottom, transparent, rgba(125, 232, 232, 0.25), transparent);
        }

        .subscription-status {
          display: flex;
          align-items: center;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(125, 232, 232, 0.06);
          border: 0.5px solid rgba(125, 232, 232, 0.15);
          border-radius: 40px;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
        }

        .status-badge.pro {
          background: rgba(106, 176, 245, 0.08);
          border-color: rgba(106, 176, 245, 0.25);
          color: rgba(106, 176, 245, 0.8);
        }

        .status-badge.free {
          color: rgba(125, 232, 232, 0.6);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(125, 232, 232, 0.4);
          animation: pulse 2s infinite;
        }

        .status-dot.pro {
          background: rgba(106, 176, 245, 0.6);
        }

        .dashboard-main {
          animation: fadeInUp 0.6s ease 0.15s both;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 64px 24px;
          color: rgba(245, 240, 250, 0.45);
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(125, 232, 232, 0.2);
          border-top: 2px solid rgba(125, 232, 232, 0.6);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .empty-state {
          text-align: center;
          padding: 64px 24px;
        }

        .empty-icon {
          margin-bottom: 24px;
          opacity: 0.3;
        }

        .empty-state h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 300;
          margin: 0 0 8px 0;
          color: rgba(245, 240, 250, 0.6);
        }

        .empty-state p {
          color: rgba(245, 240, 250, 0.45);
          margin: 0 0 32px 0;
        }

        .repositories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }

        .upgrade-section {
          margin-top: 64px;
          animation: fadeInUp 0.6s ease 0.3s both;
        }

        .upgrade-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 32px;
          background: rgba(106, 176, 245, 0.04);
          border: 0.5px solid rgba(106, 176, 245, 0.18);
          border-radius: 16px;
          position: relative;
          overflow: hidden;
        }

        .upgrade-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(to bottom, rgba(125, 232, 232, 0.6), rgba(106, 176, 245, 0.6));
        }

        .upgrade-content h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 300;
          margin: 0 0 4px 0;
        }

        .japanese-copy {
          font-size: 14px;
          color: rgba(245, 240, 250, 0.45);
          margin: 0 0 16px 0;
          font-style: italic;
        }

        .upgrade-content ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 4px;
        }

        .upgrade-content li {
          font-size: 14px;
          color: rgba(245, 240, 250, 0.6);
          position: relative;
          padding-left: 12px;
        }

        .upgrade-content li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: rgba(106, 176, 245, 0.6);
        }

        .upgrade-actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 300;
          color: rgba(245, 240, 250, 0.92);
        }

        .price span {
          font-size: 16px;
          color: rgba(245, 240, 250, 0.45);
        }

        .pill-button {
          background: rgba(125, 232, 232, 0.1);
          border: 0.5px solid rgba(125, 232, 232, 0.35);
          border-radius: 40px;
          padding: 12px 28px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          color: rgba(125, 232, 232, 0.9);
          text-transform: uppercase;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          text-decoration: none;
        }

        .pill-button:hover {
          background: rgba(125, 232, 232, 0.18);
          border-color: rgba(125, 232, 232, 0.6);
          transform: translateY(-1px);
        }

        .pill-button:active {
          transform: translateY(0) scale(0.98);
        }

        .pill-button.primary {
          background: rgba(125, 232, 232, 0.15);
          border-color: rgba(125, 232, 232, 0.45);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 24px;
            align-items: flex-start;
          }

          .upgrade-card {
            flex-direction: column;
            gap: 24px;
            text-align: center;
          }

          .repositories-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}