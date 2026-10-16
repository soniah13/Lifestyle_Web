import React, { useMemo } from 'react';
import {
  TrendingUp,
  Briefcase,
  Heart,
  Home,
  Users,
  Coins,
  Sparkles,
  Compass,
  Folder,
  ArrowRight,
  CheckCircle2,
  Clock,
  Feather,
} from 'lucide-react';
import { useGraph } from '../context/GraphContext.tsx';
import { getAreaGrowthStats, LIFE_AREAS } from '../utils/graphLogic.ts';

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

export const GrowthView: React.FC = () => {
  const { nodes, setActiveView, focusNode, selectNode } = useGraph();

  const areaStats = useMemo(() => getAreaGrowthStats(nodes), [nodes]);

  const totalTasks = areaStats.reduce((sum, a) => sum + a.totalTasks, 0);
  const totalCompleted = areaStats.reduce((sum, a) => sum + a.completedTasks, 0);
  const overallPercent = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
  const completedMinutes = areaStats.reduce((sum, a) => sum + a.completedMinutes, 0);

  const handleInspectArea = (areaId: string) => {
    setActiveView('graph');
    focusNode(areaId);
    selectNode(areaId);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF9F5] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Holistic Equilibrium</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Life Alignment & Growth
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-xl leading-relaxed">
              Every season has its rhythm. Growth is not about maximizing every metric at once, but maintaining awareness and gentle care across what matters to you.
            </p>
          </div>

          {/* Overall Equilibrium Pill */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100 flex flex-col justify-center min-w-[220px]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              Overall Harmony
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-bold text-stone-900">{overallPercent}%</span>
              <span className="text-xs text-stone-500">
                ({totalCompleted} of {totalTasks} completed)
              </span>
            </div>
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-rose-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            <span className="text-[11px] text-stone-400 mt-2">
              ~{Math.round(completedMinutes / 60)} hours of intentional action
            </span>
          </div>
        </div>

        {/* 7 Life Domains Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-stone-800">
              Seven Life Domains
            </h3>
            <span className="text-xs text-stone-400">
              Click any domain to focus its branch in your Life Web
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {areaStats.map((stat) => {
              const areaConfig = LIFE_AREAS[stat.areaId] || LIFE_AREAS['area-work'];
              const IconComp = iconMap[areaConfig.icon] || Folder;

              return (
                <div
                  key={stat.areaId}
                  onClick={() => handleInspectArea(stat.areaId)}
                  className="group bg-white rounded-2xl p-5 border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  style={{
                    borderTopColor: areaConfig.color,
                    borderTopWidth: '4px',
                  }}
                >
                  <div>
                    {/* Header: Icon + Title */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
                          style={{ backgroundColor: areaConfig.color }}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-stone-900 text-sm group-hover:text-indigo-600 transition-colors">
                            {stat.title}
                          </h4>
                          <span className="text-[10px] text-stone-400">
                            {stat.totalTasks} registered actions
                          </span>
                        </div>
                      </div>

                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: areaConfig.accentBg,
                          color: areaConfig.textColor,
                        }}
                      >
                        {stat.progressPercent}%
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 line-clamp-2 mb-4 leading-relaxed">
                      {areaConfig.description}
                    </p>
                  </div>

                  {/* Progress & Stats */}
                  <div className="space-y-3 pt-3 border-t border-stone-100">
                    <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: areaConfig.color,
                          width: `${stat.progressPercent}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-600">
                      <span className="flex items-center space-x-1 text-[11px] text-stone-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-stone-400" />
                        <span>
                          {stat.completedTasks} done / {stat.totalTasks - stat.completedTasks} active
                        </span>
                      </span>

                      <div className="inline-flex items-center space-x-1 text-xs font-medium text-stone-400 group-hover:text-indigo-600 transition-colors">
                        <span>Explore</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gentle Philosophy & Mindset Note */}
        <div className="bg-amber-50/70 border border-amber-200/70 rounded-3xl p-6 flex items-start space-x-4">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Feather className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-amber-950">
              Gentle Guidance for Life Web
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              An uncompleted domain isn&rsquo;t a failure—it reflects where your energy naturally paused to allow other priorities to flourish. Rebalance intentionally whenever you feel ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
