import Crud from './crud';
import Error from '../utils/error';
import { isError } from '../utils/error';

const entity = 'MyEntity';

test('wrapperDetail - ok', () => {
  const detail = {id: 1};

  // https://stackoverflow.com/questions/11508463/javascript-set-object-key-by-variable
  // const data = {};
  // data[entity] = [detail];
  // the two above lines can be replaced swith tthe following
  const data = {
    [entity]: [detail]
  };

  const r = Crud.wrapperDetail(data, entity);

  expect(r).toEqual(detail);
});

test('wrapperDetail - not ok', () => {
  
  const data = {
  };

  const r = Crud.wrapperDetail(data, entity);

  expect(isError(r)).toEqual(true);
});

test('wrapperDetail - empty array', () => {
  
  const data = {
    [entity]: []
  };

  const r = Crud.wrapperDetail(data, entity);

  expect(isError(r)).toEqual(true);
});

test('wrapperDetail - empty array, allows null', () => {
  
  const data = {
    [entity]: []
  };

  const r = Crud.wrapperDetail(data, entity, true);

  expect(r).toEqual(null);
});
