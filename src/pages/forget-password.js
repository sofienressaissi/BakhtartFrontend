import React, { useState } from 'react'
import Axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from 'toast-notification-alert';

export default function ForgetPassword() {

    const [email, setEmail] = useState();

    const history = useHistory();

    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }

    const submit = async (e) => {
        e.preventDefault();
        try {
            const newFPUser = {
                email,
                newPass: makeid(8)
            };
        await Axios.put(
            "https://bakhtart-backend.onrender.com/fashion/forget-password",
            newFPUser
        );
        toast.show({title: 'Sending Email!',
            position: 'topright', type: 'info'});
        setTimeout(function(){
            toast.show({title: 'Email Sent!',
            position: 'topright', type: 'info'});
            history.push('/login');
         }, 5000);
    } catch (err) {
        toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
    }
    };

    return (
        <html>
            <head>
            <title>Bakht'Art - Forget Password</title>
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

	<div className="limiter">
		<div className="container-login100">
			<div className="wrap-login100">
				<form className="login100-formRegister" onSubmit = {submit} style={{backgroundColor: 'rgba(1, 0, 61)'}}>
                <span className="login100-form-title">
                    <a href = "/">
                <img src="../assets/images/logoBakhtSiren.png" title="Go to Bakht'Art Homepage" alt = "Homepage"
                style={{width: '255px', marginBottom: '-1000px', float: 'center', marginTop: '-250px'}}/>
                </a>
                </span>
                <h1 style={{color: 'white', fontSize: '30px', textAlign: 'left'}}>Forget password</h1> <br/><br/>
                    
					<div className="wrap-input100 validate-input">
						<input className="input100"
                        type="email" onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email*" style={{color: 'white'}}/>
					</div>


					<div className="container-login100-form-btn">
						<button className="login100-form-btn" style={{color: '#021144'}}>
							Send
						</button>
					</div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span style = {{color: '#D1B23E', float: 'center'}}>Remember your password ?</span> <a href = "/login" className = "authRef" style = {{color: 'white'}}>Login</a>
				</form>

				<div className="login100-more" style={{backgroundImage: 'url(../assetsLogin/images/bgLogin.jpg)',
                backgroundSize: 'cover'}}>
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
