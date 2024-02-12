import React, { Component } from "react";
import services from "../services/services";
import Swal from "sweetalert2";
import MaterialTable from '@material-table/core';
import '../style.css';
import Select from 'react-select'
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import {
    Async,
    FieldFeedback,
    FieldFeedbacks,
    FormWithConstraints,
    Input
} from 'react-form-with-constraints';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { NavLink } from "react-router-dom";
import { history } from '../helpers/history';


class booking extends Component {

    static propTypes={
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        const { cookies }=props;
        this.state={
            name: cookies.get('name')||'Ben'
        };
        this.state={
            data: [], bookingtypes: [], zones: [], districts: [], municipalities: [], wards: [], countries: [], states: [], cities: [],
            priorities: [{ 'label': 'High', 'value': 'High' }, { 'label': 'Medium', 'value': 'Medium' }, { 'label': 'Low', 'value': 'Low' }],
            BookingTypeID: { 'label': '--Select Task Type--', 'value': '--Select Task Type--' },
            ZoneID: { 'label': '--Select Zone--', 'value': '--Select Zone--' },
            DistrictID: { 'label': '--Select District--', 'value': '--Select District--' },
            MuncipalityID: { 'label': '--Select Municipality--', 'value': '--Select Municipality--' },
            WardID: { 'label': '--Select Ward--', 'value': '--Select Ward--' },
            CountryID: { 'label': '--Select Country--', 'value': '--Select Country--' },
            StateID: { 'label': '--Select State--', 'value': '--Select State--' },
            CityID: { 'label': '--Select City--', 'value': '--Select City--' },
            Priority: { 'label': '--Select Priority--', 'value': '--Select Priority--' },
            BookingTypeErrMsg: "", TaskDateErrMsg: "", ZoneErrMsg: "", DistrictErrMsg: "", MunicipalityErrMsg: "", WardErrMsg: "", StateErrMsg: "", CityErrMsg: "",
            PriorityErrMsg: "",
            BookingID: "", BookingNo: "", BookingDate: new Date(), Locality: "", Remarks: "", isChanging: false
        }
    }

    componentDidMount() {
        debugger;
        this.GetBookingType();
        this.GetZone();
        this.GetCountry();
        this.onCountryChange(1);
        this.setState({ CountryID: { 'label': 'India', 'value': '1' } })
        const search=history.location.search;
        const params=new URLSearchParams(search);
        const id=params.get('id')
        if (id!=null) {
            this.EditBooking(id);
        }
        else {

        }

    }
    EditBooking(id) {
        var CompanyID="";
        var ClientID="";
        var UserID="";
        if (this.props.allCookies.MainCompanyID!==undefined) {
            CompanyID=this.props.allCookies.MainCompanyID;
        }
        if (this.props.allCookies.MainClientID!==undefined) {
            ClientID=this.props.allCookies.MainClientID
        }
        if (this.props.allCookies.UserID!==undefined) {
            UserID=this.props.allCookies.UserID
        }
        if (CompanyID!==""&&ClientID!=="") {
            var data=JSON.stringify({
                "BookingID": id,
                "CompanyID": CompanyID,
                "ClientID": ClientID,
                "UserID": UserID
            });
            var config={
                method: 'POST',
                url: services.API_URL+"Booking/getBooking",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            services.JsonValue(config).then(response => {
                debugger;
                var data="";
                data=JSON.stringify({
                    "ZoneID": response.data.data[0].ZoneID,
                    "CompanyID": CompanyID,
                    "ClientID": ClientID,
                    "UserID": UserID
                });

                var config={
                    method: 'POST',
                    url: services.API_URL+"User/getUserDistrictDetail",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    //debugger;

                    if (response.data.status) {
                        //debugger;

                        this.setState({ districts: response.data.data.map(item => ({ value: item.DistrictID, label: item.DistrictName })) });

                    }
                    else {

                    }
                }, error => { })

                var data="";
                data=JSON.stringify({
                    "DistrictID": response.data.data[0].DistrictID,
                    "CompanyID": CompanyID,
                    "ClientID": ClientID,
                    "UserID": UserID
                });

                var config={
                    method: 'POST',
                    url: services.API_URL+"User/getUserMuncipalityDetail",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    //debugger;

                    if (response.data.status) {
                        //debugger;

                        this.setState({ municipalities: response.data.data.map(item => ({ value: item.MuncipalityID, label: item.MuncipalityName })) });

                    }
                    else {

                    }
                }, error => { })

                var data="";
                data=JSON.stringify({
                    "MuncipalityID": response.data.data[0].MunicipalityID,
                    "CompanyID": CompanyID,
                    "ClientID": ClientID,
                    "UserID": UserID
                });

                var config={
                    method: 'POST',
                    url: services.API_URL+"Ward/getWard",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    //debugger;

                    if (response.data.status) {
                        //debugger;

                        this.setState({ wards: response.data.data.map(item => ({ value: item.WardID, label: item.WardName })) });
                    }
                    else {

                    }
                }, error => { })

                var data=JSON.stringify({
                    "CountryID": response.data.data[0].CountryID
                });

                var config={
                    method: 'POST',
                    url: services.API_URL+"State/getState",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    debugger;

                    if (response.data.status) {
                        this.setState({ states: response.data.data.map(item => ({ value: item.StateID, label: item.StateName })) });
                    }
                    else {

                    }
                }, error => { })

                var data=JSON.stringify({
                    "StateID": response.data.data[0].StateID
                });

                var config={
                    method: 'POST',
                    url: services.API_URL+"City/getCity",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    debugger;
                    this.setState({ cities: response.data.data.map(item => ({ value: item.CityID, label: item.CityName })) });
                }, error => { })
                debugger;

                var dateString= response.data.data[0].BookingDate; 

                 var dateMomentObject=moment(dateString, "DD-MM-YYYY"); // 1st argument - string, 2nd argument - format
                 var date=dateMomentObject.toDate(); // convert moment.js object to Date object
                 //var dt = new Date();
               // var dts = moment(new Date, 'DD-MM-YYYY').format();
              //  var abc = dateMomentObject.toLocaleDateString();
                // var dt="2020-06-11";
                 //var strDate=new Date(dt);
                // var abc = new Date();
               // var date=moment(dateObject).format('DD-MM-YYYY');
               // var date = "01-02-2023";
                //console.log("valdate",tddate);
                this.setState({
                    BookingID: response.data.data[0].BookingID,
                    BookingTypeID: { 'label': response.data.data[0].BookingType, 'value': response.data.data[0].BookingTypeID },
                    BookingNo: response.data.data[0].BookingNo,
                    BookingDate: date,
                    ZoneID: { 'label': response.data.data[0].ZoneName, 'value': response.data.data[0].ZoneID },
                    DistrictID: { 'label': response.data.data[0].DistrictName, 'value': response.data.data[0].DistrictID },
                    MuncipalityID: { 'label': response.data.data[0].MuncipalityName, 'value': response.data.data[0].MuncipalityID },
                    WardID: { 'label': response.data.data[0].WardName, 'value': response.data.data[0].WardID },
                    CountryID: { 'label': response.data.data[0].CountryName, 'value': response.data.data[0].CountryID },
                    StateID: { 'label': response.data.data[0].StateName, 'value': response.data.data[0].StateID },
                    CityID: { 'label': response.data.data[0].CityName, 'value': response.data.data[0].CityID },
                    Locality: response.data.data[0].Locality,
                    Priority: { 'label': response.data.data[0].Priority, 'value': response.data.data[0].Priority },
                    Remarks: response.data.data[0].Remarks,
                });
            });
        }
        else {
            if (CompanyID==""&&ClientID=="") {
                Swal.fire({
                    title: 'Please Select Company & Client', icon: "error", timer: 1500
                });
            }
            else if (CompanyID!=""&&ClientID=="") {
                Swal.fire({
                    title: 'Please Select Client', icon: "error", timer: 1500
                });
            }
            else if (CompanyID==""&&ClientID!="") {
                Swal.fire({
                    title: 'Please Select Company', icon: "error", timer: 1500
                });
            }
            else {
                Swal.fire({
                    title: 'Something went wrong', icon: "error", timer: 1500
                });
            }
        }

    }
    GetBookingType() {
        var CompanyID="";
        var ClientID="";

        if (this.props.allCookies.MainCompanyID!==undefined) {
            CompanyID=this.props.allCookies.MainCompanyID;
        }
        if (this.props.allCookies.MainClientID!==undefined) {
            ClientID=this.props.allCookies.MainClientID
        }

        if (CompanyID!=""&&ClientID!="") {
            var data=JSON.stringify({
                "BookingTypeID": "",
                "CompanyID": CompanyID,
                "ClientID": ClientID
            });
            var config={
                method: 'POST',
                url: services.API_URL+"BookingType/getBookingType",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            services.JsonValue(config).then(response => {
                //debugger;
                this.setState({ bookingtypes: response.data.data.map(item => ({ value: item.BookingTypeID, label: item.BookingType })) });
            }, error => { })
        }
        else {
            if (CompanyID==""&&ClientID=="") {
                Swal.fire({
                    title: 'Please Select Company & Client', icon: "error", timer: 1500
                });
            }
            else if (CompanyID!=""&&ClientID=="") {
                Swal.fire({
                    title: 'Please Select Client', icon: "error", timer: 1500
                });
            }
            else if (CompanyID==""&&ClientID!="") {
                Swal.fire({
                    title: 'Please Select Company', icon: "error", timer: 1500
                });
            }
            else {
                Swal.fire({
                    title: 'Something went wrong', icon: "error", timer: 1500
                });
            }
        }


    }
    GetZone() {
        var CompanyID="";
        var ClientID="";
        var UserID="";

        if (this.props.allCookies.MainCompanyID!==undefined) {
            CompanyID=this.props.allCookies.MainCompanyID;
        }
        if (this.props.allCookies.MainClientID!==undefined) {
            ClientID=this.props.allCookies.MainClientID
        }
        if (this.props.allCookies.UserID!==undefined) {
            UserID=this.props.allCookies.UserID
        }

        var data=JSON.stringify({
            "ZoneID": "",
            "CompanyID": CompanyID,
            "ClientID": ClientID,
            "UserID": UserID
        });
        var config={
            method: 'POST',
            url: services.API_URL+"User/getUserZoneDetail",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        services.JsonValue(config).then(response => {
            //debugger;
            this.setState({ zones: response.data.data.map(item => ({ value: item.ZoneID, label: item.ZoneName })) });
        }, error => { })
    }
    ValidateBookingType=(e) => {
        this.setState({ BookingTypeErrMsg: '' });
    }
    ValidateCancelZone=(e) => {
        this.setState({ ZoneErrMsg: 'required' })
    }
    ValidateZone=(e) => {
        this.setState({ ZoneErrMsg: '' })
    }
    ValidateCancelDistrict=(e) => {
        this.setState({ DistrictErrMsg: 'required' })
    }
    ValidateDistrict=(e) => {
        this.setState({ DistrictErrMsg: '' });
    }
    ValidateCancelMunicipality=(e) => {
        this.setState({ MunicipalityErrMsg: 'required' })
    }
    ValidateMunicipality=(e) => {
        this.setState({ MunicipalityErrMsg: '' });
    }
    ValidateCancelWard=(e) => {
        this.setState({ WardErrMsg: 'required' })
    }
    ValidateWard=(e) => {
        this.setState({ WardErrMsg: '' });
    }
    ValidateCancelPriority=(e) => {
        this.setState({ PriorityErrMsg: 'required' })
    }
    ValidatePriority=(e) => {
        this.setState({ PriorityErrMsg: '' });
    }
    onZoneChange=(e) => {
        //debugger;
        if (e!=null) {
            var CompanyID="";
            var ClientID="";
            var UserID="";

            if (this.props.allCookies.MainCompanyID!==undefined) {
                CompanyID=this.props.allCookies.MainCompanyID;
            }
            if (this.props.allCookies.MainClientID!==undefined) {
                ClientID=this.props.allCookies.MainClientID
            }
            if (this.props.allCookies.UserID!==undefined) {
                UserID=this.props.allCookies.UserID
            }

            this.setState({ ZoneID: e }, () => { this.ValidateZone() });
            var data="";
            data=JSON.stringify({
                "ZoneID": e.value,
                "CompanyID": CompanyID,
                "ClientID": ClientID,
                "UserID": UserID
            });

            var config={
                method: 'POST',
                url: services.API_URL+"User/getUserDistrictDetail",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            services.JsonValue(config).then(response => {
                //debugger;

                if (response.data.status) {
                    //debugger;

                    this.setState({ districts: response.data.data.map(item => ({ value: item.DistrictID, label: item.DistrictName })) });
                    this.setState({ DistrictID: { 'label': '--Select District--', 'value': '--Select District--' } })
                    this.setState({ municipalities: [] });
                    this.setState({ MuncipalityID: { 'label': '--Select Municipality--', 'value': '--Select Municipality--' } })
                    this.setState({ wards: [] });
                    this.setState({ WardID: { 'label': '--Select Ward--', 'value': '--Select Ward--' } });
                }
                else {
                    this.setState({ districts: [] })
                    this.setState({ DistrictID: { 'label': '--Select District--', 'value': '--Select District--' } })
                    this.setState({ municipalities: [] });
                    this.setState({ MuncipalityID: { 'label': '--Select Municipality--', 'value': '--Select Municipality--' } })
                    this.setState({ wards: [] });
                    this.setState({ WardID: { 'label': '--Select Ward--', 'value': '--Select Ward--' } });
                }
            }, error => { })
        }
        else {
            this.setState({ ZoneID: { 'label': '--Select Zone--', 'value': '--Select Zone--' } }, () => { this.ValidateCancelZone() })
            this.setState({ districts: [] });
            this.setState({ DistrictID: { 'label': '--Select District--', 'value': '--Select District--' } }, () => { this.ValidateCancelDistrict() })
            this.setState({ municipalities: [] });
            this.setState({ MuncipalityID: { 'label': '--Select Municipality--', 'value': '--Select Municipality--' } }, () => { this.ValidateCancelMunicipality() })
            this.setState({ wards: [] });
            this.setState({ WardID: { 'label': '--Select Ward--', 'value': '--Select Ward--' } }, () => { this.ValidateCancelWard() });
        }


    }
    onDistrictChange=(e) => {
        debugger
        if (e!=null) {
            this.setState({ DistrictID: e }, () => { this.ValidateDistrict() });
            var CompanyID="";
            var ClientID="";
            var UserID="";

            if (this.props.allCookies.MainCompanyID!==undefined) {
                CompanyID=this.props.allCookies.MainCompanyID;
            }
            if (this.props.allCookies.MainClientID!==undefined) {
                ClientID=this.props.allCookies.MainClientID
            }
            if (this.props.allCookies.UserID!==undefined) {
                UserID=this.props.allCookies.UserID
            }

            // this.setState({ ZoneID: e });
            var data="";
            data=JSON.stringify({
                "DistrictID": e.value,
                "CompanyID": CompanyID,
                "ClientID": ClientID,
                "UserID": UserID
            });

            var config={
                method: 'POST',
                url: services.API_URL+"User/getUserMuncipalityDetail",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            services.JsonValue(config).then(response => {
                //debugger;

                if (response.data.status) {
                    //debugger;

                    this.setState({ municipalities: response.data.data.map(item => ({ value: item.MuncipalityID, label: item.MuncipalityName })) });
                    this.setState({ MuncipalityID: { 'label': '--Select Municipality--', 'value': '--Select Municipality--' } })
                    this.setState({ wards: [] });
                    this.setState({ WardID: { 'label': '--Select Ward--', 'value': '--Select Ward--' } });
                }
                else {
                    this.setState({ municipalities: [] })
                    this.setState({ MuncipalityID: { 'label': '--Select Municipality--', 'value': '--Select Municipality--' } });
                    this.setState({ wards: [] });
                    this.setState({ WardID: { 'label': '--Select Ward--', 'value': '--Select Ward--' } });
                }
            }, error => { })
        }
        else {
            this.setState({ DistrictID: { 'label': '--Select District--', 'value': '--Select District--' } }, () => { this.ValidateCancelDistrict() });
            this.setState({ municipalities: [] })
            this.setState({ MuncipalityID: { 'label': '--Select Municipality--', 'value': '--Select Municipality--' } }, () => { this.ValidateCancelMunicipality() });
            this.setState({ wards: [] });
            this.setState({ WardID: { 'label': '--Select Ward--', 'value': '--Select Ward--' } }, () => { this.ValidateCancelWard() });
        }
    }
    onMunicipalityChange=(e) => {
        if (e!=null) {
            this.setState({ MuncipalityID: e }, () => { this.ValidateMunicipality() });
            var CompanyID="";
            var ClientID="";
            var UserID="";

            if (this.props.allCookies.MainCompanyID!==undefined) {
                CompanyID=this.props.allCookies.MainCompanyID;
            }
            if (this.props.allCookies.MainClientID!==undefined) {
                ClientID=this.props.allCookies.MainClientID
            }
            if (this.props.allCookies.UserID!==undefined) {
                UserID=this.props.allCookies.UserID
            }

            //this.setState({ ZoneID: e });
            var data="";
            data=JSON.stringify({
                "MuncipalityID": e.value,
                "CompanyID": CompanyID,
                "ClientID": ClientID,
                "UserID": UserID
            });

            var config={
                method: 'POST',
                url: services.API_URL+"Ward/getWard",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            services.JsonValue(config).then(response => {
                //debugger;

                if (response.data.status) {
                    //debugger;

                    this.setState({ wards: response.data.data.map(item => ({ value: item.WardID, label: item.WardName })) });
                }
                else {
                    this.setState({ wards: [] })
                    this.setState({ WardID: { 'label': '--Select Ward--', 'value': '--Select Ward--' } });
                }
            }, error => { })
        }
        else {
            this.setState({ MuncipalityID: { 'label': '--Select Municipality--', 'value': '--Select Municipality--' } }, () => { this.ValidateCancelMunicipality() });
            this.setState({ wards: [] });
            this.setState({ WardID: { 'label': '--Select Ward--', 'value': '--Select Ward--' } }, () => { this.ValidateCancelWard() });
        }
    }
    onWardChange=(e) => {
        if (e!=null) {
            this.setState({ WardID: e }, () => { this.ValidateWard() });
        }
        else {
            this.setState({ WardID: { 'label': '--Select Ward--', 'value': '--Select Ward--' } }, () => { this.ValidateCancelWard() });
        }
    }
    onBookingTypeChange=(e) => {
        this.setState({ BookingTypeID: e }, () => { this.ValidateBookingType() });
    }
    GetCountry() {
        var data=JSON.stringify({
            "CountryID": ""
        });
        var config={
            method: 'POST',
            url: services.API_URL+"Country/getCountry",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        services.JsonValue(config).then(response => {
            //debugger;
            this.setState({ countries: response.data.data.map(item => ({ value: item.CountryID, label: item.CountryName })) });
        }, error => { })
    }
    onCountryChange=(e) => {
        //debugger;
        this.setState({ CountryID: e });
        if (e.value!="--Select Country--") {
            var data="";
            data=JSON.stringify({
                "CountryID": e.value
            });

            var config={
                method: 'POST',
                url: services.API_URL+"State/getState",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            services.JsonValue(config).then(response => {
                //debugger;

                if (response.data.status) {
                    this.setState({ states: response.data.data.map(item => ({ value: item.StateID, label: item.StateName })) });
                    this.setState({ StateID: { 'label': '--Select State--', 'value': '--Select State--' } })
                    this.setState({ cities: [] })
                    this.setState({ CityID: { 'label': '--Select City--', 'value': '--Select City--' } })
                }
                else {
                    this.setState({ states: [] })
                    this.setState({ StateID: { 'label': '--Select State--', 'value': '--Select State--' } })
                    this.setState({ cities: [] })
                    this.setState({ CityID: { 'label': '--Select City--', 'value': '--Select City--' } })
                }
            }, error => { })
        }
        else {
            this.setState({ CountryID: { 'label': '--Select Country--', 'value': '--Select Country--' } });
        }
    }
    ValidateState=(e) => {
        this.setState({ StateErrMsg: '' })
    }
    ValidateCancelState=(e) => {
        this.setState({ StateErrMsg: 'required' })
    }
    onStateChange=(e) => {
        //debugger;
        if (e!=null) {
            this.setState({ StateID: e }, () => { this.ValidateState() });
            var data="";
            if (e.value!="--Select State--") {
                data=JSON.stringify({
                    "StateID": e.value
                });

                var config={
                    method: 'POST',
                    url: services.API_URL+"City/getCity",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    //debugger;

                    if (response.data.status) {
                        this.setState({ CityID: { 'label': '--Select City--', 'value': '--Select City--' } })
                        this.setState({ cities: response.data.data.map(item => ({ value: item.CityID, label: item.CityName })) });

                    }
                    else {
                        this.setState({ cities: [] })
                        this.setState({ CityID: { 'label': '--Select City--', 'value': '--Select City--' } })
                    }

                }, error => { })
            }
            else {
                this.setState({ StateID: { 'label': '--Select State--', 'value': '--Select State--' } });
            }
        }
        else {
            this.setState({ StateID: { 'label': '--Select State--', 'value': '--Select State--' } }, () => { this.ValidateCancelState() });
            this.setState({ cities: [] })
            this.setState({ CityID: { 'label': '--Select City--', 'value': '--Select City--' } }, () => { this.ValidateCancelCity() })
        }


    }
    ValidateCity=(e) => {
        this.setState({ CityErrMsg: '' })
    }
    ValidateCancelCity=(e) => {
        this.setState({ CityErrMsg: 'required' })
    }
    onCityChange=(e) => {
        if (e!==null) {
            this.setState({ CityID: e }, () => { this.ValidateCity() });
        }
        else {
            this.setState({ CityID: { 'label': '--Select City--', 'value': '--Select City--' } }, () => { this.ValidateCancelCity() });
        }
    }
    onPriorityChange=(e) => {
        if (e!==null) {
            this.setState({ Priority: e }, () => { this.ValidatePriority() });
        }
        else {
            this.setState({ Priority: { 'label': '--Select Priority--', 'value': '--Select Priority--' } }, () => { this.ValidateCancelPriority() });
        }
    }
    ClearData=(e) => {
        //debugger;
        this.setState({
            data: [], bookingtypes: [], zones: [], districts: [], municipalities: [], wards: [], countries: [], states: [], cities: [],
            priorities: [{ 'label': 'High', 'value': 'High' }, { 'label': 'Medium', 'value': 'Medium' }, { 'label': 'Low', 'value': 'Low' }],
            BookingTypeID: { 'label': '--Select Task Type--', 'value': '--Select Task Type--' },
            ZoneID: { 'label': '--Select Zone--', 'value': '--Select Zone--' },
            DistrictID: { 'label': '--Select District--', 'value': '--Select District--' },
            MuncipalityID: { 'label': '--Select Municipality--', 'value': '--Select Municipality--' },
            WardID: { 'label': '--Select Ward--', 'value': '--Select Ward--' },
            CountryID: { 'label': '--Select Country--', 'value': '--Select Country--' },
            StateID: { 'label': '--Select State--', 'value': '--Select State--' },
            CityID: { 'label': '--Select City--', 'value': '--Select City--' },
            Priority: { 'label': '--Select Priority--', 'value': '--Select Priority--' },
            BookingTypeErrMsg: "", TaskDateErrMsg: "", ZoneErrMsg: "", DistrictErrMsg: "", MunicipalityErrMsg: "", WardErrMsg: "", StateErrMsg: "", CityErrMsg: "",
            PriorityErrMsg: "",
            BookingID: "", BookingNo: "", BookingDate: new Date(), Locality: "", Remarks: "",
        });
        this.form.reset();
        this.GetBookingType();
        this.GetZone();
        this.GetCountry();
        this.onCountryChange(1);
        this.setState({ CountryID: { 'label': 'India', 'value': '1' } })
    }
    onBookingDateChange=(e) => {
        debugger
        this.setState({ BookingDate: e }, () => { this.form.validateFields(e.target) })
    }
    ValidateTaskDate=(e) => {
        this.setState({ TaskDateErrMsg: '' })
    }
    ValidateCancelTaskDate=(e) => {
        this.setState({ TaskDateErrMsg: 'required' })
    }
    CheckBookingDate=(e) => {
        this.setState({ isChanging: true });
    }
    handleSubmit=(e) => {
        debugger;
        e.preventDefault();


        this.form.validateFields();

        var CompanyID="";
        var ClientID="";
        var UserID="";
        var UserType="";

        if (this.props.allCookies.MainCompanyID!==undefined) {
            CompanyID=this.props.allCookies.MainCompanyID;
        }
        if (this.props.allCookies.MainClientID!==undefined) {
            ClientID=this.props.allCookies.MainClientID
        }
        if (this.props.allCookies.UserID!==undefined) {
            UserID=this.props.allCookies.UserID
        }
        if (this.props.allCookies.UserType!==undefined) {
            UserType=this.props.allCookies.UserType
        }

        if (this.state.BookingTypeID.value=="--Select Task Type--") {
            this.setState({ BookingTypeErrMsg: 'required' });
        }

        if (this.state.BookingDate=="") {
            this.setState({ TaskDateErrMsg: 'required' });
        }

        if (this.state.ZoneID.value=="--Select Zone--") {
            this.setState({ ZoneErrMsg: 'required' });
        }

        if (this.state.DistrictID.value=="--Select District--") {
            this.setState({ DistrictErrMsg: 'required' });
        }

        if (this.state.MuncipalityID.value=="--Select Municipality--") {
            this.setState({ MunicipalityErrMsg: 'required' });
        }

        if (this.state.WardID.value=="--Select Ward--") {
            this.setState({ WardErrMsg: 'required' });
        }

        if (this.state.StateID.value=="--Select State--") {
            this.setState({ StateErrMsg: 'required' });
        }

        if (this.state.CityID.value=="--Select City--") {
            this.setState({ CityErrMsg: 'required' });
        }

        if (this.state.Priority.value=="--Select Priority--") {
            this.setState({ PriorityErrMsg: 'required' });
        }

        if (this.form.isValid()) {
            if (CompanyID!=""&&ClientID!="") {
                var data="";
                if (this.state.BookingID!="") {
                    data=JSON.stringify({
                        "BookingID": this.state.BookingID,
                        "CompanyID": CompanyID,
                        "ClientID": ClientID,
                        "UserID": UserID,
                        "BookingTypeID": this.state.BookingTypeID.value,
                        "BookingNo": this.state.BookingNo,
                        "BookingDate": moment(this.state.BookingDate).format('DD-MM-YYYY'),
                        "ZoneID": this.state.ZoneID.value,
                        "DistrictID": this.state.DistrictID.value,
                        "MuncipalityID": this.state.MuncipalityID.value,
                        "WardID": this.state.WardID.value,
                        "CountryID": this.state.CountryID.value,
                        "StateID": this.state.StateID.value,
                        "CityID": this.state.CityID.value,
                        "Locality": this.state.Locality,
                        "Remarks": this.state.Remarks,
                        "Priority": this.state.Priority.value,
                        "EntryByUserType": UserType,
                        "EntryByUserID": UserID
                    });

                }
                else {
                    data=JSON.stringify({
                        "BookingID": "",
                        "CompanyID": CompanyID,
                        "ClientID": ClientID,
                        "UserID": UserID,
                        "BookingTypeID": this.state.BookingTypeID.value,
                        "BookingNo": this.state.BookingNo,
                        "BookingDate": moment(this.state.BookingDate).format('DD-MM-YYYY'),
                        "ZoneID": this.state.ZoneID.value,
                        "DistrictID": this.state.DistrictID.value,
                        "MuncipalityID": this.state.MuncipalityID.value,
                        "WardID": this.state.WardID.value,
                        "CountryID": this.state.CountryID.value,
                        "StateID": this.state.StateID.value,
                        "CityID": this.state.CityID.value,
                        "Locality": this.state.Locality,
                        "Remarks": this.state.Remarks,
                        "Priority": this.state.Priority.value,
                        "EntryByUserType": UserType,
                        "EntryByUserID": UserID
                    });
                }
                var config={
                    method: 'POST',
                    url: services.API_URL+"Booking/setBooking",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    ////debugger;
                    if (response.data.status) {
                        //debugger;
                        if (this.state.BookingID!="") {
                            // Swal.fire({ position: 'top-end', toast: true, icon: 'success', title: 'Successfully Updated', showConfirmButton: false, timer: 1500 });
                            Swal.fire({
                                title: 'Successfully Updated', icon: "success", timer: 1500
                            }).then(function () {
                                window.location.href="viewtask";
                            });
                        }
                        else {
                            Swal.fire({
                                title: 'Successfully Inserted', icon: "success", timer: 1500
                            });
                        }
                        this.ClearData();
                        //this.GetMuncipality();
                    }
                    else {
                        Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
                    }
                }, error => { })

            }
            else {
                if (CompanyID==""&&ClientID=="") {
                    Swal.fire({
                        title: 'Please Select Company & Client', icon: "error", timer: 1500
                    });
                }
                else if (CompanyID!=""&&ClientID=="") {
                    Swal.fire({
                        title: 'Please Select Client', icon: "error", timer: 1500
                    });
                }
                else if (CompanyID==""&&ClientID!="") {
                    Swal.fire({
                        title: 'Please Select Company', icon: "error", timer: 1500
                    });
                }
                else {
                    Swal.fire({
                        title: 'Something went wrong', icon: "error", timer: 1500
                    });
                }
            }

        }

    }
    render() {
        return (
            <>
                <div className="container-fluid" style={{ marginTop: '10%' }}>
                    <div className="row">

                        <div className="col-md-12">
                            <div className="card card-custom gutter-b example example-compact">
                                <div className="card-header">
                                    <h3 className="card-title">Add Task</h3>
                                </div>
                                <FormWithConstraints
                                    ref={form => this.form=form}
                                    onSubmit={this.handleSubmit}
                                    noValidate>
                                    <div className="card-body">
                                        <div className="row">

                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Task Type <span className="text-danger">*</span></label>
                                                    <Select options={this.state.bookingtypes} value={this.state.BookingTypeID} onChange={this.onBookingTypeChange} />
                                                    {this.state.BookingTypeErrMsg&&<span className="text-danger">{this.state.BookingTypeErrMsg==='required'? '*':''}</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Task No <span className="text-danger">*</span> </label>
                                                    <input type="text" name="BookingNo" required value={this.state.BookingNo} onChange={(e) => this.setState({ BookingNo: e.target.value }, () => { this.form.validateFields(e.target) })} onKeyPress={this.allowOnlyNumbers} className="form-control" placeholder="Enter Task No" />
                                                    <FieldFeedbacks for="BookingNo">
                                                        <FieldFeedback when="valueMissing">
                                                            *
                                                        </FieldFeedback>
                                                    </FieldFeedbacks>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Task Date </label>
                                                    {/* <input id="txtTaskDate" name="TaskDate"  required value={this.state.BookingDate} onClick={this.onBookingDateChange} type="text" className="form-control"
                                                        placeholder="Select Booking Date" /> */}
                                                    <DatePicker dateFormat="dd-MM-yyyy" selected={this.state.BookingDate} minDate={new Date()} autoComplete="off" className="form-control readonly" id="txtTaskDate" value={this.state.BookingDate} onChange={(e) => {
                                                        this.setState({ BookingDate: e }, () => { this.ValidateTaskDate() });
                                                    }} />
                                                    {this.state.TaskDateErrMsg&&<span className="text-danger">{this.state.TaskDateErrMsg==='required'? '*':''}</span>}
                                                    {/* <DatePicker dropdownMode="select"
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        adjustDateOnChange minDate={new Date()} className="form-control" id="example-datepicker" value={this.state.BookingDate} selected={this.state.BookingDate} /> */}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Zone <span className="text-danger">*</span> </label>
                                                    <Select isClearable={true} options={this.state.zones} value={this.state.ZoneID} onChange={this.onZoneChange} />
                                                    {this.state.ZoneErrMsg&&<span className="text-danger">{this.state.ZoneErrMsg==='required'? '*':''}</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>District <span className="text-danger">*</span> </label>
                                                    <Select isClearable={true} options={this.state.districts} value={this.state.DistrictID} onChange={this.onDistrictChange} />
                                                    {this.state.DistrictErrMsg&&<span className="text-danger">{this.state.DistrictErrMsg==='required'? '*':''}</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Municipality <span className="text-danger">*</span> </label>
                                                    <Select isClearable={true} options={this.state.municipalities} value={this.state.MuncipalityID} onChange={this.onMunicipalityChange} />
                                                    {this.state.MunicipalityErrMsg&&<span className="text-danger">{this.state.MunicipalityErrMsg==='required'? '*':''}</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Ward <span className="text-danger">*</span> </label>
                                                    <Select isClearable={true} options={this.state.wards} value={this.state.WardID} onChange={this.onWardChange} />
                                                    {this.state.WardErrMsg&&<span className="text-danger">{this.state.WardErrMsg==='required'? '*':''}</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Country </label>
                                                    <Select options={this.state.countries} value={this.state.CountryID} onChange={this.onCountryChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>State <span className="text-danger">*</span></label>
                                                    <Select isClearable={true} options={this.state.states} value={this.state.StateID} onChange={this.onStateChange} />
                                                    {this.state.StateErrMsg&&<span className="text-danger">{this.state.StateErrMsg==='required'? '*':''}</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>City <span className="text-danger">*</span></label>
                                                    <Select isClearable={true} options={this.state.cities} value={this.state.CityID} onChange={this.onCityChange} />
                                                    {this.state.CityErrMsg&&<span className="text-danger">{this.state.CityErrMsg==='required'? '*':''}</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Locality <span className="text-danger">*</span></label>
                                                    <input type="text" name="Locality" required value={this.state.Locality} onChange={(e) => this.setState({ Locality: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter Locality" />
                                                    <FieldFeedbacks for="Locality">
                                                        <FieldFeedback when="valueMissing">
                                                            *
                                                        </FieldFeedback>
                                                    </FieldFeedbacks>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Priority <span className="text-danger">*</span></label>
                                                    <Select isClearable={true} options={this.state.priorities} value={this.state.Priority} onChange={this.onPriorityChange} />
                                                    {this.state.PriorityErrMsg&&<span className="text-danger">{this.state.PriorityErrMsg==='required'? '*':''}</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Remarks </label>
                                                    <textarea rows={3} className="form-control" value={this.state.Remarks} onChange={(e) => this.setState({ Remarks: e.target.value })} />

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <button type="submit" onSubmit={this.handleSubmit} className="btn btn-primary mr-2">
                                            Submit
                                        </button>
                                        <button type="button" onClick={this.ClearData} className="btn btn-secondary">
                                            Cancel
                                        </button>
                                        <NavLink to={"/viewtask"} className="btn btn-outline-primary font-weight-bolder ml-2">
                                            View
                                        </NavLink >
                                        {/* <a href="/viewbooking" className="btn btn-outline-primary font-weight-bolder ml-2">
                                            View</a> */}
                                    </div>
                                </FormWithConstraints>
                            </div>
                        </div>

                    </div>
                </div>
            </>
        );
    }
}
export default withCookies(booking);