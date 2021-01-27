import { ApiResource } from '../api/model/ApiResource';

export interface AssetPutResult {
  id: string;
  status: string;
}

export class AssetPutResultList extends ApiResource {
  results: AssetPutResult[];

  public parse(data: any): void {
    this.results = data;
  }
}
