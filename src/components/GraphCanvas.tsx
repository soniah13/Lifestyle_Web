import React, { useMemo, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  applyNodeChanges,
  NodeChange,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useGraph } from '../context/GraphContext.tsx';
import { CenterNodeComponent } from './nodes/CenterNodeComponent.tsx';
import { AreaNodeComponent } from './nodes/AreaNodeComponent.tsx';
import { BranchNodeComponent } from './nodes/BranchNodeComponent.tsx';
import { TaskNodeComponent } from './nodes/TaskNodeComponent.tsx';
import {
  calculateDescendantProgress,
  getDescendantIds,
  getAncestors,
  LIFE_AREAS,
} from '../utils/graphLogic.ts';
import { ArrowLeft, ChevronRight, Compass } from 'lucide-react';

const nodeTypes = {
  center: CenterNodeComponent,
  area: AreaNodeComponent,
  branch: BranchNodeComponent,
  task: TaskNodeComponent,
  habit: TaskNodeComponent,
  project: BranchNodeComponent,
};

const GraphCanvasInner: React.FC = () => {
  const { fitView } = useReactFlow();
  const {
    nodes,
    profile,
    selectedNodeId,
    focusedNodeId,
    selectNode,
    focusNode,
    updateNodePositions,
    toggleTaskComplete,
    toggleCollapse,
    setProfileModalOpen,
  } = useGraph();

  // Auto-fit view when focused node changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.35, duration: 400 });
    }, 60);
    return () => clearTimeout(timer);
  }, [focusedNodeId, fitView]);

  // Find ancestors and path if in focused mode
  const focusedNode = useMemo(
    () => nodes.find((n) => n.id === focusedNodeId),
    [nodes, focusedNodeId]
  );

  const breadcrumbs = useMemo(() => {
    if (!focusedNodeId) return [];
    return getAncestors(focusedNodeId, nodes);
  }, [focusedNodeId, nodes]);

  // Determine which nodes should be visible
  const visibleNodes = useMemo(() => {
    if (focusedNodeId) {
      // In focused mode: show focused node and its descendants
      const descendantIds = new Set(getDescendantIds(focusedNodeId, nodes));
      descendantIds.add(focusedNodeId);
      return nodes.filter((n) => descendantIds.has(n.id));
    }

    // Normal mode: central node + root areas + expanded branches/tasks
    // Walk tree: a node is visible if its parent is visible and parent is NOT collapsed
    const visibleIds = new Set<string>();
    const center = nodes.find((n) => n.type === 'center');
    if (center) visibleIds.add(center.id);

    // Add 7 major areas
    nodes
      .filter((n) => n.type === 'area')
      .forEach((area) => visibleIds.add(area.id));

    // Iteratively add children whose parents are visible and not collapsed
    let added = true;
    while (added) {
      added = false;
      for (const n of nodes) {
        if (!visibleIds.has(n.id) && n.parentId && visibleIds.has(n.parentId)) {
          const parentNode = nodes.find((p) => p.id === n.parentId);
          if (parentNode && !parentNode.collapsed) {
            visibleIds.add(n.id);
            added = true;
          }
        }
      }
    }

    return nodes.filter((n) => visibleIds.has(n.id));
  }, [nodes, focusedNodeId]);

  // Dedicated clean tree layout for focused branch view
  const focusedLayout = useMemo(() => {
    if (!focusedNodeId) return null;
    const layoutMap = new Map<string, { x: number; y: number }>();
    layoutMap.set(focusedNodeId, { x: 0, y: 0 });

    const children = nodes.filter((n) => n.parentId === focusedNodeId);
    const childCount = children.length;
    const spacing = 320;

    children.forEach((child, idx) => {
      const childX = Math.round((idx - (childCount - 1) / 2) * spacing);
      const childY = 180;
      layoutMap.set(child.id, { x: childX, y: childY });

      const grandChildren = nodes.filter((n) => n.parentId === child.id);
      grandChildren.forEach((gc, gcIdx) => {
        layoutMap.set(gc.id, { x: childX, y: childY + 130 + gcIdx * 110 });
      });
    });

    return layoutMap;
  }, [focusedNodeId, nodes]);

  // Overall holistic stats for center node
  const holisticProgress = useMemo(() => {
    const center = nodes.find((n) => n.type === 'center');
    if (!center) return { totalTasks: 0, completedTasks: 0, progressPercent: 0 };
    return calculateDescendantProgress(center.id, nodes);
  }, [nodes]);

  // Map to React Flow Nodes
  const rfNodes: Node[] = useMemo(() => {
    return visibleNodes.map((n) => {
      const isSelected = n.id === selectedNodeId;
      const nodePos = (focusedLayout && focusedLayout.get(n.id)) || n.position;

      if (n.type === 'center') {
        const areaCount = nodes.filter((node) => node.type === 'area').length;
        return {
          id: n.id,
          type: 'center',
          position: nodePos,
          data: {
            title: n.title,
            profile,
            totalAreas: areaCount,
            totalTasks: holisticProgress.totalTasks,
            overallPercent: holisticProgress.progressPercent,
            isSelected,
            onSelect: () => selectNode(n.id),
            onOpenProfile: () => setProfileModalOpen(true),
          },
        };
      }

      if (n.type === 'area') {
        const progress = calculateDescendantProgress(n.id, nodes);
        const children = nodes.filter((child) => child.parentId === n.id);
        return {
          id: n.id,
          type: 'area',
          position: nodePos,
          data: {
            id: n.id,
            title: n.title,
            description: n.description,
            areaId: n.areaId || n.id,
            childCount: children.length,
            totalTasks: progress.totalTasks,
            completedTasks: progress.completedTasks,
            progressPercent: progress.progressPercent,
            collapsed: !!n.collapsed,
            isSelected,
            onSelect: () => selectNode(n.id),
            onToggleCollapse: () => toggleCollapse(n.id),
            onFocus: () => focusNode(n.id),
          },
        };
      }

      if (n.type === 'branch' || n.type === 'project') {
        const progress = calculateDescendantProgress(n.id, nodes);
        const children = nodes.filter((child) => child.parentId === n.id);
        return {
          id: n.id,
          type: 'branch',
          position: nodePos,
          data: {
            id: n.id,
            title: n.title,
            description: n.description,
            areaId: n.areaId,
            childCount: children.length,
            totalTasks: progress.totalTasks,
            completedTasks: progress.completedTasks,
            progressPercent: progress.progressPercent,
            collapsed: !!n.collapsed,
            isSelected,
            onSelect: () => selectNode(n.id),
            onToggleCollapse: () => toggleCollapse(n.id),
            onFocus: () => focusNode(n.id),
          },
        };
      }

      // Tasks & Habits
      return {
        id: n.id,
        type: 'task',
        position: nodePos,
        data: {
          id: n.id,
          title: n.title,
          description: n.description,
          status: n.status || 'not_started',
          priority: n.priority,
          estimatedMinutes: n.estimatedMinutes,
          focusToday: n.focusToday,
          dueDate: n.dueDate,
          areaId: n.areaId,
          isSelected,
          onSelect: () => selectNode(n.id),
          onToggleComplete: () => toggleTaskComplete(n.id),
          onOpenEdit: () => selectNode(n.id),
        },
      };
    });
  }, [
    visibleNodes,
    selectedNodeId,
    focusedLayout,
    profile,
    nodes,
    holisticProgress,
    selectNode,
    setProfileModalOpen,
    toggleCollapse,
    focusNode,
    toggleTaskComplete,
  ]);

  // Generate Edges for visible nodes
  const rfEdges: Edge[] = useMemo(() => {
    const visibleIdSet = new Set(visibleNodes.map((n) => n.id));
    const edges: Edge[] = [];

    for (const node of visibleNodes) {
      if (node.parentId && visibleIdSet.has(node.parentId)) {
        const areaConfig = node.areaId ? LIFE_AREAS[node.areaId] : null;
        const strokeColor = areaConfig ? areaConfig.color : '#A5B4FC';

        edges.push({
          id: `edge-${node.parentId}-${node.id}`,
          source: node.parentId,
          target: node.id,
          type: 'smoothstep',
          style: {
            stroke: strokeColor,
            strokeWidth: node.type === 'area' ? 2.5 : 1.5,
            opacity: 0.65,
          },
          animated: false,
        });
      }
    }

    return edges;
  }, [visibleNodes]);

  // Handle node drag stop: persist positions to localStorage
  const onNodeDragStop = useCallback(
    (_: any, node: Node) => {
      updateNodePositions([{ id: node.id, position: node.position }]);
    },
    [updateNodePositions]
  );

  // Handle multi-node changes
  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => {
      // Local changes for fluid dragging
      const positionChanges = changes.filter(
        (c) => c.type === 'position' && (c as any).position
      );
      if (positionChanges.length > 0) {
        // Position changes handled on drag stop for performance
      }
    },
    []
  );

  return (
    <div className="relative w-full h-full bg-[#FAF9F5] select-none overflow-hidden">
      {/* Focused Branch Breadcrumb bar */}
      {focusedNodeId && focusedNode && (
        <div className="absolute top-4 left-6 z-20 flex items-center space-x-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-stone-200">
          <button
            onClick={() => focusNode(null)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Whole Web</span>
          </button>

          <span className="text-stone-300">|</span>

          {/* Breadcrumb links */}
          <div className="flex items-center space-x-1.5 text-xs text-stone-500 overflow-x-auto max-w-md">
            <button
              onClick={() => focusNode(null)}
              className="hover:text-stone-800 transition-colors"
            >
              Whole Web
            </button>
            {breadcrumbs.map((b) => (
              <React.Fragment key={b.id}>
                <ChevronRight className="w-3 h-3 text-stone-400" />
                <button
                  onClick={() => focusNode(b.id)}
                  className="hover:text-stone-800 transition-colors truncate max-w-[120px]"
                >
                  {b.title}
                </button>
              </React.Fragment>
            ))}
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <span className="font-semibold text-stone-800 truncate max-w-[140px]">
              {focusedNode.title}
            </span>
          </div>
        </div>
      )}

      {/* Floating hints / canvas guide */}
      <div className="absolute bottom-4 left-6 z-10 hidden sm:flex items-center space-x-3 text-[11px] text-stone-500 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-200/80 shadow-xs pointer-events-none">
        <span className="inline-flex items-center space-x-1">
          <Compass className="w-3.5 h-3.5 text-stone-400" />
          <span>Click to select</span>
        </span>
        <span className="text-stone-300">•</span>
        <span>Double-click to focus branch</span>
        <span className="text-stone-300">•</span>
        <span>Drag to reposition</span>
      </div>

      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        onNodeDragStop={onNodeDragStop}
        onNodesChange={onNodesChange}
        onPaneClick={() => selectNode(null)}
        fitView
        fitViewOptions={{ padding: 0.35, duration: 600 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#E7E5E4" gap={24} size={1.2} />
        <Controls
          className="!bg-white !border !border-stone-200 !shadow-md !rounded-xl overflow-hidden !m-4"
          showInteractive={false}
        />
        <MiniMap
          nodeColor={(n) => {
            if (n.type === 'center') return '#6366F1';
            if (n.type === 'area') return '#10B981';
            return '#E2E8F0';
          }}
          className="!bg-white/90 !border !border-stone-200 !rounded-xl !shadow-md !m-4 hidden md:block"
          maskColor="rgba(250, 249, 245, 0.7)"
        />
      </ReactFlow>
    </div>
  );
};

export const GraphCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <GraphCanvasInner />
    </ReactFlowProvider>
  );
};
