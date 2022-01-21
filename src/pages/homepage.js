import React, { useContext, useEffect, useState } from 'react';
import {FaHome, FaInfo, FaBox, FaList, FaPhone, FaInstagram, FaWhatsapp, 
  FaFacebookF, FaGlobe, FaHeadset, FaSignInAlt, FaUser, FaTruckMoving} from 'react-icons/fa';
import ScrollUpButton from "react-scroll-up-button";
import { Link } from 'react-scroll';
import { useHistory } from 'react-router-dom';
import { toast } from 'toast-notification-alert';
import UserContext from "../context/UserContext";
import emailjs from "emailjs-com";
import { useSpeechSynthesis } from 'react-speech-kit';
import Axios from 'axios';
import { GiHamburgerMenu } from "react-icons/gi";
import { Menu } from "../components/Menu";
import { ReactDimmer } from "react-dimmer";

export default function Homepage() {

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

    const { userrData, setUserrData } = useContext(UserContext);

    const [navbar, setNavbar] = useState(false)

    let [bakhtartCats, setBakhtartCats] = useState([]);
    let [prodCarts, setProdCarts] = useState([]);
    let [nb_pc]= useState(0);

    useEffect(async() => {
      const result_pc = 
      await Axios.get('https://bakhtart-backend.herokuapp.com/fashion/countprodcart');
      setProdCarts(result_pc.data);
    },[]);

    const changeBackground = () => {
      if (window.scrollY >= 66) {
        setNavbar(true)
      } else {
        setNavbar(false)
      }
    }

    useEffect(() => {
      changeBackground()
      window.addEventListener("scroll", changeBackground)
    })

    prodCarts.map((itempc,index)=>{
      userrData.userr && userrData.userr.id === itempc.userId ? nb_pc = nb_pc + 1 : nb_pc = nb_pc + 0
    });

    useEffect(async() => {
        const result_bakhtcats = await Axios.get('https://bakhtart-backend.herokuapp.com/fashion/allBakhtCatsAdmin');
        setBakhtartCats(result_bakhtcats.data);
      },[]);

    const history = useHistory();

    const register = () => {
        history.push("/register");
        window.location.reload();
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
            <title>Bakht'Art - Home</title>
            <link rel="stylesheet" href="../assets/css/bootstrap.min.css"/>
<link rel="stylesheet" href="../assets/css/flexslider.css"/>
<link rel="stylesheet" href="../assets/css/jquery.fancybox.css"/>
<link rel="stylesheet" href="../assets/css/main.css"/>
<link rel="stylesheet" href="../assets/css/responsive.css"/>
<link rel="stylesheet" href="../assets/css/font-icon.css"/>
<link rel="stylesheet" href="../assets/css/animate.min.css"/>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"></link>
          </head>
            <div>

<section className="banner" id="home" role="banner">
  <header id="header">
    <div className="header-content clearfix">
        <a href = "/">
        <img className="logo" src="../assets/images/logoBakhtSiren.png"/>
        </a>
        
      <nav className="navigation" role="navigation">
        <ul className="primary-nav" style={{paddingRight: '290px'}}>
          <li>

            <Link
        to="home"
        activeClass="active"
        spy={true} 
        smooth={true}
        style={{color: '#D1B23E', fontFamily: 'Felix Titling'}}
    >
        <FaHome/> Home
    </Link>

          </li>
          <li>
          <Link
        to="section-profile"
        activeClass="active"
        spy={true} 
        smooth={true}
        style={{color: '#D1B23E', fontFamily: 'Felix Titling'}}
    >
            <FaInfo/> About Us </Link>
          </li>
          <li><Link
        to="products"
        activeClass="active"
        spy={true} 
        smooth={true}
        style={{color: '#D1B23E', fontFamily: 'Felix Titling'}}
    >
            <FaBox /> Products</Link></li>
          <li>
          <Link
        to="catalogue"
        activeClass="active"
        spy={true} 
        smooth={true}
        style={{color: '#D1B23E', fontFamily: 'Felix Titling'}}
    ><FaList/> Catalogue</Link></li>
          <li>
          <Link
        to="contactus"
        activeClass="active"
        spy={true} 
        smooth={true}
        style={{color: '#D1B23E', fontFamily: 'Felix Titling'}}
    ><FaPhone/> Contact Us</Link></li>
        </ul>
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
    .navigation span {\
        display: inline;\
    }\
    iframe {\
        display: none;\
    }\
    #header {\
        height: 13%;\
        background: rgb(2, 17, 68, 0.5);\
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
        margin-top: -5px;\
    }\
    .footer {\
        background: white;\
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
       #header .logoutB {\
	float: right;\
	font-size:15px;\
	color: #000;\
	text-decoration:none;\
	text-transform:uppercase;\
	letter-spacing: 2px;\
	/* background: #ffffff; */
	position: absolute;\
	top: 35px;\
	bottom: 45px;\
	right: 0px;\
	text-align: center;\
	padding: 6px 15px;\
	vertical-align: bottom;\
  font-weight: bold;\
}\
      `}
      {`\
       #header .loginB {\
	float: right;\
	font-size: 15px;\
	color: #000;\
	text-decoration:none;\
	text-transform:uppercase;\
	letter-spacing: 2px;\
	position: absolute;\
	top: 26px;\
  margin-top: 8px;\
	bottom: 50px;\
  margin-bottom: -7px;\
	right: 0px;\
	text-align: center;\
	padding: 6px 15px;\
	vertical-align: bottom;\
  font-weight: bold;\
}\
      `}
        </style>
        <style>
          {`\
        .shopping-item {\
    float: right;\
    font-size: 18px;\
    margin-top: -33px;\
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
      {
        navbar ?
        <>
        {`\
      #header {\
        background-color: #020d31;\
        position: fixed;\
        width: 100%;\
        height: 15%;\
        z-index: 999;\
      }\
      `}
        </> : <>
        {`\
      #header {\
        position: fixed;\
        width: 100%;\
        height: 15%;\
        z-index: 999;\
        background: rgb(2, 17, 68, 0.5);\
      }\
      `}
        </>
      }
      
      
          </style>
        {
          userrData.userr ?
          <>
          
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
    margin-top: -35px;\
    margin-right: 120px;\
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
              <a href="/account" className="account" 
              style={{color: '#D1B23E', fontFamily: 'Felix Titling'}}><FaUser/> Account</a>
            <button className="logoutB"
            onClick={logout} style={{fontWeight: 'bold', color: '#D1B23E', backgroundColor: 'transparent', fontFamily: 'Felix Titling'}}>
                Logout
            </button>
            </span> :
        <button className="loginB"
        onClick = {login} 
        style={{color: '#D1B23E', backgroundColor: 'transparent', fontFamily: 'Felix Titling'}}>
          <FaSignInAlt/> Login
        </button>
        }
      </nav>
      {/*<a href="#" className="nav-toggle">Menu<span>llllllll</span></a>*/}
        <GiHamburgerMenu className="nav-toggle" onClick={handleMenu}/>
        <Menu isMenuOpen={isMenuOpen} />
        <ReactDimmer
        isOpen={isMenuOpen}
        exitDimmer={setMenu}
        zIndex={100}
        blur={1.5}
      />
    </div>
  </header>
  <div className="container">
    <div className="col-md-6 col-sm-12">
      <div className="banner-text text-center">
      <h4 style={{color: '#070C29', fontFamily: 'Felix Titling', fontWeight: 'bold'}}>Luxury must be comfortable <br/>otherwise
        it is not luxury.</h4>
        <h1 style={{color: '#070C29', fontFamily: 'Felix Titling'}}><span style = {{color: '#070C29'}}>Whims of Princesses</span> <span className="icon icon-heart" style = {{color: '#070C29'}}></span></h1>

        {
            !userrData.userr ?
        <button onClick = {register} style={{backgroundColor: '#070C29', color: '#D1B23E', border: 'none',
      fontSize: '20px', borderRadius: '5px', fontFamily: 'Felix Titling'}}>
        Join Bakht'Art
        </button> : <></>
        }
      <br/></div>
    </div>
  </div>
</section>
<section id="section-profile" className="section-padding">
		<div className="profile-bg visible-md visible-lg"></div>
		<div className="container">
			<div className="row">
				<div className="col-md-7 col-sm-12 pull-right">
					<div className="profile-desc wow fadeInRight animated" styles={{visibility: 'visible', animationName: 'fadeInRight'}}>
						 <h2 className="section-title uppercase" style={{fontFamily: 'Felix Titling', color: '#070C29'}}>About Us</h2>
<br/>
      <p>
          Bakht'Art is founded in 2016, it is a Brand of Fashion making and selling luxuarious products
          that are related to fashion, wedding, summer...
      </p>
 <br/>


      <p className="text-grey animated bounceInUp" styles={{opacity: 1}}>
          Products are Bathing Capes, Jebbas, Caftans, Beach Dresses, Dresses, Napkins & Cushions.
      </p>
<br/>
      <p className="text-grey animated bounceInUp" styles={{opacity: 1}}>
          Founded by Wissal Labbane
      </p>
<br/>
      <p className="text-grey animated bounceInUp" styles={{opacity: 1}}>
          Current products and old products are in <a href = "#catalogue" style={{color: '#021144'}}>catalogue</a> section
      </p>
					</div>
				</div>
			</div>
		</div>
	</section>
<section id="products" className="gallery section">
  <div className="container">
    <div className="section-header">
                <h2 className="wow fadeInDown animated" 
                style = {{fontFamily: 'Felix Titling', color: '#070C29'}}>Products</h2>
            </div>
    <div className="row no-gutter">
      {
        bakhtartCats.map((itemcat, indexcat) => (
          <div className="col-lg-3 col-md-6 col-sm-6 work"> 
      <a href={`/products/${itemcat.categoryPath}`} className="work-box">
      <img src={`${itemcat.categoryImg}`} alt="If the image is not loaded, refresh the page!
      Otherwise, it will appear in a few seconds. This is Firebase issues!"/>
        <div className="overlay">
          <div className="overlay-caption">
          <p><span style={{fontFamily: 'Felix Titling', fontSize: '25px'}}>{itemcat.categoryName}</span></p>
          </div>
        </div>
        </a> </div>
        ))
      }
      
    </div>
  </div>
</section>
<section id="catalogue" className="packageList">
  <div className="container">
      <div className="section-header">
                <h2 className="wow fadeInDown animated" style={{fontFamily:'Felix Titling', color: '#070C29'}}>Catalogue</h2>
                <p className="wow fadeInDown animated" style={{fontFamily: 'Felix Titling'}}>Current and old products</p>
            </div>
    <div className="row">
            <div className="col-md-6">
            	<div className="package wow fadeInLeft animated" data-wow-offset="250" data-wow-delay="200ms">
                	<h5 style={{fontFamily: 'Felix Titling'}}>Catalogue 1</h5>
                    <ul className="list-default">
                    	<li></li>
                    	<li style={{fontFamily: 'Felix Titling'}}>Products in sale</li>
                    	<li></li>
                    </ul>
                    <a href = "/products/in-sale/all">
                    <strong className="price" style={{fontFamily: 'Felix Titling'}}>Consult</strong></a>
                </div>
                </div>
                <div className="col-md-6">
                <div className="package wow fadeInLeft animated" data-wow-offset="200" data-wow-delay="300m">
                	<h5 style={{fontFamily: 'Felix Titling'}}>Catalogue 2</h5>
                    <ul className="list-default">
                    	<li></li>
                    	<li style={{fontFamily: 'Felix Titling'}}>Products out of stock | Archive</li>
                    	<li></li>
                    </ul>
                    <a href = "/products/out-of-stock/all">
                      <strong className="price" style={{fontFamily: 'Felix Titling'}}>Consult</strong></a>
                </div>
                </div>


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
          <FaGlobe/> International Delivery &nbsp;&nbsp;<FaHeadset/>&nbsp;Customer Support &nbsp;&nbsp;<FaTruckMoving/>&nbsp;Home Delivery
    		</address>
			  © Copyright 2016 - 2021 bakhtart.herokuapp.com | Made with <img src="../assets/images/heartbeat.gif" style={{width: '20px'}}/> by <strong>Sofien Ressaissi</strong>.
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
<script src="../assets/js/bootstrap.min.js"></script> 
<script src="../assets/js/jquery.flexslider-min.js"></script> 
<script src="../assets/js/jquery.fancybox.pack.js"></script> 
<script src="../assets/js/retina.min.js"></script> 
<script src="../assets/js/modernizr.js"></script> 
<script src="../assets/js/main.js"></script> 
<script type="text/javascript" src="../assets/js/jquery.contact.js"></script> 
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
