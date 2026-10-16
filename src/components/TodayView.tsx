import React, { useState, useMemo } from 'react';
import {
  Sun,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Network,
  Plus,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useGraph } from '../context/GraphContext.tsx';
import { getTodayTasks, LIFE_AREAS } from '../utils/graphLogic.ts';
import type { LifeNode } from '../types/graph.ts';

export const TodayView: React.FC = () => {
  const {
    nodes,
    toggleTaskComplete,
    selectNode,
    focusNode,
    setActiveView,
    openAddModal,
  } = useGraph();

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const allTodayTasks = useMemo(() => getTodayTasks(nodes), [nodes]);

  const filteredTasks = useMemo(() => {
    if (filter === 'pending') {
      return allTodayTasks.filter((t) => t.status !== 'completed');
    }
    if (filter === 'completed') {
      return allTodayTasks.filter((t) => t.status === 'completed');
    }
    return allTodayTasks;
  }, [allTodayTasks, filter]);

  const totalCount = allTodayTasks.length;
  const completedCount = allTodayTasks.filter((t) => t.status === 'completed').length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalMinutes = allTodayTasks.reduce((sum, t) => sum + (t.estimatedMinutes || 15), 0);

  const handleJumpToGraph = (task: LifeNode) => {
    setActiveView('graph');
    if (task.parentId) {
      focusNode(task.parentId);
    }
    selectNode(task.id);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF9F5] p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-semibold">
              <Sun className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>
                {new Date().toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
              Today&rsquo;s Flow
            </h2>
            <p className="text-xs text-stone-500 max-w-md">
              Focus without overwhelm. Tasks here were intentionally marked for today or are scheduled for delivery.
            </p>
          </div>

          {/* Understated Progress Indicator */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 flex flex-col justify-center min-w-[180px]">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1.5 gap-3">
              <span className="text-stone-500 font-medium">Daily Completion</span>
              <span className="text-stone-900 font-bold">
                {completedCount} of {totalCount} ({completionPercent}%)
              </span>
            </div>
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2">
              <span>{totalMinutes} mins total</span>
              {completedCount === totalCount && totalCount > 0 && (
                <span className="text-emerald-600 font-medium">All cleared!</span>
              )}
            </div>
          </div>
        </div>

        {/* Filter bar & Add Task */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-1.5 bg-stone-200/60 p-1 rounded-xl">
            {(['all', 'pending', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                  filter === tab
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => openAddModal()}
            className="inline-flex items-center space-x-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium px-3.5 py-1.5 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Node to Today</span>
          </button>
        </div>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-stone-800">
              No {filter !== 'all' ? filter : ''} tasks for today
            </h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Browse your Life Web and toggle &ldquo;Focus Today&rdquo; on any task you want to prioritize, or add a fresh one.
            </p>
            <button
              onClick={() => setActiveView('graph')}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition-colors mt-2"
            >
              <Network className="w-4 h-4" />
              <span>Explore My Life Web</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTasks.map((task) => {
              const isDone = task.status === 'completed';
              const areaConfig = task.areaId ? LIFE_AREAS[task.areaId] : null;

              return (
                <div
                  key={task.id}
                  className={`bg-white rounded-2xl p-4 border transition-all duration-200 flex items-center justify-between space-x-3 shadow-xs hover:shadow-md ${
                    isDone ? 'border-stone-200/70 bg-stone-50/60 opacity-80' : 'border-stone-200'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className="text-stone-400 hover:text-emerald-600 transition-colors flex-shrink-0"
                      aria-label={isDone ? `Mark incomplete: ${task.title}` : `Mark complete: ${task.title}`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                      ) : (
                        <Circle className="w-5 h-5 hover:stroke-emerald-600" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-semibold truncate ${
                          isDone ? 'line-through text-stone-400' : 'text-stone-800'
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-stone-400 truncate mt-0.5">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Metadata and actions */}
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    {areaConfig && (
                      <span
                        className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: areaConfig.accentBg,
                          color: areaConfig.textColor,
                        }}
                      >
                        {areaConfig.name}
                      </span>
                    )}

                    {task.estimatedMinutes ? (
                      <span className="inline-flex items-center space-x-1 text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-lg">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{task.estimatedMinutes}m</span>
                      </span>
                    ) : null}

                    {/* Button to inspect in graph */}
                    <button
                      onClick={() => handleJumpToGraph(task)}
                      title="View in Life Web graph"
                      aria-label={`View ${task.title} in Life Web graph`}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
