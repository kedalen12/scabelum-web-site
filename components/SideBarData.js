import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import React from 'react'


export const UnAuthorizedSideBar = [
    {
        text : 'Scabelum',
        path : '/',
        icon: <AiIcons.AiFillHome fill="white"/>,
        class: 'nav-text'
    },
    {
        text : 'Blog',
        path : '/blog',
        icon: <IoIcons.IoIosPaper fill="white"/>,
        class: 'nav-text'
    },
    {
        text : 'Documentos',
        path : '/documents',
        icon: <AiIcons.AiFillFolder fill="white"/>,
        class: 'nav-text'
    },
    {
        text : 'Identificarse',
        path : '/signin',
        icon: <FaIcons.FaKey fill="white"/>,
        class: 'nav-text'
    }
]

export const AuthorizedSideBar = [
    {
        text : 'Scabelum',
        path : '/',
        icon: <AiIcons.AiFillHome fill="white"/>,
        class: 'nav-text'
    },
    {
        text : 'Blog',
        path : '/blog',
        icon: <IoIcons.IoIosPaper fill="white"/>,
        class: 'nav-text'
    },
    {
        text : 'Documentos',
        path : '/documents',
        icon: <AiIcons.AiFillFolder fill="white"/>,
        class: 'nav-text'
    },
    {
        text : 'Perfil',
        path : '/profile',
        icon: <FaIcons.FaUserAstronaut fill="white"/>,
        class: 'nav-text'
    },
    {
        text: 'Salir',
        path: '/logout',
        icon: <IoIcons.IoIosExit fill="white"/>,
        class: 'nav-text'
    }
]