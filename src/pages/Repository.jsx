import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { GitBranch, Star, Fork, Download, Settings, Eye, Lock, Globe, FileText, Clock, Users } from 'lucide-react';
import FileTree from '../components/FileTree';
import CodeViewer from '../components/CodeViewer';

export default function Repository() {
  const { username, repoName } = useParams();
  const [repository, setRepository] = useState(null);
  const [currentPath, setCurrentPath] = useState('');
  const [currentFile, setCurrentFile] = useState(null);
  const [commits, setCommits] = useState([]);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('code');
  const navigate = useNavigate();

  useEffect(() => {
    const loadRepository = async () => {
      try {
        // Load repository data
        const repoRef = doc(db, 'repositories', `${username}/${repoName}`);
        const repoDoc = await getDoc(repoRef);
        
        if (!repoDoc.exists()) {
          navigate('/404');
          return;
        }

        const repoData = { id: repoDoc.id, ...repoDoc.data() };
        setRepository(repoData);

        // Load recent commits
        const commitsQuery = query(
          collection(db, 'commits'),
          where('repositoryId', '==', repoDoc.id),
          orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(commitsQuery, (snapshot) => {
          const commitsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setCommits(commitsData);
        });

        setLoading(false);
        return unsubscribe;
      } catch (error) {
        console.error('Error loading repository:', error);
        setLoading(false);
      }
    };

    loadRepository();
  }, [username, repoName, navigate]);

  const handleFileSelect = (file) => {
    setCurrentFile(file);
    setCurrentPath(file.path);
  };

  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
  };

  const text = {
    en: {
      code: 'Code',
      issues: 'Issues',
      pullRequests: 'Pull Requests',
      settings: 'Settings',
      clone: 'Clone',
      download: 'Download',
      star: 'Star',
      fork: 'Fork',
      watch: 'Watch',
      commits: 'commits',
      branches: 'branches',
      releases: 'releases',
      contributors: 'contributors',
      lastCommit: 'Latest commit',
      readme: 'README',
      license: 'License',
      languages: 'Languages',
      noDescription: 'No description provided'
    },
    ja: {
      code: 'コード',
      issues: 'イシュー',
      pullRequests: 'プルリクエスト',
      settings: '設定',
      clone: 'クローン',
      download: 'ダウンロード',
      star: 'スター',
      fork: 'フォーク',
      watch: 'ウォッチ',
      commits: 'コミット',
      branches: 'ブランチ',
      releases: 'リリース',
      contributors: 'コントリビューター',
      lastCommit: '最新のコミット',
      readme: 'README',
      license: 'ライセンス',
      languages: '言語',
      noDescription: '説明がありません'
    }
  };

  const t = text[language];

  if (loading) {
    return (
      <div className="repository-page loading">
        <div className="loading-state">
          <div className="loading-spinner" />
          <span>Loading repository...</span>
        </div>
      </div>
    );
  }

  if (!repository) {
    return (
      <div className="repository-page error">
        <div className="error-state">
          <h2>Repository not found</h2>
          <p>The repository you're looking for doesn't exist or has been moved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="repository-page">
      {/* Background Glow */}
      <div className="glow-top" />
      <div className="glow-side" />

      <div className="container">
        {/* Repository Header */}
        <header className="repo-header">
          <div className="repo-title-section">
            <div className="repo-path">
              <span className="username">{username}</span>
              <span className="separator">/</span>
              <span className="repo-name">{repository.name}</span>
              <div className="privacy-badge">
                {repository.private ? (
                  <><Lock size={12} /> Private</>
                ) : (
                  <><Globe size={12} /> Public</>
                )}
              </div>
            </div>
            
            <p className="repo-description">
              {repository.description || t.noDescription}
            </p>
            
            <div className="repo-meta">
              <span className="meta-item">
                <GitBranch size={14} />
                {repository.defaultBranch || 'main'}
              </span>
              <div className="divider" />
              <span className="meta-item">
                <Clock size={14} />
                Updated {formatTimeAgo(repository.updatedAt)}
              </span>
            </div>
          </div>

          <div className="repo-actions">
            <button className="action-button">
              <Eye size={14} />
              {t.watch}
            </button>
            <button className="action-button">
              <Star size={14} />
              {t.star}
            </button>
            <button className="action-button">
              <Fork size={14} />
              {t.fork}
            </button>
            
            <div className="primary-actions">
              <button className="pill-button secondary">
                <Download size={14} />
                {t.clone}
              </button>
              <button 
                className="language-toggle"
                onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
              >
                {language.toUpperCase()}
              </button>
            </div>
          </div>
        </header>

        {/* Repository Stats */}
        <div className="repo-stats">
          <div className="stat-item">
            <span className="stat-number">{commits.length}</span>
            <span className="stat-label">{t.commits}</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{repository.branches || 1}</span>
            <span className="stat-label">{t.branches}</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{repository.releases || 0}</span>
            <span className="stat-label">{t.releases}</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{repository.contributors || 1}</span>
            <span className="stat-label">{t.contributors}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="repo-nav">
          <button 
            className={`nav-tab ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            <FileText size={16} />
            {t.code}
          </button>
          <button 
            className={`nav-tab ${activeTab === 'issues' ? 'active' : ''}`}
            onClick={() => setActiveTab('issues')}
          >
            <Users size={16} />
            {t.issues}
            <span className="badge">0</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'pulls' ? 'active' : ''}`}
            onClick={() => setActiveTab('pulls')}
          >
            <GitBranch size={16} />
            {t.pullRequests}
            <span className="badge">0</span>
          </button>
        </nav>

        {/* Main Content */}
        <main className="repo-main">
          {activeTab === 'code' && (
            <div className="code-view">
              <div className="code-layout">
                <aside className="file-browser">
                  <div className="browser-header">
                    <h3>Files</h3>
                    {commits.length > 0 && (
                      <div className="last-commit">
                        <span className="commit-message">
                          {commits[0]?.message || 'Initial commit'}
                        </span>
                        <span className="commit-time">
                          {formatTimeAgo(commits[0]?.timestamp || repository.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>
                  <FileTree 
                    repository={repository}
                    onFileSelect={handleFileSelect}
                    currentPath={currentPath}
                  />
                </aside>

                <div className="content-viewer">
                  {currentFile ? (
                    <CodeViewer 
                      file={currentFile}
                      repository={repository}
                    />
                  ) : (
                    <div className="readme-viewer">
                      <div className="readme-header">
                        <FileText size={16} />
                        <span>README.md</span>
                      </div>
                      <div className="readme-content">
                        <h1>{repository.name}</h1>
                        <p className="japanese-subtitle">美しいコード、集中した開発</p>
                        <p>{repository.description || 'A beautiful repository for focused development.'}</p>
                        
                        <h2>Features</h2>
                        <ul>
                          <li>Clean, distraction-free interface</li>
                          <li>Beautiful syntax highlighting</li>
                          <li>Essential collaboration tools</li>
                          <li>Focus on code quality</li>
                        </ul>

                        <h2>Getting Started</h2>
                        <pre><code>git clone https://sanctuary.dev/{username}/{repository.name}.git</code></pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="issues-view">
              <div className="empty-state">
                <Users size={48} />
                <h3>No issues yet</h3>
                <p>Issues help you track and discuss ideas, bugs, and improvements.</p>
                <button className="pill-button primary">Create Issue</button>
              </div>
            </div>
          )}

          {activeTab === 'pulls' && (
            <div className="pulls-view">
              <div className="empty-state">
                <GitBranch size={48} />
                <h3>No pull requests yet</h3>
                <p>Pull requests help you collaborate and review code changes.</p>
                <button className="pill-button primary">Create Pull Request</button>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .repository-page {
          min-height: 100vh;
          background: #0b0b0f;
          color: rgba(245, 240, 250, 0.92);
          position: relative;
          overflow-x: hidden;
        }

        .repository-page.loading,
        .repository-page.error {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-state, .error-state {
          text-align: center;
          color: rgba(245, 240, 250, 0.45);
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(125, 232, 232, 0.2);
          border-top: 2px solid rgba(125, 232, 232, 0.6);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
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

        .glow-side {
          position: absolute;
          top: 50%;
          right: -100px;
          transform: translateY(-50%);
          width: 400px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(106, 176, 245, 0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 48px 24px;
          position: relative;
          z-index: 1;
        }

        .repo-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          animation: fadeInUp 0.6s ease both;
        }

        .repo-path {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .username {
          font-size: 18px;
          color: rgba(125, 232, 232, 0.8);
          text-decoration: none;
        }

        .separator {
          font-size: 18px;
          color: rgba(245, 240, 250, 0.3);
        }

        .repo-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 300;
          color: rgba(245, 240, 250, 0.92);
        }

        .privacy-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: rgba(125, 232, 232, 0.06);
          border: 0.5px solid rgba(125, 232, 232, 0.15);
          border-radius: 40px;
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(125, 232, 232, 0.7);
        }

        .repo-description {
          font-size: 16px;
          color: rgba(245, 240, 250, 0.6);
          margin: 0 0 12px 0;
          max-width: 600px;
        }

        .repo-meta {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: rgba(245, 240, 250, 0.45);
        }

        .divider {
          width: 1px;
          height: 16px;
          background: linear-gradient(to bottom, transparent, rgba(125, 232, 232, 0.25), transparent);
        }

        .repo-actions {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: rgba(125, 232, 232, 0.04);
          border: 0.5px solid rgba(125, 232, 232, 0.18);
          border-radius: 8px;
          color: rgba(245, 240, 250, 0.6);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-button:hover {
          background: rgba(125, 232, 232, 0.08);
          border-color: rgba(125, 232, 232, 0.3);
          color: rgba(245, 240, 250, 0.8);
        }

        .primary-actions {
          display: flex;
          gap: 8px;
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

        .repo-stats {
          display: flex;
          gap: 32px;
          margin-bottom: 24px;
          padding: 16px 0;
          border-bottom: 0.5px solid rgba(125, 232, 232, 0.1);
          animation: fadeInUp 0.6s ease 0.15s both;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 300;
          color: rgba(245, 240, 250, 0.92);
        }

        .stat-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(245, 240, 250, 0.4);
        }

        .repo-nav {
          display: flex;
          gap: 0;
          margin-bottom: 32px;
          border-bottom: 0.5px solid rgba(125, 232, 232, 0.1);
          animation: fadeInUp 0.6s ease 0.2s both;
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: rgba(245, 240, 250, 0.45);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .nav-tab:hover {
          color: rgba(245, 240, 250, 0.7);
        }

        .nav-tab.active {
          color: rgba(125, 232, 232, 0.9);
          border-bottom-color: rgba(125, 232, 232, 0.6);
        }

        .nav-tab .badge {
          background: rgba(125, 232, 232, 0.15);
          color: rgba(125, 232, 232, 0.8);
          padding: 2px 6px;
          border-radius: 10px;
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
        }

        .repo-main {
          animation: fadeInUp 0.6s ease 0.25s both;
        }

        .code-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 24px;
          min-height: 600px;
        }

        .file-browser {
          background: rgba(125, 232, 232, 0.04);
          border: 0.5px solid rgba(125, 232, 232, 0.18);
          border-radius: 12px;
          padding: 20px;
          position: sticky;
          top: 24px;
          height: fit-content;
          max-height: 80vh;
          overflow-y: auto;
        }

        .browser-header {
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 0.5px solid rgba(125, 232, 232, 0.15);
        }

        .browser-header h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 300;
          margin: 0 0 8px 0;
          color: rgba(245, 240, 250, 0.92);
        }

        .last-commit {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .commit-message {
          font-size: 12px;
          color: rgba(245, 240, 250, 0.6);
          line-height: 1.4;
        }

        .commit-time {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: rgba(245, 240, 250, 0.3);
          letter-spacing: 0.05em;
        }

        .content-viewer {
          background: rgba(125, 232, 232, 0.04);
          border: 0.5px solid rgba(125, 232, 232, 0.18);
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }

        .readme-viewer {
          padding: 24px;
        }

        .readme-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 0.5px solid rgba(125, 232, 232, 0.15);
          color: rgba(245, 240, 250, 0.6);
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
        }

        .readme-content {
          line-height: 1.7;
        }

        .readme-content h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 300;
          margin: 0 0 8px 0;
          color: rgba(245, 240, 250, 0.92);
        }

        .japanese-subtitle {
          font-style: italic;
          color: rgba(125, 232, 232, 0.7);
          margin: 0 0 24px 0;
          font-size: 14px;
        }

        .readme-content h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 300;
          margin: 24px 0 12px 0;
          color: rgba(245, 240, 250, 0.8);
          position: relative;
          padding-left: 12px;
        }

        .readme-content h2::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(to bottom, rgba(125, 232, 232, 0.6), rgba(106, 176, 245, 0.6));
          border-radius: 1px;
        }

        .readme-content p {
          color: rgba(245, 240, 250, 0.6);
          margin: 0 0 16px 0;
        }

        .readme-content ul {
          margin: 0 0 16px 0;
          padding-left: 20px;
        }

        .readme-content li {
          color: rgba(245, 240, 250, 0.6);
          margin: 6px 0;
        }

        .readme-content pre {
          background: rgba(0, 0, 0, 0.3);
          border: 0.5px solid rgba(125, 232, 232, 0.15);
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
          overflow-x: auto;
        }

        .readme-content code {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(125, 232, 232, 0.9);
          letter-spacing: 0.05em;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 24px;
          text-align: center;
          color: rgba(245, 240, 250, 0.45);
        }

        .empty-state svg {
          margin-bottom: 16px;
          opacity: 0.3;
        }

        .empty-state h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 300;
          margin: 0 0 8px 0;
          color: rgba(245, 240, 250, 0.6);
        }

        .empty-state p {
          margin: 0 0 24px 0;
          max-width: 400px;
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

        .pill-button.secondary {
          background: rgba(106, 176, 245, 0.1);
          border-color: rgba(106, 176, 245, 0.35);
          color: rgba(106, 176, 245, 0.9);
        }

        .pill-button.secondary:hover {
          background: rgba(106, 176, 245, 0.18);
          border-color: rgba(106, 176, 245, 0.6);
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

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .code-layout {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .file-browser {
            position: static;
            max-height: 300px;
          }
        }

        @media (max-width: 768px) {
          .repo-header {
            flex-direction: column;
            gap: 24px;
            align-items: flex-start;
          }

          .repo-actions {
            width: 100%;
            justify-content: space-between;
          }

          .repo-stats {
            flex-wrap: wrap;
            gap: 16px;
          }

          .nav-tab {
            padding: 12px 16px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}