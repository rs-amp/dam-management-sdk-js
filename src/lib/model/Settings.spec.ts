import test from 'ava';
import { MockDAM } from '../DAM.mocks';
import { Settings } from './Settings';

test('get settings', async (t) => {
  const client = new MockDAM();
  const result = await client.settings.get();

  t.is(result.companyClassificationType, 'Demo');
  t.is(result.di.defaultEndpoint, 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeffffff');
});
