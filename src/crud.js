import RequestService from './request';
import Error from '../utils/error';

const handleResult = r => {
  if (typeof r === 'boolean') {
    return {status: r};
  }

  if (!r.error) {
    return r;
  }

  return new Error(r.message + ' - ' + r.error);
}

const data = async query => {
  const result = await ProductService.request('/crud/data', query);
  return handleResult(result);
};

const list = async (entity, params) => {
  if (typeof params === 'undefined') {
    params = {};
  }

  const result = await ProductService.request(`/crud/${entity.toLowerCase()}/list`, params);
  return handleResult(result);
};

const insert = async (entity, data) => {
  const result = await ProductService.request(`/crud/${entity.toLowerCase()}/insert`, { data });
  return handleResult(result);
};

/**
 * insert multipe
 * @param rows: alrady formatted rows (array)
 * @return tbd
 * // todo check syntax for insertmultiple (mutate)
 * // for now simple wrapper around insert
 */
const insertMultiple = async (entity, rows) => {
  return await Promise.all(rows.map(async row => {
    return await insert(entity, row);
  }))
}

const update = async (entity, params, data) => {
  const url = `/crud/${entity.toLowerCase()}/update`;
  const body = {params, data};

  const result = await ProductService.request(url, body);

  return handleResult(result);
};

const deleteById = async (entity, id) => {
  if (typeof id !== 'number') {
    return new Error('argument has to be of type number', 500);
  }
  const result = await ProductService.request(`/crud/${entity.toLowerCase()}/delete`, {params: { id }});
  return handleResult(result);
};

// does not work - to check with latest version of crud
const deleteFilter = async (entity, filters) => {

  const result = await ProductService.request(`/crud/${entity.toLowerCase()}/delete`, {filters});
  return handleResult(result);
}

const detailById = async (entity, id) => {
  const query = {
    [entity]: {
      filters:{ id: Number(id) }
    }
  };

  const l = await data(query);

  return wrapperDetail(l, entity);
};

/**
 * delete multipe
 * @param ids: list of ids
 * @return tbd
 * // todo check syntax for insertmultiple (mutate)
 * // for now simple wrapper around insert
 */
const deleteIds = async (entity, ids) => {
  return await Promise.all(ids.map(async id => {
    return await deleteById(entity, id);
  }))
};

/**
 * when only one record is expected, wrap result of detail to get data of interest
 * @param  data: output of `data()`
 * @param  `entity` entity name
 * @param allowsNull: if the query returns an empty array, the function will then return `null` instead of throwing an error
 * @return only record of interest or `Error`
 */
const wrapperDetail = (data, entity, allowsNull = false) => {
  if (!data.hasOwnProperty(entity)) {
    return new Error('something went wrong while querying for the requested entity');
  }

  if (data[entity].length === 0) {
    if (allowsNull) {
      return null;
    }

    return new Error('the requested resource does not exist');
  }

  return data[entity][0];
};

const wrapperList = (data, entity) => {
  if (!data.hasOwnProperty(entity)) {
    return new Error('something went wrong while querying for the requested entity');
  }

  return data[entity];
}

export default { data, list, insert, insertMultiple, update, deleteFilter, deleteById, deleteIds, detailById, wrapperDetail, wrapperList };
