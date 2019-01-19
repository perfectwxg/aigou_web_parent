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

export const getProductPage = params => { return axios.post(`${base}/product/product/page`, params); };

export const removeBrand = ({id}) => { return axios.delete(`${base}/product/brand/delete/`+id); };

export const batchRemoveBrand = ids => { return axios.get(`${base}/product/brand/batch_remove?ids=`+ids); };

export const getProductTypes = params => { return axios.get(`${base}/product/productType/getProductTree`); };

export const addBrand = params => { return axios.post(`${base}/product/brand/save`, params); };
export const editBrand = params => { return axios.post(`${base}/product/brand/save`,params); };

//下面是商品对象的api
export const addProduct = params => { return axios.post(`${base}/product/product/save`, params); };

export const editProduct = params => { return axios.post(`${base}/product/product/save`,params); };

export const batchRemoveProduct = ids => { return axios.get(`${base}/product/product/batch_remove?ids=`+ids); };

export const removeProduct = ({id}) => { return axios.delete(`${base}/product/product/delete/`+id); };

//规格api
export const getSpecificationPage = params => { return axios.post(`${base}/product/specification/json`, params); };

export const removeSpecification = ({id}) => { return axios.delete(`${base}/product/specification/delete/`+id); };

export const batchRemoveSpecification = ids => { return axios.get(`${base}/product/specification/batch_remove?ids=`+ids); };

export const addSpecification = params => { return axios.post(`${base}/product/specification/save`, params); };

export const editSpecification = params => { return axios.post(`${base}/product/specification/save`,params); };

//规格选项api
export const getSpecificationOptionPage = params => { return axios.post(`${base}/product/specificationOption/json`, params); };

export const getSpecificationOptions = () => { return axios.get(`${base}/product/specificationOption/list`); };

export const removeSpecificationOption = ({id}) => { return axios.delete(`${base}/product/specificationOption/delete/`+id); };

export const batchRemoveSpecificationOption = ids => { return axios.get(`${base}/product/specificationOption/batch_remove?ids=`+ids); };

export const editSpecificationOption = params => { return axios.post(`${base}/product/specificationOption/save`, params); };

export const addSpecificationOption = params => { return axios.post(`${base}/product/specificationOption/save`,params); };