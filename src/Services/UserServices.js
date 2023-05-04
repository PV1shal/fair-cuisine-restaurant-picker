import axios from "axios";

class UserServices {

    getUserById = (id) => {
        return axios.get(`https://lighthall-challenge-4-backend.herokuapp.com/api/yelpCouples/users/${id}`);
    }

    getUserByIdLogin = (id, data) => {
        return axios.post(`https://lighthall-challenge-4-backend.herokuapp.com/api/yelpCouples/users/${id}`, data);
    }

    createUser = (data) => {
        return axios.post(`https://lighthall-challenge-4-backend.herokuapp.com/api/yelpCouples/users`, data);
    }

    updateUser = (id, data) => {
        console.log("Services", data);
        return axios.put(`https://lighthall-challenge-4-backend.herokuapp.com/api/yelpCouples/users/${id}`, data);
    }
}

export default new UserServices();