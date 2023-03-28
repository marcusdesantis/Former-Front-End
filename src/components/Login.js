import React, { useEffect, useRef, useState } from "react";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Route, useHistory } from "react-router-dom";
import { Toast } from "primereact/toast";
import LoginService from "../service/LoginService";
const Login = () => {
    const toast = useRef();
    const [valueUsuario, setValueUsuario] = useState("");
    const [valuePassword, setValuePassword] = useState("");
    const history = useHistory();
    useEffect(() => {
        setValuePassword("");
        setValueUsuario("");
    }, []);

    const login = async () => {
        if (valueUsuario !== "" && valuePassword !== "") {
            let dtoDataUser = { nickName: valueUsuario, password: valuePassword };
            console.log(dtoDataUser);
            let exiteUsurio = await LoginService.findCredentials(dtoDataUser);
            console.log(exiteUsurio.data);
            if (exiteUsurio.data === true) {
                toast.current.show({ severity: "success", summary: "Usuario y password correctos", life: 3000 });
                history.push({
                    pathname: "/crud",
                });
            } else {
                toast.current.show({ severity: "warn", summary: "Usuario y password incorrectos", life: 3000 });
            }

            console.log(exiteUsurio);
        } else {
            toast.current.show({ severity: "warn", summary: "Usuario y password en blanco", life: 3000 });
            setValuePassword("");
            setValueUsuario("");
        }
    };
    return (
        <div className="card">
            <Toast ref={toast} />
            <h5>Login</h5>
            <div className="grid">
                <div className="col-10 flex align-items-center justify-content-center">
                    <div className="p-fluid">
                        <div className="field">
                            <label htmlFor="username">Username</label>

                            <InputText id="username" type="text" placeholder="Username" style={{ height: "50px" }} onInput={(e) => setValueUsuario(e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="password">Password</label>
                            <Password id="password" type="password" placeholder="Password" style={{ height: "50px" }} onInput={(e) => setValuePassword(e.target.value)} />
                        </div>
                        <Button label="Login " onClick={() => login()}></Button>
                    </div>
                </div>
                <div className="col-5 flex align-items-center justify-content-center"></div>
            </div>
        </div>
    );
};
const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};
export default React.memo(Login, comparisonFn);
