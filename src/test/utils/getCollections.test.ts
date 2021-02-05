import { expect } from 'chai';
import { before } from 'mocha';
import { Collection } from '../../postman';
import { getCollections } from '../../utils';

suite('getCollections', () => {
  let collections: Collection[] | undefined;

  before(async () => {
    collections = await getCollections();
  });

  test('Should return an array', () => {
    expect(collections).to.be.an('array');
  });

  test('Items should be collections', () => {
    expect(collections).not.to.be.undefined;
    collections?.forEach((c) => {
      expect(Collection.isCollection(c)).to.be.true;
    });
  });
});
