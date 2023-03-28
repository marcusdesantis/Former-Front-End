import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProductService } from "../service/ProductService";
import ListarProductoService from "../service/ListarProductoService";
import OrdenService from "../service/OrdenService";

const Crud = () => {
    let emptyProduct = {
        id: null,
        name: "",
        image: null,
        description: "",
        category: null,
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: "INSTOCK",
    };
    let emptyProductModelo = {
        idproducto: null,
        nombreproducto: "",
        precioventa: 0,
        stock: 0,
        estado: "",
    };

    const [products, setProducts] = useState(null);
    const [listProduct, setListProduct] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [productModelo, setProductModelo] = useState(emptyProductModelo);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then((data) => setProducts(data));
        ListarProductoService.listAllProduct().then((valid) => {
            //console.log(valid.data);
            setListProduct(valid.data);
        });
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        // setSubmitted(true);

        if (productModelo.nombreproducto.trim()) {
            let _products = [...listProduct];
            let _productModelo = { ...productModelo };
            if (productModelo.idproducto) {
                const index = findIndexById(productModelo.idproducto);

                _products[index] = _productModelo;
                //_products[index].stock = new Date();
                console.log(_products[index]);
                ListarProductoService.updateProduct(_products[index]).then((valid) => {
                    console.log("putDataProduct", valid);
                    _products[index] = valid;
                });
                toast.current.show({ severity: "success", summary: "Successful", detail: "Producto Actualizado", life: 3000 });
            } else {
                let postDataProduct = {
                    nombreproducto: productModelo.nombreproducto,
                    precioventa: productModelo.precioventa,
                    stock: productModelo.stock,
                    estado: "A",
                };
                console.log(postDataProduct);
                ListarProductoService.saveProduct(postDataProduct).then((valid) => {
                    //console.log("postDataProduct", valid);
                    _products.push(valid);
                });
                toast.current.show({ severity: "success", summary: "Successful", detail: "Producto Creado", life: 3000 });
            }
            console.log("postDa_productstaProduct", _products);
            setListProduct(_products);

            setProductDialog(false);
            setProductModelo(emptyProductModelo);
            window.location.reload();
        }

        /*let postDataProduct = {
            nombreproducto: product.name,
            precioventa: product.price,
            pdtCreate: new Date(),
            pdtLastUpdate: null,
            estado: "A",
        };
        console.log(postDataProduct);
        let _products = [...listProduct];
        ListarProductoService.saveProduct(postDataProduct).then((valid) => {
            console.log("postDataProduct", valid.data);
            _products.push(valid.data);
        });
        setListProduct(_products);
        setProductDialog(false);
        toast.current.show({ severity: "success", summary: "Successful", detail: "Producto Creado", life: 3000 });*/
    };

    const editProduct = (product) => {
        setProductModelo({ ...product });
        console.log("edit product", productModelo);
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        let productoDto = {
            idproducto: product.idproducto,
        };

        OrdenService.isProductExisInOrderDitalle(productoDto).then((valid) => {
            console.log("isExiteProduc", valid.data);
            if (valid.data === true) {
                toast.current.show({ severity: "info", summary: "Producto ya existe en una orden y no se puede borrar  ", detail: valid.data.orderNo, life: 3000 });
            } else {
                setProductModelo(product);
                setDeleteProductDialog(true);
            }
        });

        //window.location.reload();
    };

    const deleteProduct = () => {
        //let _products = products.filter((val) => val.id !== product.id);
        let _products = [...listProduct];
        let _productModelo = { ...productModelo };
        const index = findIndexById(productModelo.idproducto);
        _products[index] = _productModelo.idproducto;
        ListarProductoService.deleteById(_products[index]).then((valid) => {
            console.log("deleteDataProduct", valid.data);
        });

        setListProduct(_products);
        setDeleteProductDialog(false);
        setProductModelo(emptyProductModelo);
        toast.current.show({ severity: "success", summary: "Successful", detail: "Product Deleted", life: 3000 });
        window.location.reload();
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < listProduct.length; i++) {
            if (listProduct[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = "";
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: "success", summary: "Successful", detail: "Products Deleted", life: 3000 });
    };

    const onCategoryChange = (e) => {
        let _product = { ...product };
        _product["category"] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...productModelo };
        _product[`${name}`] = val;

        setProductModelo(_product);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...productModelo };
        _product[`${name}`] = val;

        setProductModelo(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.code}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`assets/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.price)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
            </>
        );
    };

    const ratingBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <Rating value={rowData.rating} readonly cancel={false} />
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Productos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={listProduct}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="idproducto"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="nombreproducto" header="Nombre" sortable headerStyle={{ width: "30%", minWidth: "10rem" }}></Column>
                        <Column field="precioventa" header="Precio" sortable headerStyle={{ width: "14%", minWidth: "8rem" }}></Column>
                        <Column field="stock" header="Stock" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="estado" header="Estado" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: "450px" }} header="Producto Nuevo" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nombre</label>
                            <InputText id="name" value={productModelo.nombreproducto} onChange={(e) => onInputChange(e, "nombreproducto")} required autoFocus className={classNames({ "p-invalid": submitted && !productModelo.nombreproducto })} />
                            {submitted && !productModelo.nombreproducto && <small className="p-invalid">Name is required.</small>}
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Precio</label>
                                <InputNumber id="price" value={productModelo.precioventa} onValueChange={(e) => onInputNumberChange(e, "precioventa")} mode="currency" currency="USD" locale="en-US" />
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="stock">stock</label>
                                <InputNumber id="stock" value={productModelo.stock} onValueChange={(e) => onInputNumberChange(e, "stock")} locale="en-US" />
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {productModelo && (
                                <span>
                                    Está seguro que quiere eliminar <b>{productModelo.nombreproducto}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Crud, comparisonFn);
