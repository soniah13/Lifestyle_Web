import type {
  LifeNode,
  LifeAreaData,
  GrowthAreaStat,
  LifeWebBackup,
  UserProfile,
} from '../types/graph.ts';

export const LIFE_AREAS: Record<string, LifeAreaData> = {
  'area-work': {
    id: 'area-work',
    name: 'Work & Responsibilities',
    color: '#6366F1', // Indigo
    accentBg: '#EEF2FF',
    borderAccent: '#C7D2FE',
    textColor: '#4338CA',
    icon: 'Briefcase',
    description: 'Professional commitments, delivery, and work excellence',
  },
  'area-health': {
    id: 'area-health',
    name: 'Health & Wellbeing',
    color: '#10B981', // Mint / Emerald
    accentBg: '#ECFDF5',
    borderAccent: '#A7F3D0',
    textColor: '#047857',
    icon: 'Heart',
    description: 'Physical vitality, nourishment, and restful restoration',
  },
  'area-home': {
    id: 'area-home',
    name: 'Home & Everyday Life',
    color: '#D97706', // Amber / Sand
    accentBg: '#FFFBEB',
    borderAccent: '#FDE68A',
    textColor: '#B45309',
    icon: 'Home',
    description: 'Living space, domestic care, and daily nourishment',
  },
  'area-relationships': {
    id: 'area-relationships',
    name: 'Relationships & Hobbies',
    color: '#F43F5E', // Coral / Rose
    accentBg: '#FFF1F2',
    borderAccent: '#FECDD3',
    textColor: '#BE123C',
    icon: 'Users',
    description: 'Meaningful connections, friendships, and soul passions',
  },
  'area-money': {
    id: 'area-money',
    name: 'Money & Stability',
    color: '#0D9488', // Teal / Sage
    accentBg: '#F0FDFA',
    borderAccent: '#99F6E4',
    textColor: '#0F766E',
    icon: 'Coins',
    description: 'Financial foundations, mindful spending, and wealth security',
  },
  'area-career': {
    id: 'area-career',
    name: 'Career & Side Hustles',
    color: '#8B5CF6', // Lilac / Violet
    accentBg: '#F5F3FF',
    borderAccent: '#DDD6FE',
    textColor: '#6D28D9',
    icon: 'Sparkles',
    description: 'Exploration, engineering craft, and entrepreneurial pursuits',
  },
  'area-intellectual': {
    id: 'area-intellectual',
    name: 'Intellectual Growth',
    color: '#0284C7', // Sky / Deep blue
    accentBg: '#F0F9FF',
    borderAccent: '#BAE6FD',
    textColor: '#0369A1',
    icon: 'Compass',
    description: 'Curiosity, books, philosophy, and mind expansion',
  },
};

export const INITIAL_PROFILE: UserProfile = {
  name: 'Alex Morgan',
  title: 'Lifelong Learner & Creator',
  avatarUrl: 'preset:lotus',
};

export function getInitialGraphData(): LifeNode[] {
  const nodes: LifeNode[] = [
    // Center node
    {
      id: 'center-user',
      parentId: null,
      type: 'center',
      title: 'My Life Center',
      description: 'Anchor of presence, intentionality, and daily harmony',
      position: { x: 0, y: 0 },
    },
  ];

  // Exact sample content per user specification
  const areaDefinitions = [
    {
      areaId: 'area-work',
      title: 'Work & Responsibilities',
      description: 'Core projects, instruction, and student mentoring',
      branches: [
        {
          id: 'branch-work-classes',
          title: 'Classes & Student Support',
          description: 'Lecture prep, office hours, and learner guidance',
          tasks: [
            {
              id: 'task-work-prep',
              title: 'Prepare for the next class',
              description: 'Review slides and compile coding exercises',
              status: 'in_progress' as const,
              estimatedMinutes: 45,
              priority: 'high' as const,
              focusToday: true,
              dueDate: new Date().toISOString().split('T')[0],
            },
          ],
        },
        {
          id: 'branch-work-reviews',
          title: 'Project Reviews',
          description: 'Providing thoughtful critique on student submissions',
          tasks: [
            {
              id: 'task-work-review-one',
              title: 'Review one student project',
              description: 'Examine architecture and leave supportive feedback',
              status: 'not_started' as const,
              estimatedMinutes: 30,
              priority: 'medium' as const,
              focusToday: false,
            },
          ],
        },
        {
          id: 'branch-work-upskill',
          title: 'Upskilling & Masterclasses',
          description: 'Continuous professional learning in modern tooling',
          tasks: [
            {
              id: 'task-work-learn-session',
              title: 'Complete one short learning session',
              description: 'Study reactive systems chapter',
              status: 'completed' as const,
              completedAt: new Date(Date.now() - 86400000).toISOString(),
              estimatedMinutes: 25,
              priority: 'low' as const,
              focusToday: false,
            },
          ],
        },
        {
          id: 'branch-work-content',
          title: 'Content Development',
          description: 'Authoring educational videos and documentation',
          tasks: [
            {
              id: 'task-work-outline-lesson',
              title: 'Outline one lesson or video',
              description: 'Draft the storyboard for state machine lecture',
              status: 'not_started' as const,
              estimatedMinutes: 40,
              priority: 'medium' as const,
              focusToday: false,
            },
          ],
        },
      ],
    },
    {
      areaId: 'area-health',
      title: 'Health & Wellbeing',
      description: 'Daily vitality, wholesome nutrition, and restorative rest',
      branches: [
        {
          id: 'branch-health-movement',
          title: 'Movement',
          description: 'Gentle physical activity and outdoor walks',
          tasks: [
            {
              id: 'task-health-walk',
              title: 'Take a 10-minute walk',
              description: 'Fresh air in the park to clear the head',
              status: 'not_started' as const,
              estimatedMinutes: 10,
              priority: 'medium' as const,
              focusToday: true,
              recurrence: 'daily' as const,
            },
          ],
        },
        {
          id: 'branch-health-food',
          title: 'Food',
          description: 'Simple, wholesome, vibrant nourishment',
          tasks: [
            {
              id: 'task-health-meal',
              title: 'Plan one simple, balanced meal',
              description: 'Fresh vegetables, whole grains, and protein',
              status: 'completed' as const,
              completedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
              estimatedMinutes: 15,
              priority: 'low' as const,
              focusToday: true,
            },
          ],
        },
        {
          id: 'branch-health-rest',
          title: 'Rest',
          description: 'Sleep hygiene and calming evening rituals',
          tasks: [
            {
              id: 'task-health-bedtime',
              title: 'Set a realistic bedtime',
              description: 'Unwind screens by 10:30 PM for 8 hours of rest',
              status: 'not_started' as const,
              estimatedMinutes: 5,
              priority: 'medium' as const,
              focusToday: true,
            },
          ],
        },
      ],
    },
    {
      areaId: 'area-home',
      title: 'Home & Everyday Life',
      description: 'Sanctuary maintenance, cooking, and daily rhythms',
      branches: [
        {
          id: 'branch-home-cooking',
          title: 'Cooking',
          description: 'Mindful home meals and pantry preparation',
          tasks: [
            {
              id: 'task-home-prep-meal',
              title: 'Prepare one simple meal',
              description: 'Warm soup with toasted sourdough',
              status: 'not_started' as const,
              estimatedMinutes: 30,
              priority: 'medium' as const,
              focusToday: false,
            },
          ],
        },
        {
          id: 'branch-home-cleaning',
          title: 'Cleaning & Laundry',
          description: 'Keeping living spaces airy and organized',
          tasks: [
            {
              id: 'task-home-laundry',
              title: 'Wash and fold one load',
              description: 'Linens and soft warm clothing',
              status: 'completed' as const,
              completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
              estimatedMinutes: 20,
              priority: 'low' as const,
              focusToday: false,
            },
          ],
        },
        {
          id: 'branch-home-care',
          title: 'Personal Care',
          description: 'Gentle morning and evening hygiene rituals',
          tasks: [
            {
              id: 'task-home-routine',
              title: 'Complete the daily self-care routine',
              description: 'Moisturize, stretch, and hydrate with lemon water',
              status: 'in_progress' as const,
              estimatedMinutes: 15,
              priority: 'low' as const,
              focusToday: false,
            },
          ],
        },
      ],
    },
    {
      areaId: 'area-relationships',
      title: 'Relationships & Hobbies',
      description: 'Human warmth, creative play, and sports',
      branches: [
        {
          id: 'branch-rel-friends',
          title: 'Friends & Hangouts',
          description: 'Staying connected with dear friends',
          tasks: [
            {
              id: 'task-rel-msg',
              title: 'Send a message to a friend',
              description: 'Check in on Sarah and ask about her weekend',
              status: 'not_started' as const,
              estimatedMinutes: 5,
              priority: 'high' as const,
              focusToday: true,
            },
          ],
        },
        {
          id: 'branch-rel-reading',
          title: 'Reading',
          description: 'Immersing in fiction and philosophical prose',
          tasks: [
            {
              id: 'task-rel-pages',
              title: 'Read five pages',
              description: 'Continue reading chapter 4 of The Creative Act',
              status: 'completed' as const,
              completedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
              estimatedMinutes: 15,
              priority: 'low' as const,
              focusToday: false,
            },
          ],
        },
        {
          id: 'branch-rel-drawing',
          title: 'Drawing & Painting',
          description: 'Visual sketching and color expression',
          tasks: [
            {
              id: 'task-rel-sketch',
              title: 'Sketch for ten minutes',
              description: 'Draw the houseplant by the window',
              status: 'not_started' as const,
              estimatedMinutes: 10,
              priority: 'low' as const,
              focusToday: false,
            },
          ],
        },
        {
          id: 'branch-rel-swimming',
          title: 'Swimming',
          description: 'Lap swimming and water breathing rhythm',
          tasks: [
            {
              id: 'task-rel-plan-swim',
              title: 'Plan the next swim',
              description: 'Check pool lane availability for Thursday evening',
              status: 'not_started' as const,
              estimatedMinutes: 10,
              priority: 'medium' as const,
              focusToday: false,
            },
          ],
        },
      ],
    },
    {
      areaId: 'area-money',
      title: 'Money & Stability',
      description: 'Financial peace of mind, mindful budgeting, and savings',
      branches: [
        {
          id: 'branch-money-budget',
          title: 'Budgeting',
          description: 'Tracking inflows, essential outflows, and balances',
          tasks: [
            {
              id: 'task-money-spending',
              title: "Record today's spending",
              description: 'Log groceries and utility receipt',
              status: 'not_started' as const,
              estimatedMinutes: 5,
              priority: 'medium' as const,
              focusToday: true,
            },
          ],
        },
        {
          id: 'branch-money-savings',
          title: 'Savings',
          description: 'Emergency buffer and deliberate future reserves',
          tasks: [
            {
              id: 'task-money-goal',
              title: 'Review the current savings goal',
              description: 'Check milestone progress toward the 3-month buffer',
              status: 'completed' as const,
              completedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
              estimatedMinutes: 15,
              priority: 'low' as const,
              focusToday: false,
            },
          ],
        },
        {
          id: 'branch-money-edu',
          title: 'Financial Education',
          description: 'Understanding index funds, inflation, and compound growth',
          tasks: [
            {
              id: 'task-money-concept',
              title: 'Learn one money concept',
              description: 'Read brief primer on treasury bills vs bonds',
              status: 'not_started' as const,
              estimatedMinutes: 20,
              priority: 'low' as const,
              focusToday: false,
            },
          ],
        },
      ],
    },
    {
      areaId: 'area-career',
      title: 'Career & Side Hustles',
      description: 'Independent initiatives, technical projects, and career exploration',
      branches: [
        {
          id: 'branch-career-remote',
          title: 'Remote Jobs',
          description: 'Scanning curated boards for high-autonomy roles',
          tasks: [
            {
              id: 'task-career-find-job',
              title: 'Find and save one suitable job',
              description: 'Bookmark a remote frontend/systems role on We Work Remotely',
              status: 'not_started' as const,
              estimatedMinutes: 20,
              priority: 'medium' as const,
              focusToday: false,
            },
          ],
        },
        {
          id: 'branch-career-circuits',
          title: 'Circuit Design',
          description: 'Schematic capture and breadboard tinkering',
          tasks: [
            {
              id: 'task-career-led',
              title: 'Simulate a basic LED and resistor circuit',
              description: 'Verify current draw with Ohm law in Falstad simulator',
              status: 'completed' as const,
              completedAt: new Date(Date.now() - 86400000).toISOString(),
              estimatedMinutes: 25,
              priority: 'low' as const,
              focusToday: false,
            },
          ],
        },
        {
          id: 'branch-career-embedded',
          title: 'Embedded Systems',
          description: 'Firmware programming with C and microcontrollers',
          tasks: [
            {
              id: 'task-career-mcu',
              title: 'Research one microcontroller',
              description: 'Compare ESP32-S3 vs RP2040 for low power sleep',
              status: 'not_started' as const,
              estimatedMinutes: 30,
              priority: 'medium' as const,
              focusToday: false,
            },
          ],
        },
        {
          id: 'branch-career-freelance',
          title: 'Freelancing',
          description: 'High-value technical consulting and design offerings',
          tasks: [
            {
              id: 'task-career-service',
              title: 'Identify one service to offer',
              description: 'Draft one-pager for interactive web canvas prototyping',
              status: 'not_started' as const,
              estimatedMinutes: 35,
              priority: 'medium' as const,
              focusToday: false,
            },
          ],
        },
      ],
    },
    {
      areaId: 'area-intellectual',
      title: 'Intellectual Growth',
      description: 'Deep reading, mental models, and personal synthesis',
      branches: [
        {
          id: 'branch-intel-ideas',
          title: 'Books & Ideas',
          description: 'Collecting quotes, philosophical questions, and notes',
          tasks: [
            {
              id: 'task-intel-idea',
              title: 'Capture one interesting idea',
              description: 'Note thoughts on cybernetic feedback loops',
              status: 'not_started' as const,
              estimatedMinutes: 10,
              priority: 'medium' as const,
              focusToday: true,
            },
          ],
        },
        {
          id: 'branch-intel-skills',
          title: 'New Skills',
          description: 'Practicing micro-skills and memory retention',
          tasks: [
            {
              id: 'task-intel-exercise',
              title: 'Complete a short learning exercise',
              description: 'Write three custom recursive traversal functions',
              status: 'completed' as const,
              completedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
              estimatedMinutes: 20,
              priority: 'low' as const,
              focusToday: false,
            },
          ],
        },
        {
          id: 'branch-intel-reflection',
          title: 'Reflection',
          description: 'Quiet weekly review and intentional alignment',
          tasks: [
            {
              id: 'task-intel-reflect-week',
              title: 'Write a short reflection on the week',
              description: 'Record what brought energy, what felt heavy, and what to release',
              status: 'not_started' as const,
              estimatedMinutes: 15,
              priority: 'high' as const,
              focusToday: false,
            },
          ],
        },
      ],
    },
  ];

  const areaRadius = 450;
  const branchRadialDist = 260;
  const branchTangentialSpacing = 300;
  const taskRadialDist = 210;

  // Distribute the 7 areas evenly around the center in a 360-degree circle
  areaDefinitions.forEach((def, index) => {
    const angle = (index * 2 * Math.PI) / areaDefinitions.length - Math.PI / 2;
    const areaX = Math.round(Math.cos(angle) * areaRadius);
    const areaY = Math.round(Math.sin(angle) * areaRadius);

    // Unit radial and tangential vectors
    const radX = Math.cos(angle);
    const radY = Math.sin(angle);
    const tanX = -Math.sin(angle);
    const tanY = Math.cos(angle);

    // Major Life Area node
    nodes.push({
      id: def.areaId,
      parentId: 'center-user',
      type: 'area',
      title: def.title,
      description: def.description,
      areaId: def.areaId,
      position: { x: areaX, y: areaY },
      collapsed: true, // Initially collapsed to show clean overview as specified!
    });

    // Sub-branches spaced tangentially to prevent overlap
    const branchCount = def.branches.length;
    def.branches.forEach((b, bIdx) => {
      const tanOffset = (bIdx - (branchCount - 1) / 2) * branchTangentialSpacing;
      const branchX = Math.round(areaX + radX * branchRadialDist + tanX * tanOffset);
      const branchY = Math.round(areaY + radY * branchRadialDist + tanY * tanOffset);

      nodes.push({
        id: b.id,
        parentId: def.areaId,
        type: 'branch',
        title: b.title,
        description: b.description,
        areaId: def.areaId,
        position: { x: branchX, y: branchY },
        collapsed: false,
      });

      // Tasks under each branch positioned outward along radial vector
      b.tasks.forEach((t: any, tIdx) => {
        const taskX = Math.round(branchX + radX * (taskRadialDist + tIdx * 110));
        const taskY = Math.round(branchY + radY * (taskRadialDist + tIdx * 110));

        nodes.push({
          id: t.id,
          parentId: b.id,
          type: 'task',
          title: t.title,
          description: t.description,
          areaId: def.areaId,
          status: t.status,
          completedAt: t.completedAt || null,
          estimatedMinutes: t.estimatedMinutes,
          priority: t.priority,
          focusToday: t.focusToday,
          dueDate: t.dueDate,
          recurrence: t.recurrence || 'none',
          position: { x: taskX, y: taskY },
        });
      });
    });
  });

  return nodes;
}

/**
 * Recursively find all descendant node IDs for a given parent
 */
export function getDescendantIds(nodeId: string, nodes: LifeNode[]): string[] {
  const result: string[] = [];
  const queue = [nodeId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const children = nodes.filter((n) => n.parentId === current);
    for (const child of children) {
      result.push(child.id);
      queue.push(child.id);
    }
  }

  return result;
}

/**
 * Get all ancestors up to the root for breadcrumb navigation
 */
export function getAncestors(nodeId: string, nodes: LifeNode[]): LifeNode[] {
  const ancestors: LifeNode[] = [];
  const map = new Map(nodes.map((n) => [n.id, n]));
  let curr = map.get(nodeId);

  while (curr && curr.parentId) {
    const parent = map.get(curr.parentId);
    if (parent) {
      ancestors.unshift(parent);
      curr = parent;
    } else {
      break;
    }
  }

  return ancestors;
}

/**
 * Calculate completion percentage and task stats for any node based strictly
 * on its descendant actionable tasks.
 */
export function calculateDescendantProgress(
  nodeId: string,
  nodes: LifeNode[]
): {
  totalTasks: number;
  completedTasks: number;
  progressPercent: number;
} {
  const descendantIds = new Set(getDescendantIds(nodeId, nodes));
  const tasks = nodes.filter(
    (n) => (n.id === nodeId || descendantIds.has(n.id)) && (n.type === 'task' || n.type === 'habit')
  );

  const totalTasks = tasks.length;
  if (totalTasks === 0) {
    return { totalTasks: 0, completedTasks: 0, progressPercent: 0 };
  }

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  return { totalTasks, completedTasks, progressPercent };
}

/**
 * Search nodes across the entire web by title or description
 */
export function searchNodes(nodes: LifeNode[], query: string): LifeNode[] {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();

  return nodes.filter((n) => {
    if (n.type === 'center') return false; // don't clutter with center unless named
    const matchTitle = n.title.toLowerCase().includes(q);
    const matchDesc = n.description ? n.description.toLowerCase().includes(q) : false;
    const matchNotes = n.notes ? n.notes.toLowerCase().includes(q) : false;
    return matchTitle || matchDesc || matchNotes;
  });
}

/**
 * Return actionable tasks that belong in the Today view:
 * 1. Explicitly marked `focusToday === true`
 * 2. Or due date is today or overdue (and not completed)
 */
export function getTodayTasks(nodes: LifeNode[]): LifeNode[] {
  const todayStr = new Date().toISOString().split('T')[0];

  return nodes.filter((n) => {
    if (n.type !== 'task' && n.type !== 'habit') return false;
    if (n.focusToday) return true;
    if (n.dueDate && n.dueDate <= todayStr && n.status !== 'completed') return true;
    return false;
  });
}

/**
 * Compute growth metrics across the 7 major life areas
 */
export function getAreaGrowthStats(nodes: LifeNode[]): GrowthAreaStat[] {
  const areaNodes = nodes.filter((n) => n.type === 'area');

  return areaNodes.map((area) => {
    const areaMeta = LIFE_AREAS[area.id] || {
      name: area.title,
      color: '#6366F1',
      icon: 'Folder',
    };

    const descendantIds = new Set(getDescendantIds(area.id, nodes));
    const tasks = nodes.filter(
      (n) => descendantIds.has(n.id) && (n.type === 'task' || n.type === 'habit')
    );

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const totalMinutes = tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 15), 0);
    const completedMinutes = tasks
      .filter((t) => t.status === 'completed')
      .reduce((sum, t) => sum + (t.estimatedMinutes || 15), 0);

    return {
      areaId: area.id,
      title: area.title,
      color: areaMeta.color,
      icon: areaMeta.icon,
      totalTasks,
      completedTasks,
      inProgressTasks,
      progressPercent,
      totalMinutes,
      completedMinutes,
    };
  });
}

/**
 * Validate imported backup JSON
 */
export function validateBackupData(data: unknown): {
  valid: boolean;
  error?: string;
  backup?: LifeWebBackup;
} {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Backup file is empty or not valid JSON.' };
  }

  const obj = data as Partial<LifeWebBackup>;

  if (!Array.isArray(obj.nodes) || obj.nodes.length === 0) {
    return { valid: false, error: 'Backup does not contain any valid graph nodes.' };
  }

  // Check required node properties
  for (const node of obj.nodes) {
    if (!node.id || typeof node.id !== 'string') {
      return { valid: false, error: 'One or more nodes are missing a valid ID.' };
    }
    if (!node.type || typeof node.type !== 'string') {
      return { valid: false, error: `Node ${node.id} is missing a valid node type.` };
    }
    if (!node.title || typeof node.title !== 'string') {
      return { valid: false, error: `Node ${node.id} is missing a title.` };
    }
    if (!node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
      return { valid: false, error: `Node ${node.id} has invalid coordinates.` };
    }
  }

  // Validate center node exists
  const hasCenter = obj.nodes.some((n) => n.type === 'center');
  if (!hasCenter) {
    return { valid: false, error: 'Backup is missing the central user node.' };
  }

  const profile: UserProfile = {
    name: obj.profile?.name && typeof obj.profile.name === 'string' ? obj.profile.name : 'Life Web User',
    title: obj.profile?.title || 'Lifelong Learner',
    avatarUrl: obj.profile?.avatarUrl || 'preset:lotus',
  };

  return {
    valid: true,
    backup: {
      version: obj.version || 1,
      exportedAt: obj.exportedAt || new Date().toISOString(),
      profile,
      nodes: obj.nodes as LifeNode[],
    },
  };
}
