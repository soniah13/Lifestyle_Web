export type NodeType = 'center' | 'area' | 'branch' | 'project' | 'habit' | 'task';

export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'paused';

export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'weekdays' | 'monthly';

export interface LifeNode {
  id: string;
  parentId: string | null;
  type: NodeType;
  title: string;
  description?: string;
  areaId?: string; // Links to top-level life area (1-7) for consistent theming
  // Task specific properties
  status?: TaskStatus;
  completedAt?: string | null;
  dueDate?: string; // YYYY-MM-DD
  estimatedMinutes?: number;
  priority?: TaskPriority;
  notes?: string;
  recurrence?: TaskRecurrence;
  focusToday?: boolean;
  // Canvas layout properties
  position: { x: number; y: number };
  collapsed?: boolean;
}

export interface UserProfile {
  name: string;
  title?: string;
  avatarUrl: string; // URL or data:image URL or preset ID
}

export interface LifeAreaData {
  id: string;
  name: string;
  color: string;
  accentBg: string;
  borderAccent: string;
  textColor: string;
  icon: string;
  description: string;
}

export interface GrowthAreaStat {
  areaId: string;
  title: string;
  color: string;
  icon: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  progressPercent: number;
  totalMinutes: number;
  completedMinutes: number;
}

export interface LifeWebBackup {
  version: number;
  exportedAt: string;
  profile: UserProfile;
  nodes: LifeNode[];
}
