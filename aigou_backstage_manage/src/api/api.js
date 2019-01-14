import axios from 'axios';

let base = 'http://localhost:9988/services';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };


export const getBrandPage = params => { return axios.post(`${base}/product/brand/brand_list`, params); };

export const removeBrand = ({id}) => { return axios.delete(`${base}/product/brand/delete/`+id); };

export const batchRemoveBrand = ids => { return axios.get(`${base}/product/brand/batch_remove?ids=`+ids); };

export const getProductTypes = params => { return axios.get(`${base}/product/productType/getProductTree`); };

export const addBrand = params => { return axios.post(`${base}/product/brand/save`, params); };

export const editBrand = params => { return axios.post(`${base}/product/brand/save`+params); };
