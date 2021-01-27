import test from 'ava';
import { ResourceList } from './ResourceList';
import { Asset } from './Asset';
import { MockDAM } from '../DAM.mocks';

test('creation and to JSON', async (t) => {
  const list = {
    data: [{ id: 'example1' }, { id: 'example2' }],
    count: 2,
  };

  const resList = new ResourceList<Asset>(Asset, list);
  resList.setClient(new MockDAM().mockClient);

  t.deepEqual(
    resList.getItems().map((asset) => asset.toJSON()),
    list.data
  );

  // When converting to a list and back, we should get the same data.
  const json = resList.toJSON();

  t.deepEqual(json, list);
});
