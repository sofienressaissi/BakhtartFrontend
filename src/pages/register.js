import React, { useState } from 'react'
import Axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from 'toast-notification-alert';

export default function Register() {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordCheck, setPasswordCheck] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [username, setUsername] = useState();

    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();
        try {
        const newUser = {
            firstName,
            lastName,
            username,
            email,
            password,
            passwordCheck,
            phoneNumber
        };
        await Axios.post(
            "https://bakhtart-backend.onrender.com/fashion/register",
            newUser
        );
        toast.show({title: "Thank you for registering!", 
        position: 'topright', type: 'info'});
        toast.show({title: "We will check the info you provided and get back to you soon!", 
        position: 'topright', type: 'info'});
        setTimeout(function(){
        toast.show({title: "Redirecting to homepage", 
        position: 'topright', type: 'warn'});
            history.push("/");
            window.location.reload(1);
         }, 5000);
    } catch (err) {
        toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
    }
    };

    return (
        <html>
            <head>
            <title>Bakht'Art - Register</title>
	<meta name="viewport" content="width=device-width, initial-scale=1"/>
	<link rel="icon" type="image/png" href="../images/icons/favicon.ico"/>
	<link rel="stylesheet" type="text/css" href="../assetsLogin/vendor/bootstrap/css/bootstrap.min.css"/>
	<link rel="stylesheet" type="text/css" href="../assetsLogin/fonts/font-awesome-4.7.0/css/font-awesome.min.css"/>
	<link rel="stylesheet" type="text/css" href="../assetsLogin/fonts/Linearicons-Free-v1.0.0/icon-font.min.css"/>
	<link rel="stylesheet" type="text/css" href="../assetsLogin/vendor/animate/animate.css"/>
	<link rel="stylesheet" type="text/css" href="../assetsLogin/vendor/css-hamburgers/hamburgers.min.css"/>
	<link rel="stylesheet" type="text/css" href="../assetsLogin/vendor/animsition/css/animsition.min.css"/>
	<link rel="stylesheet" type="text/css" href="../assetsLogin/vendor/select2/select2.min.css"/>
	<link rel="stylesheet" type="text/css" href="../assetsLogin/vendor/daterangepicker/daterangepicker.css"/>
	<link rel="stylesheet" type="text/css" href="../assetsLogin/css/util.css"/>
	<link rel="stylesheet" type="text/css" href="../assetsLogin/css/main.css"/>
            </head>
        <body style={{backgroundColor: '#666666'}}>
    <style>
		{
                  `\
                  @media screen and (max-width: 740px){\
                  	.haveAnAcc {\
                  		margin-left: -71px;\
                  	}\
                  }\
                  `}
	</style>
	<div className="limiter">
		<div className="container-login100">
			<div className="wrap-login100">
				<form className="login100-formRegister" onSubmit = {submit} style={{backgroundColor: 'rgba(1, 0, 61)'}}>
                <span className="login100-form-title">
                    <a href = "/">
                    <img src="../assets/images/logoBakhtSiren.png" title="Go to Bakht'Art Homepage" alt = "Homepage"
                style={{width: '120px', marginBottom: '-375px', float: 'center', marginTop: '-250px'}}/>
                </a>
                </span><br/><br/><br/><br/><br/><br/>
                <h1 style={{color: 'white', fontSize: '30px', textAlign: 'center'}}>Create new account</h1> <br/><br/>
                    <div className="wrap-input100 validate-input">
						<input className="input100" style={{color: 'white'}}
                        type="text" onChange={(e) => setFirstName(e.target.value)} placeholder = "First Name*"/>
					</div>
                    <div className="wrap-input100 validate-input">
						<input className="input100" style={{color: 'white'}}
                        type="text" onChange={(e) => setLastName(e.target.value)} placeholder = "Last Name*"/>
					</div>
					<div className="wrap-input100 validate-input">
						<input className="input100"
                        type="text" onChange={(e) => setUsername(e.target.value)} style={{color: 'white'}}
                        placeholder="Username (optional)"/>
						<span className="focus-input100"></span>
					</div>
					<div className="wrap-input100 validate-input">
						<input className="input100"
                        type="email" onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email*" style={{color: 'white'}}/>
					</div>
                    <div className="wrap-input100 validate-input">
						<input className="input100"
                        type="password" placeholder = "Password*"
                        onChange={(e) => setPassword(e.target.value)} style={{color: 'white'}}/>
					</div>
                    <div className="wrap-input100 validate-input">
						<input className="input100" placeholder = "Confirm Password*" style={{color: 'white'}}
                        type="password" onChange={(e) => setPasswordCheck(e.target.value)}/>
					</div>
                    <div className="wrap-input100 validate-input">
						<input className="input100"
                        type="number" style={{color: 'white'}} placeholder = "Phone Number*"
                        onChange={(e) => setPhoneNumber(e.target.value)}/>
					</div>


					<div className="container-login100-form-btn">
						<button className="login100-form-btn" style={{color: '#021144'}}>
							Register
						</button>
					</div>
                    <span style={{pointerEvents: 'none', WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none', KhtmlUserSelect: 'none', MozUserSelect: 'none',
    msUserSelect: 'none', userSelect: 'none'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span className="haveAnAcc">
                    <a className = "authRef" 
					style = {{color: '#D1B23E', pointerEvents: 'none'}}>
                        Have an account already?</a> <a href = "/login" className = "authRef" style = {{color: 'white'}}>
                            Login
                    </a>
					</span>
                </form>

				<div className="login100-more" style={{backgroundImage: 'url(../assetsLogin/images/bgLogin.jpg)',
                backgroundSize: 'cover', marginTop: '-207px', height: '1242px'}}>
				</div>
			</div>
		</div>
	</div>
	<script src="../assetsLogin/vendor/jquery/jquery-3.2.1.min.js"></script>
	<script src="../assetsLogin/vendor/animsition/js/animsition.min.js"></script>
	<script src="../assetsLogin/vendor/bootstrap/js/popper.js"></script>
	<script src="../assetsLogin/vendor/bootstrap/js/bootstrap.min.js"></script>
	<script src="../assetsLogin/vendor/select2/select2.min.js"></script>
	<script src="../assetsLogin/vendor/daterangepicker/moment.min.js"></script>
	<script src="../assetsLogin/vendor/daterangepicker/daterangepicker.js"></script>
	<script src="../assetsLogin/vendor/countdowntime/countdowntime.js"></script>
	<script src="../assetsLogin/js/main.js"></script>
    </body>
    </html>
    )
}
