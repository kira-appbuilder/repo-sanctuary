import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import { Copy, Check, Download, Eye, EyeOff } from 'lucide-react';

// Import Prism languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-dart';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';

// Import Prism theme (customize for dark theme)
import './CodeViewer.css';

const CodeViewer = ({ file, repository }) => {
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [highlightedCode, setHighlightedCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (file) {
      loadFileContent();
    }
  }, [file]);

  useEffect(() => {
    if (code && file) {
      highlightCode();
    }
  }, [code, file, showLineNumbers]);

  const loadFileContent = async () => {
    setLoading(true);
    // Simulate loading file content - in real app this would fetch from Git API
    try {
      let mockContent = '';
      
      if (file.name.endsWith('.jsx')) {
        mockContent = `import React, { useState } from 'react';
import { Star, GitFork } from 'lucide-react';

const ${file.name.replace('.jsx', '')} = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="component">
      <h1>Beautiful React Component</h1>
      <p>This is a sample component file.</p>
      {/* コードの美しさを追求 */}
      <button onClick={() => setIsLoaded(true)}>
        Load Content
      </button>
    </div>
  );
};

export default ${file.name.replace('.jsx', '')};`;
      } else if (file.name === 'README.md') {
        mockContent = `# ${repository?.name || 'Repository'}

A beautiful, minimal Git repository hosted on RepoSanctuary.

## Features

- Clean, distraction-free interface
- Beautiful syntax highlighting
- Essential collaboration tools
- Zero algorithmic feeds

## Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

## Usage

This project demonstrates clean code architecture and beautiful design.

### コードの聖域

RepoSanctuary - where code finds its sanctuary.

## Contributing

Contributions are welcome! Please read our contributing guidelines.

## License

MIT License - see LICENSE file for details.`;
      } else if (file.name === 'package.json') {
        mockContent = `{
  "name": "${repository?.name || 'repo-sanctuary'}",
  "version": "1.0.0",
  "description": "A minimal, distraction-free Git hosting platform",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "firebase": "^9.17.1",
    "@revenuecat/purchases-js": "^1.0.0",
    "prismjs": "^1.29.0",
    "lucide-react": "^0.220.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^3.1.0",
    "vite": "^4.1.0",
    "eslint": "^8.35.0"
  }
}`;
      } else if (file.name.endsWith('.css')) {
        mockContent = `/* RepoSanctuary Styles */

:root {
  --kira-bg: #0b0b0f;
  --kira-surface: rgba(255, 255, 255, 0.03);
  --kira-cyan: #7de8e8;
  --kira-blue: #6ab0f5;
  --kira-text-primary: rgba(245, 240, 250, 0.92);
  --kira-text-secondary: rgba(245, 240, 250, 0.45);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--kira-bg);
  color: var(--kira-text-primary);
  font-family: 'Zen Kaku Gothic New', sans-serif;
  line-height: 1.6;
}

/* Beautiful typography */
h1, h2, h3 {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-style: italic;
}

/* コードの美しさ */
.code-viewer {
  background: rgba(125, 232, 232, 0.02);
  border: 0.5px solid rgba(125, 232, 232, 0.15);
  border-radius: 16px;
  overflow: hidden;
}

/* Sanctuary for developers */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.6s ease both;
}`;
      } else {
        mockContent = `// ${file.name}
// Beautiful code lives here

const sanctuary = {
  name: '${file.name}',
  type: 'code',
  beauty: 'infinite',
  purpose: 'to inspire'
};

// コードの聖域で、美しいコードを書く
function createBeauty() {
  return 'Clean code is a love letter to future developers';
}

export default sanctuary;`;
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setCode(mockContent);
    } catch (error) {
      console.error('Error loading file:', error);
      setCode('// Error loading file content');
    } finally {
      setLoading(false);
    }
  };

  const getLanguageFromFile = (filename) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    const languageMap = {
      'js': 'javascript',
      'jsx': 'jsx',
      'ts': 'typescript',
      'tsx': 'tsx',
      'py': 'python',
      'java': 'java',
      'go': 'go',
      'rs': 'rust',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'md': 'markdown',
      'sh': 'bash',
      'bash': 'bash',
      'php': 'php',
      'rb': 'ruby',
      'swift': 'swift',
      'kt': 'kotlin',
      'dart': 'dart',
      'sql': 'sql',
      'yml': 'yaml',
      'yaml': 'yaml'
    };
    
    return languageMap[extension] || 'markup';
  };

  const highlightCode = () => {
    const language = getLanguageFromFile(file.name);
    
    try {
      const highlighted = Prism.highlight(code, Prism.languages[language] || Prism.languages.markup, language);
      setHighlightedCode(highlighted);
    } catch (error) {
      console.error('Syntax highlighting error:', error);
      setHighlightedCode(code);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadFile = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderLineNumbers = () => {
    if (!showLineNumbers) return null;
    
    const lines = code.split('\n').length;
    return (
      <div style={{
        padding: '24px 0',
        paddingRight: '16px',
        borderRight: '0.5px solid rgba(125, 232, 232, 0.1)',
        background: 'rgba(125, 232, 232, 0.01)',
        minWidth: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        userSelect: 'none'
      }}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i + 1}
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '12px',
              color: 'rgba(245, 240, 250, 0.2)',
              lineHeight: '24px',
              letterSpacing: '0.05em'
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>
    );
  };

  if (!file) {
    return (
      <div style={{
        background: 'rgba(125, 232, 232, 0.02)',
        border: '0.5px solid rgba(125, 232, 232, 0.15)',
        borderRadius: '16px',
        padding: '48px',
        textAlign: 'center',
        height: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          color: 'rgba(125, 232, 232, 0.7)',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginBottom: '16px'
        }}>
          CODE VIEWER • コードビューア
        </div>
        <h3 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '24px',
          fontWeight: 300,
          color: 'rgba(245, 240, 250, 0.45)',
          fontStyle: 'italic',
          marginBottom: '8px'
        }}>
          Select a file to view
        </h3>
        <p style={{
          fontFamily: 'Zen Kaku Gothic New, sans-serif',
          fontSize: '14px',
          color: 'rgba(245, 240, 250, 0.2)',
          fontWeight: 300
        }}>
          美しいコードを見つけよう
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(125, 232, 232, 0.02)',
      border: '0.5px solid rgba(125, 232, 232, 0.15)',
      borderRadius: '16px',
      height: 'calc(100vh - 200px)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '0.5px solid rgba(125, 232, 232, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(125, 232, 232, 0.01)'
      }}>
        <div>
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '10px',
            color: 'rgba(125, 232, 232, 0.7)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: '4px'
          }}>
            {getLanguageFromFile(file.name).toUpperCase()}
          </div>
          <h3 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '18px',
            fontWeight: 300,
            color: 'rgba(245, 240, 250, 0.92)',
            margin: 0,
            fontStyle: 'italic'
          }}>
            {file.name}
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            style={{
              background: showLineNumbers ? 'rgba(125, 232, 232, 0.1)' : 'transparent',
              border: '0.5px solid rgba(125, 232, 232, 0.25)',
              borderRadius: '8px',
              padding: '8px',
              color: 'rgba(125, 232, 232, 0.7)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s'
            }}
          >
            {showLineNumbers ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          
          <button
            onClick={copyToClipboard}
            style={{
              background: copied ? 'rgba(125, 232, 232, 0.15)' : 'rgba(125, 232, 232, 0.1)',
              border: '0.5px solid rgba(125, 232, 232, 0.25)',
              borderRadius: '8px',
              padding: '8px',
              color: copied ? '#7de8e8' : 'rgba(125, 232, 232, 0.7)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s'
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          
          <button
            onClick={downloadFile}
            style={{
              background: 'rgba(125, 232, 232, 0.1)',
              border: '0.5px solid rgba(125, 232, 232, 0.25)',
              borderRadius: '8px',
              padding: '8px',
              color: 'rgba(125, 232, 232, 0.7)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s'
            }}
          >
            <Download size={14} />
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        display: 'flex'
      }}>
        {renderLineNumbers()}
        
        <div style={{
          flex: 1,
          padding: '24px',
          overflow: 'auto'
        }}>
          {loading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              color: 'rgba(245, 240, 250, 0.45)',
              fontFamily: 'Space Mono, monospace',
              fontSize: '12px',
              letterSpacing: '0.1em'
            }}>
              LOADING CODE...
            </div>
          ) : (
            <pre style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '13px',
              lineHeight: '24px',
              color: 'rgba(245, 240, 250, 0.85)',
              margin: 0,
              background: 'transparent',
              overflow: 'visible'
            }}>
              <code
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
                className={`language-${getLanguageFromFile(file.name)}`}
              />
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;