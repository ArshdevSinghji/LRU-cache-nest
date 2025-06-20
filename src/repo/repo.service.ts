import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class RepoService<T> {
  private db: Record<string, T[]> = {};

  private ensureCollection(type: string) {
    if (!this.db[type]) {
      this.db[type] = [];
    }
  }

  create(type: string, data: T) {
    this.ensureCollection(type);
    const id = this.db[type].length + 1;
    const newItem = { id, ...data };
    this.db[type].push(newItem as T);
    return newItem;
  }

  findAll(type: string) {
    return this.db[type] || [];
  }

  findOne(type: string, id: number) {
    const collection = this.db[type];
    if (!collection) throw new NotFoundException(`No type: ${type}`);
    const item = collection.find((item: any) => item.id === id);
    return item;
  }

  update(type: string, id: number, data: Partial<T>) {
    const collection = this.db[type];
    if (!collection) throw new NotFoundException(`No type: ${type}`);
    const index = collection.findIndex((item: any) => item.id === id);
    this.db[type][index] = { ...collection[index], ...data };
    return this.db[type][index];
  }

  delete(type: string, id: number) {
    const collection = this.db[type];
    if (!collection) throw new NotFoundException(`No type: ${type}`);
    const index = collection.findIndex((item: any) => item.id === id);
    const deleted = this.db[type].splice(index, 1);
    return deleted[0];
  }

  upsert(type: string, id: number, data: T) {
    if (this.findOne(type, id)) {
      this.update(type, id, data);
    } else {
      this.create(type, data);
    }
  }
}
