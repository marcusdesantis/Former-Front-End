import axios from "axios";
//import Tokenize from "./Tokenize";
//mport DataStore from "../data/DataStore";
class MasterService {
    
    decryptedToken = () => {
        return localStorage.getItem("token");
    };
    getDataService(apiUrl) {
        return axios
            .get(apiUrl, {
                headers: {
                       Authorization: `Bearer ${this.decryptedToken()}` 
                },
            })
            .then((response) => {
                return response;
            })
            .catch((err) => {
                //console.log(err);
            });
    }
    postDataService(...args) {
        let uri = args[0];
        let payload = args[1];
        let contentType = args[2];
        return axios
            .post(uri, payload, {
                headers: {
                    "Content-Type": contentType ? contentType : "application/json; charset=utf-8",
                },
            })
            .then((response) => {
                if (response.data && !response.data.success) {
                    console.error("Error:", uri, ", log:", response.data.log);
                }
                return response;
            })
            .catch((err) => {
                //console.log(err);
                console.error("Error:", uri, ", log: ", err);
                if (args[2] !== undefined) {
                    args[2](err);
                }
            });
    }
    getDataServiceJSONHeader(apiUrl) {
        return axios
            .get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${this.decryptedToken()}` ,
                    "Content-Type": "application/json; charset=utf-8",
                },
            })
            .then((response) => {
                return response;
            })
            .catch((err) => {
                //console.log(err);
            });
    }
    postDataServiceJSONHeader(...args) {
        let uri = args[0];
        let payload = args[1];
        return axios
            .post(uri, payload, {
                headers: {
                     Authorization: `Bearer ${this.decryptedToken()}` ,
                    "Content-Type": "application/json; charset=utf-8",
                },
            })
            .then((response) => {
                return response;
            })
            .catch((err) => {
                //console.log(err);
                if (args[2] !== undefined) {
                    args[2](err);
                }
            });
    }
    deleteEmptyDataServiceJSONHeader(...args) {
        //let uri = args[0];
        let uri = args[0];
        let payload = args[1];
        return axios
            .delete(uri, payload, {
                headers: {
                       Authorization: `Bearer ${this.decryptedToken()}` ,
                    "Content-Type": "application/json; charset=utf-8",
                },
            })
            .then((response) => {
                return response;
            })
            .catch((err) => {
                console.log(err);
                if (args[2] !== undefined) {
                    args[2](err);
                }
            });
    }
    putDataServiceJSONHeader(...args) {
        return axios
            .put(args[0], args[1], {
                headers: {
                       Authorization: `Bearer ${this.decryptedToken()}` ,
                    "Content-Type": "application/json; charset=utf-8",
                },
            })
            .then((response) => {
                return response;
            })
            .catch((err) => {
                //console.log(err);
                if (args[2] !== undefined) {
                    args[2]();
                }
            });
    }
}
export default new MasterService();
