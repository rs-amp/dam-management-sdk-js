import { HttpMethod } from '../../http/HttpRequest';
import { Asset, AssetsList } from '../../model/Asset';
import { AssetListRequest } from '../../model/AssetListRequest';
import { AssetMetadata } from '../../model/AssetMetadata';
import { AssetPut } from '../../model/AssetPut';
import { AssetText, AssetTextList } from '../../model/AssetText';
import { Settings } from '../../model/Settings';
import { StringList } from '../../model/StringList';
import { ApiClient } from './ApiClient';

export class ApiEndpoints {
  constructor(private client: ApiClient) {}

  private assetsListToSingle(list: AssetsList, id: string): Asset {
    const items = list.getItems();

    if (items.length === 0) {
      throw new Error(`Unable to find asset with id ${id}.`);
    }

    return items[0];
  }

  /**
   * Asset Resources
   */
  public readonly assets = {
    /**
     * Retrieve an asset resource by id
     * @param id asset id, previously generated on creation
     */
    get: async (id: string): Promise<Asset> => {
      return this.assetsListToSingle(
        await this.client.fetchResource(`/assets/${id}`, {}, AssetsList),
        id
      );
    },

    /**
     * Create or update an existing asset.
     * @param asset asset to upload to the DAM API.
     * @returns A list of asset GUIDs. Throws on failure.
     */

    // strip: revisionNum, userID, file, createdDate, timestamp
    put: (
      mode: 'overwrite' | 'renameUnique',
      assets: AssetPut[]
    ): Promise<StringList> =>
      this.client.genericRequest<StringList>(
        '/assets',
        HttpMethod.PUT,
        { mode, assets },
        {},
        StringList
      ),

    /**
     * Retrieve a list of asset resources shared with your client credentials.
     * @param options Pagination options
     */
    list: (options?: AssetListRequest): Promise<AssetsList> => {
      if (options && options.q) {
        options.q = options.q.replace(/ /g, '+');
      }

      return this.client.fetchResource(
        '/assets{?q,filter,c,n,s,f,bucket,select,variants,preferredLocales,snippetSize,hl.fl,hl.pre,hl.post,hl.max,localeGroups.collapse,localeGroups.preferredLocales,localeGroups.limit,sort}',
        //
        { query: options },
        AssetsList
      );
    },

    /**
     * Delete an asset resource by id.
     * @param id asset id, previously generated on creation
     */
    delete: (id: string): Promise<void> =>
      this.client.deleteResource(`/assets/${id}`, {}),

    /**
     * Deletes an asset resources by id.
     * @param id asset id, previously generated on creation
     */
    deleteMany: (ids: string[]): Promise<StringList> =>
      this.client.genericRequest<StringList>(
        '/assets',
        HttpMethod.DELETE,
        ids,
        {},
        StringList
      ),

    /**
     * Retrieve a specific version of an asset resource by id.
     * @param id asset id, previously generated on creation
     * @param version asset version to request
     */
    version: async (id: string, version: number): Promise<Asset> => {
      return this.assetsListToSingle(
        await this.client.fetchResource(
          `/assets/${id}/versions/${version}`,
          {},
          AssetsList
        ),
        id
      );
    },

    /**
     * Retrieve a list of versions for a specific asset by id.
     * @param options Pagination options
     */
    versions: (id: string): Promise<AssetsList> =>
      this.client.fetchResource(`/assets/${id}/versions`, {}, AssetsList),

    /**
     * Retrieves a download URL for an asset resource by id
     * @param id asset id, previously generated on creation
     */
    download: (id: string): Promise<string> =>
      this.client.fetchRawResource<string>(`assets/${id}/download`, {}),

    /**
     * Retrieves a download URL for an asset resource by id
     * @param id asset id, previously generated on creation
     * @param version the version of the asset to retrieve
     */
    downloadVersion: (id: string, version: number): Promise<string> =>
      this.client.fetchRawResource<string>(
        `assets/${id}/versions/${version}/download`,
        {}
      ),

    /**
     * Retrieves all metadata for an asset.
     * @param id asset id, previously generated on creation
     */
    metadata: (id: string): Promise<AssetMetadata> =>
      this.client.fetchResource<AssetMetadata>(
        `assets/${id}/metadata`,
        {},
        AssetMetadata
      ),

    /**
     * Publish a list of assets by id.
     * @param ids a list of asset ids to publish
     * @param mode the publish mode to use (default: UI)
     */
    publish: (ids: string[], mode?: string): Promise<StringList> => {
      const header = {
        'X-Amp-Mode': mode || 'UI',
      };

      const body = {
        assets: ids,
      };

      return this.client.genericRequest<StringList>(
        '/assets/publish',
        HttpMethod.POST,
        body,
        { header },
        StringList
      );
    },

    /**
     * Publish a list of assets by id.
     * @param ids a list of asset ids to publish
     * @param mode the publish mode to use (default: UI)
     */
    validatePublish: (ids: string[], mode?: string): Promise<StringList> => {
      const header = {
        'X-Amp-Mode': mode || 'UI',
      };

      const body = {
        assets: ids,
      };

      return this.client.genericRequest<StringList>(
        '/assets/publish/validate',
        HttpMethod.POST,
        body,
        { header },
        StringList
      );
    },

    /**
     * Unpublish a list of assets by id.
     * @param ids a list of asset ids to publish
     * @param mode the publish mode to use (default: UI)
     */
    unpublish: (ids: string[], mode?: string): Promise<StringList> => {
      const header = {
        'X-Amp-Mode': mode || 'UI',
      };

      const body = {
        assets: ids,
      };

      return this.client.genericRequest<StringList>(
        '/assets/unpublish',
        HttpMethod.POST,
        body,
        { header },
        StringList
      );
    },

    /**
     * Retrieves text content for an asset.
     * @param id asset id, previously generated on creation
     */
    text: async (id: string): Promise<AssetText> => {
      const list = await this.client.genericRequest<AssetTextList>(
        `assets/text`,
        HttpMethod.POST,
        { assetIds: [id] },
        {},
        AssetTextList
      );

      return list[0];
    },
  };

  /**
   * DAM Settings
   */
  public readonly settings = {
    /**
     * Retrieve settings for the DAM account.
     */
    get: (): Promise<Settings> =>
      this.client.fetchResource(`/settings`, {}, Settings),
  };
}
