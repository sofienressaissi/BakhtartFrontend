import React, { useContext, useEffect, useState } from 'react';
import {
    FaInstagram, FaWhatsapp,
  FaFacebookF, FaGlobe, FaHeadset, FaTruckMoving, FaSignInAlt, FaUser, FaTrash, FaWallet} from 'react-icons/fa';
import ScrollUpButton from "react-scroll-up-button";
import { useHistory } from 'react-router-dom';
import { useSpeechSynthesis } from 'react-speech-kit';
import { toast } from 'toast-notification-alert';
import UserContext from "../context/UserContext";
import Pagination from '../pagination/pagination';
import Axios from 'axios';
import {GiHamburgerMenu} from "react-icons/gi";
import {ReactDimmer} from "react-dimmer";
import { Menu } from "../components/Menu";

let PageSize = 3;

export default function CheckoutBakht() {

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

  let fullUrl = window.location.href;
    let ordNumber = fullUrl.split("checkout/").pop();
    

      if (ordNumber.includes("?")) {
        let index = ordNumber.lastIndexOf("?");
        if (index > 0) {
          ordNumber = ordNumber.substring(0, index);
        }
      }

  const [currentPage, setCurrentPage] = useState(1);
    const { userrData, setUserrData } = useContext(UserContext);

    let [bakhtartCats, setBakhtartCats] = useState([]);
    let [bakhtartProds, setBakhtartProds] = useState([]);
    let newProdByCatList = [];
    let [prodCarts, setProdCarts] = useState([]);
    let [nb_pc]= useState(0);
    let [totalQt] = useState(0);

    const deleteProdFromCart = async (productId, userId) => {
        try {
            const prodToCart = {
                productId: productId,
                userId: userId
            };
            await Axios.delete(
                "https://bakhtart-backend.herokuapp.com/fashion/delete-prod-from-cart/"+productId+"/"+userId,
                prodToCart
            );
            toast.show({title: 'Deleted From Cart!',
            position: 'topright', type: 'alert'});
            toast.show({title: 'Cart Updated!',
            position: 'topright', type: 'info'});
            setTimeout(function(){
                window.location.reload(1);
             }, 1500);
        } catch (err) {
            toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
        }
    }

    useEffect(async() => {
        const result_bakhtprods = await Axios.get('https://bakhtart-backend.herokuapp.com/adminbakht/allBakhtProdsAdmin');
        setBakhtartProds(result_bakhtprods.data);
      },[]);

      useEffect(async() => {
        const result_pc = 
        await Axios.get('https://bakhtart-backend.herokuapp.com/fashion/countprodcart');
        setProdCarts(result_pc.data);
      },[]);

      prodCarts.map((itempc,index)=>{
        userrData.userr && userrData.userr.id === itempc.userId ? nb_pc = nb_pc + 1 : nb_pc = nb_pc + 0
      });
        bakhtartProds.map((itemp => (
            prodCarts.map((itempc => (
                itemp._id === itempc.productId &&
                userrData.userr && userrData.userr.id === itempc.userId ?
                totalQt = totalQt + 7 + (itempc.quantityMin*itemp.productPrice)
                : <></>
            )))
        )))

    useEffect(async() => {
        const result_bakhtcats = await Axios.get('https://bakhtart-backend.herokuapp.com/fashion/allBakhtCatsAdmin');
        setBakhtartCats(result_bakhtcats.data);
      },[]);

    const history = useHistory();

    const placeOrderr = async () => {
        try {
            if (userrData.userr.firstAddress === ""
            && userrData.userr.secondAddress === ""
            && userrData.userr.region === ""
            && userrData.userr.ville === "") {
                toast.show({title: "Please add your address before you proceed", position: 'topright', type: 'alert'});
            } else {
                for (let i = 0; i<prodCarts.length; i++) {
                    if (prodCarts[i].userId === userrData.userr.id) {
                            const prodsToCheckout = {
                                productId: prodCarts[i].productId,
                                orderNumber: prodCarts[i].orderNumber
                            };
                            const prodsToDelete = {
                                productId: prodCarts[i].productId
                            }
                            await Axios.post(
                                "https://bakhtart-backend.herokuapp.com/fashion/place-order/"+prodCarts[i].productId+"/"+userrData.userr.id,
                                prodsToCheckout
                            );
                            await Axios.delete(
                                "https://bakhtart-backend.herokuapp.com/fashion/delete-prod-from-cart/"+prodCarts[i].productId+"/"+userrData.userr.id,
                                prodsToDelete
                            );
                            
                    }
                    
                }
                toast.show({title: 'Order Placed Successfully!',
                            position: 'topright', type: 'info'});
                            setTimeout(function(){
                                history.push('/products/all');
                             }, 1500);
            }
            
        } catch (err) {
            toast.show({title: "Error placing Order!", position: 'topright', type: 'alert'});
        }
        
    }
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

    return (
      <>
      {
        userrData.userr && userrData.userr.roleBakht === 'user' ?
        <>
        <html>
          <head>
            <title>Bakht'Art - Checkout
            </title>
            <link rel="stylesheet" href="../../../assets/css/bootstrap.min.css"/>
<link rel="stylesheet" href="../../../assets/css/flexslider.css"/>
<link rel="stylesheet" href="../../../assets/css/jquery.fancybox.css"/>
<link rel="stylesheet" href="../../../assets/css/mainOther.css"/>
<link rel="stylesheet" href="../../../assets/css/responsive.css"/>
<link rel="stylesheet" href="../../../assets/css/font-icon.css"/>
<link rel="stylesheet" href="../../../assets/css/animate.min.css"/>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"></link>
          </head>
            <div>

<section className="banner" id="home" role="banner">
    
  <header id="header">
    <div className="header-content clearfix">
        <a href = "/">
        <img className="logo" src="../../../assets/images/logoBakhtSiren.png"/>
        </a>
      <nav className="navigation" role="navigation">
        <ul className="primary-nav" style={{paddingRight: '290px'}}>
          <li>
          </li>
          <li>
          
          </li>
          <li></li>
          <li>
          </li>
          <li>
          </li>
        </ul>
        <style>
        {`\
        .shopping-item {\
    float: right;\
    font-size: 18px;\
    margin-top: -33px;\
    margin-right: 135px;\
    padding: 10px;\
    position: relative;\
        }\
      `}
      {`\
        .shopping-item a {\
          color: #666;\
        }\
      `}
      {`\
        .shopping-item i.fa {\
          margin-left: 5px;\
        }\
      `}
      {`\
        .shopping-item:hover a {\
          color: #fff;\
          text-decoration: none;\
        }\
      `}
      {`\
        .shopping-item:hover .cart-amunt {\
          color: #fff;\
        }\
      `}
      {`\
       .product-count {\
        background: none repeat scroll 0 0 #021144;\
    border-radius: 50%;\
    color: #D3BE06;\
    display: inline-block;\
    font-size: 10px;\
    height: 15px;\
    padding-top: 2px;\
    position: absolute;\
    right: 0px;\
    text-align: center;\
    top: 5px;\
    width: 15px;\
        }\
      `}
      {`\
       #header .loginB {\
	float: right;\
	font-size:15px;\
	color: #000;\
	text-decoration:none;\
	text-transform:uppercase;\
	letter-spacing: 2px;\
	/* background: #ffffff; */
	position: absolute;\
	top: 32px;\
	bottom: 42px;\
	right: 0px;\
	text-align: center;\
	padding: 6px 15px;\
	vertical-align: bottom;\
  font-weight: bold;\
}\
      `}
        </style>
        {
          userrData.userr ?
          <>
          <style>
          {`\
        .shopping-item {\
    float: right;\
    font-size: 18px;\
    margin-top: -29px;\
    margin-right: 222px;\
    padding: 10px;\
    position: relative;\
        }\
      `}
      {`\
      #header .account {\
        float: right;\
        font-size:13px;\
        color: #000;\
        text-decoration:none;\
        text-transform:uppercase;\
        letter-spacing: 2px;\
        /* background: #ffffff; */
        position: absolute;\
        top: 36px;\
        bottom: 35px;\
        right: 105px;\
        text-align: center;\
        padding: 6px 15px;\
        vertical-align: bottom;\
      }\
      `}
          </style>
          <div className="shopping-item">
            <a href="/cart" style={{fontFamily: 'Felix Titling', color: '#D1B23E'}}><b>Cart</b>
            <i className="fa fa-shopping-cart"></i> 
            <span className="product-count"><b>{nb_pc}</b></span></a>
        </div>
          </> : <>
          <style>
          {`\
        .shopping-item {\
    float: right;\
    font-size: 18px;\
    margin-top: -29px;\
    margin-right: 130px;\
    padding: 10px;\
    position: relative;\
        }\
      `}
          </style>
          <div className="shopping-item">
            <a href="/" style={{fontFamily: 'Felix Titling', color: '#D1B23E', pointerEvents: 'none'}}><b>Cart</b>
            <i className="fa fa-shopping-cart"></i> 
            <span className="product-count"></span></a>
        </div>
          </>
        }
        {
            userrData.userr ?
            <span>
              <a href="/account" className="account" style={{color: '#D1B23E', fontFamily: 'Felix Titling'}}><FaUser/> Account</a>
            <button className="loginB"
            onClick={logout} style={{fontWeight: 'bold', color: '#D1B23E', backgroundColor: 'transparent', fontFamily: 'Felix Titling'}}>
                Logout
            </button>
            </span> :
        <button className="loginB"
        onClick = {login} style={{color: '#D1B23E', backgroundColor: 'transparent', fontFamily: 'Felix Titling'}}>
          <FaSignInAlt/> Login 
        </button>
        }
      </nav>
        <GiHamburgerMenu className="nav-toggle" onClick={handleMenu}/>
        <Menu isMenuOpen={isMenuOpen} />
        <ReactDimmer
        isOpen={isMenuOpen}
        exitDimmer={setMenu}
        zIndex={100}
        blur={1.5}
      />
        <style>
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
    .section-header h2 {\
        font-size: 30px;\
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
        width: 377px;\
        margin-left: -17px;\
        background-color: #070C29;\
        color: #D1B23E;\
        text-align: center;\
    }\
    .navigation ul {\
        display: inline;\
    }\
    .nav-toggle {\
        margin-top: 10px;\
    }\
    .navigation span {\
        display: inline;\
    }\
    iframe {\
        display: none;\
    }\
    .continuePurchase[type="submit"] {\
        display: none;\
    }\
    .checkoutbtn {\
        border-radius: 5px;\
        margin-right: -4px;\
        height: 30px;\
        width: 100px;\
    }\
    #header {\
        position: fixed;\
        width: 100%;\
        height: 13%;\
        z-index: 999;\
        background: rgb(2, 17, 68, 1);\
    }\
    th h5 {\
    font-size: 8.5px;\
}\
td span {\
    font-size: 8.5px;\
}\
table {\
    margin-left: -8px;\
}\
    .navigation span .account {\
        left: -150px;\
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
        margin-left: 0px;\
        margin-top: 5px;\
    }\
    .footer {\
        background: white;\
    }\
    .woocommerce h3 {\
        text-align: center;\
    }\
    .loginB {\
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
}\

`}
        </style>
      {/*<a href="#" className="nav-toggle">Menu<span></span></a>*/} </div>
  </header><br/><br/><br/><br/>
  <br/><br/>
  <style>
  {`\
        .product-big-title-area {\
            background: url(../../../assetsCats/img/crossword.png) repeat scroll 0 0 #5a88ca;\
        }\
      `}
  {`\
        .product-bit-title {\
            font-family: raleway;\
  font-size: 50px;\
  font-weight: 200;\
  margin: 0;\
  padding: 50px 0;color: #fff;\
        }\
      `}
  </style>
  <div className="product-big-title-area">
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="product-bit-title text-center">
                        <h2 style={{fontFamily: 'Felix Titling', color: 'white'}}>Checkout</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <style>
    {`\
        .Categories {\
            background: #fff;\
	        padding-top: 130px;\
        }\
      `}
      {`\
        .containerCats {\
            max-width: 1300px;\
        }\
      `}
      {`\
        .titleCat {\
            text-align:center;\
	        padding-bottom: 60px;\
        }\
      `}
      {`\
        .titleCat h2{\
    line-height: 45px;\
    color: #000;\
    font-weight: bold;\
    margin-bottom: 25px !important;\
    text-transform: uppercase;\
    max-width: 312px;\
    width: 100%;\
    margin: -85px auto;\
    padding-bottom: 4px;\
        }\
      `}
      {`\
        ul.categiri li {\
            display: inline-block;\
            padding: 0;\
        }\
      `}
      {`\
        ul.categiri li.active a {\
            background: #070C29;\
            color: #fff;\
        }\
      `}
      {`\
        ul.categiri li a {\
            padding: 10px 12px;\
            font-weight: 500;\
            font-size: 19px;\
            color: #070C29;\
        }\
      `}
      {`\
        ul.categiri li a:hover {\
            background: #070C29;\
            color: #D3BE06;\
        }\
      `}
    </style>
    
    <style>
    {`\
        .single-product-area .zigzag-bottom {\
            background-color: #f4f4f4;\
        }\
      `}
{`\
        .single-shop-product h2 {\
            font-size: 20px;\
            margin: 10px 0;\
        }\
      `}
      {`\
        .single-shop-product {\
            margin-bottom: 50px;\
        }\
      `}
      {`\
        .product-carousel-price ins {\
            color: #5a88ca;\
  font-weight: 700;\
  margin-right: 5px;\
  text-decoration: none;\
        }\
      `}
      {`\
        .product-option-shop {\
            margin-top: 15px;\
        }\
      `}
      {`\
        .add_to_cart_button {\
            background: none repeat scroll 0 0 #021144;\
    border: medium none;\
    color: #D3BE06;\
    padding: 6px 25px;\
    display: inline-block;\
        }\
      `}
      {`\
        .add_to_cart_button:hover {\
            background-color: #D3BE06;\
            color: #021144;\
            text-decoration: none;\
        }\
      `}
      {`\
        div.cart-collaterals ul.products li.product:hover .add_to_cart_button {\
            background-color: #222;\
        }\
      `}
      {`\
        .product-upper img {\
            width: 220px;\
            height: 220px;\
            margin-left: 0px;\
        }\
      `}
      {`\
        .single-shop-product h2 a {\
            color: #021144;\
        }\
      `}
      {`\
        .product-hover {\
          height: 90%;\
          left: 5.5%;\
          position: absolute;\
          top: 0;\
          width: 89%;\
          overflow: hidden;\
          border: 1px solid #ddd;\
        }\
      `}
      {`\
        .product-hover:after {\
          background: none repeat scroll 0 0 #000;\
  content: "";\
  height: 100%;\
  left: -100%;\
  opacity: 0.6;\
  position: absolute;\
  top: 0;\
  width: 100%;\
  transition: .4s;\
        }\
      `}
      {`\
        .product-hover a {\
          background: none repeat scroll 0 0 #070C29;\
    border-radius: 5px;\
    color: #D3BE06;\
    display: block;\
    font-size: 16px;\
    left: 10%;\
    margin: 0;\
    padding: 10px;\
    position: absolute;\
    text-align: center;\
    text-transform: uppercase;\
    border: 1px solid #070C29;\
    width: 80%;\
    z-index: 99;\
    transition: .4s;\
        }\
      `}
      {`\
        .product-hover a:hover {\
          background: #D3BE06;\
  text-decoration: none;\
  border-color: #D3BE06;\
  color: #070C29;\
        }\
      `}
      {`\
        .product-hover a i {\
          margin-right: 5px;\
        }\
      `}
      {`\
        .product-hover a.add-to-cart-link {\
          top: -40%;\
        }\
      `}
      {`\
        .product-hover a.view-details-link {\
          bottom: -25%;\
        }\
      `}
      {`\
        .single-product {\
          overflow: hidden;\
        }\
      `}
      {`\
        .single-product h2 {\
            font-size: 18px;\
            line-height: 25px;\
            margin-bottom: 10px;\
            margin-top: 15px;\
        }\
      `}
      {`\
        .single-product h2 a {\
            color: #222;\
        }\
      `}
      {`\
        .single-product p {\
            color: #5a88ca;\
            font-weight: 700;\
        }\
      `}
      {`\
        .single-product:hover .product-hover a.add-to-cart-link {\
          top: 40%;\
        }\
      `}¨
      {`\
        .single-product:hover .product-hover a.view-details-link {\
          bottom: 32%;\
        }\
      `}
      {`\
        .single-product:hover .product-hover:after {\
          left: 0;\
        }\
      `}
    </style>
  
</section>
<style>
{`\
        .single-sidebar {\
            margin-bottom: 50px;\
        }\
      `}
{`\
        .single-sidebar > ul {\
            list-style: outside none none;\
    margin: 0;\
    padding: 0;\
        }\
      `}
{`\
        .single-sidebar li {\
            border-bottom: 1px solid #f1f1f1;\
    padding: 10px 0;\
        }\
      `}
      {`\
        .single-sidebar a {\
            display: block;\
        }\
      `}
      {`\
        .sidebar-title {\
            color: #021144;\
    font-size: 25px;\
    margin-bottom: 30px;\
    text-transform: uppercase;\
    font-family: Felix Titling;\
        }\
      `}
      {`\
        .single-sidebar input[type="text"] {\
            margin-bottom: 10px;\
    width: 100%;\
        }\
      `}
      {`\
        .thubmnail-recent {\
            margin-bottom: 30px;\
    overflow: hidden;\
        }\
      `}
      {`\
        .thubmnail-recent > h2 {\
            font-size: 20px;\
    margin-bottom: 10px;\
        }\
      `}
      {`\
        .thubmnail-recent > h2 a {\
            color: #222;\
        }\
      `}
      {`\
        .checkout-btn[type="submit"], .enabBtn[type=submit] {\
            background: none repeat scroll 0 0 #021144;\
    border: medium none;\
    color: #D3BE06;\
    margin-left: 200px;\
    padding: 15px 30px;\
    text-transform: uppercase;\
    font-weight: bold;\
    font-family: Felix Titling;\
    font-size: 13px;\
        }\
      `}
      {`\
        .continuePurchasing[type=submit] {\
            background: none repeat scroll 0 0 #D3BE06;\
    border: medium none;\
    color: #021144;\
    margin-left: 150px;\
    padding: 15px 30px;\
    text-transform: uppercase;\
    font-weight: bold;\
    font-family: Felix Titling;\
    font-size: 13px;\
        }\
      `}
      {`\
        .checkout-btn[type="submit"]:hover, .enabBtn[type=submit]:hover {\
            background-color: #D3BE06;\
            color: #021144;\
        }\
      `}
      {`\
        .continuePurchasing[type=submit]:hover {\
            background-color: #021144;\
            color: #D3BE06;\
        }\
      `}
</style>
<div className="single-product-area" style={{backgroundColor: '#ffffff'}}>
        <div className = "container">
            <div className = "row">
                <div className = "col-md-4">
                    <div className = "single-sidebar">
                    <h2 className="sidebar-title">Categories</h2>
                    </div>
                        <ul>
                        <li><a href={`/products/all`}>
                                        <h5 style={{fontFamily: 'Felix Titling',
                                    color: '#021144', fontWeight: 'bold'}}>All</h5>
                                        </a>
                                        <hr style={{border: '1px solid rgb(90, 136, 202)'}}/>
                                    </li>
                            {
                                bakhtartCats.map((itemc => (
                                    <>
                                    <li><a href={`/products/${itemc.categoryPath}`}>
                                        <h5 style={{fontFamily: 'Felix Titling',
                                    color: '#021144', fontWeight: 'bold'}}>{itemc.categoryName}</h5>
                                        </a>
                                        <hr style={{border: '1px solid rgb(90, 136, 202)'}}/>
                                    </li>
                                    </>
                                )))
                            }
                        </ul>
                </div>
                <style>
                {`\
        .product-breadcroumb {\
            margin-bottom: 20px;\
        }\
      `}
                    {`\
        .product-breadcroumb>a {\
            margin-right: 31px;\
            position: relative;\
            font-size: 15px;\
        }\
      `}
      {`\
        .product-breadcroumb > a::before {\
            content: "/";\
    position: absolute;\
    right: -20px;\
    top: 2px;\
        }\
      `}
      {`\
        .product-breadcroumb > a:last-child::before {\
            display: none;\
        }\
      `}
      {`\
        .product-main-img {\
            margin-bottom: 20px;\
        }\
      `}
      {`\
        .product-main-img img {\
            width: 300px;\
            height: 320px;\
        }\
      `}
      {`\
        .product-gallery {\
            margin-bottom: 25px;\
            margin-left: -15px;\
            overflow: hidden;\
        }\
      `}
      {`\
        .product-gallery img {\
            height: auto;\
            margin-left: 15px;\
            width: 76px;\
        }\
      `}
      {`\
        .product-name {\
            font-size: 25px;\
            margin-bottom: 20px;\
        }\
      `}
      {`\
        .product-inner-price {\
            margin-bottom: 25px;\
        }\
      `}
      {`\
        .product-inner-price > ins {\
            color: #5a88ca;\
            font-weight: 700;\
            margin-right: 10px;\
            text-decoration: none;\
        }\
      `}
      {`\
        form.cart {\
            margin-bottom: 25px;\
        }\
      `}
      {`\
        .quantity {\
            float: left;\
            margin-right: 15px;\
        }\
      `}
      {`\
        .quantity input[type="number"] {\
            border: 1px solid #021144;\
            padding: 5px;\
            width: 50px;\
        }\
      `}
      {`\
        div.quantity input.plus, div.quantity input.minus {\
            background: none repeat scroll 0 0 #5a88ca;\
            border: medium none;\
            color: #fff;\
            height: 25px;\
            line-height: 15px;\
            width: 25px;\
        }\
      `}
      {`\
        div.quantity input.plus:hover, div.quantity input.minus:hover {\
            background-color: #222;\
        }\
      `}
      {`\
        .add_to_cart_button {\
            background: none repeat scroll 0 0 #5a88ca;\
            border: medium none;\
            color: #fff;\
            padding: 6px 25px;\
            display: inline-block;\
        }\
      `}
      {`\
        .add_to_cart_button:hover {\
            background-color: #222;\
            color: #fff;\
            text-decoration: none;\
        }\
      `}
      {`\
        .product-inner-category {\
            margin-bottom: 30px;\
        }\
      `}
      {`\
        .product-tab {\
            border-bottom: 1px solid #ddd;\
            list-style: outside none none;\
            margin: 0 0 30px;\
            padding: 0;\
            text-align: center;\
        }\
      `}
      {`\
        .product-tab li {\
            display: inline-block;\
        }\
      `}
      {`\
        .product-tab li.active {\
            background: none repeat scroll 0 0 #5a88ca;\
        }\
      `}
      {`\
        .product-tab li.active a {\
            color: #D3BE06;\
        }\
      `}
      {`\
        .product-tab li.active a:hover {\
            color: #021144;\
        }\
      `}
      {`\
        .product-tab li a {\
            color: #222;\
            display: block;\
            font-size: 16px;\
            padding: 10px 30px;\
        }\
      `}
      {`\
        .product-tab li a {\
            color: #222;\
            display: block;\
            font-size: 16px;\
            padding: 10px 30px;\
        }\
      `}
      {`\
        .product-tab li a:hover {\
            text-decoration: none;\
        }\
      `}
      {`\
        .product-tab li a:focus {\
            text-decoration: none;\
        }\
      `}
      {`\
        .submit-review label {\
            display: block;\
        }\
      `}
      {`\
        .submit-review input[type="text"], .submit-review input[type="email"], .submit-review textarea {\
            margin-bottom: 20px;\
            width: 100%;\
        }\
      `}
      {`\
        .submit-review textarea {\
            height: 105px;\
        }\
      `}
      {`\
        .rating-chooser {\
            margin-bottom: 30px;\
        }\
      `}
      {`\
        .rating-chooser p {\
            font-weight: 700;\
        }\
      `}
      {`\
        .rating-wrap-post {\
            font-size: 20px;\
        }\
      `}
      {`\
        .tab-content h2 {\
            font-size: 20px;\
        }\
      `}
                </style><br/><br/>
                <style>
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
                 td.product-name {\
                    font-size: 10px;\
                 }\
                `}
                {`\
                 form.cart {\
                    margin-bottom: 25px;\
                 }\
                `}
                {`\
                 td.product-thumbnail img {\
                    height: auto;\
                    width: 70px;\
                 }\
                `}
                {`\
                 td.product-quantity div.quantity {\
                    float: none;\
                    margin: 0;\
                 }\
                `}
                {`\
                 .checkoutbtn[type="submit"] {\
                    font-size: 20px;\
                    margin-left: 555px;\
                 }\
                `}
                {`\
                 .continuePurchase[type="submit"] {\
                    font-size: 20px;\
                    margin-left: 300px;\
                    margin-right: -150px;\
                 }\
                `}
                {`\
                 .updateQtity[type="submit"] {\
                    font-size: 10px;\
                    margin-left: 10px;\
                    margin-right: 12px;\
                 }\
                `}
                {`\
                 #customer_details label {\
                    display: block;\
                    margin: 0 0 5px;\
                 }\
                `}
                {`\
                 #customer_details input[type="text"], #customer_details textarea, .shipping_calculator input[type=text] {\
                    margin-bottom: 10px;\
                    width: 100%;\
                 }\
                `}
                {`\
                 #customer_details h3 {\
                    color: #5a88ca;\
                    font-size: 20px;\
                    text-transform: uppercase;\
                 }\
                `}
                {`\
                 #customer_details select, .shipping_calculator select {\
                    border: 1px solid #ddd;\
                    margin-bottom: 15px;\
                    padding: 10px;\
                    width: 100%;\
                 }\
                `}
                </style>
                <div className="col-md-8">
                        <div className="woocommerce-billing-fields">
                            {
                                nb_pc > 0 ?
                                <>
                                    <h3 style={{fontFamily: 'Felix Titling', 
                            color: '#021144', top: '100px;'}}>Billing Details</h3>
                                            <br/>   
                                </> : <></>
                            }
                                            {
                                                userrData.userr && nb_pc > 0 ?
                                                <>
                                            <p id="billing_first_name_field" 
                                            className="form-row form-row-first validate-required">
                                                <label className="" 
                                                for="billing_first_name" 
                                                style={{color: '#070C29', fontFamily: 'Felix Titling'}}>Full Name:
                                                </label> <span style={{color: '#070C29', fontFamily: 'Felix Titling', fontWeight: 'bold'}}>{userrData.userr.firstName} {userrData.userr.lastName}</span>
                                            </p>
                                            <p id="billing_first_name_field" 
                                            className="form-row form-row-first validate-required">
                                                <label className="" 
                                                for="billing_first_name" 
                                                style={{color: '#070C29', fontFamily: 'Felix Titling'}}>Username:
                                                </label> <span style={{color: '#070C29', fontFamily: 'Felix Titling', fontWeight: 'bold'}}>{userrData.userr.username}</span>
                                            </p>
                                            <p id="billing_first_name_field" 
                                            className="form-row form-row-first validate-required">
                                                <label className="" 
                                                for="billing_first_name" 
                                                style={{color: '#070C29', fontFamily: 'Felix Titling'}}>Email:
                                                </label> <span style={{color: '#070C29', fontFamily: 'Felix Titling', fontWeight: 'bold'}}>{userrData.userr.email}</span>
                                            </p>
                                            <div className="clear"></div>
                                            <p id="billing_first_name_field" 
                                            className="form-row form-row-first validate-required">
                                                <label className="" 
                                                for="billing_first_name" 
                                                style={{color: '#070C29', fontFamily: 'Felix Titling'}}>Phone Number:
                                                </label> <span style={{color: '#070C29', fontFamily: 'Felix Titling', fontWeight: 'bold'}}>+216{userrData.userr.phoneNumber}</span>
                                            </p>
                                            </> : <>
                                            </>
                                            }
                                            {
                                                userrData.userr && userrData.userr.firstAddress !== "" && userrData.userr.secondAddress !== ""
                                                && userrData.userr.region !== "" 
                                                && userrData.userr.ville !== "" && nb_pc > 0 ?
                                                <>
                                                <p id="billing_first_name_field" 
                                            className="form-row form-row-first validate-required">
                                                <label className="" 
                                                for="billing_first_name" 
                                                style={{color: '#070C29', fontFamily: 'Felix Titling'}}>Delivered To The Following Address:
                                                </label> <span style={{color: '#070C29', fontFamily: 'Felix Titling', fontWeight: 'bold'}}>{userrData.userr.firstAddress} / {userrData.userr.secondAddress} / {userrData.userr.region} / {userrData.userr.ville}</span>
                                            </p>
                                                </> : 
                                                userrData.userr && userrData.userr.firstAddress === "" && userrData.userr.secondAddress === ""
                                                && userrData.userr.region === "" 
                                                && userrData.userr.ville === "" && nb_pc > 0 ? 
                                                <>
                                                <label className="" 
                                                for="billing_first_name" 
                                                style={{color: '#316DDB', fontFamily: 'Felix Titling'}}>
                                                    <a href = "/account/edit" target = "_blank">Add Your Address</a> And <a href = "/checkout">Refresh</a>
                                                </label>
                                            </> : <></>
                                            }


                        </div><br/>
                        {
                            nb_pc > 0 ?
                            <>
                            <p id="billing_first_name_field" 
                                            className="form-row form-row-first validate-required">
                                                <h3 className="" 
                                                for="billing_first_name" 
                                                style={{color: '#070C29', fontFamily: 'Felix Titling'}}>Paiement Method
                                                </h3>
                                                <input type="radio" data-order_button_text="Proceed to PayPal" 
                        value="paypal" name="payment_method" checked
                        className="input-radio" id="payment_method_paypal"></input> <span for="payment_method_paypal" 
                        style={{fontFamily: 'Felix Titling', color: '#070C29', fontWeight: 'bold'}}>Cash On Delivery <FaWallet/></span> 
                                            </p><br/><br/>
                            </> : <></>
                        }
                        
                        
                
                    <div className="product-content-right">
                        <div className="woocommerce">
                            {
                                nb_pc > 0 ?
                                <>
                                <h3 style={{fontFamily: 'Felix Titling', 
                            color: '#021144', top: '100px;'}}>Your Order</h3>   
                                </> : <>
                                <h3 style={{fontFamily: 'Felix Titling', 
                            color: '#021144', top: '100px;'}}>Nothing To Checkout</h3>
                                </>
                            }
                                <table cellspacing="0" className="shop_table cart">
                                    <thead>
                                        {
                                            nb_pc > 0 ?
                                            <>
                                            <tr>
                                            <th className="product-thumbnail"
                                            style={{fontFamily: 'Felix Titling', color: '#021144'}}><h5><b>Image</b></h5></th>
                                            <th className="product-thumbnail"
                                            style={{fontFamily: 'Felix Titling', color: '#021144'}}><h5><b>Product</b></h5></th>
                                            <th className="product-thumbnail"
                                            style={{fontFamily: 'Felix Titling', color: '#021144'}}><h5><b>Price</b></h5></th>
                                            <th className="product-quantity"
                                            style={{fontFamily: 'Felix Titling', color: '#021144'}}><h5><b>Quantity</b></h5></th>
                                            <th className="product-subtotal"
                                            style={{fontFamily: 'Felix Titling', color: '#021144'}}><h5><b>Sub-Total</b></h5></th>
                                        </tr>
                                            </> : <></>
                                        }
                                    </thead>
                                    <tbody>
                                        {
                                            bakhtartProds.map((itemp => (
                                                prodCarts.map((itempc => (
                                                    itemp._id === itempc.productId &&
                                                    userrData.userr && userrData.userr.id === itempc.userId ?
                                                    <>
                                                        <tr className="cart_item" key = {itempc.productId}>

<td className="product-thumbnail">
    <a href={`${itemp.productImage}`} target = "_blank">
        <img width="145" 
        height="145" alt="if the image is not loaded, this is Firebase issues!" 
        className="shop_thumbnail" 
        src={`${itemp.productImage}`}/>
    </a><br/><br/>
    <FaTrash style = {{color: 'red', fontFamily: 'Felix Titling'}}/> 
    <button type="button" style={{background: 'none', border: 'none', color: 'red', 
    fontFamily: 'Felix Titling', fontWeight: 'bold'}}
    onClick={() => deleteProdFromCart(itempc.productId, userrData.userr.id)}>
            Delete From Cart
          </button>
</td>

<td className="product-name">
    <span className = "amount" style={{color: '#021144', 
    fontFamily: 'Felix Titling', fontWeight: 'bold'}}>{itemp.productName}</span> 
</td>

<td className="product-price">
    <span className="amount" style={{color: '#021144', 
    fontFamily: 'Felix Titling', fontWeight: 'bold'}}>{itemp.productPrice} TND</span> 
</td>

<td className="product-quantity">
    <div className="quantity buttons_added">
    <span className="amount" style={{color: '#021144', 
    fontFamily: 'Felix Titling', fontWeight: 'bold'}}>{itempc.quantityMin}</span>
    </div>
</td>

<td className="product-subtotal">
    <span className="amount" style={{color: '#021144', 
    fontFamily: 'Felix Titling', fontWeight: 'bold'}}>{7 + itemp.productPrice * itempc.quantityMin} TND
    <br/> (7 TND Shipping)</span> 
</td>
</tr>
                                                    </> : <></>
                                                )))
                                            )))
                                        }
                                        {
                                            nb_pc > 0 ?
                                            <>
                                            <tr>
                                            <td colspan = "5"><h6 style={{color: '#021144',
                        fontWeight: 'bold', fontFamily: 'Felix Titling'}}>Total: {totalQt} TND</h6></td>
                                        </tr>
                                        <tr>
                                            <td className="actions" colspan="6">
                                                <button type="button"
                                                name="proceed" style={{
                                                    background: 'none repeat scroll 0 0 #021144',
                                                color: '#D3BE06', border: 'medium none', 
                                                fontFamily: 'Felix Titling', fontWeight: 'bold',
                                                marginLeft: '175px;',
                                                fontSize: '25px;', padding: '15px 30px;'}}
                                                className="checkoutbtn"
                                                onClick={placeOrderr}>
                                                    Place Order
                                                </button>
                                            </td>
                                        </tr>   
                                            </> : <></>
                                        }
                                                    
                                        
                                    </tbody>
                                </table>
                            <div align = "right">
                                
                            </div>
                            
</div></div></div>
            </div>
        </div>
</div>
<Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={newProdByCatList.length}
        pageSize={PageSize}
        onPageChange={page => setCurrentPage(page)}
      />

<section id="contactus" className="section" style={{backgroundColor: '#F5F5F5'}}>
  <div className="container">
      <div className="section-header">
          <h2 className="wow fadeInDown animated" style={{fontFamily: 'Felix Titling', color: '#070C29'}}>Contact Us</h2>
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
<footer className="footer">
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
              <a href = "/" style={{color: "#D1B23E"}}>
            BAKHT'ART
              </a>
            </span>
          </strong><br/>
    			Street of Tenderness.<br/>
    			La Marsa, Tunisia<br/><br/>
    			<a href = "https://www.facebook.com/7wissallabbane" target = "_blank"><span style={{color: '#D1B23E'}}><FaFacebookF/></span></a>
          &nbsp;&nbsp;&nbsp;
          <a href = "https://www.instagram.com/bakht_art_/" target = "_blank"><span style={{color: '#D1B23E'}}><FaInstagram/></span></a>
          &nbsp;&nbsp;&nbsp;
          <a href = "tel:+21698353353" target = "_blank"><span style={{color: '#D1B23E'}}><FaWhatsapp/></span></a><br/>
    			<br/>
    			<abbr title="Phone">Phone Number:</abbr> +216 98 353 353<br/><br/>
          <FaGlobe/> International Delivery &nbsp;&nbsp;<FaHeadset/>&nbsp;Customer Support &nbsp;&nbsp;<FaTruckMoving/>&nbsp;Home Delivery
    		</address>
			  © Copyright 2016 - 2021 bakht-art.com | Made with <img src="../../../assets/images/heartbeat.gif" style={{width: '20px'}}/> by <strong>Sofien Ressaissi</strong>.
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

            </div>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script> 
<script src="../../../assets/js/bootstrap.min.js"></script> 
<script src="../../../assets/js/jquery.flexslider-min.js"></script> 
<script src="../../../assets/js/jquery.fancybox.pack.js"></script> 
<script src="../../../assets/js/retina.min.js"></script> 
<script src="../../../assets/js/modernizr.js"></script> 
<script src="../../../assets/js/main.js"></script> 
<script type="text/javascript" src="../../../assets/js/jquery.contact.js"></script> 
    <script src="../../../assetsCats/js/owl.carousel.min.js"></script>
    <script src="../../../assetsCats/js/jquery.sticky.js"></script>
    <script src="../../../assetsCats/js/jquery.easing.1.3.min.js"></script>
    <script src="../../../assetsCats/js/main.js"></script>
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
    )
}

