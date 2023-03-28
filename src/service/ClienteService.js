import MasterService from "./MasterService";
import { conf } from "../Config.js";
const CLIENTE_API_URL = conf.url.API_URL + "/api";

class ClienteService {
    getTexto() {
        var CURRENT_API_URL = `${CLIENTE_API_URL}/utenti`;
        console.log(CURRENT_API_URL);
        return MasterService.getDataService(CURRENT_API_URL);
    }
}
export default new ClienteService();
