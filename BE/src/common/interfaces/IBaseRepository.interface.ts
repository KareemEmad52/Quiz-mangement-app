
export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findOne(where: Partial<T>): Promise<T | null>;
  findMany(where?: Partial<T>): Promise<T[]>;
  update(where: Partial<T>, data: Partial<T>): Promise<T>;
  delete(where: Partial<T>): Promise<T>;
}