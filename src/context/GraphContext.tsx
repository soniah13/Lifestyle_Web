import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  LifeNode,
  UserProfile,
  LifeWebBackup,
  TaskStatus,
} from '../types/graph.ts';
import {
  getInitialGraphData,
  INITIAL_PROFILE,
  validateBackupData,
  getDescendantIds,
} from '../utils/graphLogic.ts';

const STORAGE_KEY_NODES = 'life_web_nodes_v1';
const STORAGE_KEY_PROFILE = 'life_web_profile_v1';

export type ActiveView = 'graph' | 'today' | 'growth';

interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface GraphContextType {
  nodes: LifeNode[];
  profile: UserProfile;
  selectedNodeId: string | null;
  focusedNodeId: string | null;
  activeView: ActiveView;
  isAddModalOpen: boolean;
  addModalParentId: string | null;
  isProfileModalOpen: boolean;
  toasts: ToastInfo[];
  // View controls
  setActiveView: (view: ActiveView) => void;
  selectNode: (id: string | null) => void;
  focusNode: (id: string | null) => void;
  // Node CRUD
  updateNode: (id: string, updates: Partial<LifeNode>) => void;
  addNode: (nodeData: {
    title: string;
    description?: string;
    type: LifeNode['type'];
    parentId: string | null;
    status?: TaskStatus;
    estimatedMinutes?: number;
    priority?: LifeNode['priority'];
    focusToday?: boolean;
    dueDate?: string;
    notes?: string;
    recurrence?: LifeNode['recurrence'];
    areaId?: string;
  }) => string;
  deleteNode: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  toggleFocusToday: (id: string) => void;
  toggleCollapse: (id: string) => void;
  updatePositions: (positions: Array<{ id: string; position: { x: number; y: number } }>) => void;
  updateNodePositions: (positions: Array<{ id: string; position: { x: number; y: number } }>) => void;
  // Modals & triggers
  openAddModal: (parentId?: string | null) => void;
  closeAddModal: () => void;
  setProfileModalOpen: (open: boolean) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  resetToSampleData: () => void;
  exportBackup: () => void;
  importBackup: (fileContent: string) => { success: boolean; error?: string };
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const GraphContext = createContext<GraphContextType | null>(null);

export function GraphProvider({ children }: { children: React.ReactNode }) {
  // Load initial nodes from localStorage or seed
  const [nodes, setNodes] = useState<LifeNode[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NODES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load nodes from localStorage, using initial seed:', err);
    }
    return getInitialGraphData();
  });

  // Load user profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.name === 'string') {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load profile from localStorage:', err);
    }
    return INITIAL_PROFILE;
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('graph');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalParentId, setAddModalParentId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Persist nodes on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NODES, JSON.stringify(nodes));
    } catch (err) {
      console.error('Failed to save nodes to localStorage:', err);
    }
  }, [nodes]);

  // Persist profile on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (err) {
      console.error('Failed to save profile to localStorage:', err);
    }
  }, [profile]);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const selectNode = useCallback((id: string | null) => {
    setSelectedNodeId(id);
  }, []);

  const focusNode = useCallback((id: string | null) => {
    setFocusedNodeId(id);
    if (id) {
      // also ensure graph view is active
      setActiveView('graph');
    }
  }, []);

  const updateNode = useCallback((id: string, updates: Partial<LifeNode>) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        const updated = { ...n, ...updates };
        // if status changed to completed, set completedAt timestamp
        if (updates.status === 'completed' && n.status !== 'completed' && !updated.completedAt) {
          updated.completedAt = new Date().toISOString();
        } else if (updates.status && updates.status !== 'completed') {
          updated.completedAt = null;
        }
        return updated;
      })
    );
  }, []);

  const toggleTaskComplete = useCallback(
    (id: string) => {
      setNodes((prev) =>
        prev.map((n) => {
          if (n.id !== id) return n;
          const isDone = n.status === 'completed';
          const nextStatus: TaskStatus = isDone ? 'not_started' : 'completed';
          return {
            ...n,
            status: nextStatus,
            completedAt: isDone ? null : new Date().toISOString(),
          };
        })
      );
    },
    []
  );

  const toggleFocusToday = useCallback((id: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        const nextVal = !n.focusToday;
        return { ...n, focusToday: nextVal };
      })
    );
  }, []);

  const toggleCollapse = useCallback((id: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        return { ...n, collapsed: !n.collapsed };
      })
    );
  }, []);

  const addNode = useCallback(
    (data: {
      title: string;
      description?: string;
      type: LifeNode['type'];
      parentId: string | null;
      status?: TaskStatus;
      estimatedMinutes?: number;
      priority?: LifeNode['priority'];
      focusToday?: boolean;
      dueDate?: string;
      notes?: string;
      recurrence?: LifeNode['recurrence'];
      areaId?: string;
    }) => {
      const newId = `node-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      // Calculate position relative to parent or center
      let posX = 0;
      let posY = 0;

      const parent = nodes.find((n) => n.id === data.parentId);
      if (parent) {
        // Count existing siblings to offset
        const siblingCount = nodes.filter((n) => n.parentId === parent.id).length;
        const angle = (siblingCount * 0.7) + 0.3;
        const dist = data.type === 'task' ? 180 : 220;
        posX = parent.position.x + Math.round(Math.cos(angle) * dist);
        posY = parent.position.y + Math.round(Math.sin(angle) * dist);
      } else {
        posX = (Math.random() - 0.5) * 300;
        posY = (Math.random() - 0.5) * 300;
      }

      // Determine areaId
      let resolvedAreaId = data.areaId;
      if (!resolvedAreaId && parent) {
        resolvedAreaId = parent.areaId || (parent.type === 'area' ? parent.id : undefined);
      }

      const newNode: LifeNode = {
        id: newId,
        parentId: data.parentId,
        type: data.type,
        title: data.title.trim(),
        description: data.description?.trim(),
        areaId: resolvedAreaId,
        status: data.type === 'task' || data.type === 'habit' ? data.status || 'not_started' : undefined,
        estimatedMinutes: data.estimatedMinutes,
        priority: data.priority || 'medium',
        focusToday: !!data.focusToday,
        dueDate: data.dueDate,
        notes: data.notes,
        recurrence: data.recurrence || 'none',
        position: { x: posX, y: posY },
        collapsed: false,
      };

      setNodes((prev) => [...prev, newNode]);

      // If parent was collapsed, expand it
      if (parent && parent.collapsed) {
        setNodes((prev) =>
          prev.map((n) => (n.id === parent.id ? { ...n, collapsed: false } : n))
        );
      }

      setSelectedNodeId(newId);
      showToast(`Added "${newNode.title}"`, 'success');
      return newId;
    },
    [nodes, showToast]
  );

  const deleteNode = useCallback(
    (id: string) => {
      const nodeToDelete = nodes.find((n) => n.id === id);
      if (!nodeToDelete) return;
      if (nodeToDelete.type === 'center') {
        showToast('The central user node cannot be deleted.', 'error');
        return;
      }

      const descendantIds = new Set(getDescendantIds(id, nodes));
      descendantIds.add(id);

      setNodes((prev) => prev.filter((n) => !descendantIds.has(n.id)));

      if (selectedNodeId && descendantIds.has(selectedNodeId)) {
        setSelectedNodeId(null);
      }
      if (focusedNodeId && descendantIds.has(focusedNodeId)) {
        setFocusedNodeId(null);
      }

      showToast(`Deleted "${nodeToDelete.title}" and its descendants.`, 'info');
    },
    [nodes, selectedNodeId, focusedNodeId, showToast]
  );

  const updatePositions = useCallback(
    (positions: Array<{ id: string; position: { x: number; y: number } }>) => {
      setNodes((prev) => {
        const posMap = new Map(positions.map((p) => [p.id, p.position]));
        return prev.map((n) => {
          const nextPos = posMap.get(n.id);
          if (nextPos) {
            return { ...n, position: nextPos };
          }
          return n;
        });
      });
    },
    []
  );

  const openAddModal = useCallback((parentId?: string | null) => {
    setAddModalParentId(parentId !== undefined ? parentId : null);
    setIsAddModalOpen(true);
  }, []);

  const closeAddModal = useCallback(() => {
    setIsAddModalOpen(false);
    setAddModalParentId(null);
  }, []);

  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      setProfile((prev) => ({ ...prev, ...updates }));
      showToast('Profile updated', 'success');
    },
    [showToast]
  );

  const resetToSampleData = useCallback(() => {
    const initial = getInitialGraphData();
    setNodes(initial);
    setProfile(INITIAL_PROFILE);
    setSelectedNodeId(null);
    setFocusedNodeId(null);
    try {
      localStorage.setItem(STORAGE_KEY_NODES, JSON.stringify(initial));
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(INITIAL_PROFILE));
    } catch (err) {
      console.error(err);
    }
    showToast('Reset to sample life web data.', 'info');
  }, [showToast]);

  const exportBackup = useCallback(() => {
    const backup: LifeWebBackup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      profile,
      nodes,
    };
    const jsonString = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `life-web-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Backup file downloaded successfully.', 'success');
  }, [profile, nodes, showToast]);

  const importBackup = useCallback(
    (fileContent: string) => {
      try {
        const parsed = JSON.parse(fileContent);
        const result = validateBackupData(parsed);
        if (!result.valid || !result.backup) {
          showToast(result.error || 'Invalid backup file format.', 'error');
          return { success: false, error: result.error };
        }

        setNodes(result.backup.nodes);
        setProfile(result.backup.profile);
        setSelectedNodeId(null);
        setFocusedNodeId(null);
        showToast('Backup restored successfully!', 'success');
        return { success: true };
      } catch (err: any) {
        const msg = err?.message || 'Could not parse JSON backup file.';
        showToast(msg, 'error');
        return { success: false, error: msg };
      }
    },
    [showToast]
  );

  return (
    <GraphContext.Provider
      value={{
        nodes,
        profile,
        selectedNodeId,
        focusedNodeId,
        activeView,
        isAddModalOpen,
        addModalParentId,
        isProfileModalOpen,
        toasts,
        setActiveView,
        selectNode,
        focusNode,
        updateNode,
        addNode,
        deleteNode,
        toggleTaskComplete,
        toggleFocusToday,
        toggleCollapse,
        updatePositions,
        updateNodePositions: updatePositions,
        openAddModal,
        closeAddModal,
        setProfileModalOpen: setIsProfileModalOpen,
        updateProfile,
        resetToSampleData,
        exportBackup,
        importBackup,
        showToast,
        removeToast,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
}

export function useGraph() {
  const ctx = useContext(GraphContext);
  if (!ctx) {
    throw new Error('useGraph must be used within a GraphProvider');
  }
  return ctx;
}
