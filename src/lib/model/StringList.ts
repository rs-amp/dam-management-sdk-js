import { ApiResource, ApiResourceConstructor } from '../api/model/ApiResource';

export class StringList extends ApiResource {
  private data: string[];
  private count: number;

  public getItems(): string[] {
    return this.data;
  }
}
