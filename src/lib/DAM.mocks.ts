import { AxiosRequestConfig } from 'axios';
import { DAM, DAMConfig } from './DAM';
import { ApiClient } from './api/services/ApiClient';
import { AxiosHttpClient } from './http/AxiosHttpClient';
import { HttpClient } from './http/HttpClient';
import { AccessTokenProvider } from './oauth2/models/AccessTokenProvider';
import { OAuth2ClientCredentials } from './oauth2/models/OAuth2ClientCredentials';

/**
 * @hidden
 */
import MockAdapter from 'axios-mock-adapter';
import { DAMFixtures } from './_fixtures/DAMFixtures.mocks';

/**
 * @hidden
 */
export class MockDAM extends DAM {
  public mock: MockAdapter;
  public mockClient: ApiClient;

  constructor(
    clientCredentials?: OAuth2ClientCredentials,
    damConfig?: DAMConfig,
    httpClient?: AxiosRequestConfig
  ) {
    super(
      clientCredentials || {
        client_id: 'client_id',
        client_secret: 'client_secret',
      },
      damConfig,
      httpClient
    );
  }

  protected createTokenClient(
    /* eslint-disable unused-imports/no-unused-vars-ts */
    damConfig: DAMConfig,
    clientCredentials: OAuth2ClientCredentials,
    httpClient: HttpClient
  ): AccessTokenProvider {
    /* eslint-enable */
    return {
      getToken: () =>
        Promise.resolve({
          access_token: 'token',
          expires_in: 60,
          refresh_token: 'refresh',
        }),
    };
  }

  protected createResourceClient(
    damConfig: DAMConfig,
    tokenProvider: AccessTokenProvider,
    httpClient: HttpClient
  ): ApiClient {
    const client = super.createResourceClient(
      damConfig,
      tokenProvider,
      httpClient
    );
    this.mock = new MockAdapter((httpClient as AxiosHttpClient).client);
    this.mockClient = client;
    DAMFixtures.install(this.mock);
    return client;
  }
}
