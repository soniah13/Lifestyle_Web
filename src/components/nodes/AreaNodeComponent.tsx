import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import {
  Briefcase,
  Heart,
  Home,
  Users,
  Coins,
  Sparkles,
  Compass,
  Folder,
  ChevronDown,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { LIFE_AREAS } from '../../utils/graphLogic.ts';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Briefcase,
  Heart,
  Home,
  Users,
  Coins,
  Sparkles,
  Compass,
  Folder,
};

interface AreaNodeData {
  id: string;
  title: string;
  description?: string;
  areaId: string;
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

export const AreaNodeComponent: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as AreaNodeData;
  const isSelected = selected || nodeData.isSelected;
  const areaConfig = LIFE_AREAS[nodeData.areaId] || LIFE_AREAS['area-work'];
  const IconComp = iconMap[areaConfig.icon] || Folder;

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
      className={`relative group cursor-pointer transition-all duration-300 rounded-2xl p-4 w-72 bg-white/95 backdrop-blur-sm shadow-md border-2 ${
        isSelected
          ? 'border-indigo-500 ring-4 ring-indigo-50 shadow-lg'
          : 'border-stone-200/90 hover:border-stone-400 hover:shadow-lg'
      }`}
      style={{
        borderLeftColor: areaConfig.color,
        borderLeftWidth: '5px',
      }}
    >
      <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-stone-300 !border-white" />
      <Handle type="target" position={Position.Top} className="!w-2.5 !h-2.5 !bg-stone-300 !border-white" />
      <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-stone-400 !border-white" />
      <Handle type="source" position={Position.Bottom} className="!w-2.5 !h-2.5 !bg-stone-400 !border-white" />

      {/* Top Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0"
            style={{ backgroundColor: areaConfig.color }}
          >
            <IconComp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block">
              Life Area
            </span>
            <h4 className="font-semibold text-stone-800 text-sm leading-tight line-clamp-1">
              {nodeData.title}
            </h4>
          </div>
        </div>

        {/* Action button to focus this branch */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            nodeData.onFocus();
          }}
          title="Focus this life area"
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          aria-label={`Focus into ${nodeData.title}`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Description */}
      {nodeData.description && (
        <p className="text-xs text-stone-500 line-clamp-1 mb-3">
          {nodeData.description}
        </p>
      )}

      {/* Progress & Stats Bar */}
      <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-100 mb-2">
        <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
          <span className="text-stone-500 font-medium text-[11px]">Progress</span>
          <span className="font-semibold text-stone-800">
            {nodeData.completedTasks}/{nodeData.totalTasks} ({nodeData.progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-stone-200/80 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              backgroundColor: areaConfig.color,
              width: `${Math.min(100, Math.max(0, nodeData.progressPercent))}%`,
            }}
          />
        </div>
      </div>

      {/* Bottom Footer: Children count & Expand/Collapse toggle */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <span className="text-[11px] text-stone-400 font-medium">
          {nodeData.childCount} branches
        </span>

        {nodeData.childCount > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              nodeData.onToggleCollapse();
            }}
            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 text-[11px] font-medium transition-colors"
            aria-label={nodeData.collapsed ? `Expand ${nodeData.title}` : `Collapse ${nodeData.title}`}
          >
            {nodeData.collapsed ? (
              <>
                <span>Expand</span>
                <ChevronRight className="w-3 h-3 text-stone-500" />
              </>
            ) : (
              <>
                <span>Hide</span>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
