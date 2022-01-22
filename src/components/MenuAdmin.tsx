import * as React from "react";
import {
    FaBox, FaBoxes, FaCheckSquare,
    FaDoorClosed,
    FaDoorOpen, FaEnvelope, FaFolderPlus,
    FaHome,
    FaInfo,
    FaList,
    FaPhone, FaPlusSquare,
    FaSignInAlt, FaTrash, FaTshirt,
    FaUser,
    FaUserEdit, FaUserInjured, FaUserLock, FaUserPlus, FaUsers
} from "react-icons/fa";
import { toast } from 'toast-notification-alert';

interface IMenuProps {
  isMenuOpen: boolean;
}

const logout = () => {
        localStorage.setItem("auth-token", "");
        localStorage.setItem("userrData", "");
        window.location.reload();
    }

export const MenuAdmin = ({ isMenuOpen }: IMenuProps) => {
  return (
      <>
          <style>
              {`\
        .app-menu {\
          color: white;\
  height: 100vh;\
  width: 11rem;\
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
li a {\
  font-size: 10px;\
}\
      `}
          </style>
    <div className={`app-menu ${isMenuOpen ? "menu-open" : ""}`}>
        <ul className="primary-nav">
            <li style={{marginLeft: '50px', marginTop: '5px'}}>
            <a href = "/">
        <img className="logo" src="../assets/images/logoBakhtSiren.png" width="40px"/>
        </a>

          </li>
          <li>

            <a href = "/admin/edit-account"
        style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}
    >
                <FaUserEdit style={{fontSize: '15px'}}/> <span style={{fontSize: '10px'}}>Edit My Account</span>
    </a>

          </li>
          <li>
          <a href = "/" onClick={logout}
        style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}
    >
                <FaDoorOpen style={{fontSize: '15px'}}/> <span style={{fontSize: '10px'}}>Logout</span>
    </a>
          </li>
            <li>

            <a href = "/admin/messages"
        style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}
    >
                <FaEnvelope style={{fontSize: '15px'}}/> <span style={{fontSize: '10px'}}>Messages</span>
    </a>

          </li>
          <li><a href = "/admin/all-users"
        style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}
    >
                <FaUsers style={{fontSize: '15px'}}/> <span style={{fontSize: '10px'}}>All Users</span>
    </a></li>
          <li>
          <a href = "/admin/deactivated-users"
        style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}
    >
                <FaUserInjured style={{fontSize: '15px'}}/> <span style={{fontSize: '10px'}}>Deactivated Users</span>
    </a></li>
          <li>
          <a href = "/admin/unverified-users"
        style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}
    >
                <FaUserLock style={{fontSize: '15px'}}/> <span style={{fontSize: '10px'}}>Unverified Users</span>
    </a></li>
            <li>
          <a href = "/admin/add-new-user"
        style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}
    >
              <FaUserPlus style={{fontSize: '15px'}}/> <span style={{fontSize: '10px'}}>Add New User</span>
    </a></li>
            <li>
          <a href = "/admin/all-products"
        style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}
    >
                <FaBoxes style={{fontSize: '15px'}}/> <span style={{fontSize: '10px'}}>All Products</span>
    </a></li>
            <li>
          <a href = "/admin/all-categories"
        style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}
    >
                <FaTshirt style={{fontSize: '15px'}}/> <span style={{fontSize: '10px'}}>All Categories</span>
    </a></li>
            <li>
          <a href = "/admin/current-products"
        style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}
    >
                <FaCheckSquare style={{fontSize: '15px'}}/> <span style={{fontSize: '10px'}}>Current Products</span>
    </a></li>
            <li>
          <a href = "/admin/out-of-stock-products"
        style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}
    >
                <FaTrash style={{fontSize: '15px'}}/> <span style={{fontSize: '10px'}}>Out Of Stock Products</span>
    </a></li>
            <li>
          <a href = "/admin/add-product"
        style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}
    >
                <FaPlusSquare style={{fontSize: '15px'}}/> <span style={{fontSize: '10px'}}>Add New Product</span>
    </a></li>
            <li>
          <a href = "/admin/add-category"
        style={{color: '#D1B23E', fontFamily: 'Felix Titling', fontWeight: 'bold', fontSize: '30px'}}
    >
                <FaFolderPlus style={{fontSize: '15px'}}/> <span style={{fontSize: '10px'}}>Add New Category</span>
    </a></li>
        </ul>
    </div></>
  );
};