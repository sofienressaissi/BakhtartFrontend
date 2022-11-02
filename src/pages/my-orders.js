import React, { useContext, useState, useEffect, useMemo } from 'react';
import '../account.css';
import Axios from "axios";
import {FaInstagram, FaWhatsapp, 
    FaFacebookF, FaGlobe, FaHeadset, FaSignInAlt, FaUser, FaTruckMoving} from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { toast } from 'toast-notification-alert';
import Pagination from '../pagination/pagination';
import Moment from 'react-moment';
import ScrollUpButton from "react-scroll-up-button";
import { useSpeechSynthesis } from 'react-speech-kit';
import UserContext from "../context/UserContext";
import {GiHamburgerMenu} from "react-icons/gi";
import {MenuAccount} from "../components/MenuAccount";
import {ReactDimmer} from "react-dimmer";

let PageSize = 4;

export default function MyOrders() {

    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [subject, setSubject] = useState();
    const [content, setContent] = useState();
    const [isMenuOpen, setMenu] = useState(false);

    const handleMenu = () => {
        setMenu((prevState) => !prevState);
    };

    let { speak } = useSpeechSynthesis();

    const [currentPage, setCurrentPage] = useState(1);

    const { userrData, setUserrData } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    let [bakhtartProds, setBakhtartProds] = useState([]);
    let orderByLast = [];
    const [searchitem, setSearchitem] = useState('');
    let [nbOrd] = useState(0);

    useEffect(async() => {
        const result_bakhtords = await Axios.get('https://bakhtart-backend.herokuapp.com/fashion/all-orders');
        setOrders(result_bakhtords.data);
      },[]);

      useEffect(async() => {
        const result_bakhtprods = await Axios.get('https://bakhtart-backend.herokuapp.com/adminbakht/allBakhtProdsAdmin');
        setBakhtartProds(result_bakhtprods.data);
      },[]);

      orders.map((itemo,index)=>{
        userrData.userr && 
        userrData.userr.id === itemo.userId ? nbOrd = nbOrd + 1 : <></>
      });

      const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return orders.slice(firstPageIndex, lastPageIndex);
      }, [currentPage, orders]);

      for (let i = 0; i < currentTableData.length; i++) {
        for (let j = 0; j < bakhtartProds.length; j++) {
            if (currentTableData[i].productId === bakhtartProds[j]._id
                && userrData.userr && userrData.userr.id === currentTableData[i].userId) {
                orderByLast.push(bakhtartProds[j]);
            }
        }
    }

    const history = useHistory();
    const login = () => {
        history.push("/login");
        window.location.reload();
    }
    const logout = () => {
        setUserrData({
            token: undefined,
            userr: undefined
        });
        localStorage.setItem("auth-token", "");
        speak({text: 'Logging Out', voice: window.speechSynthesis.getVoices()[1] });
        toast.show({title: 'Logging Out',
            position: 'topright', type: 'warn'});
            setTimeout(function(){
                history.push('/');
                window.location.reload(1);
             }, 2000);
    }
    const deleteOrder = async (productId) => {
        try {
            const orderToRemove = {
                productId: productId
            };
            await Axios.delete(
                "https://bakhtart-backend.herokuapp.com/fashion/delete-order/"+productId+"/"+userrData.userr.id,
                orderToRemove
            );
            toast.show({title: 'Order Cancelled!',
            position: 'topright', type: 'alert'});
            setTimeout(function(){
                window.location.reload(1);
             }, 2000);
        } catch (err) {
            toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
        }
    }
    const sendMail = async (e) => {
        e.preventDefault();
        try {
            const newMsg = {
                firstName,
                lastName,
                email,
                subject,
                content
            };
            await Axios.post(
                "https://bakhtart-backend.herokuapp.com/fashion/send-message",
                newMsg
            );
            toast.show({title: "Message sent successfully!", 
            position: 'topright', type: 'info'});
            setTimeout(function(){
                window.location.reload(1);
             }, 1500);
        } catch (err) {
         toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
        }
       }
    return(
        <>
        {
            userrData.userr && userrData.userr.roleBakht === 'user' ?
            <>
            <html>
            <head>
                <title>Bakht'Art - My Orders</title>
                <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"/>
<script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<link rel="stylesheet" href="../assets/css/bootstrap.min.css"/>
<link rel="stylesheet" href="../assets/css/flexslider.css"/>
<link rel="stylesheet" href="../assets/css/jquery.fancybox.css"/>
<link rel="stylesheet" href="../assets/css/main.css"/>
<link rel="stylesheet" href="../assets/css/responsive.css"/>
<link rel="stylesheet" href="../assets/css/font-icon.css"/>
<link rel="stylesheet" href="../assets/css/animate.min.css"/>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"></link>
            </head>
            <body className="onlyinfos">
            <a href = "/">
            <img className="logo" src="../assets/images/logoBakhtSiren.png"/>
            </a>
            <nav className="navigation" role="navigation">
        

        </nav>
            <GiHamburgerMenu className="nav-toggle" onClick={handleMenu}/>
        <MenuAccount isMenuOpen={isMenuOpen} />
        <ReactDimmer
        isOpen={isMenuOpen}
        exitDimmer={setMenu}
        zIndex={100}
        blur={1.5}
      />
            <style>
            {
                  `\
                  @media screen and (max-width: 600px){\
    #map-overlay {\
        height: 400px;\
        margin-top: 0px;\
        width: 377px;\
        margin-left: -17px;\
        background-color: #070C29;\
        color: #D1B23E;\
        text-align: center;\
    }\
    .navigation ul {\
        display: inline;\
    }\
    .navigation span {\
        display: inline;\
    }\
    iframe {\
        display: none;\
    }\
    #header {\
        position: fixed;\
        width: 100%;\
        height: 13%;\
        z-index: 999;\
        background: rgb(2, 17, 68, 0.5);\
    }\
    .navigation span .account {\
        left: -100px;\
        font-weight: bold;\
        display: none;\
    }\
    .navigation .shopping-item {\
        left: 90px;\
        top: -4px;\
        font-size: 2px;\
        display: none;\
    }\
    .logoutB {\
        left: 230px;\
        height: 40px;\
    }\
    .logo {\
        margin-left: 15px;\
        margin-top: 10px;\
    }\
    .footer {\
        background: white;\
        display: none;\
    }\
    .account {\
        display: none;\
    }\
    .emp-profile {\
        width: 368px;\
        left: 10px;\
        margin-top: 10%;\
    }\
    .container {\
        margin-left: 12px;\
    }\
    .loginB {\
        display: none;\
    }\
    th h5 {\
    font-size: 10px;\
}\
table {\
    margin-left: -12px;\
}\
.searchInput {\
    display: none;\
}\
    .logoutB {\
        display: none;\
    }\
    .menu-btn {\
  font-size: 2.75rem;\
  margin-left: 325px;\
  margin-top: -18px;\
  color: rgb(209, 167, 62);\
  cursor: pointer;\
  display: none;\
}\
.section-header h2 {\
    margin-left: -55px;\
    font-size: 20px;\
}\
form input[type="text"], form input[type="email"] {\
    width: 368px;\
    left: -42px;\
    border-radius: 5px;\
}\
form #message {\
    width: 368px;\
    left: -42px;\
    border-radius: 5px;\
}\
.profile-head .nav-tabs {\
    display: none;\
}\
th h5 {\
    font-size: 5.5px;\
}\
td span {\
    font-size: 5.5px;\
}\
table {\
    margin-left: -10px;\
    margin-top: -87px;\
}\
.submitBnt {\
    border-radius: 0px;\
}\
.profile-edit-btn {\
    margin-left: 0px;\
    display: none;\
}\
.profile-work {\
    margin-left: -40px;\
}\
.col-md-6, label {\
    text-align: center;\
}\
form input[type="submit"] {\
    margin-left: 90px;\
    border-radius: 5px;\
}\
input[type="password"] {\
    width: 320px;\
    border-radius: 5px;\
}\
.profile-head h5 {\
    margin-left: 92px;\
    margin-top: 20px;\
}\
.profile-head h6 {\
    margin-left: -4px;\
    margin-top: 20px;\
}\
}\

`}
        </style>
        {
            userrData.userr ?
            <span>
              <a href="/account" className="account"
              style={{color: '#D1B23E', fontFamily: 'Felix Titling'}}><FaUser/> Account</a>
            <button className="logoutB"
            onClick={logout} style={{fontWeight: 'bold', color: '#D1B23E', border: 'none', backgroundColor: 'transparent', fontFamily: 'Felix Titling'}}>
                Logout
            </button>
            </span> :
        <button className="loginB"
        onClick = {login} style={{color: '#D1B23E', backgroundColor: 'transparent', fontFamily: 'Felix Titling'}}>
          <FaSignInAlt/> Login
        </button>
        }
<div className="container emp-profile">
                <div className="row">
                    <div className="col-md-4">
                        <div className="profile-img">
                        {
                            userrData.userr && userrData.userr.imageProfile === "unknownAvatar.jpg" ?
                                <img src={`https://bakhtart-backend.herokuapp.com/public/upload_images_bakht/${userrData.userr.imageProfile}`}
                                     alt="" style={{width: '250px', height: '150px'}}/> :
                                <></>
                        }
                        {
                            userrData.userr && userrData.userr.imageProfile !== "unknownAvatar.jpg" ?
                                <img src={`${userrData.userr.imageProfile}`}
                                     alt="" style={{width: '250px', height: '150px'}}/> :
                                <></>
                        }
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="profile-head">
                                    <h5 style={{fontFamily: 'Felix Titling', fontWeight: 'bold'}}>
                                        {
                                            userrData.userr ?
                                            <>
                                            {userrData.userr.firstName} {userrData.userr.lastName}</> :
                                            <></>
                                        }

                                    </h5>
                                    <h6 style = {{color: '#021144', 
                                    fontFamily: 'Felix Titling', fontWeight: 'bold'}}>
                                        Joined {
                                            userrData.userr ?
                                            <> 
                                            <Moment format="MMMM DD YYYY">
                                            {userrData.userr.dateCreation}
                                            </Moment>
                                            </> : <></>
                                        }
                                    </h6><br/>
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link" id="home-tab" data-toggle="tab"
                                    href="/account" style={{fontFamily: 'Felix Titling'}}
                                    role="tab" aria-controls="home" aria-selected="true">
                                       About Me
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="home-tab" data-toggle="tab"
                                    href="/account/edit" style={{fontFamily: 'Felix Titling'}}
                                    role="tab" aria-controls="home" aria-selected="true">
                                       Edit My Account
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="profile-tab" data-toggle="tab"
                                    href="/account/change-password" role="tab" aria-controls="profile"
                                    aria-selected="false" style={{fontFamily: 'Felix Titling'}}>
                                        Change My Password
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active" id="profile-tab" data-toggle="tab"
                                    href="/my-orders" role="tab" aria-controls="profile"
                                    aria-selected="false">
                                        <span style={{color: '#021144', fontFamily: 'Felix Titling'}}>
                                        My Orders
                                        </span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="profile-tab" data-toggle="tab"
                                    href="/my-wishlist" role="tab" aria-controls="profile"
                                    aria-selected="false"
                                    style={{fontFamily: 'Felix Titling'}}>My Wishlist</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="profile-tab" data-toggle="tab"
                                    href="/seen-recently" role="tab" aria-controls="profile"
                                    aria-selected="false"
                                    style={{fontFamily: 'Felix Titling'}}>Seen Recently</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <a href = "/account/edit">
                        <input type="submit" style = {{
                         fontFamily: 'Felix Titling', display: 'none'}}
                        className="profile-edit-btn" name="btnAddMore" value="Edit My Account"/>
                        </a>
                        </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="profile-work">
                            <p style={{fontFamily: 'Felix Titling'}}>ACCOUNT</p>
                            <a href="/account" 
                            style = {{color: '#212529', fontFamily: 'Felix Titling'}}>About Me</a><br/>
                            <a href="/account/edit"
                            style = {{color: '#212529', fontFamily: 'Felix Titling'}}>Edit My Account</a><br/>
                            {/*<a href="" style = {{color:'#212529'}}>Security</a><br/>*/}
                            <a href="/account/change-password" 
                            style = {{color:'#212529', fontFamily: 'Felix Titling'}}>Change My Password</a>
                            <p style={{fontFamily: 'Felix Titling'}}>PRODUCTS</p>
                            <a href="/my-orders" 
                            style = {{color:'#021144', fontFamily: 'Felix Titling'}}>My Orders</a><br/>
                            <a href="/my-wishlist" 
                            style = {{color:'#212529', fontFamily: 'Felix Titling'}}>My Wishlist</a><br/>
                            <a href="/seen-recently" 
                            style = {{color:'#212529', fontFamily: 'Felix Titling'}}>Seen Recently</a><br/>
                            <p></p>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div id="myTabContent">
                            <div id="home" 
                            role="tabpanel" aria-labelledby="home-tab">
                                   <style>
                                   {`\
                                      td.product-thumbnail img {\
                                           height: auto;\
                                           width: 70px;\
                                        }\
                                    `}
                                    {`\
                 table.shop_table {\
                    border-bottom: 1px solid #ddd;\
                    border-right: 1px solid #ddd;\
                    margin-bottom: 50px;\
                    width: 100%;\
                 }\
                `}
                {`\
                 table.shop_table th, table.shop_table td {\
                    border-left: 1px solid #ddd;\
                    border-top: 1px solid #ddd;\
                    padding: 15px;\
                    text-align: center;\
                 }\
                `}
                {`\
                 table.shop_table td.product-remove a {\
                    display: inline-block;\
                    padding: 0 5px 2px;\
                    text-transform: uppercase;\
                 }\
                `}
                {`\
                 table.shop_table td.product-remove a:hover {\
                    color: #fff;\
                    background: red;\
                    text-decoration: none;\
                 }\
                `}
                {`\
                 table.shop_table td.product-name a {\
                    color: #222;\
                 }\
                `}
                {`\
                 table.shop_table td.product-name a:hover {\
                    color: #5a88ca;\
                    text-decoration: none;\
                 }\
                `}
                {`\
        button[type="button"] {\
            background: none repeat scroll 0 0 #021144;\
    border: medium none;\
    color: #D3BE06;\
    border-radius: 5px;\
    text-transform: uppercase;\
    font-weight: bold;\
    font-size: 9px;\
        }\
      `}
      {`\
        .searchInput {\
          font-size: 17px;\
          border-radius: 5px;\
          font-family: Felix Titling;\
          margin-left: 472px;\
          margin-top: -50px;\
        }\
      `}
                                       {
                  `\
                  @media screen and (max-width: 740px){\
    .container h4 {\
        text-align: left;\
        font-size: 20px;\
        background-color: white;\
        border-radius: 5px;\
    }\
    .container h1 {\
        text-align: left;\
        font-size: 20px;\
        background-color: white;\
        border-radius: 5px;\
    }\
    .container button {\
        margin-left: 0px;\
    }\
    #section-profile p {\
        margin-left: -75px;\
    }\
    #section-profile {\
        height: 433px;\
    }\
    #products {\
        padding: 30px 0;\
    }\
    #products .container .section-header {\
        padding-bottom: 0px;\
    }\
    .no-gutter [class*=col-] {\
        margin-top: 60px;\
    }\
    .work img {\
        width: 85%;\
        height: 85%;\
        display: block;\
        margin-left: auto;\
        margin-right: auto;\
    }\
    #contactus {\
        padding: 0px 0;\
    }\
    .profile-desc .section-title {\
        font-size: 30px;\
        text-align: center;\
        margin-left: -75px;\
    }\
    .conForm .submitBnt {\
        font-size: 8px;\
    }\
    .contactusFooter {\
        margin-top: -25px;\
    }\
    #map-overlay {\
        height: 400px;\
        margin-top: 0px;\
        width: 392px;\
        margin-left: -17px;\
        background-color: #070C29;\
        color: #D1B23E;\
        text-align: center;\
    }\
    .navigation ul {\
        display: inline;\
    }\
    iframe {\
        display: none;\
    }\
    #header {\
        width: 100%;\
    }\
    .logo {\
        margin-left: 10px;\
        margin-top: 8px;\
    }\
    .footer {\
        background: white;\
    }\
}\
`}
                                   </style>
                                   {
                                       nbOrd === 0 ?
                                       <div align = "center">
                                       <span style={{fontFamily: 'Felix Titling',
                                    color: '#070C29', fontWeight: 'bold'}}>You have no order</span>
                                       </div> : <></>
                                   }
                                   {
                                       nbOrd > 0 ?
                                       <>
                                       <input type="text" className = "searchInput"
                       style={{marginRight: '250px;'}}
                        placeholder="Search Order"
                   onChange={(e)=>setSearchitem(e.target.value)}/><br/><br/>
                                       </> : <></>
                                   }
                                   
                                   <table cellspacing="0" className="shop_table cart">
                                        <thead>
                                            {
                                                nbOrd > 0 ?
                                                <>
                                                <tr>
                                        <th className="product-thumbnail"
                                            style={{fontFamily: 'Felix Titling', color: '#021144'}}><h5><b>Order N°</b></h5></th>
                                            <th className="product-thumbnail"
                                            style={{fontFamily: 'Felix Titling', color: '#021144'}}><h5><b>Order Date</b></h5></th>
                                            <th className="product-thumbnail"
                                            style={{fontFamily: 'Felix Titling', color: '#021144'}}><h5><b>Product</b></h5></th>
                                            <th className="product-thumbnail"
                                            style={{fontFamily: 'Felix Titling', color: '#021144'}}><h5><b>State</b></h5></th>
                                            <th className="product-thumbnail"
                                            style={{fontFamily: 'Felix Titling', color: '#021144'}}><h5><b>Action</b></h5></th>
                                        </tr>
                                                </> : <></>
                                            }
                                        </thead>
                                        <tbody>
                                            {
                                                orderByLast.filter((item=>{
                                                    if (searchitem === "") {
                                                        return item
                                                    }else if(item.productName.toLowerCase().includes(searchitem.toLowerCase())
                                                            ||item.productDescription.toLowerCase().includes(searchitem.toLowerCase())
                                                            ||item.productPath.toLowerCase().includes(searchitem.toLowerCase())){
                                                        return item
                                                    }
                                                })).reverse().map((itemp => (
                                                    currentTableData.map((itemo => (
                                                        itemp._id === itemo.productId
                                                        && userrData.userr
                                                        && userrData.userr.id === itemo.userId ?
                                                        <>
                                                        <tr className="cart_item" key = {itemo.productId}>
                                                            <td className="product-thumbnail">
                                                                <span style={{fontFamily: 'Felix Titling',
                                                            color: '#070C29'}}>
                                                                #{itemo.orderNumber}
                                                                </span>
                                                            </td>
                                                            <td className="product-thumbnail">
                                                            <span style={{fontFamily: 'Felix Titling',
                                                            color: '#070C29'}}>
                                                                <Moment format = "MMMM DD YYYY">
                                                                
                                                                {itemo.dateOrd}
                                                                
                                                                </Moment>
                                                                </span>
                                                            </td>
                                                            <td className="product-thumbnail">
                                                            <a href={`${itemp.productImage}`} target = "_blank">
                                                             <img width="145" 
                                                                     height="145" alt="if the image is not loaded, this is Firebase issues!" 
                                                                 className="shop_thumbnail" 
                                                                      src={`${itemp.productImage}`}/>
                                                                 </a><br/>
                                                                 <span style={{fontFamily: 'Felix Titling', color: '#070C29'}}>
                                                                     {itemp.productName} {itemp.productDescription}
                                                                 </span>
                                                            </td>
                                                            <td className="product-thumbnail">
                                                                <span style={{fontFamily: 'Felix Titling', 
                                                                color: '#070C29'}}>{itemo.stateOrd}</span>
                                                            </td>
                                                            <td className="product-thumbnail">
                                                                {
                                                                    itemo.stateOrd === 'Processing' ?
                                                                    <>
                                                                    <button type="button" style={{background: 'red', 
                                                                    border: 'none', color: 'white', 
                                                                    fontFamily: 'Felix Titling', fontWeight: 'bold'}}
                                                                    onClick={() => deleteOrder(itemo.productId)}>
                                                                          Cancel Order 
                                                                     </button>
                                                                    </> : <></>
                                                                }
                                                            </td>
                                                        </tr>
                                                        </> : <></>
                                                    )))
                                                )))
                                            }
                                        </tbody>
                                   </table>
                            </div>
                            <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={orders.length}
        pageSize={PageSize}
        onPageChange={page => setCurrentPage(page)}
      />
                            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Experience</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>Expert</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Hourly Rate</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>10$/hr</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Total Projects</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>230</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>English Level</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>Expert</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Availability</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>6 months</p>
                                            </div>
                                        </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <label>Your Bio</label><br/>
                                        <p>Your detail description</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        <section id="contactus" className="section" align = "center">
        <style>
  {`\
        .conForm input {\
          color: #797979;\
	padding: 15px 30px;\
	border: none;\
	margin-right: 3%;\
    margin-left: 180px;\
	margin-bottom: 30px;\
	outline: none;\
	font-style: normal;\
	border: #e0e0e0 1px solid;\
	font-size: 15px;\
        }\
      `}

{`\
        .conForm input.noMarr {\
          margin-right: 0px;\
        }\
      `}

{`\
        .conForm textarea {\
          color: #797979;\
	padding: 15px 30px;\
	margin-bottom: 18px;\
    margin-left: 180px;\
	outline: none;\
	height: 150px;\
	font-style: normal;\
	resize: none;\
	font-size: 15px;\
	border: none;\
	border: #e0e0e0 1px solid;\
        }\
      `}

{`\
        .conForm .submitBnt {\
          background: #D1B23E;\
	color: #070C29;\
	font-family: Felix Titling;\
	margin-top: 30px;\
    margin-left: 210px;\
	padding:15px 30px 15px 30px;\
	font-size: 13px;\
	font-weight: 600;\
	letter-spacing: 5px;\
	border: 0;\
	-moz-border-radius: 2px;\
	-webkit-border-radius: 2px;\
	border-radius: 2px;\
	display: inline-block;\
	text-transform: uppercase;\
        }\
      `}

{`\
        .conForm .submitBnt:hover {\
          background: #021144;\
	color: #e6be31;\
        }\
      `}

{`\
        .section {\
            padding: 25px 0;\
            margin-right: 200px;\
            margin-left: -150px;\
        }\
      `}
      {`\
        .section-header{\
            text-align: center;\
padding-bottom: 30px;\
margin-left: 300px;\
        }\
      `}
  </style>
  <div className="container">
      <div className="section-header">
          <nobr><h2 className="wow fadeInDown animated"
                    style={{fontFamily: 'Felix Titling', color: 'rgb(209, 178, 62)'}}>Contact Us</h2></nobr>
      </div>
    <div className="row">
      <div className="col-md-8 col-md-offset-2 conForm">
      <form onSubmit={sendMail}>
          <input style={{borderColor: '#070C29'}} name="firstName"
                 id="firstName" type="text" onChange = {(e) => setFirstName(e.target.value)}
                 className="col-xs-12 col-sm-12 col-md-12 col-lg-12" placeholder="First Name"/>
          <input style={{borderColor: '#070C29'}} name="lastName" onChange = {(e) => setLastName(e.target.value)}
                 id="lastName" type="text" className="col-xs-12 col-sm-12 col-md-12 col-lg-12" placeholder="Last Name"/>
          <input style={{borderColor: '#070C29'}} name="email" id="email" onChange = {(e) => setEmail(e.target.value)}
                 type="email" className=" col-xs-12 col-sm-12 col-md-12 col-lg-12 noMarr" placeholder="Email Address"/>
            <input style={{borderColor: '#070C29'}} name="subject" onChange = {(e) => setSubject(e.target.value)}
                   id="subject" type="text" className="col-xs-12 col-sm-12 col-md-12 col-lg-12" placeholder="Subject"/>
                 <textarea style={{borderColor: '#070C29'}} rows = "5" onChange = {(e) => setContent(e.target.value)}
                    name="message" id="message" className="col-xs-12 col-sm-12 col-md-12 col-lg-12" placeholder="Message..."></textarea>
          <input type="submit" className="submitBnt" value="Send Message"/>
        </form>
      </div>
    </div>
  </div>
</section>
</body>
<footer className="footer">
<style>

{`\
    #map-overlay {\
        height:400px;\
margin-top:-402px;\
margin-left: 700px;\
background-color: #070C29;\
padding:40px;\
color: #D1B23E;\
z-index: 1;\
    position:relative;\
    }\
  `}
  {`\
    .contactusFooter {\
        font-size: 40px;\
color: #D1B23E;\
    }\
  `}
  {`\
    .social-icons, .footer .footer-share {\
        margin-top: 20px;\
    }\
  `}
  {`\
    .social-icons li, .footer .footer-share li {\
        display: inline-block;\
float: none;\
    }\
  `}
  {`\
    .social-icons a, .footer .footer-share a {\
        border: 1px solid #cecece;\
color: #8a8a8a;\
display: block;\
font-size: 14px;\
height: 32px;\
line-height: 32px;\
margin-right: 5px;\
text-align: center;\
width: 32px;\
    }\
  `}
  {`\
    .social-icons a:hover {\
        background-color: #9b832c;\
border-color: #9b832c;\
color: #fff;\
  `}
  {`\
    .footer {\
        text-align: left;\
	background: #1f1f1f;\
	padding-top: 0;\
  `}
  {`\
    .footer-top {\
        background-color: #181818;\
	padding-top: 50px;\
  `}
  {`\
    .footer-bottom {\
        background-color: #313454;\
	padding: 20px 0;\
  `}
  {`\
    .footer .footer-col {\
        margin-bottom: 80px;\
  `}
  {`\
    .footer h5 {\
        color: #fff;\
  `}
</style>
<div className="container-fluid">
<div id="map-row" className="row">
    <div className="col-xs-12">

    <iframe width="100%" height="400" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"
src="https://maps.google.com/maps?q=Rue%20de%20la%20tendresse,%20Marsa&t=&z=13&ie=UTF8&iwloc=&output=embed"></iframe>
          <div id="map-overlay" className="col-xs-5 col-xs-offset-6">
          
    		<h2 styles={{marginTop:0,color:'#fff'}} className="contactusFooter">Contact us</h2>
    		<address styles={{color:'#fff'}}>
    			<strong>
            <span style={{fontFamily: 'Papyrus'}}>
              <a href = "#home" style={{color: "#D1B23E"}}>
            BAKHT'ART
              </a>
            </span>
          </strong><br/>
    			Street of Tenderness.<br/>
    			La Marsa, Tunisia<br/><br/>
    			<a href = "https://www.facebook.com/7wissallabbane" target = "_blank">
                    <span style={{color: '#D1B23E'}}><FaFacebookF/></span></a>
          &nbsp;&nbsp;&nbsp;
          <a href = "https://www.instagram.com/bakht_art_/" target = "_blank"><span style={{color: '#D1B23E'}}><FaInstagram/></span></a>
          &nbsp;&nbsp;&nbsp;
          <a href = "tel:+21698353353" target = "_blank"><span style={{color: '#D1B23E'}}><FaWhatsapp/></span></a><br/>
    			<br/>
    			<abbr title="Phone">Phone Number:</abbr> +216 98 353 353<br/><br/>
          <FaGlobe/> International Delivery &nbsp;&nbsp;<FaHeadset/>&nbsp;Customer Support &nbsp;&nbsp;<FaTruckMoving/>&nbsp;Home Delivery
    		</address>
			  © Copyright 2016 - 2021 bakht-art.com | Made with <img src="../assets/images/heartbeat.gif" style={{width: '20px'}}/> by <strong>Sofien Ressaissi</strong>.
    	</div>
      <ScrollUpButton style={{width: 75}} ToggledStyle={{right: 100}}
              StopPosition={0}
      ShowAtPosition={150}
      EasingType='easeOutCubic'
      AnimationDuration={500}
      ContainerClassName='ScrollUpButton__Container'
      TransitionClassName='ScrollUpButton__Toggled'/>
    </div>
	 </div>
</div>
</footer>
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
          <img src="../assets/images/logoBakhtSiren.png" alt = "BakhtArt Logo"/>
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