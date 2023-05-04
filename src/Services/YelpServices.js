import axios from "axios";

class YelpServices {

    getBusinesses = (data) => {
        return axios.put(`https://lighthall-challenge-4-backend.herokuapp.com/api/yelpCouples/yelpAPI`, data);
    }

    getBusinessesByIDs = (id) => {
        return axios.get(`https://lighthall-challenge-4-backend.herokuapp.com/api/yelpCouples/yelpAPI/business/${id}`);
    }

}

export default new YelpServices();