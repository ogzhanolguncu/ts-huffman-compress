import { expect, test } from 'vitest';
import { PriorityQueue } from './priority-queue.js';

test('Should return empty array due to constructor sets initial value to empty array', () => {
  const priorityQueue = new PriorityQueue();
  expect(priorityQueue.items).toStrictEqual([]);
});

test('Should add new items to list', () => {
  const priorityQueue = new PriorityQueue<number>();
  priorityQueue.enqueue({ priority: 3, value: 3 });
  priorityQueue.enqueue({ priority: 4, value: 4 });
  priorityQueue.enqueue({ priority: 1, value: 1 });

  expect(priorityQueue.items).toStrictEqual([
    { priority: 1, value: 1 },
    { priority: 3, value: 3 },
    { priority: 4, value: 4 },
  ]);
});

test('Should dequeue from the beginning of the array', () => {
  const priorityQueue = new PriorityQueue<number>();
  priorityQueue.enqueue({ priority: 3, value: 3 });
  priorityQueue.enqueue({ priority: 4, value: 4 });
  priorityQueue.enqueue({ priority: 1, value: 1 });

  priorityQueue.dequeue();
  expect(priorityQueue.items.length).toBe(2);
});

test('Should dequeue from the beginning of the array', () => {
  const priorityQueue = new PriorityQueue<number>();
  priorityQueue.enqueue({ priority: 3, value: 3 });
  priorityQueue.enqueue({ priority: 4, value: 4 });
  priorityQueue.enqueue({ priority: 1, value: 1 });

  expect(priorityQueue.items[0]).toStrictEqual(priorityQueue.peek());
});

test('Should dequeue from the beginning of the array', () => {
  const priorityQueue = new PriorityQueue<number>();
  priorityQueue.enqueue({ priority: 3, value: 3 });
  priorityQueue.enqueue({ priority: 4, value: 4 });
  priorityQueue.enqueue({ priority: 1, value: 1 });

  expect(priorityQueue.isEmpty()).toBe(false);
});
