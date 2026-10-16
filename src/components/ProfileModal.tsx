import React, { useState, useRef } from 'react';
import {
  X,
  User,
  Upload,
  Download,
  RotateCcw,
  Check,
  AlertTriangle,
  Camera,
  Sparkles,
} from 'lucide-react';
import { useGraph } from '../context/GraphContext.tsx';

const AVATAR_PRESETS = [
  { id: 'preset:lotus', label: 'Lotus', emoji: '🪷', bg: 'from-rose-100 to-indigo-100' },
  { id: 'preset:tree', label: 'Life Tree', emoji: '🌳', bg: 'from-emerald-100 to-teal-100' },
  { id: 'preset:sun', label: 'Golden Sun', emoji: '☀️', bg: 'from-amber-100 to-rose-100' },
  { id: 'preset:mountain', label: 'Summit', emoji: '⛰️', bg: 'from-sky-100 to-indigo-100' },
  { id: 'preset:star', label: 'Cosmos', emoji: '✨', bg: 'from-violet-100 to-fuchsia-100' },
];

export const ProfileModal: React.FC = () => {
  const {
    profile,
    updateProfile,
    isProfileModalOpen,
    setProfileModalOpen,
    exportBackup,
    importBackup,
    resetToSampleData,
  } = useGraph();

  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  if (!isProfileModalOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'Alex Morgan',
      title: title.trim() || undefined,
      avatarUrl,
    });
    setProfileModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatarUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = importBackup(content);
        if (res.success) {
          setProfileModalOpen(false);
        }
      }
    };
    reader.readAsText(file);
    // reset input value so re-importing the same file works
    e.target.value = '';
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <h3 id="profile-modal-title" className="text-base font-bold text-stone-800">
              Personal Profile & Workspace
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Customize your central anchor and manage data backups
            </p>
          </div>
          <button
            onClick={() => setProfileModalOpen(false)}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Close profile settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Avatar Section */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-3">
              Profile Avatar
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-stone-100 border-2 border-stone-200 flex-shrink-0 flex items-center justify-center shadow-sm">
                {avatarUrl && avatarUrl.startsWith('data:image') ? (
                  <img src={avatarUrl} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl bg-indigo-50">
                    {AVATAR_PRESETS.find((p) => p.id === avatarUrl)?.emoji || '🪷'}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-stone-500" />
                  <span>Upload Custom Photo</span>
                </button>
                <p className="text-[11px] text-stone-400">
                  PNG, JPG, or SVG. Saved locally in your browser.
                </p>
              </div>
            </div>

            {/* Avatar presets */}
            <div className="mt-3">
              <span className="text-[10px] text-stone-400 block mb-1.5">Or choose a symbol:</span>
              <div className="flex items-center space-x-2">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setAvatarUrl(preset.id)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-base border transition-all ${
                      avatarUrl === preset.id
                        ? 'border-indigo-500 bg-indigo-50 scale-105 shadow-xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                    }`}
                    title={preset.label}
                  >
                    <span>{preset.emoji}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name & Title Inputs */}
          <div className="space-y-3">
            <div>
              <label
                htmlFor="user-name"
                className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1"
              >
                Display Name
              </label>
              <input
                id="user-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full text-xs font-medium text-stone-800 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="user-title"
                className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1"
              >
                Personal Intent / Title
              </label>
              <input
                id="user-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lifelong Learner & Creator"
                className="w-full text-xs font-medium text-stone-800 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Save Profile Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs"
          >
            Save Profile Changes
          </button>

          {/* Data Backup & Restore Section */}
          <div className="pt-5 border-t border-stone-100 space-y-3">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Data & Backups
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Your life web is saved locally in your browser storage. Export a backup JSON to preserve your graph offline or migrate between devices.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={exportBackup}
                className="inline-flex items-center justify-center space-x-1.5 py-2 px-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-stone-500" />
                <span>Export Backup</span>
              </button>

              <button
                type="button"
                onClick={() => importInputRef.current?.click()}
                className="inline-flex items-center justify-center space-x-1.5 py-2 px-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-stone-500" />
                <span>Import Backup</span>
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportFile}
                className="hidden"
              />
            </div>

            {/* Reset to Sample Data */}
            <div className="pt-3">
              {isResetConfirmOpen ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 text-rose-800 text-xs font-semibold">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>Reset all nodes to original sample data?</span>
                  </div>
                  <p className="text-[11px] text-rose-700 leading-tight">
                    This will replace your current graph nodes with the 7 sample areas and default tasks.
                  </p>
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        resetToSampleData();
                        setIsResetConfirmOpen(false);
                        setProfileModalOpen(false);
                      }}
                      className="flex-1 py-1 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
                    >
                      Yes, Reset Data
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsResetConfirmOpen(false)}
                      className="flex-1 py-1 px-3 bg-white border border-stone-200 text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(true)}
                  className="w-full inline-flex items-center justify-center space-x-1.5 py-2 text-xs font-medium text-stone-400 hover:text-rose-600 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Sample Data</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
