import React, { useState, useContext, useEffect } from 'react';
import Axios from "axios";
import { useHistory } from "react-router-dom";
import UserContext from "../context/UserContext";
import { toast } from 'toast-notification-alert';
import { useSpeechSynthesis } from 'react-speech-kit';
import Recaptcha from 'react-recaptcha';

let recaptchaVerif = false;

function recaptchaLoaded() {
	console.log("Recaptcha loaded successfully !");
}

function verifyCallback(response) {
	if (response) {
		recaptchaVerif = true;
	}
}

export default function Login() {

	let { speak } = useSpeechSynthesis();

	let [email, setEmail] = useState();
    let [password, setPassword] = useState();
    let [checked, setChecked] = useState();

	const { userrData, setUserrData } = useContext(UserContext);
    
    const history = useHistory();

    useEffect(() => {
		const checkRememberMe = async () => {
			let emailStorage = localStorage.getItem("email");
			let passwordStorage = localStorage.getItem("password");
			let checkboxStorage = localStorage.getItem("checkbox");

			if (emailStorage !== "" && passwordStorage !== "" && checkboxStorage !== "") {
				setEmail(emailStorage);
				setPassword(passwordStorage);
				setChecked(checkboxStorage);
			}

		}
		checkRememberMe();
	}, []);

	const submit = async (e) => {
        e.preventDefault();
        try {
        const loginUser = {
            email,
            password
        };
			
      			  const loginRes = await Axios.post(
      		      "https://bakhtart-backend.herokuapp.com/fashion/login",
      		      loginUser
    		    );
   			     setUserrData({
   			         token: loginRes.data.token,
      			     userr: loginRes.data.userr
     			 });
					if (recaptchaVerif === true) {
     			   localStorage.setItem("auth-token", loginRes.data.token);
					speak({text: 'Logging In', voice: window.speechSynthesis.getVoices()[1] });
     			   toast.show({title: 'Logging In',
            position: 'topright', type: 'info'});
            setTimeout(function(){
				if (loginRes.data.userr.roleBakht === 'user') {
					history.push('/');
					window.location.reload();
				}
				if (loginRes.data.userr.roleBakht === 'admin') {
					history.push('/admin');
					window.location.reload();
				}
             }, 2000);
					} else {
						toast.show({title: "Please verify that you are human", position: 'topright', type: 'alert'});
					}
					if (checked && email !== "" && password !== "") {
						localStorage.email = email;
						localStorage.password = password;
						localStorage.checkbox = checked;
					}
    } catch (err) {
        toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
    }
    };

    return(
        <html>
            <head>
            <title>Bakht'Art - Login</title>
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
	<link rel="stylesheet" href="../assets/css/bootstrap.min.css"/>
<link rel="stylesheet" href="../assets/css/flexslider.css"/>
<link rel="stylesheet" href="../assets/css/jquery.fancybox.css"/>
<link rel="stylesheet" href="../assets/css/main.css"/>
<link rel="stylesheet" href="../assets/css/responsive.css"/>
<link rel="stylesheet" href="../assets/css/font-icon.css"/>
<link rel="stylesheet" href="../assets/css/animate.min.css"/>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"></link>
            </head>
        <body style={{backgroundColor: '#666666'}}>
	<style>
		{
                  `\
                  @media screen and (max-width: 740px){\
                  	.noAccReg {\
                  		margin-left: -28px;\
                  	}\
                  }\
                  `}
	</style>
	<div className="limiter">
		<div className="container-login100">
			<div className="wrap-login100">
				<form className="login100-form" onSubmit = {submit} style={{backgroundColor: 'rgba(1, 0, 61)'}}>
                <span className="login100-form-title">
                    <a href = "/">
                <img src="../assets/images/logoBakhtSiren.png" title="Go to Bakht'Art Homepage" alt = "Homepage"
                style={{width: '120px', marginBottom: '-285px', float: 'center', marginTop: '-250px'}}/>
                </a>
                </span>
				<h1 style={{color: 'white', fontSize: '30px', textAlign: 'left'}}>Login</h1> <br/><br/>
					<div className="wrap-input100 validate-input">
						<input className="input100" type="email" value = {email}
							   onChange={(e) => setEmail(e.target.value)}
						placeholder = "Email*" style = {{color: 'white'}}/>
					</div>
					<div className="wrap-input100 validate-input">
						<input className="input100" type="password" value = {password}
							   onChange={(e) => setPassword(e.target.value)}
						placeholder = "Password*" style = {{color: 'white'}}/>
					</div>
						<Recaptcha sitekey="6LcpmiscAAAAAFQpiHiveCv6IviMuFcsPDryxxii" 
						render = "explicit" onloadCallback={recaptchaLoaded}
						verifyCallback={verifyCallback}/>
					<div className="flex-sb-m w-full p-t-3 p-b-32">
						<div className="contact100-form-checkbox">
							<input className="input-checkbox100"
								   id="ckb1" type="checkbox" checked={checked}
								   name="remember-me" onChange={(e) => setChecked(e.target.checked)}/>
							<label className="label-checkbox100" htmlFor="ckb1">
								Remember Me
							</label>
						</div>

						<div>
							<a href="/forget-password" className="txt1">
								Forgot Password?
							</a>
						</div>
					</div>
			

					<div className="container-login100-form-btn">
						<button className="login100-form-btn" style={{color: '#021144'}}>
							Login
						</button>
					</div>
					<span style={{pointerEvents: 'none', WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none', KhtmlUserSelect: 'none', MozUserSelect: 'none',
    msUserSelect: 'none', userSelect: 'none'}}>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
					<span className="noAccReg">
                    <a style={{pointerEvents: 'none'}} 
					className = "authRef" 
					style = {{color: '#D1B23E'}}>Don't have an account?</a> <a href = "/register" className = "authRef" style = {{color: 'white'}}>Register</a>
					</span>
				</form>

				<div className="login100-more" style={{backgroundImage: 'url(../assetsLogin/images/bgLogin.jpg)'}}>
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
    );
}