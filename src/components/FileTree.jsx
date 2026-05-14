import React, { useState, useEffect } from 'react';
import { Folder, FolderOpen, File, Code, Image, Archive, Settings, FileText, Database } from 'lucide-react';

const FileTree = ({ repository, onFileSelect, selectedFile }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['']));
  const [fileStructure, setFileStructure] = useState([]);

  useEffect(() => {
    // Simulate file structure - in real app this would come from Git API
    const mockFiles = [
      { name: 'README.md', path: 'README.md', type: 'file', size: '2.1 KB' },
      { name: 'package.json', path: 'package.json', type: 'file', size: '1.3 KB' },
      { name: '.gitignore', path: '.gitignore', type: 'file', size: '847 B' },
      { name: 'src', path: 'src', type: 'folder', children: [
        { name: 'components', path: 'src/components', type: 'folder', children: [
          { name: 'Header.jsx', path: 'src/components/Header.jsx', type: 'file', size: '3.2 KB' },
          { name: 'FileTree.jsx', path: 'src/components/FileTree.jsx', type: 'file', size: '5.1 KB' },
          { name: 'CodeViewer.jsx', path: 'src/components/CodeViewer.jsx', type: 'file', size: '4.7 KB' }
        ]},
        { name: 'pages', path: 'src/pages', type: 'folder', children: [
          { name: 'Dashboard.jsx', path: 'src/pages/Dashboard.jsx', type: 'file', size: '6.3 KB' },
          { name: 'Repository.jsx', path: 'src/pages/Repository.jsx', type: 'file', size: '8.9 KB' }
        ]},
        { name: 'lib', path: 'src/lib', type: 'folder', children: [
          { name: 'firebase.js', path: 'src/lib/firebase.js', type: 'file', size: '1.8 KB' },
          { name: 'revenuecat.js', path: 'src/lib/revenuecat.js', type: 'file', size: '2.1 KB' }
        ]},
        { name: 'App.jsx', path: 'src/App.jsx', type: 'file', size: '4.1 KB' },
        { name: 'main.jsx', path: 'src/main.jsx', type: 'file', size: '892 B' },
        { name: 'App.css', path: 'src/App.css', type: 'file', size: '12.7 KB' }
      ]},
      { name: 'public', path: 'public', type: 'folder', children: [
        { name: 'logo.png', path: 'public/logo.png', type: 'file', size: '45.2 KB' },
        { name: 'favicon.ico', path: 'public/favicon.ico', type: 'file', size: '15.1 KB' }
      ]},
      { name: 'docs', path: 'docs', type: 'folder', children: [
        { name: 'API.md', path: 'docs/API.md', type: 'file', size: '8.4 KB' },
        { name: 'CONTRIBUTING.md', path: 'docs/CONTRIBUTING.md', type: 'file', size: '3.7 KB' }
      ]}
    ];
    
    setFileStructure(mockFiles);
  }, [repository]);

  const getFileIcon = (fileName, type) => {
    if (type === 'folder') {
      return expandedFolders.has(fileName) ? FolderOpen : Folder;
    }

    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
      case 'py':
      case 'java':
      case 'go':
      case 'rs':
      case 'cpp':
      case 'c':
      case 'php':
      case 'rb':
        return Code;
      case 'md':
      case 'txt':
      case 'doc':
      case 'docx':
        return FileText;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
      case 'webp':
        return Image;
      case 'zip':
      case 'tar':
      case 'gz':
      case 'rar':
        return Archive;
      case 'json':
      case 'xml':
      case 'yml':
      case 'yaml':
      case 'toml':
        return Settings;
      case 'sql':
      case 'db':
      case 'sqlite':
        return Database;
      default:
        return File;
    }
  };

  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileClick = (file) => {
    if (file.type === 'folder') {
      toggleFolder(file.path);
    } else {
      onFileSelect(file);
    }
  };

  const renderFileTree = (files, depth = 0) => {
    return files.map((file, index) => {
      const Icon = getFileIcon(file.name, file.type);
      const isSelected = selectedFile?.path === file.path;
      const isExpanded = expandedFolders.has(file.path);
      
      return (
        <div key={file.path}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              paddingLeft: `${16 + depth * 20}px`,
              cursor: 'pointer',
              borderRadius: '8px',
              margin: '2px 8px',
              background: isSelected ? 'rgba(125, 232, 232, 0.08)' : 'transparent',
              border: isSelected ? '0.5px solid rgba(125, 232, 232, 0.25)' : '0.5px solid transparent',
              transition: 'all 0.2s ease'
            }}
            onClick={() => handleFileClick(file)}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = 'rgba(125, 232, 232, 0.04)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <Icon 
              size={16} 
              style={{ 
                color: file.type === 'folder' 
                  ? (isExpanded ? '#7de8e8' : 'rgba(125, 232, 232, 0.7)')
                  : 'rgba(245, 240, 250, 0.45)',
                flexShrink: 0
              }} 
            />
            
            <span style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '13px',
              color: file.type === 'folder' 
                ? (isExpanded ? 'rgba(245, 240, 250, 0.92)' : 'rgba(245, 240, 250, 0.7)')
                : 'rgba(245, 240, 250, 0.65)',
              letterSpacing: '0.02em',
              flexGrow: 1
            }}>
              {file.name}
            </span>
            
            {file.type === 'file' && file.size && (
              <span style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '10px',
                color: 'rgba(245, 240, 250, 0.2)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>
                {file.size}
              </span>
            )}
          </div>
          
          {file.type === 'folder' && file.children && isExpanded && (
            <div>
              {renderFileTree(file.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div style={{
      background: 'rgba(125, 232, 232, 0.02)',
      border: '0.5px solid rgba(125, 232, 232, 0.15)',
      borderRadius: '16px',
      padding: '16px 0',
      height: 'calc(100vh - 200px)',
      overflowY: 'auto',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        padding: '0 24px 16px 24px',
        borderBottom: '0.5px solid rgba(125, 232, 232, 0.1)',
        marginBottom: '8px'
      }}>
        <div style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          color: 'rgba(125, 232, 232, 0.7)',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginBottom: '8px'
        }}>
          FILES • ファイル
        </div>
        <h3 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '20px',
          fontWeight: 300,
          color: 'rgba(245, 240, 250, 0.92)',
          margin: 0,
          fontStyle: 'italic'
        }}>
          {repository?.name || 'Repository'}
        </h3>
      </div>

      {/* File Tree */}
      <div style={{ padding: '0' }}>
        {renderFileTree(fileStructure)}
      </div>

      {/* Japanese subtitle */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '24px',
        fontFamily: 'Zen Kaku Gothic New, sans-serif',
        fontSize: '12px',
        color: 'rgba(245, 240, 250, 0.2)',
        fontWeight: 300
      }}>
        コードの聖域
      </div>
    </div>
  );
};

export default FileTree;