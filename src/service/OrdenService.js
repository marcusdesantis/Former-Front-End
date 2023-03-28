import MasterService from "./MasterService";
import { conf } from "../Config.js";
const ORDEN_API_URL = conf.url.API_URL + "/api/v1/Orden";
class OrdenService {
    saveOrd(payload) {
        var CURRENT_API_URL = `${ORDEN_API_URL}/saveOrd`;
        console.log(CURRENT_API_URL);
        return MasterService.postDataServiceJSONHeader(CURRENT_API_URL, payload);
    }

    isProductExisInOrderDitalle(payload) {
        console.log(payload);
        var CURRENT_API_URL = `${ORDEN_API_URL}/isProductExisInOrderDitalle`;
        console.log(CURRENT_API_URL);
        return MasterService.postDataServiceJSONHeader(CURRENT_API_URL, payload);
    }
}
export default new OrdenService();
