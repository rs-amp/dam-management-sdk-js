import { ApiResource } from '../api/model/ApiResource';

export interface AssetMetadataVariant {
  variantName: string;
  variantID: string;
  values: { [K: string]: any };
}

export interface AssetMetadataItem {
  schema: string;
  schemaID: string;
  variants: AssetMetadataVariant[];
  PK: { id: string };
}

export class AssetMetadata extends ApiResource {
  metadata: AssetMetadataItem[];
  assetId: string;
}
