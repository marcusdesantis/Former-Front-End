import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import  ClienteService  from "../src/service/ClienteService";
import classNames from "classnames";

export const AppTopbar = (props) => {

    const [texto, setTexto] = useState("");

    useEffect(() => {
        ClienteService.getTexto().then((valid) => {
            console.log(valid.data);
            setTexto(valid.data);
        });
    }, []);

    return (
        <div className="layout-topbar">
            <h3>Token</h3><p className="read-the-docs">{localStorage.getItem("token")}</p>
            <p className="read-the-docs">{texto}</p>

            {/*
            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars" />
            </button>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>
            */ }

            <ul className={classNames("layout-topbar-menu lg:flex origin-top", { "layout-topbar-menu-mobile-active": props.mobileTopbarMenuActive })}>
                <li>
                    <button className="p-link layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-calendar" />
                        <span>Events</span>
                    </button>
                </li>
                <li>
                    <button className="p-link layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-cog" />
                        <span>Settings</span>
                    </button>
                </li>
                <li>
                    <button className="p-link layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-user" />
                        <span>Profile</span>
                    </button>
                </li>
            </ul>
        </div>
    );
};
