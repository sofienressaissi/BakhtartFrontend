import * as React from "react";
import {FaBox, FaDoorClosed, FaDoorOpen, FaHome, FaInfo, FaList, FaPhone, FaSignInAlt, FaUser} from "react-icons/fa";
import { toast } from 'toast-notification-alert';

interface IMenuProps {
  isMenuOpen: boolean;
}

const logout = () => {
        localStorage.setItem("auth-token", "");
        localStorage.setItem("userrData", "");
        window.location.reload();
    }

export const MenuProd = ({ isMenuOpen }: IMenuProps) => {
  return (
      <>
          <style>
              {`\
        .app-menu {\
          color: white;\
  height: 100vh;\
  width: 20rem;\
  background-color: #020d31;\
  z-index: 200;\

  transform: translateX(-100%);\
  transition: 0.3s;\

  position: fixed;\
  left: 0;\
  top: 0;\

  display: flex;\
  justify-content: center;\
        }\
        .menu-open {\
  transform: translateX(0%);\
}\
      `}
          </style>
    <div className={`app-menu ${isMenuOpen ? "menu-open" : ""}`}>
        <ul className="primary-nav" style={{marginTop: '100px'}}>
            <li style={{marginLeft: '-13px'}}>
            <a href = "/">
        <img className="logo" src="../../assets/images/logoBakhtSiren.png" style={{marginTop: '7px'}}/>
        </a>

          </li><br/>
          <li>

            <a href = "#home"
        style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}
    >
        <FaHome/>
    </a>

          </li><br/>
          <li>
          <a href = "#section-profile"
        style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}
    >
        <FaInfo/>
    </a>
          </li><br/>
          <li><a href = "#products"
        style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}
    >
        <FaBox/>
    </a></li><br/>
          <li>
          <a href = "#catalogue"
        style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}
    >
        <FaList/>
    </a></li><br/>
          <li>
          <a href = "#contactus"
        style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}
    >
        <FaPhone/>
    </a></li><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <li>
          <a href="/cart" style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}>
            <i className="fa fa-shopping-cart"></i></a></li><br/>
            {
                localStorage.getItem('auth-token') !== '' ?
                    <>
                    <li>
          <a href="/account"
              style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}><FaUser/></a></li><br/>
                        <li>
          <a href="/" onClick={logout} style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}>
            <FaDoorOpen/></a></li>
                    </> : <>
                    <li>
          <a href="/login" style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}>
            <FaSignInAlt/></a></li>
                    </>
            }

        </ul>
    </div></>
  );
};