import React from 'react';
import { Star, GitFork, Clock, Lock, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RepositoryCard = ({ repository, isOwner = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/repository/${repository.id}`);
  };

  const formatDate = (timestamp) => {
    const date = timestamp?.toDate?.() || new Date(timestamp);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      React: '#61dafb',
      Python: '#3572a5',
      Java: '#b07219',
      Go: '#00add8',
      Rust: '#dea584',
      CSS: '#563d7c',
      HTML: '#e34c26',
      Vue: '#4fc08d',
      C: '#555555',
      'C++': '#f34b7d',
      'C#': '#239120',
      PHP: '#4f5d95',
      Ruby: '#701516',
      Swift: '#fa7343',
      Kotlin: '#a97bff',
      Dart: '#00b4ab',
      Shell: '#89e051'
    };
    return colors[language] || '#7de8e8';
  };

  return (
    <div 
      className="repository-card"
      onClick={handleClick}
      style={{
        background: 'rgba(125, 232, 232, 0.04)',
        border: '0.5px solid rgba(125, 232, 232, 0.18)',
        borderRadius: '16px',
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '16px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(125, 232, 232, 0.45)';
        e.currentTarget.style.background = 'rgba(125, 232, 232, 0.06)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(125, 232, 232, 0.18)';
        e.currentTarget.style.background = 'rgba(125, 232, 232, 0.04)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Left border accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '2px',
        height: '100%',
        background: 'linear-gradient(to bottom, #7de8e8, #6ab0f5)',
        opacity: 0.4
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h3 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '24px',
            fontWeight: 300,
            color: 'rgba(245, 240, 250, 0.92)',
            margin: 0,
            fontStyle: 'italic'
          }}>
            {repository.name}
          </h3>
          
          {repository.isPrivate ? (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: 'rgba(125, 232, 232, 0.06)',
              border: '0.5px solid rgba(125, 232, 232, 0.15)',
              borderRadius: '40px',
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              color: 'rgba(125, 232, 232, 0.5)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              <Lock size={10} />
              PRIVATE
            </div>
          ) : (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: 'rgba(125, 232, 232, 0.06)',
              border: '0.5px solid rgba(125, 232, 232, 0.15)',
              borderRadius: '40px',
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              color: 'rgba(125, 232, 232, 0.5)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              <Globe size={10} />
              PUBLIC
            </div>
          )}
        </div>

        {isOwner && (
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '10px',
            color: 'rgba(106, 176, 245, 0.7)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}>
            OWNER
          </div>
        )}
      </div>

      {repository.description && (
        <p style={{
          fontFamily: 'Zen Kaku Gothic New, sans-serif',
          fontSize: '15px',
          fontWeight: 300,
          color: 'rgba(245, 240, 250, 0.45)',
          lineHeight: 1.65,
          margin: '0 0 16px 0'
        }}>
          {repository.description}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {repository.language && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: getLanguageColor(repository.language)
              }} />
              <span style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '11px',
                color: 'rgba(245, 240, 250, 0.45)',
                letterSpacing: '0.05em'
              }}>
                {repository.language}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={12} style={{ color: 'rgba(245, 240, 250, 0.2)' }} />
            <span style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '11px',
              color: 'rgba(245, 240, 250, 0.45)'
            }}>
              {repository.stars || 0}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <GitFork size={12} style={{ color: 'rgba(245, 240, 250, 0.2)' }} />
            <span style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '11px',
              color: 'rgba(245, 240, 250, 0.45)'
            }}>
              {repository.forks || 0}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={12} style={{ color: 'rgba(245, 240, 250, 0.2)' }} />
          <span style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '11px',
            color: 'rgba(245, 240, 250, 0.2)',
            letterSpacing: '0.05em'
          }}>
            {formatDate(repository.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RepositoryCard;