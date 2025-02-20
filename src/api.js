import { httpClient } from '@/httpClient';
import config from '@/config'; // eslint-disable-line import/extensions

const getStylesListForFurniture = () => httpClient.get('https://jsonplaceholder.typicode.com/styles');
const createStyleForFurniture = (request) => httpClient.post('https://jsonplaceholder.typicode.com/styles', request);
const editStyleForFurniture = ({ id, name }) => httpClient.patch(`https://jsonplaceholder.typicode.com/styles/${id}`, { name });
const deleteStyleForFurniture = (id) => httpClient.delete(`/https://jsonplaceholder.typicode.com/styles/${id}`);

export const api = {
  getStylesListForFurniture,
  createStyleForFurniture,
  editStyleForFurniture,
  deleteStyleForFurniture,
};
