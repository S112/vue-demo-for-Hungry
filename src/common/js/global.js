import qs from 'qs';
export const axios = require('axios');

axios.interceptors.request.use(config => {
	if (config.method === 'post') {
		config.data = qs(config.data);
	}
	return config;
});

axios.interceptors.response.use(rsp => {
	return rsp.data;
}, err => {
	return Promise.reject(err.response.data);
});
