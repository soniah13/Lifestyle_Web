import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getInitialGraphData,
  calculateDescendantProgress,
  getDescendantIds,
  getAncestors,
  searchNodes,
  getTodayTasks,
  getAreaGrowthStats,
  validateBackupData,
} from './graphLogic.ts';
import type { LifeNode } from '../types/graph.ts';

test('getInitialGraphData generates central user node and 7 major life areas', () => {
  const nodes = getInitialGraphData();
  const center = nodes.find((n) => n.type === 'center');
  assert.ok(center, 'Center node exists');
  assert.equal(center?.id, 'center-user');

  const areas = nodes.filter((n) => n.type === 'area');
  assert.equal(areas.length, 7, 'Exactly 7 life areas exist');

  const branches = nodes.filter((n) => n.type === 'branch');
  assert.ok(branches.length >= 7, 'Multiple branches exist');

  const tasks = nodes.filter((n) => n.type === 'task');
  assert.ok(tasks.length >= 20, 'Seed contains all required tasks');
});

test('calculateDescendantProgress computes correct percentage from task children', () => {
  const mockNodes: LifeNode[] = [
    {
      id: 'area-1',
      parentId: null,
      type: 'area',
      title: 'Area 1',
      position: { x: 0, y: 0 },
    },
    {
      id: 'branch-1',
      parentId: 'area-1',
      type: 'branch',
      title: 'Branch 1',
      position: { x: 10, y: 10 },
    },
    {
      id: 'task-1',
      parentId: 'branch-1',
      type: 'task',
      title: 'Task 1',
      status: 'completed',
      position: { x: 20, y: 20 },
    },
    {
      id: 'task-2',
      parentId: 'branch-1',
      type: 'task',
      title: 'Task 2',
      status: 'not_started',
      position: { x: 30, y: 30 },
    },
    {
      id: 'task-3',
      parentId: 'branch-1',
      type: 'task',
      title: 'Task 3',
      status: 'in_progress',
      position: { x: 40, y: 40 },
    },
    {
      id: 'task-4',
      parentId: 'branch-1',
      type: 'task',
      title: 'Task 4',
      status: 'completed',
      position: { x: 50, y: 50 },
    },
  ];

  // 2 out of 4 completed = 50%
  const areaProgress = calculateDescendantProgress('area-1', mockNodes);
  assert.equal(areaProgress.totalTasks, 4);
  assert.equal(areaProgress.completedTasks, 2);
  assert.equal(areaProgress.progressPercent, 50);

  // Branch progress should be identical
  const branchProgress = calculateDescendantProgress('branch-1', mockNodes);
  assert.equal(branchProgress.totalTasks, 4);
  assert.equal(branchProgress.completedTasks, 2);
  assert.equal(branchProgress.progressPercent, 50);

  // An isolated node with 0 tasks returns 0%
  const emptyProgress = calculateDescendantProgress('non-existent', mockNodes);
  assert.equal(emptyProgress.totalTasks, 0);
  assert.equal(emptyProgress.progressPercent, 0);
});

test('searchNodes matches by title, description and notes case-insensitively', () => {
  const nodes = getInitialGraphData();
  
  // Search for "walk"
  const walkResults = searchNodes(nodes, 'walk');
  assert.ok(walkResults.length >= 1);
  assert.ok(walkResults.some((n) => n.title.toLowerCase().includes('walk')));

  // Search for "circuits" or "simulate"
  const circuitResults = searchNodes(nodes, 'circuit');
  assert.ok(circuitResults.length >= 1);

  // Empty query returns empty
  assert.equal(searchNodes(nodes, '').length, 0);
});

test('getTodayTasks returns focusToday and due tasks', () => {
  const nodes = getInitialGraphData();
  const todayTasks = getTodayTasks(nodes);

  assert.ok(todayTasks.length >= 1, 'Today tasks contains preseeded examples');
  for (const task of todayTasks) {
    const isFocus = task.focusToday === true;
    const isDue = !!task.dueDate;
    assert.ok(isFocus || isDue, 'Each task meets today criteria');
  }
});

test('getAreaGrowthStats produces stats for all 7 areas', () => {
  const nodes = getInitialGraphData();
  const stats = getAreaGrowthStats(nodes);

  assert.equal(stats.length, 7, '7 area growth stats calculated');
  for (const stat of stats) {
    assert.ok(stat.areaId);
    assert.ok(stat.title);
    assert.ok(stat.totalTasks > 0, `${stat.title} has tasks`);
    assert.ok(stat.progressPercent >= 0 && stat.progressPercent <= 100);
  }
});

test('validateBackupData enforces schema and center node existence', () => {
  const nodes = getInitialGraphData();
  const validData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: { name: 'Test User', avatarUrl: 'preset:lotus' },
    nodes,
  };

  const validResult = validateBackupData(validData);
  assert.equal(validResult.valid, true);
  assert.ok(validResult.backup);
  assert.equal(validResult.backup?.profile.name, 'Test User');

  // Missing center node
  const invalidData = {
    version: 1,
    nodes: nodes.filter((n) => n.type !== 'center'),
  };
  const invalidResult = validateBackupData(invalidData);
  assert.equal(invalidResult.valid, false);
  assert.match(invalidResult.error || '', /central user node/i);

  // Empty/corrupt payload
  assert.equal(validateBackupData(null).valid, false);
  assert.equal(validateBackupData({}).valid, false);
});
