import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class RepoService<T> {
  private db = new Map<string, T[]>();

  private ensureCollection(type: string) {
    if (!this.db.has(type)) {
      this.db.set(type, []);
    }
  }

  create(type: string, data: T) {
    this.ensureCollection(type);
    const collection = this.db.get(type)!;
    const id = collection.length + 1;
    const newItem = { id, ...data };
    collection.push(newItem as T);
    return newItem;
  }

  findAll(type: string) {
    return this.db.get(type) || [];
  }

  findOne(type: string, id: number) {
    const collection = this.db.get(type);
    if (!collection) throw new NotFoundException(`No type: ${type}`);
    const item = collection.find((item: any) => item.id === id);
    return item;
  }

  update(type: string, id: number, data: Partial<T>) {
    const collection = this.db.get(type);
    if (!collection) throw new NotFoundException(`No type: ${type}`);
    const index = collection.findIndex((item: any) => item.id === id);
    if (index === -1) throw new NotFoundException(`No item with id: ${id}`);
    collection[index] = { ...collection[index], ...data };
    return collection[index];
  }

  delete(type: string, id: number) {
    const collection = this.db.get(type);
    if (!collection) throw new NotFoundException(`No type: ${type}`);
    const index = collection.findIndex((item: any) => item.id === id);
    if (index === -1) throw new NotFoundException(`No item with id: ${id}`);
    const deleted = collection.splice(index, 1);
    return deleted[0];
  }

  upsert(type: string, id: number, data: T) {
    const item = this.findOne(type, id);
    if (item) {
      this.update(type, id, data);
    } else {
      this.create(type, data);
    }
  }
}
