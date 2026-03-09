#!/usr/bin/env node
const readline = require('readline');

class Queue { constructor() { this.a = []; } enqueue(x) { this.a.push(x); } dequeue() { return this.a.shift(); } }
class Stack { constructor() { this.a = []; } push(x) { this.a.push(x); } pop() { return this.a.pop(); } }
class Node { constructor(v) { this.v = v; this.n = null; } }
class LinkedList {
  constructor() { this.h = null; }
  append(v) { const node = new Node(v); if (!this.h) return (this.h = node); let c = this.h; while (c.n) c = c.n; c.n = node; }
  removeHead() { if (!this.h) return null; const v = this.h.v; this.h = this.h.n; return v; }
  toArray() { const a = []; let c = this.h; while (c) { a.push(c.v); c = c.n; } return a; }
}

const bubbleSort = (arr) => { arr = [...arr]; for (let i = 0; i < arr.length; i++) for (let j = 0; j < arr.length - i - 1; j++) if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; return arr; };
const quickSort = (arr) => arr.length <= 1 ? arr : [...quickSort(arr.slice(1).filter((x) => x < arr[0])), arr[0], ...quickSort(arr.slice(1).filter((x) => x >= arr[0]))];
const linearSearch = (arr, t) => arr.findIndex((x) => x === t);
const binarySearch = (arr, t) => { let l = 0, r = arr.length - 1; while (l <= r) { const m = Math.floor((l + r) / 2); if (arr[m] === t) return m; arr[m] < t ? l = m + 1 : r = m - 1; } return -1; };
const graph = { A: ['B', 'C'], B: ['D'], C: ['E'], D: [], E: ['F'], F: [] };
const bfs = (s) => { const q = [s], seen = new Set([s]), out = []; while (q.length) { const n = q.shift(); out.push(n); graph[n].forEach((x) => { if (!seen.has(x)) { seen.add(x); q.push(x); } }); } return out; };
const dfs = (s, seen = new Set(), out = []) => { seen.add(s); out.push(s); graph[s].forEach((n) => !seen.has(n) && dfs(n, seen, out)); return out; };
const tree = { v: 7, l: { v: 3, l: { v: 1 }, r: { v: 5 } }, r: { v: 11, l: { v: 9 }, r: { v: 13 } } };
const traverse = {
  in: (n, o = []) => { if (!n) return o; traverse.in(n.l, o); o.push(n.v); traverse.in(n.r, o); return o; },
  pre: (n, o = []) => { if (!n) return o; o.push(n.v); traverse.pre(n.l, o); traverse.pre(n.r, o); return o; },
  post: (n, o = []) => { if (!n) return o; traverse.post(n.l, o); traverse.post(n.r, o); o.push(n.v); return o; }
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

async function main() {
  while (true) {
    console.log('\n=== DSA Terminal Simulation ===');
    console.log('1. Ticket Queue Simulation');
    console.log('2. Stack Simulation');
    console.log('3. Linked List Simulation');
    console.log('4. Sorting Algorithms');
    console.log('5. Searching Algorithms');
    console.log('6. Graph Traversal');
    console.log('7. Tree Traversal');
    console.log('8. Exit');

    const ch = await ask('Select option: ');
    if (ch === '1') {
      const q = new Queue(); ['T1', 'T2', 'T3'].forEach((x) => q.enqueue(x));
      console.log('Queue:', q.a, 'Dequeued:', q.dequeue(), 'Now:', q.a);
    } else if (ch === '2') {
      const s = new Stack(); ['A', 'B', 'C'].forEach((x) => s.push(x));
      console.log('Stack:', s.a, 'Popped:', s.pop(), 'Now:', s.a);
    } else if (ch === '3') {
      const l = new LinkedList(); [10, 20, 30].forEach((x) => l.append(x));
      console.log('Linked List:', l.toArray(), 'Removed:', l.removeHead(), 'Now:', l.toArray());
    } else if (ch === '4') {
      const arr = [5, 1, 4, 2, 8];
      console.log('Bubble:', bubbleSort(arr), 'Quick:', quickSort(arr));
      console.log('Complexity: Bubble O(n^2), Quick avg O(n log n).');
    } else if (ch === '5') {
      const arr = [1, 3, 5, 7, 9];
      console.log('Linear target 7 =>', linearSearch(arr, 7));
      console.log('Binary target 7 =>', binarySearch(arr, 7));
    } else if (ch === '6') {
      console.log('BFS:', bfs('A').join(' -> '));
      console.log('DFS:', dfs('A').join(' -> '));
    } else if (ch === '7') {
      console.log('InOrder:', traverse.in(tree).join(','));
      console.log('PreOrder:', traverse.pre(tree).join(','));
      console.log('PostOrder:', traverse.post(tree).join(','));
      console.log('Recursion used in traversals.');
    } else if (ch === '8') {
      console.log('Goodbye!');
      break;
    } else {
      console.log('Invalid option.');
    }
  }
  rl.close();
}
main();
