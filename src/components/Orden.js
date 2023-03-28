import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { OverlayPanel } from "primereact/overlaypanel";
import { Toast } from "primereact/toast";
import ListarProductoService from "../service/ListarProductoService";
import OrdenService from "../service/OrdenService";
import ClienteService from "../service/ClienteService";

const Orden = () => {
    const [lisOrden, setLisOrden] = useState(null);
    const [valueIdCliente, setValueIdCliente] = useState("");
    const [valueNombreCliente, setValueNombreCliente] = useState("");
    const [valueFecha, setValueDecha] = useState("");
    const [valuePrice, setValuePrice] = useState("");
    const [valueQuatity, setValueQuatity] = useState("");
    const op = useRef(null);
    const [listProduct, setListProduct] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const isMounted = useRef(false);
    const toast = useRef();
    const [productosDetalle, setProductosDetalle] = useState(null);
    let [productosDetalleData, setProductosDetalleData] = useState([]);
    const [displayBasic, setDisplayBasic] = useState(false);
    const [position, setPosition] = useState("center");
    const [bthGenerarDis, setBthGenerarDis] = useState(true);
    const [valueTotal, setTotal] = useState(0);
    useEffect(() => {
        setValueIdCliente("");
        setValueNombreCliente("");
        setValueDecha("");
        setValuePrice("");
        setProductosDetalle([]);
        setProductosDetalleData([]);
        ListarProductoService.listAllProduct().then((valid) => {
            setListProduct(valid.data);
        });
    }, []);

    const onProductSelect = (e) => {
        console.log("onrpro : ", e.value.precioventa);
        let _newprod = {
            idproducto: e.value.idproducto,
            nombreproducto: e.value.nombreproducto,
            precioventa: e.value.precioventa,
            cantidad: 0,
        };
        let _products = [...productosDetalle];
        _products.push(_newprod);
        setProductosDetalle(_products);
        op.current.hide();
        toast.current.show({ severity: "info", summary: "Producto seleccionado", detail: e.value.nombreproducto, life: 3000 });
        setBthGenerarDis(false);
    };

    const inputTextEditor = (props, field) => {
        return <InputText type="text" value={props.rowData[field]} onChange={(e) => onEditorValueChange(props, e.target.value)} />;
    };
    const codeEditor = (props) => {
        return inputTextEditor(props, "code");
    };
    const onEditorValueChange = (props, value) => {
        console.log("props value: ", props.props.value);

        let updatedProducts = [...props.props.value];
        productosDetalleData = updatedProducts;
        //  let iva = value * 0.12;
        let unitCost = updatedProducts[props.rowIndex]["precioventa"];
        let valortotal = unitCost * value;
        updatedProducts[props.rowIndex][props.field] = value;
        updatedProducts[props.rowIndex]["total"] = valortotal;
        setProductosDetalleData(updatedProducts);
        // setIva(iva);
        setTotal(valortotal);
        let suma = 0;
        productosDetalleData.map((objX) => {
            setValuePrice((suma += objX.total));
            return suma;
        });
        console.log(productosDetalleData);
    };

    const savePosDataOrder = () => {
        let dtoOrderPost = {
            fechacreacionorden: new Date(),
            estado: "A",
            ordenDetalleList: productosDetalle,
            idCliente: valueIdCliente,
            orderPriceTotal: valuePrice,
        };
        console.log("dtoOrderPost: ", dtoOrderPost);
        OrdenService.saveOrd(dtoOrderPost).then((valid) => {
            if (valid.status === 200 || valid.status === 201) {
                toast.current.show({ severity: "info", summary: "Orden creada", detail: valid.data.orderNo, life: 3000 });
            } else {
                toast.current.show({ severity: "error", summary: "Orden no creada", life: 3000 });
            }
        });
    };
    const searchePosDataCliente = (e) => {
        console.log("dtoOrderPost: ", e.target.value);
        let clienteDto = {
            identificacionCliente: e.target.value,
        };
        ClienteService.findClienteByCode(clienteDto).then((valid) => {
            // setValueIdCliente(valid);
            //setValueNombreCliente(valid);
            console.log("dtoOrderPost: ", valid.data);
            if (valid.data) {
                setValueNombreCliente(valid.data.nombreCliente);
                setValueIdCliente(valid.data.idCliente);
            } else {
                setValueNombreCliente("");
            }
        });
    };
    const foterTotal = () => {
        return (
            <>
                <label htmlFor="order_price_total">Total: {valuePrice}</label>
            </>
        );
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <h5>Orden</h5>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="cedula_cli">
                                <br></br>
                            </label>
                            <InputText id="cedula_cli" placeholder="Buscar por numero de cédula" type="text" onChange={(e) => searchePosDataCliente(e)} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="name_cli">
                                {" "}
                                <br></br>
                            </label>
                            <InputText id="name_cli" disabled placeholder="Nombre cliente" value={valueNombreCliente} type="text" />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="order_create">Fecha</label>
                            <InputText id="order_create" type="date" onInput={(e) => setValueDecha(e.target.value)} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="order_price_total">Total</label>
                            <InputText id="order_price_total" type="text" value={valuePrice} onInput={(e) => setValuePrice(e.target.value)} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <Button label="Agregar Producto" className="mr-2 mb-2" onClick={(e) => op.current.toggle(e)} />
                            <OverlayPanel ref={op} appendTo={document.body} showCloseIcon id="overlay_panel" style={{ width: "450px" }}>
                                <DataTable value={listProduct} selection={selectedProduct} selectionMode="single" dataKey="idproducto" responsiveLayout="scroll" paginator rows={5} onSelectionChange={onProductSelect}>
                                    <Column field="idproducto" header="Code Prod." sortable headerStyle={{ minWidth: "10rem" }} />
                                    <Column field="nombreproducto" header="Nombre" sortable headerStyle={{ minWidth: "10rem" }} />
                                    <Column field="precioventa" header="Precio" sortable headerStyle={{ minWidth: "8rem" }} />
                                </DataTable>
                            </OverlayPanel>
                        </div>
                        <div className="field col-12 md:col-6">
                            <Button label="Generar" className="mr-2 mb-2" disabled={bthGenerarDis} onClick={() => savePosDataOrder()} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <h5>Detalle </h5>
                    <DataTable value={productosDetalle} editMode="cell" dataKey="idDetalle" footer={foterTotal}>
                        <Column field="idproducto" header="Cod Prod." sortable headerStyle={{ minWidth: "10rem" }} />
                        <Column field="nombreproducto" header="Nombre" sortable headerStyle={{ minWidth: "10rem" }} />
                        <Column field="precioventa" header="Precio Unt."></Column>
                        <Column field="cantidad" header="Cantidad" editor={(props) => codeEditor(props)}></Column>
                        <Column field="total" header="Sub Total" onchange={(props) => codeEditor(props)} value={setTotal}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};
const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};
export default React.memo(Orden, comparisonFn);
