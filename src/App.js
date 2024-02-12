import React, { Component } from "react";
import { connect } from "react-redux";
import './App.css';
import Routes from './Routing';
import { withCookies, Cookies } from 'react-cookie';
import { NavLink } from "react-router-dom";
import 'bootstrap';
import 'bootstrap/dist/js/bootstrap.js';
import { clearMessage } from "./actions/message";
import { history } from './helpers/history';
import { instanceOf } from 'prop-types';
import Select from 'react-select'
import services from "./services/services";

// import { useLocation } from "react-router-dom";


class App extends Component {
  static propTypes={
    cookies: instanceOf(Cookies).isRequired
  };
  constructor(props) {
    super(props);
    const { cookies }=props;

    this.state={
      name: cookies.get('name')||'Ben', companies: [], clients: []
    };
    // const { pathname } = location;
    // const splitLocation = pathname.split("/");
    // console.log(props.allCookies.MobileNo);
    // this.logOut = this.logOut.bind(this);
    // this.logOut = this.logOut.bind(this);
    this.state={ currentUser: undefined, URLName: '', pathname: "" };
    history.listen((location) => { props.dispatch(clearMessage()) });
    console.log(props.allCookies.ClientID);
    console.log("path", window.location.pathname);
    if (props.allCookies.UserType===undefined) {

      // history.push('/');
      //window.location.href="/";
    }

    //console.log("pathname", history);

    console.log("navigation location", this.props);

  }
  componentDidMount() {

    const { cookies }=this.props;
    this.GetCompany();
    if (this.props.allCookies.MainCompanyID!==undefined) {
      this.setState({ MainCompanyID: { 'label': this.props.allCookies.MainCompanyName, 'value': this.props.allCookies.MainCompanyID } });
      var data=JSON.stringify({
        "CompanyID": this.props.allCookies.MainCompanyID
      });

      var config={
        method: 'POST',
        url: services.API_URL+"Client/getClient",
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };
      services.JsonValue(config).then(response => {

        // cookies.remove("MainClientID");
        // cookies.remove("MainClientName");
        // this.setState({ MainClientID: { 'label': '--Select Client--', 'value': '--Select Client--' } });
        if (response.data.status) {
          this.setState({ clients: response.data.data.map(item => ({ value: item.ClientID, label: item.ClientName })) });

        }
        else {
          this.setState({ clients: [] })

        }

      }, error => { })
    }

    if (this.props.allCookies.MainClientID!==undefined) {
      this.setState({ MainClientID: { 'label': this.props.allCookies.MainClientName, 'value': this.props.allCookies.MainClientID } });
    }
    else {
      if (this.props.allCookies.MainCompanyID!==undefined) {
        var data=JSON.stringify({
          "CompanyID": this.props.allCookies.MainCompanyID
        });

        var config={
          method: 'POST',
          url: services.API_URL+"Client/getClient",
          headers: {
            'Content-Type': 'application/json'
          },
          data: data
        };
        services.JsonValue(config).then(response => {

          cookies.remove("MainClientID");
          cookies.remove("MainClientName");
          this.setState({ MainClientID: { 'label': '--Select Client--', 'value': '--Select Client--' } });
          if (response.data.status) {
            this.setState({ clients: response.data.data.map(item => ({ value: item.ClientID, label: item.ClientName })) });

          }
          else {
            this.setState({ clients: [] })

          }

        }, error => { })
      }
    }

  }
  onCompanyChange=(e) => {

    const { cookies }=this.props;
    cookies.set('MainCompanyID', e.value, { path: '/' });
    cookies.set('MainCompanyName', e.label, { path: '/' });
    this.setState({ MainCompanyID: { 'label': e.label, 'value': e.value } });

    var data=JSON.stringify({
      "CompanyID": e.value
    });

    var config={
      method: 'POST',
      url: services.API_URL+"Client/getClient",
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };
    services.JsonValue(config).then(response => {

      cookies.remove("MainClientID");
      cookies.remove("MainClientName");
      this.setState({ MainClientID: { 'label': '--Select Client--', 'value': '--Select Client--' } });
      if (response.data.status) {
        this.setState({ clients: response.data.data.map(item => ({ value: item.ClientID, label: item.ClientName })) });

      }
      else {
        this.setState({ clients: [] })

      }

    }, error => { })

  }
  onClientChange=(e) => {
    const { cookies }=this.props;
    cookies.set('MainClientID', e.value, { path: '/' });
    cookies.set('MainClientName', e.label, { path: '/' });
    this.setState({ MainClientID: { 'label': e.label, 'value': e.value } });
    window.location.reload(true);
  }
  GetCompany() {

    var data=JSON.stringify({
      "CompanyID": ""
    });
    var config={
      method: 'POST',
      url: services.API_URL+"Company/getCompany",
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };
    services.JsonValue(config).then(response => {
      //debugger;
      this.setState({ companies: response.data.data.map(item => ({ value: item.CompanyID, label: item.CompanyName })) });
    }, error => { })
  }
  logout=(e) => {
    e.preventDefault();
    const { cookies }=this.props;
    cookies.remove("MobileNo");
    cookies.remove("ClientID");
    cookies.remove("MainCompanyID");
    cookies.remove("MainCompanyName");
    cookies.remove("MainClientID");
    cookies.remove("MainClientName");
    cookies.remove("UserID");
    cookies.remove("UserType");

    history.push('/');
    window.location.href="/";
  }
  CompanyClick=(e) => {
    e.preventDefault();
    history.push('/company');
  }
  // clear message when changing location
  render() {
    return (
      <>
        <Routes />
        {(this.props.allCookies.UserType!==undefined)? (

          <div className="App">
            <div>
              <div id="kt_header_mobile" className="header-mobile bg-primary header-mobile-fixed">
                <a href="index.html">
                  <h3 style={{ color: 'white' }}>Metrro Waste Handling Pvt. Ltd.</h3>
                </a>
                <div className="d-flex align-items-center">
                  <button className="btn p-0 burger-icon burger-icon-left ml-4" id="kt_header_mobile_toggle">
                    <span />
                  </button>
                  <button className="btn p-0 ml-2" id="kt_header_mobile_topbar_toggle">
                    <span className="svg-icon svg-icon-xl">
                      {/* <svg xmlns="http://www.w3.org/2000/svg" xmlnsxlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                        <g stroke="none" strokewidth="{1}" fill="none" fillrule="evenodd">
                          <polygon points="0 0 24 0 24 24 0 24" />
                          <path d="M12,11 C9.790861,11 8,9.209139 8,7 C8,4.790861 9.790861,3 12,3 C14.209139,3 16,4.790861 16,7 C16,9.209139 14.209139,11 12,11 Z" fill="#000000" fillrule="nonzero" opacity="0.3" />
                          <path d="M3.00065168,20.1992055 C3.38825852,15.4265159 7.26191235,13 11.9833413,13 C16.7712164,13 20.7048837,15.2931929 20.9979143,20.2 C21.0095879,20.3954741 20.9979143,21 20.2466999,21 C16.541124,21 11.0347247,21 3.72750223,21 C3.47671215,21 2.97953825,20.45918 3.00065168,20.1992055 Z" fill="#000000" fillrule="nonzero" />
                        </g>
                      </svg> */}
                    </span>

                  </button>
                </div>
              </div>
              <div className="d-flex flex-column flex-root">
                <div className="d-flex flex-row flex-column-fluid page">
                  <div className="d-flex flex-column flex-row-fluid wrapper" id="kt_wrapper">
                    <div id="kt_header" className="header flex-column header-fixed">
                      <div className="header-top">
                        <div className="container">
                          <div className="d-none d-lg-flex align-items-center mr-3">
                            <a href="/dashboard" className="mr-20">
                              <h3 style={{ color: 'white' }}>Metrro Waste Handling Pvt. Ltd.</h3>
                            </a>
                          </div>
                          <div className="topbar bg-primary">
                            {/* <div className="topbar-item mr-1">
                              <div className="btn-icon" style={{width:'250px'}}>
                                <Select styles={{width:'250px'}} options={this.state.companies} value={this.state.MainCompanyID} />
                              </div>
                            </div> */}

                            <div className="topbar-item">
                              <div className="btn btn-icon btn-hover-transparent-white w-sm-auto d-flex align-items-center btn-lg px-2" id="kt_quick_user_toggle">
                                <div className="d-flex flex-column text-right pr-sm-3">
                                  <span className="text-white font-weight-bolder font-size-sm d-none d-sm-inline">Admin</span>
                                </div>
                                <span className="symbol symbol-35">
                                  <span className="symbol-label font-size-h5 font-weight-bold text-white bg-white-o-30">A</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="header-bottom">
                        <div className="container">
                          <div className="header-navs header-navs-left" id="kt_header_navs">
                            <div className="tab-content">
                              <div className="tab-pane py-5 p-lg-0 show active" id="kt_header_tab_1">
                                <div id="kt_header_menu" className="header-menu header-menu-mobile header-menu-layout-default">
                                  <ul className="menu-nav">
                                    {/* <li className="menu-item" aria-haspopup="true">
                                      <NavLink to={"/dashboard"} className="menu-link">
                                        <span className="menu-text">Dashboard</span>
                                      </NavLink>
                                    </li> */}

                                    <li className={"menu-item menu-item-submenu menu-item-open menu-item-rel "+(window.location.pathname=="/country"||window.location.pathname=="/state"||window.location.pathname=="/city"||window.location.pathname=="/zone"||window.location.pathname=="/district"||window.location.pathname=="/municipality"? "menu-item-active":"")} data-menu-toggle="click" aria-haspopup="true">
                                      <a className="menu-link menu-toggle">
                                        <span className="menu-text">Master</span>
                                        <i className="menu-arrow" />
                                      </a>
                                      <div className="menu-submenu menu-submenu-classic menu-submenu-left">
                                        <ul className="menu-subnav">
                                          <li className={"menu-item menu-item-submenu "+(window.location.pathname=="/country"? "menu-item-here":"")} aria-haspopup="true">
                                            <NavLink to={"/country"} className="menu-link">
                                              <span className="menu-text">Country</span>
                                            </NavLink >
                                          </li>
                                          <li className={"menu-item menu-item-submenu "+(window.location.pathname=="/state"? "menu-item-here":"")} aria-haspopup="true">
                                            <NavLink to={"/state"} className="menu-link">
                                              <span className="menu-text">State</span>
                                            </NavLink >
                                          </li>
                                          <li className={"menu-item menu-item-submenu "+(window.location.pathname=="/city"? "menu-item-here":"")} aria-haspopup="true">
                                            <NavLink to={"/city"} className="menu-link">
                                              <span className="menu-text">City</span>
                                            </NavLink>

                                          </li>
                                          <li className={"menu-item menu-item-submenu "+(window.location.pathname=="/zone"? "menu-item-here":"")} data-menu-toggle="hover" aria-haspopup="true">
                                            <NavLink to={"/zone"} className="menu-link">
                                              <span className="menu-text">Zone</span>
                                            </NavLink>
                                          </li>
                                          <li className={"menu-item menu-item-submenu "+(window.location.pathname=="/district"? "menu-item-here":"")} data-menu-toggle="hover" aria-haspopup="true">
                                            <NavLink to={"/district"} className="menu-link">
                                              <span className="menu-text">District</span>
                                            </NavLink>
                                          </li>
                                          <li className={"menu-item menu-item-submenu "+(window.location.pathname=="/municipality"? "menu-item-here":"")} data-menu-toggle="hover" aria-haspopup="true">
                                            <NavLink to={"/municipality"} className="menu-link">
                                              <span className="menu-text">Municipalities</span>
                                            </NavLink>
                                          </li>
                                          <li className={"menu-item menu-item-submenu "+(window.location.pathname=="/parkinglocation"? "menu-item-here":"")} data-menu-toggle="hover" aria-haspopup="true">
                                            <NavLink to={"/parkinglocation"} className="menu-link">
                                              <span className="menu-text">Parking Location</span>
                                            </NavLink>
                                          </li>
                                          <li className={"menu-item menu-item-submenu "+(window.location.pathname=="/usertype"? "menu-item-here":"")} data-menu-toggle="hover" aria-haspopup="true">
                                            <NavLink to={"/usertype"} className="menu-link">
                                              <span className="menu-text">User Type</span>
                                            </NavLink>
                                          </li>
                                          {/* <li className="menu-item menu-item-submenu  " data-menu-toggle="hover" aria-haspopup="true">
                                            <a href="department.html" className="menu-link">
                                              <span className="menu-text">Department</span>
                                            </a>
                                          </li>
                                         
                                         
                                          
                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <a href="bookingtype.html" className="menu-link">
                                              <span className="menu-text">Booking Type</span>
                                            </a>
                                          </li>
                                         
                                         
                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <a href="wardmaster.html" className="menu-link">
                                              <span className="menu-text">Ward Master</span>
                                            </a>
                                          </li> */}
                                        </ul>
                                      </div>
                                    </li>
                                    <li className={"menu-item menu-item-submenu menu-item-open menu-item-rel "+(window.location.pathname=="/company"||window.location.pathname=="/client"||window.location.pathname=="/viewclient"? "menu-item-active":"")} data-menu-toggle="click" aria-haspopup="true">
                                      <a className="menu-link menu-toggle">
                                        <span className="menu-text">Configuration Master</span>
                                        <span className="menu-desc" />
                                        <i className="menu-arrow" />
                                      </a>
                                      <div className="menu-submenu menu-submenu-classic">
                                        <ul className="menu-subnav">
                                          <li className={"menu-item menu-item-submenu "+(window.location.pathname=="/company"? "menu-item-here":"")} data-menu-toggle="hover" aria-haspopup="true">
                                            {/* <a onClick={() => history.push("/company")} className="menu-link">
                                              <span className="menu-text">Company</span>
                                            </a> */}
                                            <NavLink to={"/company"} className="menu-link">
                                              <span className="menu-text">Company</span>
                                            </NavLink >
                                          </li>
                                          <li className={"menu-item menu-item-submenu "+(window.location.pathname=="/client"? "menu-item-here":"")} data-menu-toggle="hover" aria-haspopup="true">
                                            <NavLink to={"/client"} className="menu-link">
                                              <span className="menu-text">Client</span>

                                            </NavLink>
                                          </li>
                                          <li className={"menu-item menu-item-submenu "+(window.location.pathname=="/checklist"? "menu-item-here":"")} data-menu-toggle="hover" aria-haspopup="true">
                                            <NavLink to={"/checklist"} className="menu-link">
                                              <span className="menu-text">CheckList</span>

                                            </NavLink>
                                          </li>
                                          <li className={"menu-item menu-item-submenu "+(window.location.pathname=="/users"? "menu-item-here":"")} data-menu-toggle="hover" aria-haspopup="true">
                                            <NavLink to={"/users"} className="menu-link">
                                              <span className="menu-text">Users</span>
                                            </NavLink>
                                          </li>
                                          
                                        </ul>
                                      </div>
                                    </li>
                                    {this.props.allCookies.UserType!=="Admin"&&
                                      <li className="menu-item menu-item-submenu menu-item-rel" data-menu-toggle="click" aria-haspopup="true">
                                        <a className="menu-link menu-toggle">
                                          <span className="menu-text">Task</span>
                                          <span className="menu-desc" />
                                          <i className="menu-arrow" />
                                        </a>
                                        <div className="menu-submenu menu-submenu-classic menu-submenu-left">
                                          <ul className="menu-subnav">
                                            {this.props.allCookies.UserType==="Supervisor"&&
                                              <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                                <NavLink to={"/task"} className="menu-link">
                                                  <span className="menu-text">Add Task</span>
                                                </NavLink>
                                              </li>
                                            }
                                            <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                              <NavLink to={"/viewtask"} className="menu-link">
                                                <span className="menu-text">View Task</span>

                                              </NavLink>
                                            </li>
                                          </ul>
                                        </div>
                                      </li>
                                    }
                                    <li className="menu-item menu-item-submenu menu-item-rel" data-menu-toggle="click" aria-haspopup="true">
                                      <a className="menu-link menu-toggle">
                                        <span className="menu-text">Vehicles</span>
                                        <span className="menu-desc" />
                                        <i className="menu-arrow" />
                                      </a>
                                      <div className="menu-submenu menu-submenu-classic menu-submenu-left">
                                        <ul className="menu-subnav">

                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <NavLink to={"/vehicletype"} className="menu-link">
                                              <span className="menu-text">Vehicle Type</span>
                                            </NavLink>
                                          </li>
                                        </ul>
                                      </div>
                                    </li>
                                    {/* <li className="menu-item menu-item-submenu menu-item-rel" data-menu-toggle="click" aria-haspopup="true">
                                      <a href="#" className="menu-link menu-toggle">
                                        <span className="menu-text">Booking</span>
                                        <span className="menu-desc" />
                                        <i className="menu-arrow" />
                                      </a>
                                      <div className="menu-submenu menu-submenu-classic menu-submenu-left">
                                        <ul className="menu-subnav">
                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <a href="addbooking.html" className="menu-link">
                                              <span className="menu-text">Add Booking</span>
                                            </a>
                                          </li>
                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <a href="viewbooking.html" className="menu-link">
                                              <span className="menu-text">View Booking</span>
                                            </a>
                                          </li>
                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <a href="viewstartbooking.html" className="menu-link">
                                              <span className="menu-text">View Start Booking</span>
                                            </a>
                                          </li>
                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <a href="viewfinishbooking.html" className="menu-link">
                                              <span className="menu-text">View Finish Booking</span>
                                            </a>
                                          </li>
                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <a href="viewcompletebooking.html" className="menu-link">
                                              <span className="menu-text">View Complete Booking</span>
                                            </a>
                                          </li>
                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <a href="viewapprovalbooking.html" className="menu-link">
                                              <span className="menu-text">View Approval Booking</span>
                                            </a>
                                          </li>
                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <a href="viewadministratorbooking.html" className="menu-link">
                                              <span className="menu-text">View Administrator
                                                Booking</span>
                                            </a>
                                          </li>
                                        </ul>
                                      </div>
                                    </li>
                                    <li className="menu-item menu-item-submenu menu-item-rel" data-menu-toggle="click" aria-haspopup="true">
                                      <a href="#" className="menu-link menu-toggle">
                                        <span className="menu-text">Vehicle</span>
                                        <span className="menu-desc" />
                                        <i className="menu-arrow" />
                                      </a>
                                      <div className="menu-submenu menu-submenu-classic menu-submenu-left">
                                        <ul className="menu-subnav">
                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <a href="vehicletype.html" className="menu-link">
                                              <span className="menu-text">Vehicle Type</span>
                                            </a>
                                          </li>
                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <a href="vehiclebrand.html" className="menu-link">
                                              <span className="menu-text">Vehicle Brand</span>
                                            </a>
                                          </li>
                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <a href="vehiclemodel.html" className="menu-link">
                                              <span className="menu-text">Vehicle Model</span>
                                            </a>
                                          </li>
                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <a href="vehicle.html" className="menu-link">
                                              <span className="menu-text">Vehicle Master</span>
                                            </a>
                                          </li>
                                        </ul>
                                      </div>
                                    </li> */}
                                  </ul>
                                </div>
                              </div>
                              <div className="tab-pane p-5 p-lg-0 justify-content-between" id="kt_header_tab_2">
                                <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center">
                                  <a href="#" className="btn btn-light-success font-weight-bold mr-3 my-2 my-lg-0">Latest Orders</a>
                                  <a href="#" className="btn btn-light-primary font-weight-bold my-2 my-lg-0">Customer Service</a>
                                </div>
                                <div className="d-flex align-items-center">
                                  <a href="#" className="btn btn-danger font-weight-bold my-2 my-lg-0">Generate Reports</a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="content d-flex flex-column flex-column-fluid" id="kt_content" style={{ marginTopL: '2%' }}>
                      <div className="d-flex flex-column-fluid">
                        <div className="container-fluid">
                          <div className="row">

                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <div id="kt_quick_user" className="offcanvas offcanvas-right p-10">
                <div className="offcanvas-header d-flex align-items-center justify-content-between pb-5">
                  <h3 className="font-weight-bold m-0">User Profile</h3>
                  <a href="#" className="btn btn-xs btn-icon btn-light btn-hover-primary" id="kt_quick_user_close">
                    <i className="ki ki-close icon-xs text-muted" />
                  </a>
                </div>
                <div className="offcanvas-content pr-5 mr-n5">
                  <div className="d-flex align-items-center mt-5">
                    <div className="symbol symbol-100 mr-5">
                      <div className="symbol-label" style={{ backgroundImage: 'url("metronic/theme/html/demo7/dist/assets/media/users/300_21.jpg")' }} />
                      <i className="symbol-badge bg-success" />
                    </div>
                    <div className="d-flex flex-column">
                      <a href="#" className="font-weight-bold font-size-h5 text-dark-75 text-hover-primary">Admin</a>
                      <div className="navi mt-2">
                        <button type="button" onClick={this.logout} className="btn btn-sm btn-light-primary font-weight-bolder py-2 px-5">
                          Sign Out
                        </button>
                        {/* <a href="index.html" className="btn btn-sm btn-light-primary font-weight-bolder py-2 px-5">Sign Out</a> */}
                      </div>
                    </div>
                  </div>
                  <div className="separator separator-dashed mt-8 mb-5" />
                  <div className="separator separator-dashed my-7" />
                  {this.props.allCookies.UserType==="Admin"&&
                    <div className="navi navi-spacer-x-0 p-0">
                      <a className="navi-item">
                        <div className="">
                          <div>
                            <label style={{ width: '100%', textAlign: 'left', fontFamily: '"Poppins"', color: 'black', fontWeight: 500 }}>Company</label>
                            <Select options={this.state.companies} value={this.state.MainCompanyID} onChange={this.onCompanyChange} />
                          </div>

                          <div style={{ marginTop: '7%' }}>
                            <label style={{ width: '100%', textAlign: 'left', fontFamily: '"Poppins"', color: 'black', fontWeight: 500 }}>Client</label>
                            <Select options={this.state.clients} value={this.state.MainClientID} onChange={this.onClientChange} />
                          </div>

                        </div>
                      </a>
                    </div>
                  }
                </div>
              </div>
              <div id="kt_scrolltop" className="scrolltop">
                <span className="svg-icon">

                </span>
              </div>
            </div>

          </div>
        ):''}
        <div className="footer bg-white py-4 d-flex flex-lg-column" id="kt_footer">
          <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between">
            <div className="text-dark order-2 order-md-1">
              <span className="text-muted font-weight-bold mr-2">2023©</span>
              <a href="https://smtechno.com" rel="noreferrer" target="_blank" className="text-dark-75 text-hover-primary">SM Techno
                Consultants PVT LTD</a>
            </div>
          </div>
        </div>
      </>
    );
  }

}
function mapStateToProps(state) { const { user }=state.auth; return { user }; }
export default withCookies(connect(mapStateToProps)(App));
