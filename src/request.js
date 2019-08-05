import Rp from 'request-promise';

const request = async (uri, body) => {
  const host = process.env.CRUD_HOST;
  const headers = {}; // todo
  
  const url = host + uri;

  const options = {
    url,
    body,
    method: 'POST',
    json: true
  }

  return await Rp(options);
}

export default { request };
