import MasterService from "./MasterService";
import { conf } from "../Config.js";
const PRODUCTO_API_URL = conf.url.API_URL + "/api/v1/producto";

class ListarProductoService {
    listAllProduct() {
        var CURRENT_API_URL = `${PRODUCTO_API_URL}/listAllProducto`;
        console.log(CURRENT_API_URL);
        return MasterService.getDataService(CURRENT_API_URL);
    }

    findProductByCode(payload) {
        var CURRENT_API_URL = `${PRODUCTO_API_URL}/findProductByCode`;
        console.log(CURRENT_API_URL);
        return MasterService.postDataServiceJSONHeader(CURRENT_API_URL, payload);
    }

    saveProduct(payload) {
        var CURRENT_API_URL = `${PRODUCTO_API_URL}/saveProducto`;
        console.log(CURRENT_API_URL);
        return MasterService.postDataServiceJSONHeader(CURRENT_API_URL, payload);
    }
    updateProduct(payload) {
        console.log(payload);
        var CURRENT_API_URL = `${PRODUCTO_API_URL}/saveProducto`;
        console.log(CURRENT_API_URL);
        return MasterService.postDataServiceJSONHeader(CURRENT_API_URL, payload);
    }

    deleteById(payload) {
        console.log(payload);
        var CURRENT_API_URL = `${PRODUCTO_API_URL}/deleteById/` + payload;
        console.log(CURRENT_API_URL);
        return MasterService.deleteEmptyDataServiceJSONHeader(CURRENT_API_URL);
    }
}
export default new ListarProductoService();
