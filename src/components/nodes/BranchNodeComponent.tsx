import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Folder, ChevronDown, ChevronRight, Maximize2 } from 'lucide-react';
import { LIFE_AREAS } from '../../utils/graphLogic.ts';

interface BranchNodeData {
  id: string;
  title: string;
  description?: string;
  areaId?: string;
  childCount: number;
  totalTasks: number;
  completedTasks: number;
  progressPercent: number;
  collapsed: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onToggleCollapse: () => void;
  onFocus: () => void;
}

export const BranchNodeComponent: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as BranchNodeData;
  const isSelected = selected || nodeData.isSelected;
  const areaConfig = nodeData.areaId ? LIFE_AREAS[nodeData.areaId] : null;
  const accentColor = areaConfig ? areaConfig.color : '#6366F1';

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        nodeData.onSelect();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        nodeData.onFocus();
      }}
      className={`relative group cursor-pointer transition-all duration-300 rounded-xl p-3.5 w-64 bg-white/95 backdrop-blur-sm shadow-sm border-2 ${
        isSelected
          ? 'border-indigo-500 ring-4 ring-indigo-50 shadow-md'
          : 'border-stone-200 hover:border-stone-400 hover:shadow-md'
      }`}
      style={{
        borderTopColor: accentColor,
        borderTopWidth: '4px',
      }}
    >
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-stone-300 !border-white" />
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-stone-300 !border-white" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-stone-400 !border-white" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-stone-400 !border-white" />

      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs text-white flex-shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            <Folder className="w-3.5 h-3.5" />
          </div>
          <div>
            <h5 className="font-semibold text-stone-800 text-xs leading-snug line-clamp-1">
              {nodeData.title}
            </h5>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nodeData.onFocus();
          }}
          title="Focus this branch"
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-stone-400 hover:text-stone-700"
          aria-label={`Focus into ${nodeData.title}`}
        >
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>

      {nodeData.description && (
        <p className="text-[11px] text-stone-500 line-clamp-1 mt-1.5">
          {nodeData.description}
        </p>
      )}

      {/* Progress pill & children */}
      <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
        <div className="flex items-center space-x-1.5">
          <span className="font-medium text-stone-600">
            {nodeData.completedTasks}/{nodeData.totalTasks}
          </span>
          {nodeData.totalTasks > 0 && (
            <span
              className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full"
              style={{
                backgroundColor: areaConfig ? areaConfig.accentBg : '#EEF2FF',
                color: accentColor,
              }}
            >
              {nodeData.progressPercent}%
            </span>
          )}
        </div>

        {nodeData.childCount > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              nodeData.onToggleCollapse();
            }}
            className="inline-flex items-center space-x-1 text-stone-500 hover:text-stone-800 px-1.5 py-0.5 rounded bg-stone-50 hover:bg-stone-100 transition-colors"
            aria-label={nodeData.collapsed ? `Expand ${nodeData.title}` : `Collapse ${nodeData.title}`}
          >
            <span>{nodeData.childCount}</span>
            {nodeData.collapsed ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
