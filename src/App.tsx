import React from 'react';
import { GraphProvider, useGraph } from './context/GraphContext.tsx';
import { TopBar } from './components/TopBar.tsx';
import { GraphCanvas } from './components/GraphCanvas.tsx';
import { NodeDetailPanel } from './components/NodeDetailPanel.tsx';
import { AddNodeModal } from './components/AddNodeModal.tsx';
import { ProfileModal } from './components/ProfileModal.tsx';
import { TodayView } from './components/TodayView.tsx';
import { GrowthView } from './components/GrowthView.tsx';
import { Network, CalendarCheck, TrendingUp, X } from 'lucide-react';

function AppContent() {
  const {
    activeView,
    setActiveView,
    selectedNodeId,
    toasts,
    removeToast,
  } = useGraph();

  return (
    <div className="flex flex-col h-screen w-screen bg-[#FAF9F5] text-stone-800 font-sans antialiased overflow-hidden select-none">
      {/* Top Header */}
      <TopBar />

      {/* Main Workspace Area */}
      <main className="flex-1 flex relative overflow-hidden">
        {activeView === 'graph' && (
          <div className="flex-1 flex h-full relative overflow-hidden">
            <GraphCanvas />
            {selectedNodeId && <NodeDetailPanel />}
          </div>
        )}

        {activeView === 'today' && (
          <div className="flex-1 flex h-full relative overflow-hidden">
            <TodayView />
            {selectedNodeId && <NodeDetailPanel />}
          </div>
        )}

        {activeView === 'growth' && (
          <div className="flex-1 flex h-full relative overflow-hidden">
            <GrowthView />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Hidden on md+ screens) */}
      <nav
        className="md:hidden h-14 bg-white/95 backdrop-blur-md border-t border-stone-200/90 flex items-center justify-around px-2 z-30"
        aria-label="Mobile Navigation"
      >
        <button
          onClick={() => setActiveView('graph')}
          className={`flex flex-col items-center justify-center space-y-0.5 px-3 py-1 rounded-xl text-[10px] font-semibold transition-colors ${
            activeView === 'graph' ? 'text-indigo-600' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>Life Web</span>
        </button>

        <button
          onClick={() => setActiveView('today')}
          className={`flex flex-col items-center justify-center space-y-0.5 px-3 py-1 rounded-xl text-[10px] font-semibold transition-colors ${
            activeView === 'today' ? 'text-amber-600' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Today</span>
        </button>

        <button
          onClick={() => setActiveView('growth')}
          className={`flex flex-col items-center justify-center space-y-0.5 px-3 py-1 rounded-xl text-[10px] font-semibold transition-colors ${
            activeView === 'growth' ? 'text-indigo-600' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Growth</span>
        </button>
      </nav>

      {/* Global Modals */}
      <AddNodeModal />
      <ProfileModal />

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-2xl shadow-lg border text-xs font-medium flex items-center justify-between space-x-3 transition-all animate-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-800'
                : toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-800'
                : 'bg-stone-900 text-white border-stone-800'
            }`}
          >
            <span>{toast.text}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-0.5 text-stone-400 hover:text-white transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GraphProvider>
      <AppContent />
    </GraphProvider>
  );
}
