import { ApiResource } from '../api/model/ApiResource';
import { PublishActivitySummary } from './PublishActivitySummary';
import { Page } from './Page';
import { ResourceList } from './ResourceList';
import { AssetMetadata } from './AssetMetadata';
import { StringList } from './StringList';
import { AssetText } from './AssetText';

export class Asset extends ApiResource {
  protected baseType = 'assets';

  bucketID: string;
  createdDate: number; // unix epoch created date
  locale: string;
  mimeType: string;
  publish?: PublishActivitySummary; // unknown
  publshStatus?: string; // NOT_PUBLISHED | ...
  revisionNumber?: number;
  subType?: any; // unknown
  thumbUrl?: string;
  timestamp?: string;

  id: string;
  type?: number;
  name?: string;
  label?: string;
  file?: string;
  thumbFile?: string;
  srcName?: string;
  status?: string;
  folderID?: string;
  localeID?: string;
  localeGroup?: string;
  fileExtension?: string;

  /**
   * Resources and actions related to a Content Item
   */
  public readonly related = {
    /**
     * Delete this asset.
     */
    delete: (): Promise<void> => this.client.endpoints.assets.delete(this.id),

    /**
     * Retrieves all versions for this asset.
     */
    versions: (): Promise<AssetsList> =>
      this.client.endpoints.assets.versions(this.id),

    /**
     * Retrieves a specific version for this asset.
     */
    version: (version: number): Promise<Asset> =>
      this.client.endpoints.assets.version(this.id, version),

    /**
     * Retrieves all metadata for this asset.
     */
    metadata: (): Promise<AssetMetadata> =>
      this.client.endpoints.assets.metadata(this.id),

    /**
     * Retrieves a download URL for this asset.
     */
    download: () => this.client.endpoints.assets.download(this.id),

    /**
     * Retrieves a download URL for this asset, with the given version.
     */
    downloadVersion: (version: number): Promise<string> =>
      this.client.endpoints.assets.downloadVersion(this.id, version),

    /**
     * Retrieves a download URL for this asset, with the given version.
     */
    text: (): Promise<AssetText> => this.client.endpoints.assets.text(this.id),

    /**
     * Publishes only this asset.
     */
    publish: (mode?: string): Promise<StringList> =>
      this.client.endpoints.assets.publish([this.id], mode),

    /**
     * Validates publish for only this asset. Throws if not successful.
     */
    validatePublish: (mode?: string): Promise<StringList> =>
      this.client.endpoints.assets.validatePublish([this.id], mode),

    /**
     * Unpublishes only this asset.
     */
    unpublish: (mode?: string): Promise<StringList> =>
      this.client.endpoints.assets.unpublish([this.id], mode),
  };
}

/**
 * @hidden
 */
export class AssetsList extends ResourceList<Asset> {
  constructor(data?: any) {
    super(Asset, data);
  }
}

/**
 * @hidden
 */
export class AssetsPage extends Page<Asset> {
  constructor(data?: any) {
    super(Asset, data);
  }
}
