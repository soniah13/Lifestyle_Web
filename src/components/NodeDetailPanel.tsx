import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Sun,
  Trash2,
  Plus,
  Maximize2,
  Folder,
  Tag,
  Repeat,
  FileText,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useGraph } from '../context/GraphContext.tsx';
import {
  calculateDescendantProgress,
  LIFE_AREAS,
} from '../utils/graphLogic.ts';
import type { TaskStatus, TaskPriority, TaskRecurrence } from '../types/graph.ts';

export const NodeDetailPanel: React.FC = () => {
  const {
    nodes,
    selectedNodeId,
    selectNode,
    focusNode,
    updateNode,
    deleteNode,
    toggleTaskComplete,
    openAddModal,
    setProfileModalOpen,
  } = useGraph();

  const node = nodes.find((n) => n.id === selectedNodeId);

  // Editable local state synced when selected node changes
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('not_started');
  const [dueDate, setDueDate] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | ''>('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [notes, setNotes] = useState('');
  const [recurrence, setRecurrence] = useState<TaskRecurrence>('none');
  const [focusToday, setFocusToday] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    if (node) {
      setTitle(node.title || '');
      setDescription(node.description || '');
      setStatus(node.status || 'not_started');
      setDueDate(node.dueDate || '');
      setEstimatedMinutes(node.estimatedMinutes || '');
      setPriority(node.priority || 'medium');
      setNotes(node.notes || '');
      setRecurrence(node.recurrence || 'none');
      setFocusToday(!!node.focusToday);
      setIsConfirmDeleteOpen(false);
    }
  }, [node]);

  if (!node) return null;

  const isTaskOrHabit = node.type === 'task' || node.type === 'habit';
  const isCenter = node.type === 'center';
  const isCompleted = node.status === 'completed';

  const progress = calculateDescendantProgress(node.id, nodes);
  const children = nodes.filter((n) => n.parentId === node.id);
  const areaConfig = node.areaId ? LIFE_AREAS[node.areaId] : null;

  // Save handler for inputs
  const handleSaveField = (updates: Partial<typeof node>) => {
    if (node) {
      updateNode(node.id, updates);
    }
  };

  const handleTitleBlur = () => {
    if (title.trim() && title !== node.title) {
      handleSaveField({ title: title.trim() });
    } else {
      setTitle(node.title);
    }
  };

  const handleDescriptionBlur = () => {
    if (description !== node.description) {
      handleSaveField({ description: description.trim() });
    }
  };

  const handleNotesBlur = () => {
    if (notes !== node.notes) {
      handleSaveField({ notes: notes.trim() });
    }
  };

  return (
    <aside
      className="absolute sm:relative right-0 bottom-0 top-0 sm:top-auto w-full sm:w-96 border-l border-stone-200/90 bg-white/98 backdrop-blur-md h-full flex flex-col z-40 shadow-2xl sm:shadow-lg overflow-hidden animate-in slide-in-from-right duration-200"
      aria-label="Node details panel"
    >
      {/* Panel Header */}
      <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
        <div className="flex items-center space-x-2 min-w-0">
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: areaConfig ? areaConfig.accentBg : '#EEF2FF',
              color: areaConfig ? areaConfig.textColor : '#4338CA',
            }}
          >
            {node.type}
          </span>
          {areaConfig && (
            <span className="text-[11px] text-stone-500 truncate">
              {areaConfig.name}
            </span>
          )}
        </div>

        <button
          onClick={() => selectNode(null)}
          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close details panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Title Input */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            disabled={isCenter}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="w-full text-base font-semibold text-stone-800 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:outline-none transition-all disabled:opacity-75"
          />
        </div>

        {/* Task Actions: Quick Complete & Focus Today */}
        {isTaskOrHabit && (
          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={() => toggleTaskComplete(node.id)}
              className={`flex-1 inline-flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 text-stone-400" />
                  <span>Mark Complete</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                const nextVal = !focusToday;
                setFocusToday(nextVal);
                handleSaveField({ focusToday: nextVal });
              }}
              className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                focusToday
                  ? 'bg-amber-50 text-amber-800 border-amber-300 font-semibold'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Sun
                className={`w-4 h-4 ${
                  focusToday ? 'text-amber-500 fill-amber-500' : 'text-stone-400'
                }`}
              />
              <span>Today</span>
            </button>
          </div>
        )}

        {/* Center Node Information */}
        {isCenter && (
          <div className="bg-indigo-50/60 rounded-2xl p-4 border border-indigo-100 space-y-3">
            <h4 className="text-xs font-semibold text-indigo-950">
              Personal Web Center
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              This node represents your whole personhood, anchoring your 7 life domains and daily actions.
            </p>
            <button
              onClick={() => setProfileModalOpen(true)}
              className="w-full py-2 px-3 bg-white hover:bg-stone-50 text-indigo-700 text-xs font-medium rounded-xl border border-indigo-200 shadow-xs transition-colors"
            >
              Edit Profile & Manage Backups
            </button>
          </div>
        )}

        {/* Calculated Descendant Progress for Area or Branch */}
        {!isTaskOrHabit && (
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-stone-700">Calculated Progress</span>
              <span className="font-bold text-stone-900">
                {progress.completedTasks} / {progress.totalTasks} tasks ({progress.progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-rose-400 rounded-full transition-all duration-300"
                style={{ width: `${progress.progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-2 leading-relaxed">
              Progress is dynamically calculated from completed descendant tasks.
            </p>
          </div>
        )}

        {/* Description Input */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            placeholder="Add context or notes..."
            className="w-full text-xs text-stone-700 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:outline-none transition-all placeholder:text-stone-400 resize-none"
          />
        </div>

        {/* Task Attributes (Status, Due Date, Duration, Priority, Recurrence) */}
        {isTaskOrHabit && (
          <div className="space-y-3 pt-1">
            {/* Status Select */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    const next = e.target.value as TaskStatus;
                    setStatus(next);
                    handleSaveField({ status: next });
                  }}
                  className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                </select>
              </div>

              {/* Priority Select */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => {
                    const next = e.target.value as TaskPriority;
                    setPriority(next);
                    handleSaveField({ priority: next });
                  }}
                  className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>

            {/* Due Date & Estimated Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    handleSaveField({ dueDate: e.target.value });
                  }}
                  className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
                  Duration (mins)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={estimatedMinutes}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                    setEstimatedMinutes(val);
                    handleSaveField({ estimatedMinutes: typeof val === 'number' ? val : undefined });
                  }}
                  placeholder="e.g. 20"
                  className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Recurrence */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
                Recurrence
              </label>
              <select
                value={recurrence}
                onChange={(e) => {
                  const next = e.target.value as TaskRecurrence;
                  setRecurrence(next);
                  handleSaveField({ recurrence: next });
                }}
                className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="none">No Recurrence</option>
                <option value="daily">Daily Habit</option>
                <option value="weekdays">Weekdays Only</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Completion Timestamp if completed */}
            {node.completedAt && (
              <div className="text-[11px] text-stone-400 bg-stone-50 rounded-lg p-2 flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  Completed: {new Date(node.completedAt).toLocaleString()}
                </span>
              </div>
            )}

            {/* Notes Section */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
                Detailed Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={handleNotesBlur}
                placeholder="Checklists, thoughts, or reference links..."
                className="w-full text-xs text-stone-700 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:outline-none transition-all placeholder:text-stone-400"
              />
            </div>
          </div>
        )}

        {/* Children Sub-items list if Area or Branch */}
        {!isTaskOrHabit && !isCenter && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Children ({children.length})
              </label>
              <button
                onClick={() => openAddModal(node.id)}
                className="inline-flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <Plus className="w-3 h-3" />
                <span>Add child</span>
              </button>
            </div>

            {children.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-2">
                No child nodes under this branch yet.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {children.map((child) => (
                  <div
                    key={child.id}
                    onClick={() => selectNode(child.id)}
                    className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100/80 transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      {child.type === 'task' ? (
                        child.status === 'completed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                        )
                      ) : (
                        <Folder className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      )}
                      <span className="text-xs text-stone-700 truncate group-hover:text-indigo-600 font-medium">
                        {child.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400 uppercase">
                      {child.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Panel Footer: Action Buttons (Focus branch, Add subtask, Delete) */}
      <div className="p-4 border-t border-stone-200/90 bg-stone-50/50 space-y-2">
        <div className="flex items-center space-x-2">
          {/* Focus branch action (if not center) */}
          {!isCenter && (
            <button
              onClick={() => focusNode(node.id)}
              className="flex-1 inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors shadow-xs"
            >
              <Maximize2 className="w-3.5 h-3.5 text-stone-500" />
              <span>Focus Branch</span>
            </button>
          )}

          {/* Add Subtask action */}
          <button
            onClick={() => openAddModal(node.id)}
            className="flex-1 inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-600" />
            <span>Add Sub-Item</span>
          </button>
        </div>

        {/* Delete action (disabled on center) */}
        {!isCenter && (
          <div>
            {isConfirmDeleteOpen ? (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                <p className="text-[11px] text-rose-800 font-medium">
                  Delete &ldquo;{node.title}&rdquo; and all of its descendants?
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      deleteNode(node.id);
                      setIsConfirmDeleteOpen(false);
                    }}
                    className="flex-1 py-1 px-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setIsConfirmDeleteOpen(false)}
                    className="flex-1 py-1 px-2 rounded-lg bg-white border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsConfirmDeleteOpen(true)}
                className="w-full inline-flex items-center justify-center space-x-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50/60 py-1.5 rounded-lg transition-colors font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Node</span>
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
