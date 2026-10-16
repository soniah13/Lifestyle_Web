import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Sun,
  Edit2,
  Calendar,
} from 'lucide-react';
import type { TaskPriority, TaskStatus } from '../../types/graph.ts';
import { LIFE_AREAS } from '../../utils/graphLogic.ts';

interface TaskNodeData {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  estimatedMinutes?: number;
  focusToday?: boolean;
  dueDate?: string;
  areaId?: string;
  isSelected: boolean;
  onSelect: () => void;
  onToggleComplete: () => void;
  onOpenEdit: () => void;
}

const priorityColors: Record<TaskPriority, { bg: string; text: string; dot: string }> = {
  high: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
  medium: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  low: { bg: 'bg-stone-50', text: 'text-stone-600', dot: 'bg-stone-400' },
};

export const TaskNodeComponent: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as TaskNodeData;
  const isSelected = selected || nodeData.isSelected;
  const isCompleted = nodeData.status === 'completed';
  const priorityStyle = nodeData.priority ? priorityColors[nodeData.priority] : priorityColors.medium;
  const areaConfig = nodeData.areaId ? LIFE_AREAS[nodeData.areaId] : null;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        nodeData.onSelect();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        nodeData.onOpenEdit();
      }}
      className={`relative group cursor-pointer transition-all duration-200 rounded-xl p-3 w-60 backdrop-blur-sm border-2 ${
        isCompleted
          ? 'bg-stone-50/90 border-stone-200/80 opacity-80'
          : 'bg-white/95 border-stone-200 shadow-sm hover:border-stone-300 hover:shadow-md'
      } ${
        isSelected
          ? '!border-indigo-500 ring-4 ring-indigo-50 shadow-md'
          : ''
      }`}
    >
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-stone-300 !border-white" />
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-stone-300 !border-white" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-stone-300 !border-white" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-stone-300 !border-white" />

      {/* Row 1: Checkbox + Title + Edit button */}
      <div className="flex items-start space-x-2.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            nodeData.onToggleComplete();
          }}
          className="mt-0.5 flex-shrink-0 text-stone-400 hover:text-emerald-600 transition-colors focus:outline-none"
          title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
          aria-label={isCompleted ? `Mark incomplete: ${nodeData.title}` : `Mark complete: ${nodeData.title}`}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
          ) : (
            <Circle className="w-4 h-4 hover:stroke-emerald-600" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`text-xs font-medium leading-snug line-clamp-2 ${
              isCompleted ? 'line-through text-stone-400' : 'text-stone-800'
            }`}
          >
            {nodeData.title}
          </p>
        </div>

        {/* Discoverable Open / Edit button for touchscreens and quick access */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            nodeData.onOpenEdit();
          }}
          title="Open detailed editor"
          aria-label={`Open details for ${nodeData.title}`}
          className="opacity-60 group-hover:opacity-100 p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-opacity"
        >
          <Edit2 className="w-3 h-3" />
        </button>
      </div>

      {/* Meta tags: Estimated time, Focus Today badge, Priority */}
      <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
          {nodeData.estimatedMinutes ? (
            <span className="inline-flex items-center space-x-0.5 text-stone-500 font-medium bg-stone-100 px-1.5 py-0.5 rounded">
              <Clock className="w-2.5 h-2.5" />
              <span>{nodeData.estimatedMinutes}m</span>
            </span>
          ) : null}

          {nodeData.focusToday && (
            <span className="inline-flex items-center space-x-0.5 text-amber-700 font-semibold bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">
              <Sun className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
              <span>Today</span>
            </span>
          )}

          {nodeData.dueDate && (
            <span className="inline-flex items-center space-x-0.5 text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
              <Calendar className="w-2.5 h-2.5" />
              <span>{nodeData.dueDate.slice(5)}</span>
            </span>
          )}
        </div>

        {/* Priority dot indicator */}
        {nodeData.priority && !isCompleted && (
          <span
            className={`w-2 h-2 rounded-full ${priorityStyle.dot}`}
            title={`Priority: ${nodeData.priority}`}
          />
        )}
      </div>
    </div>
  );
};
