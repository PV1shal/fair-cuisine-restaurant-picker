import axios from "axios";

class UserServices {

    getUserById = (id, data) => {
        return axios.post(`https://lighthall-challenge-4-backend.herokuapp.com/api/yelpCouples/users/${id}`, data);
    }

    createUser = (data) => {
        return axios.post(`https://lighthall-challenge-4-backend.herokuapp.com/api/yelpCouples/users`, data);
    }
}

export default new UserServices();