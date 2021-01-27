import test, { ExecutionContext } from 'ava';
import { MockDAM } from '../DAM.mocks';
import { Asset } from './Asset';
import { AssetPut } from './AssetPut';
import { AssetPutResultList } from './AssetPutResult';

test('get asset by id', async (t) => {
  const client = new MockDAM();
  const result = await client.assets.get(
    '65d78690-bf4e-415d-a16c-ca4dadbb2717'
  );

  t.is(result.label, 'AlltheLook1.jpg');
});

test('delete asset (self)', async (t) => {
  const client = new MockDAM();

  const result = await client.assets.get(
    '65d78690-bf4e-415d-a16c-ca4dadbb2717'
  );

  await result.related.delete();

  t.pass(); // Did not throw.
});

test('delete asset (by id)', async (t) => {
  const client = new MockDAM();

  await client.assets.delete('65d78690-bf4e-415d-a16c-ca4dadbb2717');

  t.pass(); // Did not throw.
});

test('delete asset (by ids)', async (t) => {
  const client = new MockDAM();

  await client.assets.deleteMany(['65d78690-bf4e-415d-a16c-ca4dadbb2717']);

  t.pass(); // Did not throw.
});

test('get versions (self)', async (t) => {
  const client = new MockDAM();

  const result = await client.assets.get(
    '65d78690-bf4e-415d-a16c-ca4dadbb2717'
  );

  const versions = await result.related.versions();

  let versionId = 5;
  versions.getItems().forEach((version) => {
    t.is(version.label, 'AlltheLook1.jpg');
    t.is(version.revisionNumber, versionId--);
    t.not(
      version.related,
      undefined,
      'List asset must be enriched with related actions.'
    );
  });
});

test('get versions (by id)', async (t) => {
  const client = new MockDAM();

  const versions = await client.assets.versions(
    '65d78690-bf4e-415d-a16c-ca4dadbb2717'
  );

  let versionId = 5;
  versions.getItems().forEach((version) => {
    t.is(version.label, 'AlltheLook1.jpg');
    t.is(version.revisionNumber, versionId--);
    t.not(
      version.related,
      undefined,
      'List asset must be enriched with related actions.'
    );
  });
});

test('get version (self)', async (t) => {
  const client = new MockDAM();

  const result = await client.assets.get(
    '65d78690-bf4e-415d-a16c-ca4dadbb2717'
  );

  const version1 = await result.related.version(1);

  t.is(version1.revisionNumber, 1);
});

test('get version (by id)', async (t) => {
  const client = new MockDAM();

  const result = await client.assets.version(
    '65d78690-bf4e-415d-a16c-ca4dadbb2717',
    1
  );

  t.is(result.label, 'AlltheLook1.jpg');
  t.is(result.revisionNumber, 1);
});

test('get download (self)', async (t) => {
  const client = new MockDAM();

  const result = await client.assets.get(
    '65d78690-bf4e-415d-a16c-ca4dadbb2717'
  );

  const downloadPath = await result.related.download();

  t.is(
    downloadPath,
    '/assets/65d78690-bf4e-415d-a16c-ca4dadbb2717/download/handle?auth=example'
  );
});

test('get download (by id)', async (t) => {
  const client = new MockDAM();

  const downloadPath = await client.assets.download(
    '65d78690-bf4e-415d-a16c-ca4dadbb2717'
  );

  t.is(
    downloadPath,
    '/assets/65d78690-bf4e-415d-a16c-ca4dadbb2717/download/handle?auth=example'
  );
});

test('get version download (self)', async (t) => {
  const client = new MockDAM();

  const result = await client.assets.get(
    '65d78690-bf4e-415d-a16c-ca4dadbb2717'
  );

  const downloadPath = await result.related.downloadVersion(1);

  t.is(
    downloadPath,
    '/assets/65d78690-bf4e-415d-a16c-ca4dadbb2717/versions/1/download/handle?revisionNumber=1&auth=example'
  );
});

test('get version download (by id)', async (t) => {
  const client = new MockDAM();

  const downloadPath = await client.assets.downloadVersion(
    '65d78690-bf4e-415d-a16c-ca4dadbb2717',
    1
  );

  t.is(
    downloadPath,
    '/assets/65d78690-bf4e-415d-a16c-ca4dadbb2717/versions/1/download/handle?revisionNumber=1&auth=example'
  );
});

test('publish (self)', async (t) => {
  const client = new MockDAM();

  const result = await client.assets.get(
    '65d78690-bf4e-415d-a16c-ca4dadbb2717'
  );

  const publishJobs = await result.related.publish('UI');

  t.deepEqual(publishJobs.getItems(), [
    'publish.8d1bb161-4de3-4cc7-a907-29636842032a',
  ]);
});

test('publish (by ids)', async (t) => {
  const client = new MockDAM();

  const publishJobs = await client.assets.publish([
    '65d78690-bf4e-415d-a16c-ca4dadbb2717',
  ]);

  t.deepEqual(publishJobs.getItems(), [
    'publish.8d1bb161-4de3-4cc7-a907-29636842032a',
  ]);
});

test('validate publish (self)', async (t) => {
  const client = new MockDAM();

  const result = await client.assets.get(
    '65d78690-bf4e-415d-a16c-ca4dadbb2717'
  );

  const publishJobs = await result.related.validatePublish('UI');

  // Returns a null list, but does not throw.
  t.is(publishJobs.getItems(), undefined);
});

test('validate publish (by ids)', async (t) => {
  const client = new MockDAM();

  const publishJobs = await client.assets.validatePublish([
    '65d78690-bf4e-415d-a16c-ca4dadbb2717',
  ]);

  // Returns a null list, but does not throw.
  t.is(publishJobs.getItems(), undefined);
});

test('unpublish (self)', async (t) => {
  const client = new MockDAM();

  const result = await client.assets.get(
    '65d78690-bf4e-415d-a16c-ca4dadbb2717'
  );

  const publishJobs = await result.related.unpublish('UI');

  t.deepEqual(publishJobs.getItems(), [
    'unpublish.8f0034fd-e0e7-4a55-a81b-a87054827a8f',
  ]);
});

test('unpublish (by ids)', async (t) => {
  const client = new MockDAM();

  const publishJobs = await client.assets.unpublish([
    '65d78690-bf4e-415d-a16c-ca4dadbb2717',
  ]);

  t.deepEqual(publishJobs.getItems(), [
    'unpublish.8f0034fd-e0e7-4a55-a81b-a87054827a8f',
  ]);
});

test('text (self)', async (t) => {
  const client = new MockDAM();

  const result = await client.assets.get(
    '65d78690-bf4e-415d-a16c-ca4dadbb2717'
  );

  const text = await result.related.text();

  t.is(text.id, '65d78690-bf4e-415d-a16c-ca4dadbb2717');
  t.is(text.status, 'INTERNAL');
  t.is(text.data, 'Text Content Example');
});

test('text (by id)', async (t) => {
  const client = new MockDAM();

  const text = await client.assets.text('65d78690-bf4e-415d-a16c-ca4dadbb2717');

  t.is(text.id, '65d78690-bf4e-415d-a16c-ca4dadbb2717');
  t.is(text.status, 'INTERNAL');
  t.is(text.data, 'Text Content Example');
});

test('get metadata (self)', async (t) => {
  const client = new MockDAM();

  const result = await client.assets.get(
    '65d78690-bf4e-415d-a16c-ca4dadbb2717'
  );

  const metadata = await result.related.metadata();

  t.deepEqual(
    metadata.metadata.map((meta) => meta.schema),
    ['exif', 'file', 'image']
  );
});

test('get metadata (by id)', async (t) => {
  const client = new MockDAM();

  const metadata = await client.assets.metadata(
    '65d78690-bf4e-415d-a16c-ca4dadbb2717'
  );

  t.deepEqual(
    metadata.metadata.map((meta) => meta.schema),
    ['exif', 'file', 'image']
  );
});

test('list assets', async (t) => {
  const client = new MockDAM();

  const list = await client.assets.list({ q: 'example search query' });
  const items = list.getItems();

  t.deepEqual(
    items.map((item) => item.label),
    ['AlltheLook1.jpg', '1.png']
  );

  items.forEach((version) => {
    t.not(
      version.related,
      undefined,
      'List asset must be enriched with related actions.'
    );
  });
});

const assetStrip = [
  'revisionNum',
  'userId',
  'file',
  'createdDate',
  'timestamp',
  'tags',
];

function sharedPut(
  t: ExecutionContext,
  client: MockDAM,
  requestIds: string[]
): void {
  for (let i = 0; i < requestIds.length; i++) {
    const request = client.mock.history.put[i];

    t.is(request.url, 'https://dam-live-api.adis.ws/v1.5.0/assets');

    // Must strip reserved fields from body.

    const data = JSON.parse(request.data);
    t.is(data.assets[0].id, requestIds[i]);
    data.assets.forEach((asset) => {
      t.is(asset.label, 'Replacement label');

      assetStrip.forEach((stripped) => {
        t.is(asset[stripped], undefined);
      });
    });
  }
}

test('put assets (by ids)', async (t) => {
  const client = new MockDAM();

  const list = await client.assets.list();
  const items = list.getItems();

  items.forEach((item) => (item.label = 'Replacement label'));

  const result = await client.assets.putAsset('overwrite', items);

  t.deepEqual(
    result.results,
    items.map((item) => ({ id: item.id, status: 'succeeded' }))
  );

  sharedPut(t, client, ['65d78690-bf4e-415d-a16c-ca4dadbb2717']);
});

test('put assets (self)', async (t) => {
  const client = new MockDAM();

  const list = await client.assets.list();
  const items = list.getItems();

  items.forEach((item) => (item.label = 'Replacement label'));

  const result = [];

  for (const item of items) {
    item.label = 'Replacement label';
    result.push(await item.related.update());
  }

  sharedPut(t, client, [
    '65d78690-bf4e-415d-a16c-ca4dadbb2717',
    '4a0bcaed-ee57-481f-98d3-4b73aad49e68',
  ]);
});

test('put assets (using asset put interface)', async (t) => {
  const client = new MockDAM();

  const assetPut: AssetPut = {
    id: '65d78690-bf4e-415d-a16c-ca4dadbb2717',
    tags: { add: [], remove: [] },
  };

  const result = await client.assets.put('overwrite', [assetPut]);

  t.deepEqual(result.results[0], {
    id: '65d78690-bf4e-415d-a16c-ca4dadbb2717',
    status: 'succeeded',
  });

  const request = client.mock.history.put[0];

  t.is(request.url, 'https://dam-live-api.adis.ws/v1.5.0/assets');

  const data = JSON.parse(request.data);
  t.deepEqual(data.assets[0], assetPut);
});

test('get asset by id (failures)', async (t) => {
  const client = new MockDAM();
  const fail404 = client.assets.get('fail404');

  await t.throwsAsync(fail404);

  const badId = client.assets.get('badId');

  await t.throwsAsync(badId);
});
