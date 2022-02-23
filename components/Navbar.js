import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import React from 'react'

import Link from 'next/link'
import { useContext, useState } from "react";
import { AuthorizedSideBar, UnAuthorizedSideBar } from "./SideBarData";
import { UserContext } from "../lib/context";
export default function NavBar(){
    const [sidebar, setSideBar] = useState(false);
    const {user, userData} = useContext(UserContext)
    const toggleSideBar = () => setSideBar(!sidebar)

    const itemsRender = [];
    const mapItems = (items) => {
            items.map((item, index) => {
                itemsRender.push(<li key={index} className={item.class}>
                    <Link href={item.path} className='nav-link'>
                        <div className="nav-link cursor-click">
                            {item.icon}
                            <span className="nav-span">{item.text}</span>
                        </div>
                    </Link>
                    </li>)
            })            
    }
    if(!user){
        mapItems(UnAuthorizedSideBar)
    } else {
        mapItems(AuthorizedSideBar)
    }

    return (
        <>
        <div className="z-index-top">
            <div className="navbar">
                <Link href="#" className='menu-bars'>
                    <>
                    <FaIcons.FaBars className="menu-bars-icons" fill="white" onClick={toggleSideBar}/>
                    <h1 className="text-title">Scabelum</h1>
                    </>
                </Link>
            </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items'>
                    <li className="navbar-toggle cursor-click">
                        <Link href="#" className='menu-bars'>
                            <AiIcons.AiFillCloseCircle fill="white" onClick={toggleSideBar}/>
                        </Link>
                    </li>
                    {itemsRender}
                </ul>
            </nav>
         </div>
        </>
    )
}