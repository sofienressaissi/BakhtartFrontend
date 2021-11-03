import React, { useContext, useEffect, useState, useMemo } from 'react';
import {FaInfo, FaInstagram, FaWhatsapp, 
  FaFacebookF, FaGlobe, FaHeadset, FaCcMastercard, FaSignInAlt, FaUser} from 'react-icons/fa';
import ScrollUpButton from "react-scroll-up-button";
import { useHistory } from 'react-router-dom';
import { toast } from 'toast-notification-alert';
import UserContext from "../context/UserContext";
import Pagination from '../pagination/pagination';
import { useSpeechSynthesis } from 'react-speech-kit';
import Axios from 'axios';

let PageSize = 8;

export default function ProdsSingleCategory() {

  const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [subject, setSubject] = useState();
    const [content, setContent] = useState();

  let { speak } = useSpeechSynthesis();

  const [currentPage, setCurrentPage] = useState(1);

    let fullUrl = window.location.href;
    let getCatName = fullUrl.split("/products/").pop();

    const { userrData, setUserrData } = useContext(UserContext);

    let [bakhtartCats, setBakhtartCats] = useState([]);
    let [bakhtartProds, setBakhtartProds] = useState([]);
    let [prodCarts, setProdCarts] = useState([]);
    let [nb_pc]= useState(0);
    let [nb_cat] = useState(0);
    let [nb_howmany] = useState(0);
    const [searchitem, setSearchitem] = useState('');

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

      
        bakhtartProds.map((itemp, index) => {
          itemp.productCategory === getCatName ?
          nb_cat = nb_cat + 1 : <></>
        })

        bakhtartProds.map((itemp, index) => {
          nb_howmany = nb_howmany + 1 
        })

      const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return bakhtartProds.slice(firstPageIndex, lastPageIndex);
      }, [currentPage, bakhtartProds]);

    useEffect(async() => {
        const result_bakhtcats = await Axios.get('https://bakhtart-backend.herokuapp.com/fashion/allBakhtCatsAdmin');
        setBakhtartCats(result_bakhtcats.data);
      },[]);

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

    return (
      <>
      {
        (userrData.userr && userrData.userr.roleBakht === 'user') || (!userrData.userr) ?
        <>
        <html>
          <head>
            <title>Bakht'Art - {
              bakhtartCats.map((itemc => (
                itemc.categoryPath === getCatName ?
                <>{itemc.categoryName}</> : <></>
              )))
              } {
                getCatName === 'all' ?
                <>All Products</> : <></>
                }</title>
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
    margin-right: 122px;\
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

      <a href="#" className="nav-toggle">Menu<span></span></a> </div>
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
      {`\
        div .searchInput {\
          font-size: 17px;\
          border-radius: 5px;\
          font-family: Felix Titling;\
          margin-left: 70px;\
        }\
      `}
    </style>
    
    <div className="Categories">
                <div className="containerCats">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="titleCat">
                                <h2 className="wow fadeInDown animated" 
                                style={{fontFamily: 'Felix Titling', color: '#070C29'}}>Categories</h2>
                                <ul className="categiri">
                                          {
                                            getCatName === 'all' ?
                                            <>
                                              <li className = "active">
                                              <a href = "/products/all"
                                              style={{color: '#D3BE06', fontFamily: 'Felix Titling'}}>
                                                All
                                              </a>
                                            </li>
                                            </> : <>
                                            <li>
                                              <a href = "/products/all" 
                                              style={{fontFamily: 'Felix Titling'}}>
                                                All
                                              </a>
                                            </li>
                                            </>
                                          }
                                            

                                   {
                                       bakhtartCats.map((itemc => (
                                           itemc.categoryPath === getCatName ?
                                           <>
                                            <li className="active">
                                                <a href={`/products/${itemc.categoryPath}`}
                                                style={{color: '#D3BE06', fontFamily: 'Felix Titling'}}>
                                            {itemc.categoryName}
                                            </a></li>
                                           </> : <>
                                           <li>
                                           <a href={`/products/${itemc.categoryPath}`}
                                           style={{fontFamily: 'Felix Titling'}}>
                                       {itemc.categoryName}
                                       </a></li>
                                           </>
                                       )))
                                   }
                                </ul><br/><br/>
                                <div align = "left" className = "col-md-10">
                                  
    {
                getCatName === 'all' && nb_howmany > 0 ?
                <>
                <input type="text" className = "searchInput"
                       style={{marginRight: '250px;'}}
                        placeholder="Search Product"
                   onChange={(e)=>setSearchitem(e.target.value)}/>
                </> : <></>
              }
    </div>
    <div align = "left" className = "col-md-10">
    {
                getCatName !== 'all' && nb_cat > 0 ?
                <>
                <input type="text" className = "searchInput"
                       style={{marginRight: '250px;'}}
                        placeholder="Search Product"
                   onChange={(e)=>setSearchitem(e.target.value)}/>
                </> : <></>
              }
    </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    </div>
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
    padding: 6px 25px;display: inline-block;\
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
            width: 211px;\
            height: 220px;\
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
          left: 5%;\
          position: absolute;\
          top: 0;\
          width: 90%;\
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
          top: -34%;\
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
        {
                nb_cat === 0 && getCatName !== 'all' ?
                <div align = "center">
                <h4 style={{fontFamily: 'Felix Titling', fontWeight: 'bold',
                color: '#021144'}}>This Category doesn't have products.</h4>
                </div> : <></>
              }
              {
                nb_howmany === 0 && getCatName === 'all' ?
                <div align = "center">
                <h4 style={{fontFamily: 'Felix Titling', fontWeight: 'bold',
                color: '#021144'}}>There are no products.</h4>
                </div> : <></>
              }
            <div className="row">
              
            {
                    currentTableData.filter((item=>{
                      if (searchitem === "") {
                          return item
                      }else if(item.productName.toLowerCase().includes(searchitem.toLowerCase())
                              ||item.productDescription.toLowerCase().includes(searchitem.toLowerCase())
                              ||item.productPath.toLowerCase().includes(searchitem.toLowerCase())){
                          return item
                      }
                  })).map((itemp => (
                        getCatName === 'all' ?
                        <>
                        <div className="col-md-3 col-sm-6" key = {itemp._id}>
                    <div className="single-shop-product">
                        <div className="product-upper">
                        <div className="single-product" align = "center">
                            <img src={`${itemp.productImage}`} 
                            alt="If the image is not loaded,  
                            refresh the page!
                                Otherwise, it will appear in a few seconds. This is Firebase issues!"
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
                          {
                            itemp.productQuantity === 0 ?
                            <>
                            <h2>
                          
                          <a href="" style={{fontFamily: 'Felix Titling'}}>
                            <strike>{itemp.productName}</strike>
                            </a></h2>
                            </> : <>
                            <h2>
                          
                          <a href="" style={{fontFamily: 'Felix Titling'}}>
                            {itemp.productName}
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
                          {
                            itemp.productQuantity > 0 ?
                            <>
                            <ins style={{textDecoration: 'none', fontFamily: 'Felix Titling'}}>
                              <b>{itemp.productQuantity} remaining</b>
                            </ins>
                            </> : <>
                            <ins style={{textDecoration: 'none', fontFamily: 'Felix Titling'}}>
                              <b>Out of Stock</b>
                            </ins>
                            </>
                          }
                            
                        </div>                 
                    </div>
                </div>
                        </> : <></>
                    )))
                }
                {
                    currentTableData.filter((item=>{
                      if (searchitem === "") {
                          return item
                      }else if(item.productName.toLowerCase().includes(searchitem.toLowerCase())
                              ||item.productDescription.toLowerCase().includes(searchitem.toLowerCase())
                              ||item.productPath.toLowerCase().includes(searchitem.toLowerCase())){
                          return item
                      }
                  })).map((itemp => (
                        itemp.productCategory === getCatName ?
                        <>
                        <div className="col-md-3 col-sm-6" key = {itemp._id}>
                    <div className="single-shop-product">
                        <div className="product-upper">
                        <div className="single-product" align = "center">
                            <img src={`${itemp.productImage}`} 
                            alt="If the image is not loaded,  
                            refresh the page!
                                Otherwise, it will appear in a few seconds. This is Firebase issues!"
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
                          {
                            itemp.productQuantity > 0 ?
                            <>
                            <ins style={{textDecoration: 'none', fontFamily: 'Felix Titling'}}>
                              <b>{itemp.productQuantity} remaining</b>
                            </ins>
                            </> : <>
                            <ins style={{textDecoration: 'none', fontFamily: 'Felix Titling'}}>
                              <b>Out of Stock</b>
                            </ins>
                            </>
                          }
                            
                        </div>                 
                    </div>
                </div>
                        </> : <></>
                    )))
                }
            </div>
            
            <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={bakhtartProds.length}
        pageSize={PageSize}
        onPageChange={page => setCurrentPage(page)}
      />
        </div>
    </div>
  
</section>


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
              <a href = "#home" style={{color: "#D1B23E"}}>
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
          <FaGlobe/> International Delivery &nbsp;&nbsp;<FaHeadset/>&nbsp;Customer Support &nbsp;&nbsp;<FaCcMastercard/>&nbsp;Secure Paiement
    		</address>
			  © Copyright 2016 - 2021 BakhtArt.com | Made with <img src="../../../assets/images/heartbeat.gif" style={{width: '20px'}}/> by <strong>Quad Squad</strong>.
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
    )
}

