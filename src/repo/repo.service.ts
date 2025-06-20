import { Injectable, NotFoundException } from '@nestjs/common';

class Node<T> {
  key: string;
  data: T[];
  next: Node<T> | null;
  prev: Node<T> | null;
  constructor(key: string, data: T | T[]) {
    this.key = key;
    this.data = Array.isArray(data) ? data : [data];
    this.next = null;
    this.prev = null;
  }
}

@Injectable()
export class RepoService<T extends { id: number }> {
  private head: Node<T>;
  private tail: Node<T>;
  private db = new Map<string, Node<T>>();

  private capacity = 2;

  constructor() {
    this.head = new Node('head', []);
    this.tail = new Node('tail', []);
    this.head.prev = null;
    this.tail.next = null;
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  MRU(node: Node<T>) {
    node.next = this.head.next;
    node.prev = this.head;
    if (this.head.next) this.head.next.prev = node;
    this.head.next = node;
  }

  deleteNode(node: Node<T>) {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
  }

  create(type: string, data: T) {
    if (this.db.size === this.capacity && !this.db.has(type)) {
      const lru = this.tail.prev;
      if (lru && lru !== this.head) {
        this.deleteNode(lru);
        this.db.delete(lru.key);
      }
    }

    if (!this.db.has(type)) {
      const node = new Node(type, data);
      this.MRU(node);
      this.db.set(type, node);
    } else {
      const node = this.db.get(type);
      if (node) {
        this.deleteNode(node);
        this.MRU(node);
        node.data.push(data);
      }
    }

    return 'Data added successfully!';
  }

  findAll(type: string) {
    return this.db.get(type) || [];
  }

  findOne(type: string, id: number) {
    const node = this.db.get(type);
    if (node) {
      this.deleteNode(node);
      this.MRU(node);
    }

    const data = node?.data;
    const gettingData = data?.filter((d) => d.id === id);
    return gettingData;
  }

  update(type: string, id: number, data: Partial<T>) {
    const node = this.db.get(type);
    if (!node)
      throw new NotFoundException(`Can't find the desired type of: ${type}`);

    const index = node.data.findIndex((d) => d.id === id);
    if (index !== -1) {
      this.deleteNode(node);
      this.MRU(node);
      node.data[index] = { ...node.data[index], ...data };
      return node.data[index];
    } else {
      throw new NotFoundException(`No item with id: ${id}`);
    }
  }

  upsert(type: string, id: number, data: T) {
    const item = this.findOne(type, id);
    if (item) {
      this.update(type, id, data);
    } else {
      this.create(type, data);
    }
  }

  delete(type: string, id: number) {
    const node = this.db.get(type);
    if (!node)
      throw new NotFoundException(`Can't find the desired type of: ${type}`);
    const index = node.data.findIndex((d) => d.id === id);
    if (index !== -1) {
      node.data.splice(index, 1);
    } else {
      throw new NotFoundException(`Can't find the item with id: ${id}`);
    }
    return node.data[index];
  }
}
