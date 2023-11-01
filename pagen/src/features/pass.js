import axiosInstance from "../context/AxiosInstance";


export const getSavedPassword = () => {
    return axiosInstance.get('/user/password/');
};

export const createSavedPassword = (body) => {
    return axiosInstance.post('/user/password/', body);
};

export const updateSavedPassword = (id, body) => {
    return axiosInstance.put(`/user/password/${id}/`, body);
};

export const deleteSavedPassword = (id) => {
    return axiosInstance.delete(`/user/password/${id}/`);
};