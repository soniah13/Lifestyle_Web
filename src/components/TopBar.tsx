import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  User,
  CheckCircle2,
  Folder,
  Circle,
  Network,
  CalendarCheck,
  TrendingUp,
  X,
  Compass,
} from 'lucide-react';
import { useGraph, ActiveView } from '../context/GraphContext.tsx';
import { searchNodes, LIFE_AREAS } from '../utils/graphLogic.ts';
import type { LifeNode } from '../types/graph.ts';

export const TopBar: React.FC = () => {
  const {
    nodes,
    profile,
    activeView,
    setActiveView,
    openAddModal,
    setProfileModalOpen,
    selectNode,
    focusNode,
    updateNode,
  } = useGraph();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Search results
  const searchResults = React.useMemo(() => {
    return searchNodes(nodes, searchQuery);
  }, [nodes, searchQuery]);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSearchResult = (node: LifeNode) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setActiveView('graph');

    // If node has parent, uncollapse ancestors so it becomes visible
    let currParentId = node.parentId;
    while (currParentId) {
      updateNode(currParentId, { collapsed: false });
      const parent = nodes.find((n) => n.id === currParentId);
      currParentId = parent ? parent.parentId : null;
    }

    // If it's a deep branch, we can focus its branch or directly select it
    if (node.type === 'task' && node.parentId) {
      focusNode(node.parentId);
    } else if (node.type === 'branch' || node.type === 'area') {
      focusNode(node.id);
    }

    selectNode(node.id);
  };

  const navItems: Array<{ id: ActiveView; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'graph', label: 'My Life Web', icon: Network },
    { id: 'today', label: 'Today', icon: CalendarCheck },
    { id: 'growth', label: 'Growth', icon: TrendingUp },
  ];

  return (
    <header className="h-16 border-b border-stone-200/90 bg-white/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 relative shadow-xs">
      {/* Left: Brand & Main Navigation */}
      <div className="flex items-center space-x-6">
        <div
          onClick={() => {
            setActiveView('graph');
            focusNode(null);
            selectNode(null);
          }}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-rose-500 to-amber-500 p-[1.5px] shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-stone-900 text-base tracking-tight leading-none">
              Life Web
            </span>
            <span className="text-[10px] text-stone-400 font-medium tracking-wide">
              Personal Graph
            </span>
          </div>
        </div>

        {/* View Switcher Tabs - visible on tablet/desktop, mobile uses bottom nav */}
        <nav className="hidden md:flex items-center bg-stone-100/80 p-1 rounded-xl" aria-label="Views">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-stone-400'}`} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Middle: Universal Search across the whole web */}
      <div ref={searchContainerRef} className="flex-1 max-w-xs sm:max-w-sm mx-3 relative">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search tasks, branches, habits..."
            aria-label="Search all nodes in life web"
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-stone-50 border border-stone-200/90 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all placeholder:text-stone-400 text-stone-800"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-600"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && searchQuery.trim() && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 max-h-80 overflow-y-auto">
            {searchResults.length === 0 ? (
              <div className="py-4 px-3 text-center text-xs text-stone-400">
                No matching nodes found for &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              <div>
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  Found {searchResults.length} node{searchResults.length === 1 ? '' : 's'}
                </div>
                {searchResults.map((item) => {
                  const areaConfig = item.areaId ? LIFE_AREAS[item.areaId] : null;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectSearchResult(item)}
                      className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-stone-50 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        {item.type === 'task' ? (
                          item.status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-stone-400 flex-shrink-0" />
                          )
                        ) : (
                          <Folder
                            className="w-4 h-4 flex-shrink-0"
                            style={{ color: areaConfig?.color || '#6366F1' }}
                          />
                        )}
                        <div className="truncate">
                          <p className="text-xs font-medium text-stone-800 truncate group-hover:text-indigo-600">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="text-[10px] text-stone-400 truncate">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-stone-400 capitalize px-1.5 py-0.5 rounded bg-stone-100 flex-shrink-0 ml-2">
                        {item.type}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Add Node Button + Profile Avatar */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={() => openAddModal()}
          className="inline-flex items-center space-x-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium px-3.5 py-1.5 rounded-xl shadow-xs transition-all active:scale-95"
          aria-label="Add Node"
        >
          <Plus className="w-3.5 h-3.5 text-stone-300" />
          <span className="hidden sm:inline">Add Node</span>
        </button>

        {/* Profile Avatar Control */}
        <button
          onClick={() => setProfileModalOpen(true)}
          className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-100 to-rose-100 border border-stone-200 hover:ring-2 hover:ring-indigo-400 transition-all flex items-center justify-center"
          title={`${profile.name} - Profile & Settings`}
          aria-label={`Open profile settings for ${profile.name}`}
        >
          {profile.avatarUrl && profile.avatarUrl.startsWith('data:image') ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-indigo-700 bg-indigo-50">
              <User className="w-4 h-4" />
            </div>
          )}
        </button>
      </div>
    </header>
  );
};
