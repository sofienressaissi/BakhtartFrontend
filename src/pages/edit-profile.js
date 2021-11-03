import React, {useContext, useState} from 'react';
import '../account.css';
import Axios from "axios";
import {FaInstagram, FaWhatsapp, 
    FaFacebookF, FaGlobe, FaHeadset, FaSignInAlt, FaUser, FaTruckMoving} from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import { toast } from 'toast-notification-alert';
import ScrollUpButton from "react-scroll-up-button";
import { useSpeechSynthesis } from 'react-speech-kit';
import UserContext from "../context/UserContext";

export default function EditProfile() {

    let { speak } = useSpeechSynthesis();

    const { userrData, setUserrData } = useContext(UserContext);
    const [email, setEmail] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [username, setUsername] = useState();
    const [subject, setSubject] = useState();
    const [content, setContent] = useState();
    const [url, setUrl] = useState("");
    const [imageProfile, setImageProfile] = useState("");
    const [image, setImage] = useState("");
    const [gender, setGender] = useState();
    const [region, setRegion] = useState();
    const [ville, setVille] = useState();
    const [firstAddress, setFirstAddress] = useState();
    const [secondAddress, setSecondAddress] = useState();

    const history = useHistory();

    const editImage = async() => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "h2uuuh2d");
        data.append("cloud_name", "dl0o9l8xz");
        fetch("https://api.cloudinary.com/v1_1/dl0o9l8xz/image/upload",{
            method: 'post',
            body: data
        }).then(resp => resp.json())
        .then(data => {
            setUrl(data.url);
            setImageProfile(data.url);
            const imageToUpdate = {
                imageProfile: data.url
            };
            Axios.put(
                `https://bakhtart-backend.herokuapp.com/fashion/fashion-profile/${userrData.userr.id}`,
                imageToUpdate
            );
            toast.show({title: 'Profile Image Updated Successfully!',
            position: 'topright', type: 'info'});
            setTimeout(function(){
                history.push("/account/edit");
                window.location.reload(1);
             }, 1500);
        }).catch (err => toast.show({title: err,
        position: 'topright', type: 'alert'}));
    }

    const editProfile = async(e) => {
        try {
            e.preventDefault();
            const userrr = {
                firstName,
                lastName,
                username,
                phoneNumber,
                gender,
                region,
                ville,
                firstAddress,
                secondAddress
            };

            await Axios.put(
                `https://bakhtart-backend.herokuapp.com/fashion/update-fashion/${userrData.userr.id}`,
                userrr
            );
            if (!firstName && !lastName && !username && !email && !phoneNumber
                && !gender && !region && !ville && !firstAddress && !secondAddress) {
                    toast.show({title: 'No changes have been made!',
            position: 'topright', type: 'warn'});
            return 0;
                }
                if (email && (!firstName || !lastName || !username || !phoneNumber || !gender
                    || !region || !ville || !firstAddress || !secondAddress)) {
                    try {
                        await Axios.get(
                            `https://bakhtart-backend.herokuapp.com/adminbakht/verify-email?email=${email}`
                        );
                        const userEmail = {
                            email
                        }
                        await Axios.put(
                            `https://bakhtart-backend.herokuapp.com/fashion/update-fashion/${userrData.userr.id}`,
                            userEmail
                        );
                        toast.show({title: 'Account Updated Successfully!',
            position: 'topright', type: 'info'});
            setTimeout(function(){
                history.push('/account');
                window.location.reload(1);
             }, 1500);
                    } catch (err) {
                        toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
                        return 0;
                    }
                }
                if (!email && (firstName || lastName || username || phoneNumber
                    || gender || region || ville || firstAddress || secondAddress)) {
                        toast.show({title: 'Account Updated Successfully!',
            position: 'topright', type: 'info'});
            console.log(userrData.userr.id);
            setTimeout(function(){
                history.push('/account');
                window.location.reload(1);
             }, 1500);
                    }
        } catch (err) {
            toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
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
    const deactivate = async() => {
        try {
            const token = localStorage.getItem("auth-token");
            if (window.confirm("Are you sure you would like to deactivate your account ?")) {
                await Axios.put(
                    `https://bakhtart-backend.herokuapp.com/fashion/deactivate/${userrData.userr.id}`,
                    userrData.userr, {headers: {"x-auth-token": token}}
                );
                toast.show({title: 'Account Deactivated!',
            position: 'topright', type: 'warn'});
            setTimeout(function(){
                localStorage.setItem("auth-token", "");
                history.push("/");
                window.location.reload();
             }, 1500);
                setUserrData({
                    token: undefined,
                    userr: undefined
                });
            }

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
            <title>Bakht'Art - Edit Account</title>
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
            <img className="logo" src={`https://bakhtart.herokuapp.com/assets/images/logoBakhtSiren.png`}/>
        </a>
        <nav className="navigation" role="navigation">
           
        </nav>
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

                        {
                        image ?
                        <>
                        <div className="file btn btn-lg" align = "center" style={{float: "left", marginLeft: "52.47px"}}>
                           <button type = "button" onClick = {editImage}
                        value = "Upload" className="btn-primary" 
                        style={{float: "right", fontFamily: 'Felix Titling',
                        marginRight:"74px"}}>Upload Image</button></div>
                        </> : <></>
                        }

                        {
                            !image ?
                            <>
                            <div className="file btn btn-lg btn-primary" style={{float: "left", marginLeft: "52.47px"}}>
                        
                        <span style={{fontFamily: 'Felix Titling'}}>Update Photo</span>
                        <input type="file" name="file" onChange = {(e) => setImage(e.target.files[0])}/>

                    </div>
                    <style>
                        {`\
        div.file:hover {\
          background-color: #337ab7;\
        }\
      `}
                    </style>
                            </> : <></>
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
                                <a className="nav-link active" id="home-tab" data-toggle="tab"
                                   href="/account" role="tab" aria-controls="home" aria-selected="true">
                                    <span style={{color: '#021144', fontFamily: 'Felix Titling',
                                       fontWeight: 'bold'}}> About Me </span>
                                </a>
                            </li>
                            <li className="nav-item">
                                    <a className="nav-link" id="profile-tab" data-toggle="tab"
                                    href="/account/change-password" role="tab" aria-controls="profile"
                                    aria-selected="false" style={{fontFamily: 'Felix Titling'}}>Change My Password</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="profile-tab" data-toggle="tab"
                                    href="/my-orders" role="tab" aria-controls="profile"
                                    aria-selected="false" style={{fontFamily: 'Felix Titling'}}>My Orders</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="profile-tab" data-toggle="tab"
                                    href="/my-wishlist" role="tab" aria-controls="profile"
                                    aria-selected="false" style={{fontFamily: 'Felix Titling'}}>My Wishlist</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="profile-tab" data-toggle="tab"
                                    href="/seen-recently" role="tab" aria-controls="profile"
                                    aria-selected="false" style={{fontFamily: 'Felix Titling'}}>Seen Recently</a>
                                </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div className="profile-work">
                    <p style={{fontFamily: 'Felix Titling'}}>ACCOUNT</p>
                            <a href="/account" style = {{color: '#021144',
                        fontFamily: 'Felix Titling'}}>About Me</a><br/>
                            {/*<a href="" style = {{color:'#212529'}}>Security</a><br/>*/}
                            <a href="/account/change-password" style = {{color:'#212529',
                        fontFamily: 'Felix Titling'}}>Change My Password</a>
                            <p style={{fontFamily: 'Felix Titling'}}>PRODUCTS</p>
                            <a href="/my-orders" style = {{color:'#212529',
                        fontFamily: 'Felix Titling'}}>My Orders</a><br/>
                            <a href="/my-wishlist" style = {{color:'#212529',
                        fontFamily: 'Felix Titling'}}>My Wishlist</a><br/>
                            <a href="/seen-recently" style = {{color:'#212529',
                        fontFamily: 'Felix Titling'}}>Seen Recently</a><br/>
                            <p></p>
                        <button style = {{backgroundColor: '#540300', color: 'white',
                            border: 'none', borderRadius: '5px', fontFamily: 'Felix Titling',
                            height: '25px', fontWeight: 'bold'}} onClick = {deactivate}>
                            Deactivate My Account
                        </button>
                    </div>
                </div>
                <div className="col-md-8">
                    <div id="myTabContent">
                        <div id="home" 
                        role="tabpanel" aria-labelledby="home-tab">
                            <form onSubmit={editProfile}>
                            <div className="row" style={{marginTop: '150px;'}}>
                                <div className="col-md-6">
                                    <label style={{fontFamily: 'Felix Titling'}}>First Name:
                                        { userrData.userr ?
                                            <h6 style={{fontFamily: 'Felix Titling'}}>{userrData.userr.firstName}</h6>:<></>
                                        }
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <p style = {{color: '#021144'}}>{
                                        userrData.userr ?
                                            <>
                                                <input type = "text" placeholder="New Value"
                                                onChange = {(e) => setFirstName(e.target.value)}/>
                                            </>
                                                :
                                            <></>
                                    }</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <label style={{fontFamily: 'Felix Titling'}}>Last Name:
                                        { userrData.userr ?
                                            <h6 style={{fontFamily: 'Felix Titling'}}>{userrData.userr.lastName}</h6>:<></>
                                        }
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <p style = {{color: '#021144'}}>
                                        {
                                            userrData.userr ?
                                                <>
                                                    <input type = "text" placeholder="New Value"
                                                           onChange = {(e) => setLastName(e.target.value)}/></> :
                                                <></>
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <label style={{fontFamily: 'Felix Titling'}}>Username:
                                        { userrData.userr ?
                                            <h6 style={{fontFamily: 'Felix Titling'}}>{userrData.userr.username}</h6>:<></>
                                        }
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <p style = {{color: '#021144'}}>{
                                        userrData.userr ?
                                            <>
                                                <input type = "text" placeholder="New Value"
                                                       onChange = {(e) => setUsername(e.target.value)}/></> :
                                            <></>
                                    }</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <label style={{fontFamily: 'Felix Titling'}}>Email:
                                        { userrData.userr ?
                                            <h6 style={{fontFamily: 'Felix Titling'}}>{userrData.userr.email}</h6>:<></>
                                        }
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <p style = {{color: '#021144'}}>{
                                        userrData.userr ?
                                            <>
                                                <input type = "email" placeholder="New Value"
                                                       onChange = {(e) => setEmail(e.target.value)}/></> :
                                            <></>
                                    }</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <label style={{fontFamily: 'Felix Titling'}}>Phone Number:
                                        { userrData.userr ?
                                            <h6>+216{userrData.userr.phoneNumber}</h6>:<></>
                                        }
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <p style = {{color: '#021144'}}>
                                        {
                                            userrData.userr ?
                                                <>
                                                    <input type = "text" placeholder="New Value"
                                                           onChange = {(e) => setPhoneNumber(e.target.value)}/></> :
                                                <></>
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <label style={{fontFamily: 'Felix Titling'}}>Gender:
                                        { userrData.userr ?
                                            <h6 style={{fontFamily: 'Felix Titling'}}>{userrData.userr.gender}</h6>:<></>
                                        }
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <p style = {{color: '#021144'}}>
                                        {
                                            userrData.userr && userrData.userr.gender === "Male"?
                                                <>
                                                    <span style={{fontFamily: 'Felix Titling'}}>Male</span> <input type = "radio" checked disabled name = "gender" value = "Male"
                                                           onChange = {(e) => setGender(e.target.value)}/>
                                                    <span style={{fontFamily: 'Felix Titling'}}>Female</span> <input type = "radio" name = "gender" disabled
                                                                  value = "Female"
                                                           onChange = {(e) => setGender(e.target.value)}/>
                                                           </> : userrData.userr && userrData.userr.gender === "Female"?
                                                <>
                                                    <span style={{fontFamily: 'Felix Titling'}}>Male</span> <input type = "radio" value = "Male" name = "gender" disabled
                                                                onChange = {(e) => setGender(e.target.value)}/>
                                                    <span style={{fontFamily: 'Felix Titling'}}>Female</span> <input type = "radio" checked value = "Female" disabled
                                                                name = "gender" onChange = {(e) => setGender(e.target.value)}/>
                                                </>:
                                                <>
                                                    <span style={{fontFamily: 'Felix Titling'}}>Male</span> <input type = "radio" value = "Male"
                                                               name = "gender" onChange = {(e) => setGender(e.target.value)}/>
                                                    <span style={{fontFamily: 'Felix Titling'}}>Female</span> <input type = "radio" value = "Female"
                                                                 name = "gender" onChange = {(e) => setGender(e.target.value)}/>
                                                </>
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <label style={{fontFamily: 'Felix Titling'}}>Address 1:
                                        { userrData.userr ?
                                            <h6 style={{fontFamily: 'Felix Titling'}}>{userrData.userr.firstAddress}</h6>:<></>
                                        }
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <p style = {{color: '#021144'}}>
                                        {
                                            userrData.userr ?
                                                <>
                                                    <input type = "text" placeholder="New Value"
                                                           onChange = {(e) => setFirstAddress(e.target.value)}/></> :
                                                <></>
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <label style={{fontFamily: 'Felix Titling'}}>Address 2:
                                        { userrData.userr ?
                                            <h6 style={{fontFamily: 'Felix Titling'}}>{userrData.userr.secondAddress}</h6>:<></>
                                        }
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <p style = {{color: '#021144'}}>
                                        {
                                            userrData.userr ?
                                                <>
                                                    <input type = "text" placeholder="New Value"
                                                           onChange = {(e) => setSecondAddress(e.target.value)}/></> :
                                                <></>
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <label style={{fontFamily: 'Felix Titling'}}>Region:
                                        { userrData.userr ?
                                            <h6 style={{fontFamily: 'Felix Titling'}}>{userrData.userr.region}</h6>:<></>
                                        }
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <p style = {{color: '#021144'}}>
                                        {
                                            userrData.userr ?
                                                <>
                                                    <select onChange = {(e) => setRegion(e.target.value)}>
                                                        {
                                                            userrData.userr.region === "" ?
                                                                <option value = "" selected></option>:
                                                                <option value = ""></option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Ariana" ?
                                                                <option value="Ariana" selected>Ariana</option>:
                                                                <option value="Ariana">Ariana</option>
                                                        }
                                                        {
                                                            userrData.userr.region ==="Beja" ?
                                                                <option value="Beja" selected>Beja</option>:
                                                                <option value="Beja">Beja</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Ben Arous" ?
                                                                <option value="Ben Arous" selected>Ben Arous</option>:
                                                                <option value="Ben Arous">Ben Arous</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Bizerte" ?
                                                                <option value="Bizerte" selected>Bizerte</option>:
                                                                <option value="Bizerte">Bizerte</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Gabes" ?
                                                                <option value="Gabes" selected>Gabes</option>:
                                                                <option value="Gabes">Gabes</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Gafsa" ?
                                                                <option value="Gafsa" selected>Gafsa</option>:
                                                                <option value="Gafsa">Gafsa</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Jendouba" ?
                                                                <option value="Jendouba" selected>Jendouba</option>:
                                                                <option value="Jendouba">Jendouba</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Kairouan" ?
                                                                <option value="Kairouan" selected>Kairouan</option>:
                                                                <option value="Kairouan">Kairouan</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Kasserine" ?
                                                                <option value="Kasserine" selected>Kasserine</option>:
                                                                <option value="Kasserine">Kasserine</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Kebili" ?
                                                                <option value="Kebili" selected>Kebili</option>:
                                                                <option value="Kebili">Kebili</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "La Manouba" ?
                                                                <option value="La Manouba" selected>La Manouba</option>:
                                                                <option value="La Manouba">La Manouba</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Le Kef" ?
                                                                <option value="Le Kef" selected>Le Kef</option>:
                                                                <option value="Le Kef">Le Kef</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Mahdia" ?
                                                                <option value="Mahdia" selected>Mahdia</option>:
                                                                <option value="Mahdia">Mahdia</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Medenine" ?
                                                                <option value="Medenine" selected>Medenine</option>:
                                                                <option value="Medenine">Medenine</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Monastir" ?
                                                                <option value="Monastir" selected>Monastir</option>:
                                                                <option value="Monastir">Monastir</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Nabeul" ?
                                                                <option value="Nabeul" selected>Nabeul</option>:
                                                                <option value="Nabeul">Nabeul</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Sfax" ?
                                                                <option value="Sfax" selected>Sfax</option>:
                                                                <option value="Sfax">Sfax</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Sidi Bouzid" ?
                                                                <option value="Sidi Bouzid" selected>Sidi Bouzid</option>:
                                                                <option value="Sidi Bouzid">Sidi Bouzid</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Siliana" ?
                                                                <option value="Siliana" selected>Siliana</option>:
                                                                <option value="Siliana">Siliana</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Sousse" ?
                                                                <option value="Sousse" selected>Sousse</option>:
                                                                <option value="Sousse">Sousse</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Tataouine" ?
                                                                <option value="Tataouine" selected>Tataouine</option>:
                                                                <option value="Tataouine">Tataouine</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Tozeur" ?
                                                                <option value="Tozeur" selected>Tozeur</option>:
                                                                <option value="Tozeur">Tozeur</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Tunis" ?
                                                                <option value="Tunis" selected>Tunis</option>:
                                                                <option value="Tunis">Tunis</option>
                                                        }
                                                        {
                                                            userrData.userr.region === "Zaghouan" ?
                                                                <option value="Zaghouan" selected>Zaghouan</option>:
                                                                <option value="Zaghouan">Zaghouan</option>
                                                        }
                                                    </select></> :
                                                <></>
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <label style={{fontFamily: 'Felix Titling'}}>City:
                                        { userrData.userr ?
                                            <h6 style={{fontFamily: 'Felix Titling'}}>{userrData.userr.ville}</h6>:<></>
                                        }
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <p style = {{color: '#021144'}}>
                                        {
                                            userrData.userr ?
                                                <>
                                                    <select onChange = {(e) => setVille(e.target.value)}>
                                                        <option value =""></option>
                                                        <option value="Bab Bhar">Bab Bhar</option>
                                                        <option value="Bab Bnet">Bab Bnet</option>
                                                        <option value="Bab Fella">Bab Fella</option>
                                                        <option value="Bab Khadhra">Bab Khadhra</option>
                                                        <option value="Bab Mnara">Bab Mnara</option>
                                                        <option value="Bab Saadoun">Bab Saadoun</option>
                                                        <option value="Bab Souika">Bab Souika</option>
                                                        <option value="Belvedere">Belvedere</option>
                                                        <option value="Carthage">Carthage</option>
                                                        <option value="City El Khadra">City El Khadra</option>
                                                        <option value="City El Mahrajen">City El Mahrajen</option>
                                                        <option value="City Hlel">City Hlel</option>
                                                        <option value="City Ibn Khaldoun">City Ibn Khaldoun</option>
                                                        <option value="City Ibn Sina">City Ibn Sina</option>
                                                        <option value="City Intilaka">City Intilaka</option>
                                                        <option value="City Rommana">City Rommana</option>
                                                        <option value="El Agba">El Agba</option>
                                                        <option value="El Aouina">El Aouina</option>
                                                        <option value="El Hrairia">El Hrairia</option>
                                                        <option value="El Kabbaria">El Kabbaria</option>
                                                        <option value="El Kram">El Kram</option>
                                                        <option value="El Menzah">El Menzah</option>
                                                        <option value="El Omrane">El Omrane</option>
                                                        <option value="Superior El Omrane">Superior El Omrane</option>
                                                        <option value="El Ouerdia">El Ouerdia</option>
                                                        <option value="Essijoumi">Essijoumi</option>
                                                        <option value="Ettahrir">Ettahrir</option>
                                                        <option value="Ezzouhour">Ezzouhour</option>
                                                        <option value="Gammarth">Gammarth</option>
                                                        <option value="Hafsia">Hafsia</option>
                                                        <option value="Carthage Garden">Carthage Garden</option>
                                                        <option value="Jebel Jelloud">Jebel Jelloud</option>
                                                        <option value="Goulette">Goulette</option>
                                                        <option value="Marsa">Marsa</option>
                                                        <option value="Medina">Medina</option>
                                                        <option value="Bardo">Bardo</option>
                                                        <option value="Lac 1">Lac 1</option>
                                                        <option value="Lac 2">Lac 2</option>
                                                        <option value="Manar 1">Manar 1</option>
                                                        <option value="Manar 2">Manar 2</option>
                                                        <option value="Manar 3">Manar 3</option>
                                                        <option value="menzah 4">menzah 4</option>
                                                        <option value="menzah 9">Menzah 9</option>
                                                        <option value="monplaisir">monplaisir</option>
                                                        <option value="Mourouj 2">Mourouj 2</option>
                                                        <option value="Sidi Bou Saïd">Sidi Bou Saïd</option>
                                                        <option value="Sidi El Bechir">Sidi El Bechir</option>
                                                        <option value="Sidi Hassine">Sidi Hassine</option>
                                                    </select></> :
                                                <></>
                                        }
                                    </p>
                                </div>
                            </div>
                                <input type = "submit" style={{fontFamily: 'Felix Titling'}}
                                className="btn-primary" value = "Update"/>
                            </form>
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
    margin-left: 350px;\
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
          <h2 className="wow fadeInDown animated" 
          style={{fontFamily: 'Felix Titling', color: 'rgb(209, 178, 62)'}}>Contact Us</h2>
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