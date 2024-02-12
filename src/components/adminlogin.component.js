import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { withIsAuthenticated } from 'react-auth-kit';

import { withSignIn } from 'react-auth-kit'
import services from "../services/services";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import Swal from "sweetalert2";

class adminlogin extends Component {
    static propTypes={
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        const { cookies }=props;
        this.state={
            name: cookies.get('name')||'Ben'
        };
        this.state={ UserID: "", ClientID: "", CompanyID: "", UserName: "", Password: "", MobileNo: "", OTP: "", OTPValue: "", IsOTPVisible: false, IsMobileNoVisible: true, IsError: false, IsMobileRequired: false };

        // if (this.props.isAuthenticated()) {
        //     // If authenticated user, then redirect to secure dashboard
        //     // return (
        //     //     <Redirect to={'/secure'} />
        //     // )
        // } else {

        //     // return (
        //     //     <button onClick={loginHandler}>Log In!!</button>
        //     // )
        // }
    }
    allowOnlyNumbers=(event) => {
        const keyCode=event.keyCode||event.which;
        const keyValue=String.fromCharCode(keyCode);
        if (!new RegExp("[0-9]").test(keyValue)) event.preventDefault();
        return;
    };
    onSubmit=(e) => {
        debugger;
        e.preventDefault()
        var data=JSON.stringify({
            "UserName": this.state.UserName,
            "Password": this.state.Password
        });

        var config={
            method: 'POST',
            url: services.API_URL+"User/setUserLoginUserNameWise",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        services.JsonValue(config).then(response => {
            if (response.data.status) {
                const { cookies }=this.props;
                cookies.set('UserID', response.data.data[0].UserID, { path: '/' });
                cookies.set('UserType', response.data.data[0].UserType);
                if (response.data.data[0].UserType!="Admin") {
                    cookies.set('MainClientID', response.data.data[0].ClientID, { path: '/' });
                    cookies.set('MainCompanyID', response.data.data[0].CompanyID, { path: '/' });
                }
                window.location.href="/zone";

            }
            else {
                Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
            }
        }, error => { })
    }
    render() {
        return (
            <>

                <div style={{ height: '100%' }}>
                    <div className="d-flex flex-column flex-root" style={{ height: '100%' }}>
                        <div className="login login-4 login-signin-on d-flex flex-row-fluid" id="kt_login">
                            <div className="d-flex flex-center flex-row-fluid bgi-size-cover bgi-position-top bgi-no-repeat" style={{ backgroundImage: 'linear-gradient(to right top, #3699ff, #47a1ff, #56a8ff, #64b0ff, #72b7ff)' }}>
                                <div className="login-form text-center p-7 position-relative overflow-hidden" style={{ border: '1px solid', background: 'white', width: '30%' }}>
                                    <div className="d-flex flex-center mb-15">
                                        <a href="#">
                                            <img src="Images/logo2.png" />
                                        </a>
                                    </div>
                                    <div className="login-signin">
                                        <form className="form" id="kt_login" onSubmit={this.onSubmit}>
                                            {/* <FormWithConstraints
                                        ref={form => this.form=form}
                                        onSubmit={this.onSubmit}
                                        noValidate id=""> */}


                                            <div className="form-group mb-5">

                                                <input id="txtUserName" className="form-control h-auto form-control-solid py-4 px-8" type="text" value={this.state.UserName} onChange={(e) => this.setState({ UserName: e.target.value })} placeholder="Enter UserName" name="UserName" autoComplete="off" />
                                            </div>

                                            <div className="form-group mb-5">
                                                <input id="txtPassword" className="form-control h-auto form-control-solid py-4 px-8" type="password" value={this.state.Password} onChange={(e) => this.setState({ Password: e.target.value })} placeholder="Enter Password" name="Password" />
                                            </div>

                                            <button type="submit" className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4" onClick={this.onSubmit}>
                                                Login
                                            </button>
                                            {/* </FormWithConstraints> */}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );

    }
}
export default withCookies(adminlogin);