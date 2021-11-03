import React, { useContext, useState, useEffect, useMemo } from 'react';
import Favicon from 'react-favicon';
import { useHistory } from 'react-router-dom';
import Axios from "axios";
import { FaDoorOpen, FaStar, FaUsers, FaUserEdit, FaTrash, 
    FaUserLock, FaUserInjured, FaUserPlus, FaBoxes, FaTshirt,
    FaPlusSquare, FaFolderPlus, FaCheckSquare, FaPen } from 'react-icons/fa';
import { toast } from 'toast-notification-alert';
import UserContext from "../context/UserContext";
import Pagination from '../pagination/pagination';
import Swal from 'sweetalert2';
import emailjs from "emailjs-com";

let PageSize = 5;

export default function Messages() {

    const [currentPage, setCurrentPage] = useState(1);

    const { userrData, setUserrData } = useContext(UserContext);

    let [searchItem, setSearchItem] = useState('');

    let [allMsgs, setAllMsgs] = useState([]);
    let [nbUM] = useState(0);

    useEffect(async() => {
        const result_bakhtmsgs = await Axios.get('https://bakhtart-backend.herokuapp.com/fashion/allMsgs');
        setAllMsgs(result_bakhtmsgs.data);
      },[]);
      allMsgs.map((itemu,index)=>{
        itemu.status === false ? nbUM = nbUM + 1 : <></>
      });

      const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return allMsgs.slice(firstPageIndex, lastPageIndex);
      }, [currentPage, allMsgs]);

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

    const markAsRead = async (msgId) => {
        try {
            await Axios.put(
                `https://bakhtart-backend.herokuapp.com/adminbakht/markasread/${msgId}`
            );
            toast.show({title: 'Message Read',
            position: 'topright', type: 'info'});
            setTimeout(function(){
                window.location.reload();
             }, 1000);
        } catch (err) {
            toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
        }
    }

    const markAsUnread = async (msgId) => {
        try {
            await Axios.put(
                `https://bakhtart-backend.herokuapp.com/adminbakht/markasunread/${msgId}`
            );
            toast.show({title: 'Message Not Read',
            position: 'topright', type: 'warn'});
            setTimeout(function(){
                window.location.reload();
             }, 1000);
        } catch (err) {
            toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
        }
    }

    const deleteMessage = async (msgId) => {
        try {
                await Axios.delete(
                    `https://bakhtart-backend.herokuapp.com/adminbakht/delete-msg/${msgId}`
                );
                toast.show({title: 'Message Deleted!',
            position: 'topright', type: 'warn'});
            setTimeout(function(){
                window.location.reload();
             }, 1000);
        } catch (err) {
            toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
        }
    }

    const replyToUser = (e, id, firstName, lastName, email, subject, content) => {
        e.preventDefault();
        Swal.fire({
            title: 'Reply to '+firstName+ ' '+lastName,
            html: `
            <html>
            <head>
            </head>
            <body>
            <form>
            <label style="font-size: 13px;"><b>Email to:</b></label>
            <input type = "email" name="email" value='${email}' placeholder='${email}' class="swal2-input"
            id="email" style="width:200px;height: 30px;font-size: 13px;" disabled/><br/>
            <label style="font-size: 13px;"><b>Subject:</b></label>
            <input type = "text" value='${subject}' name="subject" placeholder='${subject}' class="swal2-input"
            id="subject" style="width:200px;px;height: 30px;font-size: 13px;" disabled/><br/><br/>
            <label style="font-size: 13px;"><b>Message:</b></label><br/>
            <textarea id="content" value='${content}' name="content" placeholder = 'Type your message'
            class="swal2-input" style="height: 120px; width: 300px;"></textarea>
            </form>
            </body>
            </html>
            `,
            /* didClose: () => {
                window.location.reload();
            }, */
            didOpen: () => {
                Swal.getPopup().querySelector(`#email`).value = email;
		        Swal.getPopup().querySelector('#subject').value = subject;
            },
            confirmButtonText: 'Reply',
            focusConfirm: false,
            preConfirm: () => {
                const content = Swal.getPopup().querySelector('#content').value;
                if (!content) {
                    toast.show({title: `Field content is empty!`, position: 'topright', type: 'alert'});
                }
                return {content: content}
            }
        }).then((result) => {
            try {
                e.preventDefault();
                var templateParams = {
                    email: email,
                    subject: subject,
                    content: result.value.content,
                    firstName: firstName,
                    lastName: lastName
                };
        emailjs.send('gmail', 'template_xzjyfxj', templateParams, 'user_aA9P4JZixsituJGeWQYWC')
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });
        toast.show({title: "Your message has been sent successfully.", 
        position: 'topright', type: 'info'});
        Axios.put(
            `https://bakhtart-backend.herokuapp.com/adminbakht/messagereplied/${id}`
        );
        setTimeout(function(){
            window.location.reload();
         }, 1000);
            } catch (err) {
                console.log(err);
            }
        })
    }

    return(
        <>
        {
            userrData.userr && userrData.userr.roleBakht === 'admin' ?
            <>
                <html>

<head>
    <title>BakhtArt - All Messages</title>
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
          <nav className="navbar header-navbar pcoded-header" 
          style={{backgroundColor: '#070C29'}}>
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
                                        <img src="https://bakhtart-backend.herokuapp.com/upload_images_bakht/unknownAvatar.jpg" 
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
                                        <img src="https://bakhtart-backend.herokuapp.com/upload_images_bakht/unknownAvatar.jpg" 
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
                                      <span className="pcoded-mtext"  data-i18n="nav.basic-components.main"><b>All Users</b></span>
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
                                      <span className="pcoded-mtext"  data-i18n="nav.basic-components.main">All Products</span>
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
                          
                      </div>
                  </nav>
                  <div className="pcoded-content">
                      <div className="page-header">
                          <div className="page-block">
                              <div className="row align-items-center">
                                  <div className="col-md-8">
                                      <div className="page-header-title">
                                          <h5 className="m-b-10">Admin Dashboard</h5>
                                          <p className="m-b-0">All BakhtArt Messages</p>
                                      </div>
                                  </div>
                                  <div className="col-md-4">
                                      <ul className="breadcrumb-title">
                                          <li className="breadcrumb-item">
                                              <a href="/admin"> <i className="fa fa-home"></i> </a>
                                          </li>
                                          <li className="breadcrumb-item"><a href="/admin">Admin Dashboard</a>
                                          </li>
                                          <li className="breadcrumb-item"><a>All BakhtArt Messages</a>
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
          margin-right: 67px;\
        }\
      `}
                    </style>
                    <div className="card">
                                            <div className="card-header">
                                                <h5>All BakhtArt Messages</h5>
                                            </div>
                                            <div align = "right">
                                            <input type="text"
                        placeholder="Search Message" className="searchItem"
                   onChange={(e)=>setSearchItem(e.target.value)}/></div>
                                            <div className="card-block table-border-style">
                                                <div className="table-responsive">
                                                    <table className="table table-hover">
                                                        <thead>
                                                            <tr>
                                                                <th>From</th>
                                                                <th>Subject</th>
                                                                <th>Message</th>
                                                                <th>Replied</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                currentTableData.filter((item=>{
                                                                    if (searchItem === "") {
                                                                        return item
                                                                    }else if(item.firstName.toLowerCase().includes(searchItem.toLowerCase())
                                                                            ||item.lastName.toLowerCase().includes(searchItem.toLowerCase())
                                                                            ||item.email.toLowerCase().includes(searchItem.toLowerCase())
                                                                            ||item.subject.toLowerCase().includes(searchItem.toLowerCase())
                                                                            ||item.content.toLowerCase().includes(searchItem.toLowerCase())){
                                                                        return item
                                                                    }
                                                                })).reverse().map(itemm => {
                                                                    return(
                                                                    <tr key={itemm._id}>
                                                                    <td>
                                                                        {
                                                                            itemm.status === true ?
                                                                            <>
                                                                            {itemm.firstName} {itemm.lastName}
                                                                    <br/>
                                                                    {itemm.email}
                                                                            </> : <>
                                                                            <b style={{color: 'black'}}>
                                                                            {itemm.firstName} {itemm.lastName}
                                                                    <br/>
                                                                    {itemm.email}
                                                                            </b>
                                                                            </>
                                                                        }
                                                                        </td>
                                                                    <td>
                                                                        {
                                                                            itemm.status === true ?
                                                                            <>
                                                                            {itemm.subject}
                                                                            </> : <>
                                                                            <b style={{color: 'black'}}>{itemm.subject}</b>
                                                                            </>
                                                                        }
                                                                        
                                                                    </td>
                                                                    <td>
                                                                    {
                                                                            itemm.status === true ?
                                                                            <span title={itemm.content}>
                                                                            {itemm.content}
                                                                            </span> : <span title={itemm.content}>
                                                                            <b style={{color: 'black'}}>{itemm.content}</b>
                                                                            </span>
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                    {
                                                                            itemm.status === true && itemm.replied === true ?
                                                                            <span>
                                                                            Yes
                                                                            </span> : itemm.status === false && itemm.replied === true ?
                                                                             <span>
                                                                            <b style={{color: 'black'}}>Yes</b>
                                                                            </span> : <></>
                                                                        }
                                                                    {
                                                                            itemm.status === true && itemm.replied === false ?
                                                                            <span>
                                                                            No
                                                                            </span> : itemm.status === false && itemm.replied === false ?
                                                                             <span>
                                                                            <b style={{color: 'black'}}>No</b>
                                                                            </span> : <></>
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            itemm.status === false && itemm.replied === false ?
                                                                            <span style={{color: '#007bff', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => markAsRead(itemm._id)}>Mark as read</span> : <></>
                                                                        }
                                                                        {
                                                                            itemm.status === true && itemm.replied === false ?
                                                                            <span style={{color: '#540300', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => markAsUnread(itemm._id)}>Mark as unread</span> : <></>
                                                                        } {
                                                                            itemm.status === true && itemm.replied === false ?
                                                                            <button type="button"
                                                                            style={{backgroundColor: '#007bff',
                                                                            color: 'white', fontWeight: 'bold', 
                                                                            borderRadius: '5px', border: 'none', cursor: 'pointer'}}
                                                                            onClick={(e) => replyToUser(e, itemm._id, itemm.firstName, itemm.lastName, itemm.email, itemm.subject, itemm.content)}>
                                                                            Reply
                                                                            </button> : <></>
                                                                        } {
                                                                            itemm.status === true && itemm.replied === true ?
                                                                            <button type="button" disabled title="Already replied"
                                                                            style={{backgroundColor: 'rgba(0, 128, 0, 0.4)',
                                                                            color: 'white', fontWeight: 'bold', 
                                                                            borderRadius: '5px', border: 'none'}}
                                                                            onClick={(e) => replyToUser(e, itemm._id, itemm.firstName, itemm.lastName, itemm.email, itemm.subject, itemm.content)}>
                                                                            Message Replied <FaPen/>
                                                                            </button> : <></>
                                                                        } {
                                                                            itemm.status === false ?
                                                                            <button type="button" disabled title="Message must be read to reply"
                                                                            style={{backgroundColor: 'rgba(0, 123, 255, 0.4)',
                                                                            color: 'white', fontWeight: 'bold', 
                                                                            borderRadius: '5px', border: 'none'}}
                                                                            onClick={(e) => replyToUser(e, itemm._id, itemm.firstName, itemm.lastName, itemm.email, itemm.subject, itemm.content)}>
                                                                            Reply
                                                                            </button> : <></>
                                                                        } {
                                                                                itemm.status === true ?
                                                                                <>
                                                                                <button type="button"
                                                                            style={{backgroundColor: 'red',
                                                                            color: 'white', fontWeight: 'bold', 
                                                                            borderRadius: '5px', border: 'none', cursor: 'pointer'}} onClick={() => deleteMessage(itemm._id)}>
                                                                            Delete
                                                                            </button>
                                                                                </> : <></>
                                                                            }
                                                                            {
                                                                                itemm.status === false ?
                                                                                <>
                                                                                <button type="button" title="Unread message can't be deleted"
                                                                            style={{backgroundColor: 'pink',
                                                                            color: 'white', fontWeight: 'bold', 
                                                                            borderRadius: '5px', border: 'none'}} disabled
                                                                            onClick={() => deleteMessage(itemm._id)}>
                                                                            Delete
                                                                            </button>
                                                                                </> : <></>
                                                                            }
                                                                    </td>
                                                                    </tr>
                                                                    )})}
                                                        </tbody>
                                                    </table>
                                                    <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={allMsgs.length}
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