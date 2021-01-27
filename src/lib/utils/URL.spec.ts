import test from 'ava';
import { combineURLs, isAbsoluteURL } from './URL';

test('combine url tests', async (t) => {
  const relativeX2 = combineURLs('test', 'test2');

  t.is(relativeX2, 'test/test2');

  const absoluteX2 = combineURLs('http://absoluteUrl', 'http://absoluteUrl2');

  t.is(
    absoluteX2,
    'http://absoluteUrl2',
    'The second argument must be chosen.'
  );

  const absoluteRelative = combineURLs('http://absoluteUrl', 'test2');

  t.is(absoluteRelative, 'http://absoluteUrl/test2');

  const relativeAbsolute = combineURLs('test', 'http://absoluteUrl2');

  t.is(
    relativeAbsolute,
    'http://absoluteUrl2',
    'The second argument must be chosen.'
  );

  const absoluteNone = combineURLs('http://absoluteUrl', null);

  t.is(absoluteNone, 'http://absoluteUrl');
});

test('absolute url tests', async (t) => {
  t.true(isAbsoluteURL('http://absolute/a/b'));
  t.true(isAbsoluteURL('https://absolute/a/b/'));
  t.true(isAbsoluteURL('//absolute/a/b/c'));
  t.true(isAbsoluteURL('//absolute'));

  t.false(isAbsoluteURL('relative'));
  t.false(isAbsoluteURL('relative.html'));
  t.false(isAbsoluteURL('relative/a/b/c'));
  t.false(isAbsoluteURL('relative/a/b/c/'));
  t.false(isAbsoluteURL('/absolute/a/b/c'));
  t.false(isAbsoluteURL('/absolute'));
});
