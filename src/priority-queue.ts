type QueueElement<T> = {
  value: T;
  priority: number;
};

export class PriorityQueue<T> {
  items: QueueElement<T>[];

  constructor() {
    this.items = [];
  }

  enqueue(item: QueueElement<T>) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > item.priority) {
        this.items.splice(i, 0, item);
        return;
      }
    }
    this.items.push(item);
  }

  dequeue() {
    this.items.shift();
  }

  peek() {
    return this.items[0];
  }

  isEmpty() {
    return !Boolean(this.items.length);
  }
}
