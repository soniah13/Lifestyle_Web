import React, { useState, useEffect } from 'react';
import { X, Plus, AlertCircle, Sun } from 'lucide-react';
import { useGraph } from '../context/GraphContext.tsx';
import type { NodeType, TaskPriority, TaskRecurrence } from '../types/graph.ts';
import { LIFE_AREAS } from '../utils/graphLogic.ts';

export const AddNodeModal: React.FC = () => {
  const {
    nodes,
    isAddModalOpen,
    addModalParentId,
    closeAddModal,
    addNode,
    selectedNodeId,
  } = useGraph();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<NodeType>('task');
  const [parentId, setParentId] = useState<string>('center-user');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | ''>(15);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [focusToday, setFocusToday] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [recurrence, setRecurrence] = useState<TaskRecurrence>('none');
  const [validationError, setValidationError] = useState('');

  // Default parent when modal opens
  useEffect(() => {
    if (isAddModalOpen) {
      const defaultParent = addModalParentId || selectedNodeId || 'center-user';
      setParentId(defaultParent);

      // Guess sensible node type based on parent
      const parentNode = nodes.find((n) => n.id === defaultParent);
      if (parentNode?.type === 'center') {
        setType('area');
      } else if (parentNode?.type === 'area') {
        setType('branch');
      } else {
        setType('task');
      }

      setTitle('');
      setDescription('');
      setEstimatedMinutes(15);
      setPriority('medium');
      setFocusToday(false);
      setDueDate('');
      setNotes('');
      setRecurrence('none');
      setValidationError('');
    }
  }, [isAddModalOpen, addModalParentId, selectedNodeId, nodes]);

  if (!isAddModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Please enter a node title.');
      return;
    }

    addNode({
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      parentId: parentId || null,
      estimatedMinutes: typeof estimatedMinutes === 'number' ? estimatedMinutes : undefined,
      priority,
      focusToday,
      dueDate: dueDate || undefined,
      notes: notes.trim() || undefined,
      recurrence,
    });

    closeAddModal();
  };

  const isTaskOrHabit = type === 'task' || type === 'habit';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-node-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <h3 id="add-node-title" className="text-base font-bold text-stone-800">
              Add to Life Web
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Create an area, branch, project, habit, or task
            </p>
          </div>
          <button
            onClick={closeAddModal}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Node Type Selector */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1.5">
              Node Type
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 bg-stone-100/80 p-1 rounded-xl">
              {(['task', 'habit', 'branch', 'project', 'area'] as NodeType[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                    type === t
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Parent Node Selector */}
          <div>
            <label
              htmlFor="parent-select"
              className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1.5"
            >
              Attach Under Parent Node
            </label>
            <select
              id="parent-select"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="center-user">My Life Center (Root Anchor)</option>
              {nodes
                .filter((n) => n.type !== 'task' && n.id !== 'center-user')
                .map((n) => (
                  <option key={n.id} value={n.id}>
                    [{n.type.toUpperCase()}] {n.title}
                  </option>
                ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="node-title-input"
              className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1.5"
            >
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="node-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationError) setValidationError('');
              }}
              placeholder={
                isTaskOrHabit
                  ? 'e.g. Prepare for the next class'
                  : 'e.g. Creative Hobbies'
              }
              className="w-full text-sm font-medium text-stone-800 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all placeholder:text-stone-400"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="node-desc-input"
              className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1.5"
            >
              Description (Optional)
            </label>
            <textarea
              id="node-desc-input"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A few words on purpose or actionable details..."
              className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all placeholder:text-stone-400 resize-none"
            />
          </div>

          {/* Task-Specific Controls */}
          {isTaskOrHabit && (
            <div className="space-y-3.5 pt-2 border-t border-stone-100">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="duration-input"
                    className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1.5"
                  >
                    Est. Duration (mins)
                  </label>
                  <input
                    id="duration-input"
                    type="number"
                    min="1"
                    step="1"
                    value={estimatedMinutes}
                    onChange={(e) =>
                      setEstimatedMinutes(e.target.value === '' ? '' : parseInt(e.target.value, 10))
                    }
                    className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="priority-select"
                    className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1.5"
                  >
                    Priority
                  </label>
                  <select
                    id="priority-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="due-date-input"
                    className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1.5"
                  >
                    Due Date
                  </label>
                  <input
                    id="due-date-input"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="recurrence-select"
                    className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1.5"
                  >
                    Recurrence
                  </label>
                  <select
                    id="recurrence-select"
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value as TaskRecurrence)}
                    className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="none">None</option>
                    <option value="daily">Daily Habit</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              {/* Focus Today toggle */}
              <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={focusToday}
                  onChange={(e) => setFocusToday(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <div className="flex items-center space-x-1.5">
                  <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-semibold text-stone-800">
                    Mark as Focus Today
                  </span>
                </div>
              </label>
            </div>
          )}

          {/* Modal Buttons */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={closeAddModal}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-800 rounded-xl hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-5 py-2 text-xs font-semibold bg-stone-900 text-white rounded-xl hover:bg-stone-800 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Graph</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
