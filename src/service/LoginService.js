import MasterService from "./MasterService";
import { conf } from "../Config.js";
const LOGIN_API_URL = conf.url.API_URL + "/api/v1";
class LoginService {
    findCredentials(payload) {
        console.log(payload);
        var CURRENT_API_URL = `${LOGIN_API_URL}/validarLogin/` + payload.nickName + "/" + payload.password;
        console.log(CURRENT_API_URL);
        return MasterService.getDataService(CURRENT_API_URL);
    }
}
export default new LoginService();
