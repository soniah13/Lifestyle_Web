import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { User, Sparkles } from 'lucide-react';
import type { UserProfile } from '../../types/graph.ts';

interface CenterNodeData {
  title: string;
  profile: UserProfile;
  totalAreas: number;
  totalTasks: number;
  overallPercent: number;
  isSelected: boolean;
  onSelect: () => void;
  onOpenProfile: () => void;
}

export const CenterNodeComponent: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as CenterNodeData;
  const isSelected = selected || nodeData.isSelected;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        nodeData.onSelect();
      }}
      className={`relative group cursor-pointer transition-all duration-300 rounded-3xl p-5 w-64 bg-white/95 backdrop-blur-md shadow-xl border-2 ${
        isSelected
          ? 'border-indigo-500 ring-4 ring-indigo-100 shadow-indigo-100'
          : 'border-stone-200/90 hover:border-indigo-300 hover:shadow-2xl'
      }`}
      style={{
        boxShadow: isSelected
          ? '0 12px 30px -8px rgba(99, 102, 241, 0.25)'
          : '0 10px 25px -10px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Handles for connections in all directions */}
      <Handle type="source" position={Position.Top} className="!w-2 !h-2 !bg-indigo-400 !border-white" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-indigo-400 !border-white" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-indigo-400 !border-white" />
      <Handle type="source" position={Position.Left} className="!w-2 !h-2 !bg-indigo-400 !border-white" />

      <div className="flex flex-col items-center text-center">
        {/* Avatar ring */}
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-100 via-rose-50 to-amber-100 flex items-center justify-center border-2 border-indigo-200 shadow-sm">
            {nodeData.profile?.avatarUrl && nodeData.profile.avatarUrl.startsWith('data:image') ? (
              <img
                src={nodeData.profile.avatarUrl}
                alt={nodeData.profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600">
                <User className="w-8 h-8" />
              </div>
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 p-1 bg-amber-400 text-amber-950 rounded-full shadow-sm text-[10px]">
            <Sparkles className="w-3 h-3" />
          </span>
        </div>

        {/* User Name & Core Role */}
        <h3 className="font-semibold text-stone-800 text-base tracking-tight">
          {nodeData.profile?.name || 'My Life Center'}
        </h3>
        <p className="text-xs text-stone-500 font-medium line-clamp-1 mt-0.5">
          {nodeData.profile?.title || 'Anchor of Life & Intention'}
        </p>

        {/* Holistic Balance Summary */}
        <div className="w-full mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Life Areas</span>
            <span className="font-semibold text-stone-700">{nodeData.totalAreas || 7} Domains</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Completed</span>
            <span className="font-semibold text-indigo-600">{nodeData.overallPercent || 0}% overall</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-rose-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, nodeData.overallPercent || 0))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
