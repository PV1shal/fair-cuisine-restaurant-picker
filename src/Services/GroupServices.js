import axios from "axios";

class GroupServices {

    addGroup = (data) => {
        return axios.post(`https://lighthall-challenge-4-backend.herokuapp.com/api/yelpCouples/groups`, data);
    }

    getGroupById = (id) => {
        return axios.get(`https://lighthall-challenge-4-backend.herokuapp.com/api/yelpCouples/groups/${id}`);
    }

}

export default new GroupServices();