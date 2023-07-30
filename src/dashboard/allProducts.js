import React, { useContext, useState, useEffect, useMemo } from 'react';
import Favicon from 'react-favicon';
import { useHistory } from 'react-router-dom';
import Axios from "axios";
import { GetColorName } from 'hex-color-to-color-name';
import { FaDoorOpen, FaStar, FaUsers, FaUserEdit, FaTrash, 
    FaUserLock, FaUserInjured, FaUserPlus, FaBoxes, FaTshirt,
    FaPlusSquare, FaFolderPlus, FaCheckSquare, FaShoppingBag } from 'react-icons/fa';
import { toast } from 'toast-notification-alert';
import UserContext from "../context/UserContext";
import Pagination from '../pagination/pagination';
import {GiHamburgerMenu} from "react-icons/gi";
import {MenuAdmin} from "../components/MenuAdmin";
import {ReactDimmer} from "react-dimmer";

let PageSize = 5;

export default function AllProducts() {

    const [currentPage, setCurrentPage] = useState(1);

    const { userrData, setUserrData } = useContext(UserContext);

    let [bakhtartProds, setBakhtartProds] = useState([]);

    const [isMenuOpen, setMenu] = useState(false);

    const handleMenu = () => {
        setMenu((prevState) => !prevState);
    };

    let [bakhtartCats, setBakhtartCats] = useState([]);

    let [searchItem, setSearchItem] = useState('');

    let [allMsgs, setAllMsgs] = useState([]);
    let [nbUM] = useState(0);

    useEffect(async() => {
        const result_bakhtusers = await Axios.get('https://bakhtart-backend.onrender.com/fashion/allMsgs');
        setAllMsgs(result_bakhtusers.data);
      },[]);
      allMsgs.map((itemu,index)=>{
        itemu.status === false ? nbUM = nbUM + 1 : <></>
      });

    useEffect(async() => {
        const result_bakhtprods = await Axios.get('https://bakhtart-backend.onrender.com/adminbakht/allBakhtProdsAdmin/');
        setBakhtartProds(result_bakhtprods.data);
      },[]);

      useEffect(async() => {
        const result_bakhtcats = await Axios.get('https://bakhtart-backend.onrender.com/fashion/allBakhtCatsAdmin/');
        setBakhtartCats(result_bakhtcats.data);
      },[]);

      const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return bakhtartProds.slice(firstPageIndex, lastPageIndex);
      }, [currentPage, bakhtartProds]);

    const history = useHistory();

    const logout = () => {
        setUserrData({
            token: undefined,
            userr: undefined
        });
        localStorage.setItem("auth-token", "");
        history.push('/login');
        window.location.reload();
    }

    const deleteProduct = async (productId) => {
        try {
                await Axios.delete(
                    `https://bakhtart-backend.onrender.com/adminbakht/delete-prod/${productId}`
                );
                toast.show({title: 'Product Deleted!',
            position: 'topright', type: 'warn'});
            setTimeout(function(){
                window.location.reload();
             }, 1500);
        } catch (err) {
            toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
        }
    }

    return(
        <>
        {
            userrData.userr && userrData.userr.roleBakht === 'admin' ?
            <>
                <html>

<head>
    <title>BakhtArt - All Products</title>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui"/>
      <link rel="icon" href="../assetsAdmin/images/favicon.ico" type="image/x-icon"/>
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,500" rel="stylesheet"/>
    <link rel="stylesheet" href="../assetsAdmin/pages/waves/css/waves.min.css" type="text/css" media="all"/>
      <link rel="stylesheet" type="text/css" href="../assetsAdmin/css/bootstrap/css/bootstrap.min.css"/>
      <link rel="stylesheet" href="../assetsAdmin/pages/waves/css/waves.min.css" type="text/css" media="all"/>
      <link rel="stylesheet" type="text/css" href="../assetsAdmin/icon/themify-icons/themify-icons.css"/>
      <link rel="stylesheet" type="text/css" href="../assetsAdmin/icon/font-awesome/css/font-awesome.min.css"/>
      <link rel="stylesheet" type="text/css" href="../assetsAdmin/css/jquery.mCustomScrollbar.css"/>

        <link rel="stylesheet" href="https://www.amcharts.com/lib/3/plugins/export/export.css" 
        type="text/css" media="all" />
      <link rel="stylesheet" type="text/css" href="../assetsAdmin/css/style.css"/>
  </head>

  <body className="dashboardBody">
  <Favicon url='https://bakhtartadmin.herokuapp.com/assets/images/logoSiren.png'/>
  <div id="pcoded" className="pcoded">
      <div className="pcoded-overlay-box"></div>
      <div className="pcoded-container navbar-wrapper">
          <nav className="navbar header-navbar pcoded-header">
              <div className="navbar-wrapper">
                  <div className="navbar-logo">
                      
                  <span style={{color: '#D3BE06', fontWeight: 'bold',
                  fontFamily: 'Felix Titling'}}>Bakht</span><a href="/admin">
                          <img className="img-fluid" 
                          src="../assets/images/logoBakhtSiren.png"
                          alt="Theme-Logo"/>
                      </a><span style={{color: '#D3BE06', fontWeight: 'bold',
                      fontFamily: 'Felix Titling'}}>Art</span>
                  </div>
                  <div className="hambMenu">
                    <GiHamburgerMenu className="nav-toggle" onClick={handleMenu}/></div>
        <MenuAdmin isMenuOpen={isMenuOpen} />
        <ReactDimmer
        isOpen={isMenuOpen}
        exitDimmer={setMenu}
        zIndex={100}
        blur={1.5}
      />
                  <div className="navbar-container container-fluid">
                      <ul className="nav-left">
                          <li>
                              <div className="sidebar_toggle"><a href="javascript:void(0)">
                                  <i className="ti-menu"></i></a></div>
                          </li>
                      </ul>
                      <style>
                      {`\
        #messages:hover {\
          text-decoration: underline;\
          color: #D3BE06;\
        }\
      `}
                      </style>
                      <ul className="nav-right">
                      <li className="user-profile header-notification">
                         <a className="waves-effect waves-light" id="messages" href = "/admin/messages">
                         <span style={{fontSize:'15px', color: '#D3BE06'}}>Messages ({nbUM})</span>
                         </a>
                         </li>
                          <li className="user-profile header-notification">
                              <a className="waves-effect waves-light">
                                  {
                                      userrData.userr.imageProfile === 'unknownAvatar.jpg' ?
                                      <>
                                        <img src="https://bakhtart-backend.onrender.com/upload_images_bakht/unknownAvatar.jpg" 
                                  className="img-radius" 
                                  alt="User-Profile-Image"/>
                                      </> : <></>
                                  }
                                  <span style={{color: '#D3BE06'}} onClick={logout}><b>Logout</b> <span style={{fontSize: '20px;'}}><FaDoorOpen/></span></span>
                              </a>
                              <ul className="show-notification profile-notification">
                                  <li className="waves-effect waves-light">
                                      <a href="#!">
                                          <i className="ti-settings"></i> Settings
                                      </a>
                                  </li>
                                  <li className="waves-effect waves-light">
                                      <a href="user-profile.html">
                                          <i className="ti-user"></i> Profile
                                      </a>
                                  </li>
                                  <li className="waves-effect waves-light">
                                      <a href="email-inbox.html">
                                          <i className="ti-email"></i> My Messages
                                      </a>
                                  </li>
                                  <li className="waves-effect waves-light">
                                      <a href="auth-lock-screen.html">
                                          <i className="ti-lock"></i> Lock Screen
                                      </a>
                                  </li>
                                  <li className="waves-effect waves-light">
                                      <a href="auth-normal-sign-in.html">
                                          <i className="ti-layout-sidebar-left"></i> Logout
                                      </a>
                                  </li>
                              </ul>
                          </li>
                      </ul>
                  </div>
              </div>
          </nav>

          <div className="pcoded-main-container">
              <div className="pcoded-wrapper">
                  <nav className="pcoded-navbar">
                      <div className="sidebar_toggle"><a href="#"><i className="icon-close icons"></i></a></div>
                      <div className="pcoded-inner-navbar main-menu">
                          <div className="">
                              <div className="main-menu-header">
                              {
                                      userrData.userr.imageProfile === 'unknownAvatar.jpg' ?
                                      <>
                                        <img src="https://bakhtart-backend.onrender.com/upload_images_bakht/unknownAvatar.jpg" 
                                  className="img-80 img-radius" 
                                  alt="User-Profile-Image"/>
                                      </> : <></>
                                  }
                                  <div class="user-details">
                                      <span id="more-details">
                                          {userrData.userr.firstName} {userrData.userr.lastName} <FaStar style={{color: '#d4af37'}}/>
                                      </span>
                                  </div>
                              </div>
        
                              <div className="main-menu-content">
                                  <ul>
                                      <li className="more-details">
                                          <a href="user-profile.html"><i className="ti-user"></i>View Profile</a>
                                          <a href="#!"><i className="ti-settings"></i>Settings</a>
                                          <a href="auth-normal-sign-in.html"><i className="ti-layout-sidebar-left"></i>Logout</a>
                                      </li>
                                  </ul>
                              </div>
                          </div>
                          <div className="pcoded-navigation-label" data-i18n="nav.category.navigation">
                              Account Management
                          </div>
                          <ul className="pcoded-item pcoded-left-item">
                              <li className="pcoded-hasmenu">
                                  <a href="/admin/edit-account" className="waves-effect waves-dark">
                                      <span className="pcoded-micon"><FaUserEdit style={{color: '#021144'}}/></span>
                                      <span className="pcoded-mtext" data-i18n="nav.dash.main">Edit My Account</span>
                                      <span className="pcoded-mcaret"></span>
                                  </a>
                              </li>
                              <li className="pcoded-hasmenu">
                                  <a className="waves-effect waves-dark">
                                      <span className="pcoded-micon"><FaDoorOpen style={{color: '#021144'}}/></span>
                                      <span className="pcoded-mtext"  
                                      data-i18n="nav.basic-components.main" onClick={logout}>Logout</span>
                                      <span className="pcoded-mcaret"></span>
                                  </a>
                              </li>
                          </ul>
                          <div className="pcoded-navigation-label" data-i18n="nav.category.navigation">
                              Users Management
                          </div>
                          <ul className="pcoded-item pcoded-left-item">
                              <li className="pcoded-hasmenu">
                                  <a href="/admin/all-users" className="waves-effect waves-dark">
                                  <span className="pcoded-micon"><FaUsers style={{color: '#021144'}}/></span>
                                      <span className="pcoded-mtext"  data-i18n="nav.basic-components.main">All Users</span>
                                      <span className="pcoded-mcaret"></span>
                                  </a>
                              </li>
                              <li className="pcoded-hasmenu">
                                  <a href="/admin/deactivated-users" className="waves-effect waves-dark">
                                      <span className="pcoded-micon"><FaUserInjured style={{color: '#021144'}}/></span>
                                      <span className="pcoded-mtext"  data-i18n="nav.basic-components.main">Deactivated Users</span>
                                      <span className="pcoded-mcaret"></span>
                                  </a>
                              </li>
                              <li className="pcoded-hasmenu">
                                  <a href="/admin/unverified-users" className="waves-effect waves-dark">
                                      <span className="pcoded-micon"><FaUserLock style={{color: '#021144'}}/></span>
                                      <span className="pcoded-mtext"  data-i18n="nav.basic-components.main">Unverified Users</span>
                                      <span className="pcoded-mcaret"></span>
                                  </a>
                              </li>
                              <li className="pcoded-hasmenu">
                                  <a href="/admin/add-new-user" className="waves-effect waves-dark">
                                      <span className="pcoded-micon"><FaUserPlus style={{color: '#021144'}}/></span>
                                      <span className="pcoded-mtext"  data-i18n="nav.basic-components.main">Add New User</span>
                                      <span className="pcoded-mcaret"></span>
                                  </a>
                              </li>
                          </ul>
                          <div className="pcoded-navigation-label" data-i18n="nav.category.forms">
                              Products Management
                          </div>
                          <ul className="pcoded-item pcoded-left-item">
                              <li>
                                  <a href="/admin/all-products" className="waves-effect waves-dark">
                                  <span className="pcoded-micon"><FaBoxes style={{color: '#021144'}}/></span>
                                      <span className="pcoded-mtext"  data-i18n="nav.basic-components.main"><b>All Products</b></span>
                                      <span className="pcoded-mcaret"></span>
                                  </a>
                              </li>
                              <li>
                                  <a href="/admin/all-categories" className="waves-effect waves-dark">
                                  <span className="pcoded-micon"><FaTshirt style={{color: '#021144'}}/></span>
                                      <span className="pcoded-mtext"  data-i18n="nav.basic-components.main">All Categories</span>
                                      <span className="pcoded-mcaret"></span>
                                  </a>
                              </li>
                              <li>
                                  <a href="/admin/current-products" className="waves-effect waves-dark">
                                  <span className="pcoded-micon"><FaCheckSquare style={{color: '#021144'}}/></span>
                                      <span className="pcoded-mtext"  data-i18n="nav.basic-components.main">Current Products</span>
                                      <span className="pcoded-mcaret"></span>
                                  </a>
                              </li>
                              <li>
                                  <a href="/admin/out-of-stock-products" className="waves-effect waves-dark">
                                  <span className="pcoded-micon"><FaTrash style={{color: '#021144'}}/></span>
                                      <span className="pcoded-mtext"  data-i18n="nav.basic-components.main">Out Of Stock Products</span>
                                      <span className="pcoded-mcaret"></span>
                                  </a>
                              </li>
                              <li>
                                  <a href="/admin/add-product" className="waves-effect waves-dark">
                                  <span className="pcoded-micon"><FaPlusSquare style={{color: '#021144'}}/></span>
                                      <span className="pcoded-mtext"  data-i18n="nav.basic-components.main">Add New Product</span>
                                      <span className="pcoded-mcaret"></span>
                                  </a>
                              </li>
                              <li>
                                  <a href="/admin/add-category" className="waves-effect waves-dark">
                                  <span className="pcoded-micon"><FaFolderPlus style={{color: '#021144'}}/></span>
                                      <span className="pcoded-mtext"  data-i18n="nav.basic-components.main">Add New Category</span>
                                      <span className="pcoded-mcaret"></span>
                                  </a>
                              </li>
                          </ul>
                          <div className="pcoded-navigation-label" data-i18n="nav.category.forms">
                              Orders Management
                          </div>
                          <ul className="pcoded-item pcoded-left-item">
                          <li>
                                  <a href="/admin/all-orders" className="waves-effect waves-dark">
                                  <span className="pcoded-micon"><FaShoppingBag style={{color: '#021144'}}/></span>
                                      <span className="pcoded-mtext"  data-i18n="nav.basic-components.main">All Orders</span>
                                      <span className="pcoded-mcaret"></span>
                                  </a>
                              </li>
                          </ul>
                      </div>
                  </nav>
                  <div className="pcoded-content">
                      <div className="page-header">
                          <div className="page-block">
                              <div className="row align-items-center">
                                  <div className="col-md-8">
                                      <div className="page-header-title">
                                          <h5 className="m-b-10">Admin Dashboard</h5>
                                          <p className="m-b-0">All Products</p>
                                      </div>
                                  </div>
                                  <div className="col-md-4">
                                      <ul className="breadcrumb-title">
                                          <li className="breadcrumb-item">
                                              <a href="/admin"> <i className="fa fa-home"></i> </a>
                                          </li>
                                          <li className="breadcrumb-item"><a href="/admin">Admin Dashboard</a>
                                          </li>
                                          <li className="breadcrumb-item"><a>All Products</a>
                                          </li>
                                      </ul>
                                  </div>
                                  
                              </div>
                          </div>
                      </div>
                    </div>
                    <style>
                    {`\
        .searchItem {\
          border-radius: 10px;\
          height: 30px;\
          width: 300px;\
          margin-right: 36px;\
        }\
      `}
                    </style>
                  <style>
                      {
                          `\
                           @media screen and (max-width: 740px){\
                                .main-menu, .addedByH, .addedByD, .genderH, .genderD, .accountCH, .accountCD, .imageH, .imageD {\
                                    display: none;\
                                }\
                                table {\
                                    margin-left: -12px;\
                                }\
                                .table-responsive {\
                                    font-size: 5.7px;\
                                    margin-left: -10px;\
                                    overflow: hidden;\
                                }\
                                .dashboardBody {\
                                    background: none;\
                                    margin-top: 16px;\
                                }\
                                .navbar {\
                                    background: none;\
                                }\
                                .navbar-logo span {\
                                    display: none;\
                                }\
                                .page-header {\
                                    display: none;\
                                }\
                                .navbar-logo img {\
                                    margin-top: -38px;\
                                }\
                                .hambMenu {\
                                    margin-top: -39px;\
                                }\
                                .navbar-logo {\
                                    margin-left: -150px;\
                                }\
                                td button {\
                                    margin-left: -10px;\
                                    height: 20px;\
                                }\
                                .dashboardBody {\
                                    position: fixed;\
                                }\
                                .searchItem {\
                                    width: 190px;\
                                    margin-right: 190px;\
                                    margin-top: 16px;\
                                }\
                                .nav-toggle {\
                                    color: rgb(211, 190, 6);\
                                    margin-left: 111px;\
                                }\
                                .nav-toggle {\
display: inline;\
height: 30px;\
overflow: hidden;\
position: fixed;\
right: 6%;\
text-indent: 100%;\
top: 20px;\
white-space: nowrap;\
color: #D1B23E;\
width: 44px;\
z-index: 99999;\
-moz-transition: all 0.3s;\
-o-transition: all 0.3s;\
-webkit-transition: all 0.3s;\
transition: all 0.3s;\
}
                            }\
                          `}
                  </style>
                    <div className="card">
                                            <div className="card-header">
                                                <h5>All Products</h5>
                                            </div>
                                            <div align = "right">
                                            <input type="text"
                        placeholder="Search Product" className="searchItem"
                   onChange={(e)=>setSearchItem(e.target.value)}/></div>
                                            <div className="card-block table-border-style">
                                                <div className="table-responsive">
                                                    <table className="table table-hover">
                                                        <thead>
                                                            <tr>
                                                                <th>Image</th>
                                                                <th>Product</th>
                                                                <th>Category</th>
                                                                <th>Quantity</th>
                                                                <th>State</th>
                                                                <th className="addedByH">Added By</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                currentTableData.filter((item=>{
                                                                    if (searchItem === "") {
                                                                        return item
                                                                    }else if(item.productName.toLowerCase().includes(searchItem.toLowerCase())
                                                                            ||item.productDescription.toLowerCase().includes(searchItem.toLowerCase())
                                                                            ||item.productCategory.toLowerCase().includes(searchItem.toLowerCase())){
                                                                        return item
                                                                    }
                                                                })).reverse().map(itemp => {
                                                                    return(
                                                                    <tr key={itemp._id}>
                                                                    <td>
                                      <img src={`${itemp.productImage}`}
                                     alt={`${itemp.imageProdName}`} width="40px" height="40px" style={{marginTop: '-4px'}}/>
                                                                    </td>
                                                                    <td>{itemp.productName}<br/>
                                                                        Size: {itemp.productSize.toUpperCase()}<br/>
                                                                        Price: {itemp.productPrice} TND<br/>
                                                                        Color: {GetColorName(itemp.productColor)}<br/>
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            bakhtartCats.map((itemc => (
                                                                                itemp.productCategory === itemc.categoryPath ?
                                                                                <>
                                                                                {itemc.categoryName}
                                                                                </> : <></>
                                                                            )))
                                                                        }
                                                                    </td>
                                                                    <td>{itemp.productQuantity}</td>
                                                                    <td>
                                                                        {
                                                                            itemp.productQuantity === 0 ?
                                                                            <span style={{color: 'red', fontWeight: 'bold'}}>
                                                                                Out Of Stock
                                                                            </span> : 
                                                                            <span style={{color: 'green', fontWeight: 'bold'}}>
                                                                                In Stock
                                                                            </span>
                                                                        }
                                                                    </td>
                                                                    <td className="addedByD">{itemp.productAddedBy} {
                                                                        itemp.productAddedBy.startsWith(userrData.userr.firstName) && itemp.productAddedBy.endsWith(userrData.userr.lastName) ?
                                                                        <small>
                                                                        (you)
                                                                        </small> : <></>
                                                                    }</td>
                                                                    <td>
                                                                        {
                                                                            itemp.productAddedBy.startsWith(userrData.userr.firstName) && itemp.productAddedBy.endsWith(userrData.userr.lastName) ?
                                                                            <button type="button" style={{backgroundColor: 'red',
                                                                            color: 'white', fontWeight: 'bold', 
                                                                            borderRadius: '5px', border: 'none'}} onClick={() => deleteProduct(itemp._id)}>
                                                                            Delete
                                                                            </button> : <>
                                                                            </>
                                                                        }
                                                                    </td>
                                                                    </tr>
                                                                    )})}
                                                        </tbody>
                                                    </table>
                                                    <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={bakhtartProds.length}
        pageSize={PageSize}
        onPageChange={page => setCurrentPage(page)}
      />
                                                </div>
                                            </div>
                                        </div>
                </div>
            </div>
            <footer align = "center" style={{marginBottom: '-500px;'}}>
    <span style={{color: '#070C29'}}>
© Copyright 2016 - 2021 <a href = "https://bakhtart.herokuapp.com" 
className = "bakhtartlink" target="_blank">
    bakhtart.herokuapp.com</a> | Made with <img src="../assetsAdmin/images/heartbeat.gif" 
    style={{width: '20px'}}/> by Sofien Ressaissi
</span>
<style>
{`\
        .bakhtartlink {\
          color: #070C29;\
        }\
      `}
      {`\
        .bakhtartlink:hover {\
          color: #070C29;\
        }\
      `}
</style>
</footer>
        </div>
        
    </div>
    
    <script type="text/javascript" src="../assetsAdmin/js/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="../assetsAdmin/js/jquery-ui/jquery-ui.min.js "></script>
    <script type="text/javascript" src="../assetsAdmin/js/popper.js/popper.min.js"></script>
    <script type="text/javascript" src="../assetsAdmin/js/bootstrap/js/bootstrap.min.js "></script>
    <script type="text/javascript" src="../assetsAdmin/pages/widget/excanvas.js "></script>
    <script src="../assetsAdmin/pages/waves/js/waves.min.js"></script>
    <script type="text/javascript" src="../assetsAdmin/js/jquery-slimscroll/jquery.slimscroll.js "></script>
    <script type="text/javascript" src="../assetsAdmin/js/modernizr/modernizr.js "></script>
    <script type="text/javascript" src="../assetsAdmin/js/SmoothScroll.js"></script>
    <script src="../assetsAdmin/js/jquery.mCustomScrollbar.concat.min.js "></script>
    <script type="text/javascript" src="../assetsAdmin/js/chart.js/Chart.js"></script>
    <script src="https://www.amcharts.com/lib/3/amcharts.js"></script>
    <script src="../assetsAdmin/pages/widget/amchart/gauge.js"></script>
    <script src="../assetsAdmin/pages/widget/amchart/serial.js"></script>
    <script src="../assetsAdmin/pages/widget/amchart/light.js"></script>
    <script src="../assetsAdmin/pages/widget/amchart/pie.min.js"></script>
    <script src="https://www.amcharts.com/lib/3/plugins/export/export.min.js"></script>
    <script src="../assetsAdmin/js/pcoded.min.js"></script>
    <script src="../assetsAdmin/js/vertical-layout.min.js "></script>
    <script type="text/javascript" src="../assetsAdmin/pages/dashboard/custom-dashboard.js"></script>
    <script type="text/javascript" src="../assetsAdmin/js/script.js "></script>
    
</body>

</html>
            </> : <>
            <html>
        <head>
          <title>Something went wrong!</title>
        </head>
        <body>
        <div align = "center">
          </div>
          
        </body>
        <div align = "center">
          <br/><br/><br/><br/><br/><br/><br/><br/><br/>
          <br/><br/>
          <span style={{color: '#D3BE06', fontFamily: 'Felix Titling'}}>BAKHT</span>
          <img src={`https://bakhtart.herokuapp.com/assets/images/logoBakhtSiren.png`} alt="BakhtArt Logo"/>
          <span style={{color: '#D3BE06', fontFamily: 'Felix Titling'}}>ART</span><br/>
          <h2 style={{color: '#D3BE06', fontFamily: 'Felix Titling'}}>Something went wrong!</h2><br/>
        </div>
        <style>
        {document.body.style.backgroundColor = "#070C29"}
        </style>
      </html>
            </>
        }

</>

    );
}