import React, { useContext, useEffect, useState, useMemo } from 'react';
import {FaShoppingCart, FaInfo,
    FaInstagram, FaWhatsapp, FaShare, FaArrowRight, FaShippingFast, FaHeart,
  FaFacebookF, FaGlobe, FaHeadset, FaTruckMoving, FaSignInAlt, FaUser} from 'react-icons/fa';
import ScrollUpButton from "react-scroll-up-button";
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router-dom';
import { ShareSocial } from 'react-share-social';
import { toast } from 'toast-notification-alert';
import UserContext from "../context/UserContext";
import Pagination from '../pagination/pagination';
import { useSpeechSynthesis } from 'react-speech-kit';
import Axios from 'axios';
import { GiHamburgerMenu } from "react-icons/gi";
import { MenuProd } from "../components/MenuProd";
import { ReactDimmer } from "react-dimmer";

let PageSize = 3;

export default function ProdDetail() {

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

  const useStyles = makeStyles({
    root: {
      width: 200,
      display: "flex",
      alignItems: "center"
    }
  });

  const [value, setValue] = useState(0);
  const [rateValue, setRateValue] = useState(-1);
  const [res, setRes] = useState();
  const [disabled, setDisabled] = useState();
  const classes = useStyles();

  const showRes = () => {
    setRes(`The value is: ${rateValue}`);
    setDisabled(true);
    setValue(rateValue);
  };

    const socialMediaStyle = {
        background: 'linear-gradient(45deg, #D1B23E 10%, #021144 100%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      };

  const [currentPage, setCurrentPage] = useState(1);

    let fullUrl = window.location.href;
    let cutUrl = fullUrl.split(".com").pop();
    let getCatName = cutUrl.split("/products/").pop();
    let productId = getCatName.split("/").pop();
    

      if (productId.includes("?")) {
        let index = productId.lastIndexOf("?");
        if (index > 0) {
          productId = productId.substring(0, index);
        }
      }

    const { userrData, setUserrData } = useContext(UserContext);

    let [bakhtartCats, setBakhtartCats] = useState([]);
    let [bakhtartProds, setBakhtartProds] = useState([]);
    let [prodCarts, setProdCarts] = useState([]);
    let [prodWishlist, setProdWishlist] = useState([]);
    let [prodRates, setProdRates] = useState([]);
    let newProdByCatList = [];
    let [nb_pc]= useState(0);
    let [quantityMin] = useState(1);
    let [nb_ac, setNb_ac] = useState(0);
    let [orders, setOrders] = useState([]);
    let [nb_ord] = useState(0);
    let [nb_qt] = useState(0);
    let [nb_wsh] = useState(0);
    let [nb_rate] = useState(0);
    let [nb_pr] = useState(0);
    let [nb_val] = useState(0);

    useEffect(async() => {
        const result_bakhtprods = await Axios.get('https://bakhtart-backend.herokuapp.com/adminbakht/allBakhtProdsAdmin');
        setBakhtartProds(result_bakhtprods.data);
      },[]);

      useEffect(async() => {
        const result_orders = await Axios.get('https://bakhtart-backend.herokuapp.com/fashion/all-orders');
        setOrders(result_orders.data);
      },[]);

      useEffect(async() => {
        const result_prodwish = await Axios.get('https://bakhtart-backend.herokuapp.com/fashion/all-wish-prods');
        setProdWishlist(result_prodwish.data);
      },[]);

      useEffect(async() => {
        const result_prodrates = await Axios.get('https://bakhtart-backend.herokuapp.com/fashion/countprodrate');
        setProdRates(result_prodrates.data);
      },[]);

      orders.map((itempc,index)=>{
        userrData.userr && userrData.userr.id === itempc.userId 
        && productId === itempc.productId 
        && itempc.stateOrd === 'Processing' ? nb_ord = nb_ord + 1 : <></>
      });

      bakhtartProds.map((itemp, index) => {
        productId === itemp._id && itemp.productQuantity > 0 ?
        nb_qt = nb_qt + 1 : <></>
      });

      prodWishlist.map((itemw, index) => {
        userrData.userr && userrData.userr.id === itemw.userId && productId === itemw.productId ?
        nb_wsh = nb_wsh + 1 : <></>
      });

      prodRates.map((itemr, index) => {
        userrData.userr && userrData.userr.id === itemr.userId && productId === itemr.productId ?
        nb_rate = nb_rate + 1 : <></>
      });

      prodRates.map((itemr, index) => {
        productId === itemr.productId ?
        nb_pr = nb_pr + 1 : nb_pr = nb_pr + 0
      });

      prodRates.map((itemr, index) => {
        productId === itemr.productId ?
        nb_val = nb_val + itemr.rateValue : nb_val = nb_val + 0
      });

      

      const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        for (let i = 0; i<bakhtartProds.length; i++) {
            if (bakhtartProds[i]._id !== productId) {
                newProdByCatList.push(bakhtartProds[i]);
            }
        }
        return newProdByCatList.slice(firstPageIndex, lastPageIndex);
        
      }, [currentPage, newProdByCatList]);

    useEffect(async() => {
        const result_bakhtcats = await Axios.get('https://bakhtart-backend.herokuapp.com/fashion/allBakhtCatsAdmin');
        setBakhtartCats(result_bakhtcats.data);
      },[]);

      useEffect(async() => {
        const result_pc = 
        await Axios.get('https://bakhtart-backend.herokuapp.com/fashion/countprodcart');
        setProdCarts(result_pc.data);
      },[]);

      prodCarts.map((itempc,index)=>{
        userrData.userr && userrData.userr.id === itempc.userId ? nb_pc = nb_pc + 1 : <></>
      });

      prodCarts.map((itempcc,indexpcc)=>{
        userrData.userr && userrData.userr.id === itempcc.userId && itempcc.productId === productId
        ? nb_ac = itempcc.quantityMin : <></>
      });

    const history = useHistory();

    const addSeenProd = async (productId, prodCat) => {
      try {
        const prodSeen = {
          productId
        };
        if (userrData.userr) {
          await Axios.post(
            "https://bakhtart-backend.herokuapp.com/fashion/add-prod-seen/"+userrData.userr.id,
            prodSeen
        );
        }
      history.push('/products/'+prodCat+'/'+productId);
      window.location.reload();
      window.scrollTo(0, 0);
      } catch (err) {
        toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
      }
    }

    const updateMinusCart = async () => {
      try {
        const prodToCart = {
            productId: productId,
            quantityMin
        };
        await Axios.put(
            "https://bakhtart-backend.herokuapp.com/fashion/decr-quantity/"+userrData.userr.id+"/"+productId,
            prodToCart
        );
        toast.show({title: 'Quantity Updated!',
        position: 'topright', type: 'info'});
        setTimeout(function(){
            window.location.reload(1);
         }, 1000);
    } catch (err) {
        toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
    }
    }

    const updatePlusCart = async () => {
        try {
            const prodToCart = {
                productId: productId,
                quantityMin
            };
            await Axios.put(
                "https://bakhtart-backend.herokuapp.com/fashion/incr-quantity/"+userrData.userr.id+"/"+productId,
                prodToCart
            );
            toast.show({title: 'Quantity Updated!',
            position: 'topright', type: 'info'});
            setTimeout(function(){
                window.location.reload(1);
             }, 1000);
        } catch (err) {
            toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
        }
    }

    const addProductRate = async () => {
      try {
        const productRate = {
          rateValue: value,
          productId: productId
      };
        await Axios.post(
          "https://bakhtart-backend.herokuapp.com/fashion/add-product-rate/"+userrData.userr.id,
          productRate
        );
        toast.show({title: 'You rated this product with '+value+ ' out of 5',
          position: 'topright', type: 'info'});
          setTimeout(function(){
            window.location.reload(1);
         }, 1500);
      } catch (err) {
        toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
      }
    }

    const addWishProd = async () => {
      try {
        await Axios.post(
          "https://bakhtart-backend.herokuapp.com/fashion/add-wishlist/"+productId+"/"+userrData.userr.id
      );
      toast.show({title: 'Product Added To Wishlist!',
          position: 'topright', type: 'info'});
          setTimeout(function(){
              window.location.reload(1);
           }, 1500);
      } catch (err) {
        toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
      }
    }

    const orderProd = async () => {
      if (nb_ord <= 0) {
        try {
          const prodToCart = {
              productId: productId,
              quantityMin
          };
          await Axios.post(
              "https://bakhtart-backend.herokuapp.com/fashion/add-to-cart/"+userrData.userr.id,
              prodToCart
          );
          toast.show({title: 'Product Added To Cart!',
          position: 'topright', type: 'info'});
          setTimeout(function(){
              window.location.reload(1);
           }, 1500);
      } catch (err) {
          toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
      }
      } else {
        toast.show({title: "You can order this product again once it's delivered", position: 'topright', type: 'alert'});
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
        (userrData.userr && userrData.userr.roleBakht === 'user') || (!userrData.userr) ?
        <>
        <html>
          <head>
            <title>Bakht'Art - {
                    bakhtartProds.map((itemp => (
                        bakhtartCats.map((itemc => (
                            getCatName.startsWith(itemp.productCategory) &&
                            itemc.categoryPath === itemp.productCategory &&
                            productId === itemp._id ?
                        <>
                        
                        {itemc.categoryName} - {itemp.productName}
                        </> : <></>
                        )))
                    )))
                }
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
    {/*<span className="logo" style={{fontFamily: 'Papyrus'}}><a href="index.html">
        BAKHT'ART</a></span>*/}
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
            <a href="/" style={{fontFamily: 'Felix Titling', textDecoration: 'line-through',
            color: '#D1B23E', pointerEvents: 'none'}}>
                <b>Cart</b>
            <i className="fa fa-shopping-cart" style={{textDecoration: 'line-through'}}></i> 
            <span className="product-count" style={{textDecoration: 'line-through', backgroundColor: 'transparent'}}></span></a>
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
        <MenuProd isMenuOpen={isMenuOpen} />
        <ReactDimmer
        isOpen={isMenuOpen}
        exitDimmer={setMenu}
        zIndex={100}
        blur={1.5}
      />
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
                        <h2 style={{fontFamily: 'Felix Titling', color: 'white'}}>Shop</h2>
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
        .product-hover button {\
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
        .product-hover button:hover {\
          background: #D3BE06;\
  text-decoration: none;\
  border-color: #D3BE06;\
  color: #070C29;\
        }\
      `}
      {`\
        .product-hover button i {\
          margin-right: 5px;\
        }\
      `}
      {`\
        .product-hover button.add-to-cart-link {\
          top: -40%;\
        }\
      `}
      {`\
        .product-hover button.view-details-link {\
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
        .single-product:hover .product-hover button.add-to-cart-link {\
          top: 40%;\
        }\
      `}¨
      {`\
        .single-product:hover .product-hover button.view-details-link {\
          bottom: 32%;\
        }\
      `}
      {`\
        .single-product:hover .product-hover:after {\
          left: 0;\
        }\
      `}
    </style>
    <div className="single-product-area">
        <div className="zigzag-bottom"></div>
        <div className="container">
            <div className="row">
                {
                    currentTableData.map((itemp => (
                        itemp.productCategory === getCatName ?
                        <>
                        <div className="col-md-3 col-sm-6" key = {itemp._id}>
                    <div className="single-shop-product">
                        <div className="product-upper">
                        <div class="single-product" align = "center">
                            <img src={`${itemp.productImage}`} 
                            alt="If the image is not loaded,  
                            click on it to see it or refresh the page!
                                Otherwise, it will appear in a few seconds."
                            name="Open product image in new tab"/>
                            <div className="product-hover">
                            <button
                                            className="add-to-cart-link" onClick = {() => addSeenProd(itemp._id, itemp.productCategory)}
                                            style={{fontFamily: 'Felix Titling'}}>
                                              <FaInfo/>
                                              See Details</button>
                                        </div>
                        </div></div>
                        <div align = "center">
                        <h2>
                          
                          <a href={`/products/${getCatName}/${itemp.productPath}`}>
                            {itemp.productName}
                            </a></h2></div>
                        <div className="product-carousel-price" align = "center">
                            <ins>{itemp.productPrice} TN</ins>
                        </div>
                        <div style={{color: 'red'}} align = "center">
                            <ins style={{textDecoration: 'none'}}>{itemp.productQuantity} remaining</ins>
                        </div>                 
                    </div>
                </div>
                        </> : <></>
                    )))
                }
            </div>
            
            
        </div>
    </div>
  
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
        input[type="submit"], .enabBtn[type=submit] {\
            background: none repeat scroll 0 0 #021144;\
    border: medium none;\
    color: #D3BE06;\
    margin-left: 72px;\
    padding: 15px 30px;\
    text-transform: uppercase;\
    font-weight: bold;\
    font-size: 20px;\
        }\
      `}
      {`\
        input[type="submit"]:hover, .enabBtn[type=submit]:hover {\
            background-color: #D3BE06;\
            color: #021144;\
        }\
      `}
</style>
<div className="single-product-area">
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
                <div className="col-md-8">
                    <div className="product-content-right">
                        <div className="product-breadcroumb">
                            
                            <a href={`/products/all`}
                            style={{color: '#021144', fontFamily: 'Felix Titling'}}>Products</a>
                            
                            {
                    bakhtartProds.map((itemp => (
                        bakhtartCats.map((itemc => (
                            getCatName.startsWith(itemp.productCategory) &&
                            itemc.categoryPath === itemp.productCategory &&
                            productId === itemp._id ?
                        <>
                        <a href={`/products/${itemc.categoryPath}`}
                        style={{color: '#021144', fontFamily: 'Felix Titling'}}>{itemc.categoryName}</a>
                        </> : <></>
                        )))
                    )))
                }
                            {
                    bakhtartProds.map((itemp => (
                        bakhtartCats.map((itemc => (
                            getCatName.startsWith(itemp.productCategory) &&
                            itemc.categoryPath === itemp.productCategory &&
                            productId === itemp._id ?
                        <>
                        <a href="" style={{color: '#021144', fontFamily: 'Felix Titling',
                         pointerEvents: 'none'}}>{itemp.productName}</a>
                        </> : <></>
                        )))
                    )))
                }
                        </div>
                        <div className = "row">
                        <div className="col-sm-6">
                                <div className="">
                                    <div className="product-main-img">
                                        
                                        {
                    bakhtartProds.map((itemp => (
                        bakhtartCats.map((itemc => (
                            getCatName.startsWith(itemp.productCategory) &&
                            itemc.categoryPath === itemp.productCategory &&
                            productId === itemp._id ?
                        <>
                        <a href = {`${itemp.productImage}`} target = "_blank"> 
                        <img src={`${itemp.productImage}`} 
                        alt="If the image is not loaded,  
                        click on it to see it or refresh the page!
                            Otherwise, it will appear in a few seconds."
                        name="Open product image in new tab"/></a>
                        </> : <></>
                        )))
                    )))
                }
                                    </div>
                                </div>
                                {
                                  nb_qt === 0 ?
                                  <>
                                  <h3 style={{color: 'red',
                                fontFamily: 'Felix Titling', fontWeight: 'bold'}}>
                                  Out Of Stock
                                  </h3>
                                  </> : <></>
                                }
                                {
                                    bakhtartProds.map((itemp => (
                                        bakhtartCats.map((itemc => (
                                            getCatName.startsWith(itemp.productCategory) &&
                            itemc.categoryPath === itemp.productCategory &&
                            productId === itemp._id && itemp.productQuantity > 0 ? 
                            <>
                            {
                                userrData.userr ?
                                <>
                                <button className = "enabBtn" onClick = {orderProd}
                                        style={{fontFamily: 'Felix Titling'}}
                                        type="submit">Order <FaShoppingCart/></button><br/><br/>
                                        {
                                            nb_ac > 0 ?
                                            <>
                                            <style>
                                            {`\
                                             input[type="number"] {\
                                                 border: 1px solid #021144;\
                                                  padding: 5px;\
                                                   width: 50px;\
                                               }\
                                            `}
                                                       {`\
        input.plus, input.minus {\
            background: none repeat scroll 0 0 #5a88ca;\
            border: medium none;\
            color: #fff;\
            height: 25px;\
            line-height: 15px;\
            width: 25px;\
        }\
      `}
                                            </style>
                                            <input type="button" style={{backgroundColor: '#021144', 
        color: '#D3BE06', fontFamily: 'Felix Titling', fontWeight: 'bold'}}
        className="minus" value="-" onClick = {updateMinusCart}/>
        <input type="number" size="4" 
        className="input-text qty text" title="Quantity" disabled 
        value={nb_ac} min="1" step="1" onChange={e=>setNb_ac(e.target.value)}/>
        <input type="button" style={{backgroundColor: '#021144', 
        color: '#D3BE06', fontFamily: 'Felix Titling', fontWeight: 'bold'}}
        className="plus" value="+" onClick={updatePlusCart}/>
        <pre>      <span style={{color: '#021144', 
        fontFamily: 'Felix Titling', fontWeight: 'bold'}}>({nb_ac} Product(s) Added)</span></pre>
                                            </> : <></>
                                        }
                                </> : <></>
                            }
                                            
                                        {
                                            !userrData.userr ?
                                            <>
                                            <button className = "disBtn"
                                        style={{fontFamily: 'Felix Titling'}} disabled
                                        type="submit">Order <FaShoppingCart/></button>
                                            </> : <></>
                                        }
                                        
                            </> : <></>
                                        )))
                                    )))
                                }
                                    
                                        <br/>
                                        <style>
                                        {`\
                                            .disBtn {\
                                                background: none repeat scroll 0 0 rgba(2, 17, 68, 0.6);\
                                                border: medium none;\
                                                color: rgba(211, 190, 6, 0.6);\
                                                margin-left: 72px;\
                                                padding: 15px 30px;\
                                                text-transform: uppercase;\
                                                font-weight: bold;\
                                                font-size: 20px;\
                                           }\
                                        `}
                                        {`\
                                            .loginReq {\
                                                font-size: 1.286em;\
                                                font-weight: 500;\
                                                margin-left: 97px;\
                                                margin: 0.3em 0.5;\
                                                text-transform: capitalize;\
                                                text-align: left;\
                                           }\
                                        `}
                                            {/*
                                            h5 {
    
}
                                            */}
                                        </style>
                                        <div style={{float: 'right;'}}>
                                        {
                                        !userrData.userr ?
                                        <h5 className = "loginReq" style={{color: 'red',
                                    fontFamily: 'Felix Titling',
                                fontWeight: 'bold'}}>Login required</h5> : <></>
                                        }
                                        </div>
                                    <br/>
                                    {
                                      nb_qt > 0 ?
                                      <>
                                      <div>
                                        <h4 style={{color: '#28B13D',
                                    fontFamily: 'Felix Titling'}}> <FaWhatsapp/> <b>Order on WhatsApp</b></h4>

                                    <h5 style={{color: '#28B13D',
                                    fontFamily: 'Felix Titling'}}><b><FaArrowRight/> <u>+216 98 353 353</u></b></h5>
                                    </div>
                                      </> : <></>
                                    }<br/>
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
        margin-left: 44px;\
    }\
    .product-main-img {\
        text-align: center;\
    }\
    .single-product img {\
        margin-left: 55px;\
    }\
    .product-hover {\
        height: 105%;\
    }\
    .col-sm-6 .enabBtn {\
        margin-left: 94px;\
    }\
    .prodDetails {\
        margin-top: -90px;\
    }\
    .btn .btn-danger {\
        margin-left: 94px;\
    }\
    #section-profile p {\
        margin-left: -75px;\
    }\
    #section-profile {\
        height: 433px;\
    }\
    .rating {\
        margin-left: 22px;\
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
    iframe {\
        display: none;\
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
        margin-left: 10px;\
    }\
    .contactusFooter {\
        margin-top: -25px;\
    }\
    .loginB {\
        display: none;\
    }\
    .logoutB {\
        display: none;\
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
    .navigation span .account {\
        left: -120px;\
        font-weight: bold;\
        display: none;\
    }\
    .navigation .shopping-item {\
        left: 104px;\
        top: -9px;\
        font-size: 2px;\
        display: none;\
    }\
    iframe {\
        display: none;\
    }\
    #header {\
        width: 100%;\
        height: 12%;\
    }\
    .logo {\
        margin-left: -15px;\
        margin-top: -1px;\
    }\
    .container .disBtn {\
        margin-left: 83px;\
    }\
    .loginReq {\
        margin-left: 110px;\
    }\
    .footer {\
        background: white;\
    }\
}\
`}
                                    {`\
                                            .btn:hover, .btn-danger:hover {\
                                                color: white;\
                                                background-color: red;\
                                           }\
                                        `}
                                        {`\
                                            .btn, .btn-danger {\
                                                color: red;\
                                                background-color: white;\
                                                border: 1px solid red;\
                                           }\
                                        `}
                                        {`\
                                            .btn-warning {\
                                                color: #021144;\
                                                background-color: #FFB400;\
                                                font-family: Felix Titling;\
                                                font-weight: bold;\
                                                font-size: 15px;\
                                                border: none;\
                                                margin-left: -120px;\
                                                margin-bottom: -45px;\
                                           }\
                                        `}
                                        {`\
                                            .btn-warning:hover {\
                                                color: #FFB400;\
                                                background-color: #021144;\
                                           }\
                                        `}
                                        {`\
                                            .addedWishlist {\
                                                font-size: 16px;\
                                           }\
                                        `}
                                    </style>
                                    {
                                    bakhtartProds.map((itemp => (
                                        bakhtartCats.map((itemc => (
                                            getCatName.startsWith(itemp.productCategory) &&
                            itemc.categoryPath === itemp.productCategory &&
                            productId === itemp._id && itemp.productQuantity > 0 ? 
                            <>
                            {
                              nb_wsh === 0 && userrData.userr ?
                              <>
                              <div align = "center" style={{marginRight: '55px'}}>
                                    <button className = "btn btn-danger" onClick = {addWishProd}
                                    style={{fontFamily: 'Felix Titling', fontWeight: 'bold'}}>
                                    Add To Wishlist <FaHeart/></button>
                                    </div>
                              </> : <></>
                            }<br/>
                            {
                              prodRates.map((itemr => (
                                userrData.userr &&
                                userrData.userr.id === itemr.userId &&
                                productId === itemr.productId ?
                                <>
                                
      <h6 style={{fontFamily: 'Felix Titling', fontWeight: 'bold', color: '#021144'}}>
        Your Rate: {itemr.rateValue} out of 5
        </h6> <Rating
        className="rating"
        name="hover-feedback"
        value={itemr.rateValue}
        precision={0.5}
        disabled={true}
        style={{fontSize: '35px'}}
      />
                                </> : <></>
                              )))
                            }
                            <br/>
                            {
                              nb_rate === 0 && userrData.userr ?
                              <>
                              <div className = {classes.root} style={{marginLeft: '65px'}}>
                            <Rating
        className="rating"
        name="hover-feedback"
        value={value}
        precision={0.5}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        onChangeActive={(event, newHover) => {
          setRateValue(newHover);
        }}
        style={{fontSize: '35px'}}
      />
      {
        value > 0 && userrData.userr ?
        <>
        <button className="btn btn-warning"
      onClick={addProductRate}>Rate</button>
        </> : <></>
      }
      
      </div>
      
      
                              </> : <></>
                            }<br/><br/>
                            {
                              nb_val > 0 && nb_pr > 0 && userrData.userr ?
                              <>
                              <h6 style={{fontFamily: 'Felix Titling', fontWeight: 'bold', color: '#021144'}}>
        Average Rating: {nb_val / nb_pr} out of 5
        </h6> <Rating
        name="hover-feedback"
        value={nb_val / nb_pr}
        precision={0.5}
        disabled={true}
        style={{fontSize: '35px'}}
      />
                              </> : nb_val === 0 && nb_pr === 0 && userrData.userr ? <>
                              <h6 style={{fontFamily: 'Felix Titling', fontWeight: 'bold', color: '#021144'}}>
        Average Rating: Not Rated Yet
        </h6>
                              </> : <></>
                            }
                            
                            
                            
                            
                            </> : <></> 
                            ))))))}
                            <br/><br/>
                            {
                              nb_wsh > 0 ?
                              <>
                              <div align = "center">
                                
                              <span style={{color: 'red', fontWeight: 'bold',
                            fontFamily: 'Felix Titling'}} className = "addedWishlist"><FaHeart/>
                            <u><i>Added To Wishlist</i></u> <FaHeart/></span>
                            </div></> : <></>
                            }
                                    
                            </div>

                            <div className="col-sm-6 prodDetails">
                                <div className="product-inner">
                                <h2 className="product-name" style={{fontFamily: 'Felix Titling'}}>
                                {
                    bakhtartProds.map((itemp => (
                        bakhtartCats.map((itemc => (
                            getCatName.startsWith(itemp.productCategory) &&
                            itemc.categoryPath === itemp.productCategory &&
                            productId === itemp._id ?
                        <>
                        {itemp.productName}
                        </> : <></>
                        )))
                    )))
                }
                                </h2>
                                    <div className="product-inner-price">
                                    {
                    bakhtartProds.map((itemp => (
                        bakhtartCats.map((itemc => (
                            getCatName.startsWith(itemp.productCategory) &&
                            itemc.categoryPath === itemp.productCategory &&
                            productId === itemp._id ?
                        <>
                        {
                          nb_qt > 0 ?
                          <>
                          <h4 style={{fontFamily: 'Felix Titling',
                    color: '#5a88ca'}}><strong>{itemp.productPrice} TND</strong></h4>
                          </> : <>
                          
                          </>
                        }
                        
                        </> : <></>
                        )))
                    )))
                }
                                            {
                    bakhtartProds.map((itemp => (
                        bakhtartCats.map((itemc => (
                            getCatName.startsWith(itemp.productCategory) &&
                            itemc.categoryPath === itemp.productCategory &&
                            productId === itemp._id ?
                        <>
                        {
                            itemp.productQuantity > 0 ?
                            <>
                                <ins style={{fontFamily: 'Felix Titling',
                    color: 'red'}}><strong>{itemp.productQuantity} Remaining</strong></ins>
                            </> : <><ins style={{fontFamily: 'Felix Titling',
                    color: 'red'}}><strong>Out of Stock</strong></ins></>
                        }
                        
                        </> : <></>
                        )))
                    )))
                }
                                    </div>
                                    
                                    <style>
                                    {`\
                                        .product-tab a {\
                                            background-color: #021144;\
                                            color: #D3BE06;\
                                        }\
                                    `}
                                    {`\
                                        .product-tab a:hover {\
                                            background-color: #D3BE06;\
                                            color: #021144;\
                                        }\
                                    `}
                                    </style>
                                    <div role="tabpanel">
                                    <ul className="product-tab" role="tablist">
                                            <li role="presentation" className="active">
                                                <a href="" aria-controls="home"
                                                style={{pointerEvents: 'none'}}
                                                role="tab" data-toggle="tab">
                                                    <span style={{fontFamily: 'Felix Titling'}}>
                                                        <b>Details</b>
                                                    </span>
                                                    </a></li>
                                            
                                        </ul>
                                        <div className="tab-content">
                                        <div role="tabpanel" className="tab-pane fade in active" id="home">
                                        {
                    bakhtartProds.map((itemp => (
                        bakhtartCats.map((itemc => (
                            getCatName.startsWith(itemp.productCategory) &&
                            itemc.categoryPath === itemp.productCategory &&
                            productId === itemp._id ?
                        <>
                        <p style={{color: '#021144',
                    fontFamily: 'Felix Titling'}}>{itemp.productDescription}</p>
                    {
                        itemp.productCategory !== 'napkins' && itemp.productCategory !== 'cushions' ?
                        <>
                        <p style={{color: '#021144',
                    fontFamily: 'Felix Titling'}}>Size: {itemp.productSize}</p>
                    <p style={{color: '#021144',
                    fontFamily: 'Felix Titling'}}>Color: 
                    <div className = "col-md-12" 
                    style={{backgroundColor: `${itemp.productColor}`, userSelect: 'none', 
                    KhtmlUserSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none',
                    msUserSelect: 'none',
                    border: '1px solid #021144',
                    color: `${itemp.productColor}`}}>
                        <a href = "" style={{pointerEvents: 'none', color: `${itemp.productColor}`}}>{itemp.productColor}</a>
                    </div></p>
                        </> : <></>
                    }
                    <br/>
                    {
                      nb_qt > 0 ?
                      <>
                      <h4 style={{color: '#021144',
                    fontFamily: 'Felix Titling'}}>
                        <FaTruckMoving/> Home Delivery</h4> 
                        <h4 style={{color: '#021144',
                    fontFamily: 'Felix Titling'}}>
                        <FaShippingFast/></h4><h5 style={{color: '#021144',
                    fontFamily: 'Felix Titling'}}>Shipping Cost: 7 TND</h5><br/>
                        <h5 style={{color: '#021144',
                    fontFamily: 'Felix Titling'}}><FaShare/> Share This Article</h5>
                        <ShareSocial url = {`https://bakht-art.com/products/${itemc.categoryPath}/${productId}`}
                        socialTypes={['facebook','twitter']}
                        style={socialMediaStyle}
                        />
                      </> : <></>
                    }
                        
                        </> : <></>
                        )))
                    )))
                }
                                                
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* next */}
                        <style>
                        {`\
                           .related-products-wrapper {\
                                margin-top: 30px;\
                             }\
                        `}
                        {`\
                           .related-products-title {\
                            color: #021144;\
                            font-size: 25px;\
                            font-family: Felix Titling;\
                            margin-bottom: 30px;\
                            text-transform: uppercase;\
                             }\
                        `}
                        {`\
                           .product-f-image {\
                            position: relative;\
                             }\
                        `}
                        {`\
                           .product-f-image .product-hover {\
                            height: 90%;\
                            left: 0%;\
                            position: absolute;\
                            top: 0px;\
                            width: 90%;\
                            overflow: hidden;\
                            border: 1px solid #ddd;\
                             }\
                        `}
                        {`\
        .product-f-image .product-hover:after {\
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
        .product-f-image .product-hover button {\
          background: none repeat scroll 0 0 #070C29;\
    border-radius: 5px;\
    color: #D3BE06;\
    display: block;\
    font-size: 16px;\
    left: 0%;\
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
        .product-f-image .product-hover button:hover {\
          background: #D3BE06;\
  text-decoration: none;\
  border-color: #D3BE06;\
  color: #070C29;\
        }\
      `}

                        </style>

                        

                        <div className="related-products-wrapper">
                        <h2 className="related-products-title">Other {
                    bakhtartProds.map((itemp => (
                        bakhtartCats.map((itemc => (
                            getCatName.startsWith(itemp.productCategory) &&
                            itemc.categoryPath === itemp.productCategory &&
                            productId === itemp._id ?
                        <>
                        {itemc.categoryName}
                        </> : <></>
                        )))
                    )))
                }
                        </h2>
                             
                        </div>
                        
                        {
                    currentTableData.map((itemp => (
                        bakhtartCats.map((itemc => (
                            getCatName.startsWith(itemp.productCategory) &&
                            itemc.categoryPath === itemp.productCategory &&
                            productId !== itemp._id ?
                        <>
                        <div className="col-md-4" key = {itemp._id}>
                    <div className="single-shop-product">
                        <div className="product-upper">
                        <div className="single-product">
                        <img src={`${itemp.productImage}`} alt="If the image is not loaded,  
                        refresh the page!
                            Otherwise, it will appear in a few seconds."
                        name="Open product image in new tab"/>
                        <div className="product-hover">
                        <button className="add-to-cart-link" onClick = {() => addSeenProd(itemp._id, itemp.productCategory)}
                                            style={{fontFamily: 'Felix Titling'}}>
                                              <FaInfo/>
                                              See Details</button>
                                        </div>
                        </div></div>
                        <div align = "center">
                          {
                            itemp.productQuantity > 0 ?
                            <>
                            <h2>
                          <a href="" style={{fontFamily: 'Felix Titling'}}>
                          {itemp.productName}
                            </a></h2>
                            </> : <>
                            <h2>
                          <a href="" style={{fontFamily: 'Felix Titling'}}>
                          <strike>{itemp.productName}</strike>
                            </a></h2>
                            </>
                          }
                        </div>
                        <div className="product-carousel-price" align = "center">
                          {
                            itemp.productQuantity > 0 ?
                            <>
                            <ins style={{fontFamily: 'Felix Titling'}}>{itemp.productPrice} TND</ins>
                            </> : <>
                            <ins style={{fontFamily: 'Felix Titling'}}><strike>{itemp.productPrice} TND</strike></ins>
                            </>
                          }
                        
                        </div>
                        <div style={{color: 'red'}} align = "center">
                            <ins style={{textDecoration: 'none', fontFamily: 'Felix Titling'}}>
                              {
                                itemp.productQuantity > 0 ?
                                <>
                                <b>{itemp.productQuantity} remaining</b>
                                </> : <>
                                <b>Out of Stock</b>
                                </>
                              }
                                </ins>
                        </div>                 
                    </div>
                </div>
                        </> : <></>
                        )))
                    )))
                }
                        
                    </div>
                    
                </div>
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

<section id="contactus" className="section">
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

