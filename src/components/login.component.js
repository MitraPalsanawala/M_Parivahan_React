import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Routes, Route,Navigate    } from "react-router-dom";

import {withIsAuthenticated} from 'react-auth-kit';

import { withSignIn } from 'react-auth-kit'
import service from '../services/services'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

class Login extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
      };
    constructor(props) {
        super(props);
        const { cookies } = props;
        this.state = {
            name: cookies.get('name') || 'Ben'
          };
        this.state={ UserID:"",ClientID:"",CompanyID:"",UserType:"", UserName: "", Password: "", MobileNo: "", OTP: "", OTPValue: "", IsOTPVisible: false, IsMobileNoVisible: true, IsError: false, IsMobileRequired: false };

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

    getMobileNo=(e) => {

        this.setState({ MobileNo: e.target.value });
        if (e.target.value='') {
            this.setState({ IsMobileRequired: true });
        }
        else {
            this.setState({ IsMobileRequired: false });
        }
    }
    handleChangeOTP=(e) => {
        this.setState({ OTP: e.target.value });
    }
    GetOTP=(e) => {
        debugger;
        if (this.state.MobileNo!="") {
            this.setState({ IsMobileRequired: false });
            var data=JSON.stringify({
                "MobileNo": this.state.MobileNo
            });
            var config={
                method: 'post',
                url: service.API_URL+"User/setUserLogin",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            service.JsonValue(config).then(response => {
                debugger;
                if (response.data.status) {
                    this.setState({ data: response.data.data })
                    this.setState({UserID:response.data.data[0].UserID});
                    this.setState({ClientID:response.data.data[0].ClientID});
                    this.setState({CompanyID:response.data.data[0].CompanyID});
                    this.setState({UserType:response.data.data[0].UserType});

                    this.setState({ IsOTPVisible: true });
                    this.setState({ IsMobileNoVisible: false });
                    this.setState({ IsError: false });
                    this.setState({ OTPValue: response.data.data[0].LoginOTP });
                    toast('Your OTP is '+response.data.data[0].LoginOTP, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                }
                else {
                    this.setState({ IsError: true });
                    this.setState({ ErrorMessage: 'Invalid Mobile No' });
                }

            }, error => { })
        }
        else {
            this.setState({ IsError: false });
            this.setState({ IsMobileRequired: true });
        }


    }

    onSubmit=(e) => {
        debugger;
        e.preventDefault()
        var CurrentOTP=this.state.OTP;
        var OTPData=this.state.OTPValue;
        if (CurrentOTP==OTPData) {
            this.setState({ IsError: false });

            // const cookies = new Cookies();
            const { cookies } = this.props;
            cookies.set('UserID', this.state.UserID, { path: '/' });
            cookies.set('MainClientID', this.state.ClientID, { path: '/' });
            cookies.set('MainCompanyID', this.state.CompanyID, { path: '/' });
            cookies.set('UserType', this.state.UserType, { path: '/' });
            window.location.href = "/dashboard";
            // if (this.props.signIn(
            //     {
            //         token: '35v3443bn368367n306306wbn407qn420b436b4', //Just a random token
            //         tokenType: 'Bearer',    // Token type set as Bearer
            //         authState: { name: 'React User', uid: 123456 },   // Dummy auth user state
            //         expiresIn: 120  // Token Expriration time, in minutes
            //     }
            // )) {
            //     // this.props.history.push('/dashboard')
            //     window.location.href = "/dashboard";
                
                
            // } else {
            //     //Throw error
            // }
        }
        else {
            this.setState({ IsError: true });
            this.setState({ ErrorMessage: 'Invalid OTP' });
        }
    }
    render() {
        return (
            <>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                
                <ToastContainer />
                <div style={{ height: '100%' }}>
                    <div className="d-flex flex-column flex-root" style={{ height: '100%' }}>
                        <div className="login login-4 login-signin-on d-flex flex-row-fluid" id="kt_login">
                            <div className="d-flex flex-center flex-row-fluid bgi-size-cover bgi-position-top bgi-no-repeat" style={{ backgroundImage: 'linear-gradient(to right top, #3699ff, #47a1ff, #56a8ff, #64b0ff, #72b7ff)' }}>
                                <div className="login-form text-center p-7 position-relative overflow-hidden" style={{ border: '1px solid', background: 'white',width:'30%' }}>
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

                                            {this.state.IsMobileNoVisible&&
                                                <div className="form-group mb-5">
                                                    {/* <label>Mobile No</label> */}
                                                    <input id="txtMobileNo" onKeyPress={this.allowOnlyNumbers} className="form-control h-auto form-control-solid py-4 px-8" type="text" value={this.state.MobileNo} onChange={this.getMobileNo} placeholder="Enter Mobile No" name="mobileno" autoComplete="off" />
                                                </div>
                                            }
                                            {this.state.IsOTPVisible&&
                                                <div className="form-group mb-5">
                                                    <input id="txtOTP" onKeyPress={this.allowOnlyNumbers} maxLength="4" className="form-control h-auto form-control-solid py-4 px-8" type="text" value={this.state.OTP} onChange={this.handleChangeOTP} placeholder="Enter OTP" name="otp" />
                                                </div>
                                            }

                                            {this.state.IsError&&
                                                <div id="divError" className="row" style={{ marginTop: '1%', display: 'block', textAlign: 'center' }}>
                                                    <span style={{ color: 'red', fontWeight: 'bold' }}>{this.state.ErrorMessage}</span>
                                                </div>
                                            }
                                            {this.state.IsMobileRequired&&
                                                <div id="divError" className="row" style={{ marginTop: '1%', display: 'block', textAlign: 'left', paddingLeft: '5%' }}>
                                                    <span style={{ color: 'red', fontWeight: 'bold' }}>*</span>
                                                </div>
                                            }
                                            {this.state.IsMobileNoVisible&&
                                                <button type="button" className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4" onClick={this.GetOTP}>
                                                    Get OTP
                                                </button>
                                            }
                                            {this.state.IsOTPVisible&&
                                                <button type="button" className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4" onClick={this.onSubmit}>
                                                    Submit
                                                </button>
                                            }
                                            {this.state.IsMobileNoVisible&&
                                                <div className="flex-wrap form-group justify-content-between px-8 mt-5">
                                                    <a href="#" id="kt_login_forgot" className="font-weight-bold">Forget Password ?</a>
                                                </div>
                                            }
                                            {this.state.IsOTPVisible&&
                                                <div className="flex-wrap form-group justify-content-between px-8 mt-5">
                                                    <a href="#" onClick={this.GetOTP} id="kt_login_forgot" className="font-weight-bold">Resend SMS ?</a>
                                                </div>
                                            }
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
export default withCookies(Login);