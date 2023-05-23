// ✨ implement axiosWithAuth
// ==========================
// create an Axios config that attaches an `Authorization: <token> header to requests...
import axios from 'axios';

export const axiosWithAuth = () => {
    const token = localStorage.getItem('token');

    return axios.create({
        headers: {
            Authorization: token,
        },
    });
};