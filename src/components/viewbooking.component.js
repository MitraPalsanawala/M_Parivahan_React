import React, { Component } from "react";

import services from "../services/services";
import Swal from "sweetalert2";
import MaterialTable, { MTableToolbar } from '@material-table/core';
import '../style.css';
import Select, { components } from 'react-select'
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import MultiSelect from "@khanacademy/react-multi-select";
import { NavLink } from "react-router-dom";
import Geocode from "react-geocode";
import moment from 'moment';
import $ from 'jquery';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import {
    Async,
    FieldFeedback,
    FieldFeedbacks,
    FormWithConstraints,
    Input
} from 'react-form-with-constraints';
import { de } from "date-fns/locale";

const headerTblStyle={ color: 'black' };


class viewbooking extends Component {
    constructor(props) {
        super(props);
        const { cookies }=props;
        this.state={
            name: cookies.get('name')||'Ben'
        };
        this.tableRef=React.createRef();
        this.state={
            data: [], municipalities: [], MunicipalityID: [], vehicles: [], drivers: [], helpers: [{ 'id': 'No Helpers', 'value': 'No Helpers' }],
            parkinglocations: [], checklists: [{ 'id': 'No Checklist', 'value': 'No Checklist' }],
            HelperData: [{ UserID: '' }],
            BookingApprovals: [{ 'label': 'Approved', 'value': 'Approved' }, { 'label': 'Referred Back', 'value': 'Referred Back' }],
            isChecked: false, isCheckListChecked: false, NoHelperVisibleMsg: false, HelperDataAvailable: true,
            VehicleID: { 'label': '--Select Vehicle--', 'value': '--Select Vehicle--' },
            DriverID: { 'label': '--Select Driver--', 'value': '--Select Driver--' },
            ParkingLocationID: { 'label': '--Select Parking Location--', 'value': '--Select Parking Location--' },
            BookingApprovalStatus: { 'label': '--Select Booking Status--', 'value': '--Select Booking Status--' },
            BookingNo: "", StartDate: new Date(), EndDate: new Date(), BookingMunicipalityID: "",
            VehicleLeaveParkingTime: "", VehicleReachedLocationTime: "", VehicleLeaveParkingOdometer: "", JettingStartMeterReading: "",
            SuctionPumpStartMeterReading: "", TaskFile: [], TaskImages: "", Latitude: null, Longitude: null, CurrentAddress: "",
            VehicleReachedLocationOdometer: "", VehicleReturnLocationTime: "", VehicleReturnLocationOdometer: "", VehicleReachedParkingTime: "",
            VehicleReachedParkingOdometer: "", JettingFinishMeterReading: "", SuctionPumpFinishMeterReading: "", TotalNoOfDranageLine: "",
            DrainageLine150to300mmDiaMeter: "", DrainageLine301to600mmDiaMeter: "", DrainageLine601to900mmDiaMeter: "",
            DrainageLine901to1200mmDiaMeter: "", JettingSystem: "", SuctionSystem: "", SuctionHose5Diameter3MeterLong: "",
            JettingHose32Diameter120MeterLong: "", JettingNozzleDeChockingNozzle: "", DeSiltingNozzleFlatNozzle: "",
            BalanceNozzleBombNozzle: "", BookingFinishLatitude: "", BookingFinishLongitude: "", BookingFinishAddress: "",
            Shift: "", FinishTaskFile: [], FinishTaskImages: "",
            BookingCompleteRemarks: "", BookingCompleteRemarksGujarati: "", TenderLiquidityDamagesCondition: "", BookingCompleteStatus: "",
            LogSheetTaskFile: [], LogSheetImage: "",
            BookingApprovalRemarks: "", FinishTaskImageText: "", FinishTaskImageTextVisible: true,
            isFilterVisible: false, iconFilter: "fa fa-plus",
            modalvisible: false, IsHelperChange: false, AddTaskHidden: false, getCurrentLocation: false, IsCompleteDisabled: true,
            isFinishEditVisible: true, IsFinishUpdatesVisible: false,
            faicon: "fa fa-plus",
            PanelUserType: "", FinishTaskImageErrMsg: "", PreviousID: "",
            RefferBackAssignDate: "", IsReferredAssignDataVisible: false, BookingZoneID: "", BookingDistrictID: "",
            VehicleErrMsg: "", DriverErrMsg: "", HelperErrMsg: "", CheckListErrMsg: "", ParkingLocationErrMsg: "", TaskImageErrMsg: "",
            CompleteTaskErrImage: "", BookingApprovalStatusErrMsg: "",
            cols: [
                { title: 'Sr.No', width: '5%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.tableData.id+1}</p>) } },
                {
                    title: 'Details', width: '5%', removable: false,hidden:true, headerStyle: headerTblStyle, render: rowData => {
                        return (<i style={{ color: 'black' }} className={this.state.faicon} onClick={this.onToggleDetailPanel(rowData.BookingID, rowData.tableData.id)}></i>)
                    }
                },
                { title: 'Status', width: '5%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.BookingStatus}</p>) } },
                {
                    title: 'Action', width: '5%', removable: false, headerStyle: headerTblStyle, render: rowData => {
                        return (
                            rowData.BookingStatus=="New"? (
                                this.state.PanelUserType==="Supervisor"&&
                                <button type="button" class="btn btn-primary" onClick={this.OnAssignClick(rowData.BookingDate, rowData.BookingID, rowData.ZoneID, rowData.DistrictID, rowData.MuncipalityID)}>
                                    Assign
                                </button>):rowData.BookingStatus=="Assigned"? (
                                    this.state.PanelUserType==="Vehicle"&&
                                    <button type="button" class="btn btn-primary" onClick={this.OnAssignStartClick(rowData.BookingDate, rowData.BookingID, rowData.BookingTaskDetailID)}>
                                        Start
                                    </button>):rowData.BookingStatus=="Started"? (
                                        this.state.PanelUserType==="Vehicle"&&
                                        <button type="button" class="btn btn-primary" onClick={this.OnAssignFinishClick(rowData.BookingDate, rowData.BookingID, rowData.BookingTaskDetailID)}>
                                            Finish
                                        </button>):rowData.BookingStatus=="Finished"? (
                                            this.state.PanelUserType==="Supervisor"&&
                                            <button type="button" class="btn btn-primary" onClick={this.OnAssignCompleteClick(rowData.BookingDate, rowData.BookingID, rowData.BookingTaskDetailID)}>
                                                Complete
                                            </button>):rowData.BookingStatus=="Completed"? (
                                                <button type="button" class="btn btn-primary" onClick={this.OnAssignApprovedClick(rowData.BookingDate, rowData.BookingID, rowData.BookingTaskDetailID)}>
                                                    Approved
                                                </button>):rowData.BookingStatus=="Referred Back"? (
                                                    <>
                                                        <button type="button" class="btn btn-primary" onClick={this.OnAssignCompleteClick(rowData.BookingDate, rowData.BookingID, rowData.BookingTaskDetailID)}>
                                                            Complete
                                                        </button><br /><br />
                                                        <button type="button" class="btn btn-primary" onClick={this.OnRefferedBackAssignClick(rowData.BookingID, rowData.ZoneID, rowData.DistrictID, rowData.MuncipalityID)}>
                                                            Assign
                                                        </button>
                                                    </>
                                                ):

                                '')
                    }
                },
                { title: (<div style={{ width: '100%' }}><span>Country Name</span><hr style={{ marginTop: '5px', marginBottom: '5px' }} /><span>State Name</span><hr style={{ marginTop: '5px', marginBottom: '5px' }} /><span>City Name</span></div>), width: '10%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.CountryName}<hr />{rowData.StateName}<hr />{rowData.CityName}</p>) } },
                { title: (<div style={{ width: '100%' }}><span>Task No</span><hr style={{ marginTop: '5px', marginBottom: '5px' }} /><span>Task Type</span></div>), width: '10%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.BookingNo}<hr />{rowData.BookingType}</p>) } },
                { title: (<div style={{ width: '100%' }}><span>Zone Name</span><hr style={{ marginTop: '5px', marginBottom: '5px' }} /><span>District Name</span><hr style={{ marginTop: '5px', marginBottom: '5px' }} /><span>Municipality Name</span><hr style={{ marginTop: '5px', marginBottom: '5px' }} /><span>Ward Name</span></div>), width: '20%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.ZoneName}<hr />{rowData.DistrictName}<hr />{rowData.MuncipalityName}<hr />{rowData.WardName}</p>) } },
                { title: 'Locality', width: '10%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.Locality}</p>) } },
                { title: 'Priority', width: '10%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p className={rowData.Priority=="High"? "label font-weight-bold label-lg label-light-danger label-inline":rowData.Priority=="Medium"? "label font-weight-bold label-lg label-light-primary label-inline":"label font-weight-bold label-lg label-light-success label-inline"} style={{ marginBottom: '1px' }}>{rowData.Priority}</p>) } },
                { title: 'Remarks', width: '10%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.Remarks}</p>) } },
                { title: 'Task Date', width: '10%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.BookingDate}</p>) } },
            ],
            detailcols: [
                { title: 'Assign Vehicle', width: '10%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px', fontSize: '12px' }}>{rowData.VehicleNo}</p>) } },
                { title: 'Assign Driver', width: '10%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px', textAlign: 'left', fontSize: '12px' }}>{rowData.DriverFullName}</p>) } },
                { title: 'Assign Date', width: '10%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px', fontSize: '12px' }}>{rowData.AssignDate}</p>) } },
            ]
        }
    }
    getCurrentTime() {
        debugger;
        var today=new Date(),
            time=today.getHours()+':'+(today.getMinutes()<10? '0':'')+today.getMinutes();
        this.setState({ VehicleLeaveParkingTime: time });
        this.setState({ VehicleReachedLocationTime: time });
        this.setState({ VehicleReturnLocationTime: time });
        this.setState({ VehicleReachedParkingTime: time });
    }
    componentDidMount() {
        var UserType="";
        if (this.props.allCookies.UserType!==undefined) {
            UserType=this.props.allCookies.UserType
            this.setState({ PanelUserType: UserType });
            if (UserType=="Vehicle") {
                this.setState({ AddTaskHidden: true }, () => { this.getCurrentTime() });
                this.GetParkingLocation();
                this.GetCheckList();

            }
        }
        this.GetBooking();
        this.GetMunicipality();
    }
    GetMunicipality() {

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
        var data="";
        data=JSON.stringify({
            "UserID": UserID,
            "CompanyID": CompanyID,
            "ClientID": ClientID,
            "ZoneID": "",
            "DistrictID": ""
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
                this.setState({ municipalities: response.data.data.map(item => ({ value: item.MuncipalityID, label: item.MuncipalityName })) });
                this.setState({ MunicipalityID: [] })

            }
            else {
                this.setState({ municipalities: [] })
            }
        }, error => { })
    }
    GetParkingLocation() {
        var CompanyID="";
        if (this.props.allCookies.MainCompanyID!==undefined) {
            CompanyID=this.props.allCookies.MainCompanyID;
        }
        if (CompanyID!="") {
            var data=JSON.stringify({
                "ParkingLocationID": "",
                "CompanyID": CompanyID,
                "CountryID": "",
                "StateID": "",
                "CityID": ""
            });
            var config={
                method: 'POST',
                url: services.API_URL+"ParkingLoction/getParkingLocation",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            services.JsonValue(config).then(response => {
                debugger;
                this.setState({ parkinglocations: response.data.data.map(item => ({ value: item.ParkingLocationID, label: item.ParkingLocationName })) });
            }, error => { })
        }
        else {
            Swal.fire({
                title: 'Please Select Company', icon: "error", timer: 1500
            });
        }

    }
    onToggleDetailPanel=(BookingID, id) => (e) => {
        e.preventDefault();
        debugger;

        var rowid=id;
        if (!this.tableRef.current) return;

        const { detailPanel }=this.tableRef.current.props;
        let handleShowDetailPanel=detailPanel;

        // If props.detailPanel is an array not a func
        if (typeof detailPanel==='object') {
            // ~ I AM USING INDEX 0 HERE - CHANGE TO WHATEVER YOU NEED ~
            handleShowDetailPanel=detailPanel[0].render
        }

        //var bid = rowData;
        var data=JSON.stringify({
            "BookingID": BookingID
        });
        var config={
            method: 'POST',
            url: services.API_URL+"Booking/getBookingTaskDetail",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        services.JsonValue(config).then(response => {
            if (response.data.status) {
                // if(this.state.faicon == "fa fa-plus")
                // {
                //     this.setState({faicon:"fa fa-minus"});
                // }
                // else{
                //     this.setState({faicon:"fa fa-plus"});
                // }
                this.setState({ detaildata: response.data.data })

                const updateddatas = this.state.data.map((c, i) => {
                    debugger
                    if (c.tableData !== undefined) {
                      // Increment the clicked counter
                      return c
                    } else {
                      // The rest haven't changed
                      return c;
                    }
                  });

               // this.setState({ data: newState });


               //const _data=[...this.state.data]; // Make copy of data
               const _data=[...updateddatas]; // Make copy of data

                // If `showDetailPanel` already exists, remove it to close the detailPanel..
                //var check  = _data[id].contains("tableData");

                var datatd=_data[id].tableData;
                if (datatd==undefined) {
                    _data[id].tableData={
                        ..._data[id],
                        showDetailPanel: handleShowDetailPanel
                    }
                }
                else {
                    if (_data[id].tableData.showDetailPanel) {
                        _data[id].tableData.showDetailPanel='';
                    } else {

                        // If `showDetailPanel` does not exist, add it to open detailPanel..
                        _data[id].tableData={
                            ..._data[id],
                            showDetailPanel: handleShowDetailPanel
                        }
                    }
                }

                this.setState({ data: _data });
                // this.tableRef.current.onToggleDetailPanel(
                //         [3],
                //         this.tableRef.current.props.detailPanel[0].render
                //     )
            }
            else {
                this.setState({ detaildata: [] })
            }

        }, error => { })

        // this.tableRef.current.onToggleDetailPanel(
        //     [0],
        //     this.tableRef.current.props.detailPanel[0].render
        // )
    }
    GetBooking() {
        //debugger;
        var CompanyID="";
        var ClientID="";
        var UserID="";
        var MunicipalityID="";
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
        //var MunicipalityID="";
        if (this.state.MunicipalityID!=null) {
            var datas=this.state.MunicipalityID.map(

                item => (
                    MunicipalityID+=item+","
                )
            );
            MunicipalityID=MunicipalityID.slice(0, -1)
        }

        var APIName="";
        var data="";
        if (UserType=="Supervisor") {
            APIName="Booking/getBooking"
            data=JSON.stringify({
                BookingID: "",
                CompanyID: CompanyID,
                ClientID: ClientID,
                UserID: UserID,
                UserTypeID: "",
                UserType: "",
                BookingTypeID: "",
                BookingNo: this.state.BookingNo,
                ZoneID: "",
                DistrictID: "",
                MuncipalityID: MunicipalityID,
                WardID: "",
                Priority: "",
                BookingStatus: "",
                StartDate: "",
                EndDate: ""
            });
        }
        else if (UserType=="Vehicle") {
            APIName="Booking/getVehicleBooking"
            data=JSON.stringify({
                BookingID: "",
                CompanyID: CompanyID,
                ClientID: ClientID,
                VehicleUserID: UserID,
                UserID: "",
                UserTypeID: "",
                UserType: "",
                BookingTypeID: "",
                BookingNo: "",
                ZoneID: "",
                DistrictID: "",
                MuncipalityID: "",
                WardID: "",
                Priority: "",
                BookingStatus: "",
                StartDate: "",
                EndDate: ""
            });
        }
        else {
            APIName="Booking/getBooking"
            data=JSON.stringify({
                BookingID: "",
                CompanyID: CompanyID,
                ClientID: ClientID,
                UserID: UserID,
                UserTypeID: "",
                UserType: "",
                BookingTypeID: "",
                BookingNo: this.state.BookingNo,
                ZoneID: "",
                DistrictID: "",
                MuncipalityID: MunicipalityID,
                WardID: "",
                Priority: "",
                BookingStatus: "",
                StartDate: "",
                EndDate: ""
            });
        }


        var config={
            method: 'POST',
            url: services.API_URL+APIName,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        services.JsonValue(config).then(response => {
            if (response.data.status) {
                this.setState({ data: response.data.data })
            }
            else {
                this.setState({ data: [] })
            }

        }, error => { })
    }
    GetVehicle(BookingDate, ZoneID, DistrictID, MuncipalityID) {
        debugger;
        var CompanyID="";
        var ClientID="";
        //var BookingDate = "";
        if (this.props.allCookies.MainCompanyID!==undefined) {
            CompanyID=this.props.allCookies.MainCompanyID;
        }
        if (this.props.allCookies.MainClientID!==undefined) {
            ClientID=this.props.allCookies.MainClientID
        }

        if (CompanyID!=""&&ClientID!="") {
            var data=JSON.stringify({
                "CompanyID": CompanyID,
                "ClientID": ClientID,
                "BookingDate": BookingDate,
                "UserType": "Vehicle",
                "BookingStatus": "Finished,Completed,Approved",
                "ZoneID": ZoneID,
                "DistrictID": DistrictID,
                "MuncipalityID": MuncipalityID,
            });
            var config={
                method: 'POST',
                url: services.API_URL+"Booking/getVehicleDataForAssignBooking",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            services.JsonValue(config).then(response => {
                //debugger;
                if (response.data.status) {
                    this.setState({ vehicles: response.data.data.map(item => ({ value: item.VehicleID, label: item.VehicleNo })) });
                }
                else {
                    this.setState({ vehicles: [] });
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
    GetDriver(BookingDate, ZoneID, DistrictID, MuncipalityID) {
        var CompanyID="";
        var ClientID="";
        //var BookingDate = "";
        if (this.props.allCookies.MainCompanyID!==undefined) {
            CompanyID=this.props.allCookies.MainCompanyID;
        }
        if (this.props.allCookies.MainClientID!==undefined) {
            ClientID=this.props.allCookies.MainClientID
        }

        if (CompanyID!=""&&ClientID!="") {
            var data=JSON.stringify({
                "CompanyID": CompanyID,
                "ClientID": ClientID,
                "BookingDate": BookingDate,
                "UserType": "Driver",
                "BookingStatus": "Finished,Completed,Approved",
                "ZoneID": ZoneID,
                "DistrictID": DistrictID,
                "MuncipalityID": MuncipalityID
            });
            var config={
                method: 'POST',
                url: services.API_URL+"Booking/getDriverDataForAssignBooking",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            services.JsonValue(config).then(response => {
                debugger;
                if (response.data.status) {
                    this.setState({ drivers: response.data.data.map(item => ({ value: item.UserID, label: item.FullName })) }, () => { this.GetHelper(BookingDate, ZoneID, DistrictID, MuncipalityID) });
                }
                else {
                    this.setState({ drivers: [] });
                    this.setState({ helpers: [] });
                    this.setState({ HelperDataAvailable: false });
                    this.setState({ NoHelperVisibleMsg: true });
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
    GetHelper(BookingDate, ZoneID, DistrictID, MuncipalityID) {
        var CompanyID="";
        var ClientID="";
        //var BookingDate = "";
        if (this.props.allCookies.MainCompanyID!==undefined) {
            CompanyID=this.props.allCookies.MainCompanyID;
        }
        if (this.props.allCookies.MainClientID!==undefined) {
            ClientID=this.props.allCookies.MainClientID
        }

        if (CompanyID!=""&&ClientID!="") {
            var data=JSON.stringify({
                "CompanyID": CompanyID,
                "ClientID": ClientID,
                "BookingDate": BookingDate,
                "UserType": "Helper",
                "BookingStatus": "Finished,Completed,Approved",
                "ZoneID": ZoneID,
                "DistrictID": DistrictID,
                "MuncipalityID": MuncipalityID
            });
            var config={
                method: 'POST',
                url: services.API_URL+"Booking/getHelperDataForAssignBooking",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            services.JsonValue(config).then(response => {
                debugger;
                if (response.data.status) {
                    debugger;
                    this.setState({ helpers: response.data.data.map(item => ({ id: item.UserID, value: item.FullName, isChecked: false })) });
                }
                else {
                    this.setState({ helpers: [] })
                }
                // var SelectAll={ 'label': 'Select All', 'value': 'Select All' };
                // this.setState({ helpers: [SelectAll, ...response.data.data.map(item => ({ value: item.UserID, label: item.FullName }))] });


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
    GetCheckList() {
        var CompanyID="";
        var ClientID="";
        //var BookingDate = "";
        if (this.props.allCookies.MainCompanyID!==undefined) {
            CompanyID=this.props.allCookies.MainCompanyID;
        }
        if (this.props.allCookies.MainClientID!==undefined) {
            ClientID=this.props.allCookies.MainClientID
        }

        if (CompanyID!=""&&ClientID!="") {
            var data=JSON.stringify({
                "CheckListID": "",
                "CompanyID": CompanyID,
                "ClientID": ClientID
            });
            var config={
                method: 'POST',
                url: services.API_URL+"CheckList/getCheckList",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            services.JsonValue(config).then(response => {
                //debugger;
                this.setState({ checklists: response.data.data.map(item => ({ id: item.CheckListID, value: item.CheckListTitle, isCheckListChecked: false })) });
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
    CheckAlert(id) {
        Swal.fire({
            title: 'Are you Sure You Want to Delete?', icon: "warning", showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                var data=JSON.stringify({
                    "BookingID": id
                });
                var config={
                    method: 'POST',
                    url: services.API_URL+"Booking/removeBooking",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    if (response.data.status) {
                        this.GetBooking();
                        Swal.fire({
                            title: 'Successfully Deleted', icon: "success", timer: 1500
                        });
                    } else {
                        Swal.fire({ position: 'top-end', icon: 'error', title: response.data.message, showConfirmButton: false, timer: 1500 });
                    }
                }, error => { })
            } else if (result.isDenied) {
                Swal.close();
            }
        });
    }
    OnFilterClick=(e) => {

        e.preventDefault();
        if (this.state.isFilterVisible===false) {
            this.setState({ isFilterVisible: true });
            this.setState({ iconFilter: "fa fa-minus" });
        }
        else {
            this.setState({ isFilterVisible: false });
            this.setState({ iconFilter: "fa fa-plus" });
        }

    }
    OnAssignClick=(bookingdate, bookingid, ZoneID, DistrictID, MuncipalityID) => e => {
        debugger;
        e.preventDefault();
        this.setState({ BookingID: bookingid });
        //console.log("Clicked");
        this.setState({ modalvisible: true });
        window.$(this.modal).modal('show');
        this.setState({ BookingMunicipalityID: MuncipalityID });
        this.GetVehicle(bookingdate, ZoneID, DistrictID, MuncipalityID);
        this.GetDriver(bookingdate, ZoneID, DistrictID, MuncipalityID);
        this.GetHelper(bookingdate, ZoneID, DistrictID, MuncipalityID);

    }
    OnRefferedBackAssignClick=(bookingid, ZoneID, DistrictID, MuncipalityID) => e => {
        debugger;
        e.preventDefault();
        this.setState({ BookingID: bookingid });
        //console.log("Clicked");
        this.setState({ modalvisible: true });
        window.$(this.ReferredAssignModal).modal('show');
        // maam no call aave 6 
        this.setState({ BookingZoneID: ZoneID });
        this.setState({ BookingDistrictID: DistrictID });
        this.setState({ BookingMunicipalityID: MuncipalityID });

    }

    OnAssignStartClick=(bookingdate, bookingid, bookingtaskdetailid) => e => {
        debugger;
        this.GetParkingLocation();
        this.GetCheckList();
        e.preventDefault();
        this.setState({ BookingID: bookingid });
        this.setState({ BookingTaskDetailID: bookingtaskdetailid });

        //console.log("Clicked");
        this.setState({ modalvisible: true });
        window.$(this.modals).modal('show');

        // this.GetHelper(bookingdate);
    }
    OnAssignFinishClick=(bookingdate, bookingid, bookingtaskdetailid) => e => {
        debugger;
        e.preventDefault();
        this.setState({ BookingID: bookingid });
        this.setState({ BookingTaskDetailID: bookingtaskdetailid });
        //console.log("Clicked");
        this.setState({ modalvisible: true });
        window.$(this.FinishModal).modal('show');

        // this.GetHelper(bookingdate);
    }
    OnAssignCompleteClick=(bookingdate, bookingid, bookingtaskdetailid) => e => {
        debugger;
        e.preventDefault();
        this.setState({ BookingID: bookingid });
        this.setState({ BookingTaskDetailID: bookingtaskdetailid });
        //console.log("Clicked");
        this.setState({ modalvisible: true });
        this.GetFinishData(bookingid);
        window.$(this.CompleteModal).modal('show');


        // this.GetHelper(bookingdate);
    }
    OnAssignApprovedClick=(bookingdate, bookingid, bookingtaskdetailid) => e => {
        debugger;
        e.preventDefault();
        this.setState({ BookingID: bookingid });
        this.setState({ BookingTaskDetailID: bookingtaskdetailid });
        //console.log("Clicked");
        this.setState({ modalvisible: true });
        //this.GetFinishData(bookingid);
        window.$(this.ApprovedModal).modal('show');


        // this.GetHelper(bookingdate);
    }
    GetFinishData(bookingid) {
        debugger;
        var data=JSON.stringify({
            "BookingID": bookingid
        });
        var config={
            method: 'POST',
            url: services.API_URL+"Booking/getBookingTaskDetail",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        services.JsonValue(config).then(response => {
            if (response.data.status) {
                this.setState({
                    VehicleReachedLocationOdometer: response.data.data[0].VehicleReachedLocationOdometer,
                    VehicleReturnLocationTime: response.data.data[0].VehicleReturnLocationTime,
                    VehicleReturnLocationOdometer: response.data.data[0].VehicleReturnLocationOdometer,
                    VehicleReachedParkingTime: response.data.data[0].VehicleReachedParkingTime,
                    VehicleReachedParkingOdometer: response.data.data[0].VehicleReachedParkingOdometer,
                    JettingFinishMeterReading: response.data.data[0].JettingFinishMeterReading,
                    SuctionPumpFinishMeterReading: response.data.data[0].SuctionPumpFinishMeterReading,
                    TotalNoOfDranageLine: response.data.data[0].TotalNoOfDranageLine,
                    DrainageLine150to300mmDiaMeter: response.data.data[0].DrainageLine150to300mmDiaMeter,
                    DrainageLine301to600mmDiaMeter: response.data.data[0].DrainageLine301to600mmDiaMeter,
                    DrainageLine601to900mmDiaMeter: response.data.data[0].DrainageLine601to900mmDiaMeter,
                    DrainageLine901to1200mmDiaMeter: response.data.data[0].DrainageLine901to1200mmDiaMeter,
                    JettingSystem: response.data.data[0].JettingSystem,
                    SuctionSystem: response.data.data[0].SuctionSystem,
                    SuctionHose5Diameter3MeterLong: response.data.data[0].SuctionHose5Diameter3MeterLong,
                    JettingHose32Diameter120MeterLong: response.data.data[0].JettingHose32Diameter120MeterLong,
                    JettingNozzleDeChockingNozzle: response.data.data[0].JettingNozzleDeChockingNozzle,
                    DeSiltingNozzleFlatNozzle: response.data.data[0].DeSiltingNozzleFlatNozzle,
                    BalanceNozzleBombNozzle: response.data.data[0].BalanceNozzleBombNozzle,
                    BookingFinishLatitude: response.data.data[0].BookingFinishLatitude,
                    BookingFinishLongitude: response.data.data[0].BookingFinishLongitude,
                    BookingFinishAddress: response.data.data[0].BookingFinishAddress,
                    Shift: response.data.data[0].Shift
                })

            }
            else {
                this.setState({ data: [] })
            }

        }, error => { })
    }
    onSearchBookingClick=(e) => {
        e.preventDefault();
        this.GetBooking();
    }
    OnSearchCancelClientClick=() => {
        //debugger;
        this.setState({ BookingNo: "", MunicipalityID: [], StartDate: new Date(), EndDate: new Date() }, () => {
            this.GetBooking();
        });

    }
    onStartDateChange=(e) => {
        this.setState({ StartDate: e });
        this.setState({ EndDate: e });
    }
    onMunicipalityChange=(value) => {
        //debugger;
        this.setState({ MunicipalityID: value });

        // }


        // if (event.action === "select-option" && event.option.value === "*") {
        //     this.setState(this.municipalities);
        //   } else if (
        //     event.action === "deselect-option" &&
        //     event.option.value === "*"
        //   ) {
        //     this.setState([]);
        //   } else if (event.action === "deselect-option") {
        //     this.setState(value.filter((o) => o.value !== "*"));
        //   } else if (value.length === this.municipalities.length - 1) {
        //     this.setState(this.options);
        //   } else {
        //     this.setState(value);
        //   }

        // this.setState({ MunicipalityID: e });
    }
    ValidateVehicle=(e) => {
        this.setState({ VehicleErrMsg: "" });
    }
    ValidateCancelVehicle=(e) => {
        this.setState({ VehicleErrMsg: "required" });
    }
    onVehicleChange=(e) => {
        if (e!=null) {
            this.setState({ VehicleID: e }, () => { this.ValidateVehicle() });
        }
        else {
            this.setState({ VehicleID: { 'label': '--Select Vehicle--', 'value': '--Select Vehicle--' } }, () => { this.ValidateCancelVehicle() });
        }
    }
    ValidateDriver=(e) => {
        this.setState({ DriverErrMsg: "" });
    }
    ValidateCancelDriver=(e) => {
        this.setState({ DriverErrMsg: "required" });
    }
    onDriverChange=(e) => {
        if (e!=null) {
            this.setState({ DriverID: e }, () => { this.ValidateDriver() });
        }
        else {
            this.setState({ DriverID: { 'label': '--Select Vehicle--', 'value': '--Select Vehicle--' } }, () => { this.ValidateCancelDriver() });
        }
    }
    allowOnlyNumbers=(event) => {
        const keyCode=event.keyCode||event.which;
        const keyValue=String.fromCharCode(keyCode);
        if (!new RegExp("[0-9]").test(keyValue)) event.preventDefault();
        return;
    };
    onDynamicHelper=(e, target) => {
        debugger;
        if (e.target.value=="Select All") {
            if (target==false) {
                this.setState({
                    HelperID: this.state.helpers.map(item =>
                        ({ value: item.value, label: item.label }))
                });
            }
            else {
                this.setState({ HelperID: "" });
            }

        }
        else {
            this.setState({ HelperID: e.target.value });
        }
    }
    ValidateHelper=(e) => {
        this.setState({ HelperErrMsg: "" });
    }
    ValidateCancelHelper=(e) => {
        this.setState({ HelperErrMsg: "required" });
    }
    onHelperChange=(e, action) => {
        debugger;

        let helpers=this.state.helpers;
        var allvalueselectted=false;
        var isValid=false;
        helpers.forEach(helpers => {
            debugger
            if (helpers.id===e.target.value) {
                helpers.isChecked=e.target.checked;
            }
            if (helpers.isChecked==false) {
                allvalueselectted=true;
            }
            if (helpers.isChecked==true) {
                isValid=true;
            }
            // this.setState({helpers:true});
            //this.setState({isChecked:true});
        });
        this.setState({ helpers: helpers });
        if (allvalueselectted==false) {
            this.setState({ isChecked: true });
        }
        else {
            this.setState({ isChecked: false });
        }
        if (isValid==true) {
            this.ValidateHelper();
        }
        else {
            this.ValidateCancelHelper();
        }
        // if (e.target.checked==true) {
        //     this.setState({ isChecked: true });
        // }
        // else{
        //     this.setState({ isChecked: false });
        // }
        // this.setState({
        //     isChecked: this.state.helpers.map(item =>
        //         ({ id: item.value, value: item.label, isChecked: true }))
        // });
        //this.setState({ IsHelperChange: true }, () => { this.onDynamicHelper(e, e.target.checked) });
    }
    onHelperAllChange=(e, action) => {
        debugger;

        if (e.target.checked==true) {
            this.setState({ isChecked: true });
            this.setState({
                helpers: this.state.helpers.map(item =>
                    ({ id: item.id, value: item.value, isChecked: true }))
            }, () => { this.ValidateHelper() });
        }
        else {
            this.setState({ isChecked: false });
            this.setState({
                helpers: this.state.helpers.map(item =>
                    ({ id: item.id, value: item.value, isChecked: false }))
            }, () => { this.ValidateCancelHelper() });
        }
        //this.setState({ IsHelperChange: true });
        //this.setState({ IsHelperChange: true }, () => { this.onDynamicHelper(e, e.target.checked) });
    }
    ValidateCheckList=(e) => {
        this.setState({ CheckListErrMsg: "" });
    }
    ValidateCancelCheckList=(e) => {
        this.setState({ CheckListErrMsg: "required" });
    }
    isValidFileUploaded=(file) => {
        const validExtensions=['png', 'jpeg', 'jpg']
        const fileExtension=file.type.split('/')[1]
        return validExtensions.includes(fileExtension)
    }
    OnTaskImageUpload=e => {
        debugger;
        if (e.target.files.length<1) {
            this.setState({ TaskImageErrMsg: "" });
            return;
        }
        else {
            this.setState({ TaskImageErrMsg: "*" });
        }
        const file=e.target.files[0];
        if (this.isValidFileUploaded(file)) {
            this.setState({ TaskFile: e.target.files, TaskImages: e.target.files[0].originalname })
        } else {
            this.setState({ TaskImageErrMsg: "Not Valid File" });
            return false;
        }

    };
    OnFinishTaskImageUpload=e => {
        debugger;
        if (e.target.files.length<1) {
            this.setState({ FinishTaskImageErrMsg: "*" });
            return;
        }
        else {
            this.setState({ FinishTaskImageErrMsg: "" });
        }
        const file=e.target.files[0];
        if (this.isValidFileUploaded(file)) {
            this.setState({ FinishTaskFile: e.target.files, FinishTaskImages: e.target.files[0].originalname })
        } else {
            this.setState({ FinishTaskImageErrMsg: "Not Valid File" });
            return false;
        }

    };
    OnCompleteTaskImageUpload=e => {
        debugger;
        if (e.target.files.length<1) {
            this.setState({ CompleteTaskErrImage: "*" });
            return;
        }
        else {
            this.setState({ CompleteTaskErrImage: "" });
        }
        const file=e.target.files[0];
        if (this.isValidFileUploaded(file)) {
            this.setState({ LogSheetTaskFile: e.target.files, LogSheetImage: e.target.files[0].originalname })
        } else {
            this.setState({ CompleteTaskErrImage: "Not Valid File" });
            return false;
        }

    };
    onCheckListChange=(e, action) => {
        debugger;

        let checklists=this.state.checklists;
        var allvalueselectted=false;
        var isValid=false;
        checklists.forEach(checklists => {
            debugger
            if (checklists.id===e.target.value) {
                checklists.isCheckListChecked=e.target.checked;
            }
            if (checklists.isCheckListChecked==false) {
                allvalueselectted=true;
            }
            if (checklists.isCheckListChecked==true) {
                isValid=true;
            }
            // this.setState({helpers:true});
            //this.setState({isChecked:true});
        });
        this.setState({ checklists: checklists });
        if (allvalueselectted==false) {
            this.setState({ isCheckListChecked: true });
        }
        else {
            this.setState({ isCheckListChecked: false });
        }
        if (isValid==true) {
            this.ValidateCheckList();
        }
        else {
            this.ValidateCancelCheckList();
        }
    }
    onCheckListAllChange=(e, action) => {
        debugger;

        if (e.target.checked==true) {
            this.setState({ isCheckListChecked: true });
            this.setState({
                checklists: this.state.checklists.map(item =>
                    ({ id: item.id, value: item.value, isCheckListChecked: true }))
            }, () => { this.ValidateCheckList() });
        }
        else {
            this.setState({ isCheckListChecked: false });
            this.setState({
                checklists: this.state.checklists.map(item =>
                    ({ id: item.id, value: item.value, isCheckListChecked: false }))
            }, () => { this.ValidateCancelCheckList() });
        }
        //this.setState({ IsHelperChange: true });
        //this.setState({ IsHelperChange: true }, () => { this.onDynamicHelper(e, e.target.checked) });
    }
    handleAssign=(e) => {
        debugger;
        var CompanyID="";
        var ClientID="";
        var UserID="";
        var UserType="";
        let helperdatas=[];
        e.preventDefault();
        var allvalid=true;
        if (this.state.VehicleID.value=="--Select Vehicle--") {
            this.setState({ VehicleErrMsg: 'required' });
            allvalid=false;
        }

        if (this.state.DriverID.value=="--Select Driver--") {
            this.setState({ DriverErrMsg: 'required' });
            allvalid=false;
        }

        let helpers=this.state.helpers;
        var allvalueselectted=false;
        helpers.forEach(helpers => {

            // if (helpers.id===e.target.value) {
            //    // helpers.isChecked=e.target.checked;
            //     helperdatas.push(helpers.id)
            // }
            if (helpers.isChecked==true) {
                allvalueselectted=true;
                helperdatas.push({ "UserID": helpers.id })
            }

            // if (allvalueselectted==false) {
            //     this.setState({ HelperErrMsg: 'required' });
            //     allvalid=false;
            // }
            // this.setState({helpers:true});
            //this.setState({isChecked:true});
        });
        if (helperdatas.length===0) {
            this.setState({ HelperErrMsg: 'required' });
            allvalid=false;
        }
        if (allvalid==true) {
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

            if (CompanyID!=""&&ClientID!="") {



                var data="";
                data=JSON.stringify({
                    "BookingID": this.state.BookingID,
                    "AssignSupervisorID": UserID,
                    "VehicleID": this.state.VehicleID.value,
                    "DriverID": this.state.DriverID.value,
                    "EntryByUserType": UserType,
                    "EntryByUserID": UserID,
                    "HelperData": helperdatas
                });
                var config={
                    method: 'POST',
                    url: services.API_URL+"Booking/setAssignBooking",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    ////debugger;
                    if (response.data.status) {
                        //debugger;
                        Swal.fire({
                            title: 'Successfully Inserted', icon: "success", timer: 1500
                        });
                        this.cancelAssign();
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
    cancelAssign=(e) => {
        this.setState({
            vehicles: [], drivers: [], helpers: [{ 'id': 'No Helpers', 'value': 'No Helpers' }],
            isChecked: false,
            VehicleID: { 'label': '--Select Vehicle--', 'value': '--Select Vehicle--' },
            DriverID: { 'label': '--Select Driver--', 'value': '--Select Driver--' },
            VehicleErrMsg: "", DriverErrMsg: "", HelperErrMsg: ""
        })
        window.$(this.modal).modal('hide');
        this.GetBooking();
    }
    cancelStart=(e) => {
        this.setState({
            parkinglocations: [], checklists: [],
            isCheckListChecked: false,
            ParkingLocationID: { 'label': '--Select Parking Location--', 'value': '--Select Parking Location--' },
            VehicleLeaveParkingTime: "", VehicleReachedLocationTime: "", VehicleLeaveParkingOdometer: "", JettingStartMeterReading: "",
            SuctionPumpStartMeterReading: "", TaskFile: [], TaskImages: "", Latitude: null, Longitude: null, CurrentAddress: "",
            ParkingLocationErrMsg: "", TaskImageErrMsg: "", CheckListErrMsg: ""
        }, () => { this.ValidateParkingLocation() })
        this.forms.reset();
        window.$(this.modals).modal('hide');
        this.GetBooking();
    }
    cancelFinish=(e) => {
        debugger;
        this.setState({
            VehicleReachedLocationOdometer: "", VehicleReturnLocationTime: "", VehicleReturnLocationOdometer: "", VehicleReachedParkingTime: "",
            VehicleReachedParkingOdometer: "", JettingFinishMeterReading: "", SuctionPumpFinishMeterReading: "", TotalNoOfDranageLine: "",
            DrainageLine150to300mmDiaMeter: "", DrainageLine301to600mmDiaMeter: "", DrainageLine601to900mmDiaMeter: "",
            DrainageLine901to1200mmDiaMeter: "", JettingSystem: "", SuctionSystem: "", SuctionHose5Diameter3MeterLong: "",
            JettingHose32Diameter120MeterLong: "", JettingNozzleDeChockingNozzle: "", DeSiltingNozzleFlatNozzle: "",
            BalanceNozzleBombNozzle: "", BookingFinishLatitude: "", BookingFinishLongitude: "", BookingFinishAddress: "",
            Shift: "", FinishTaskImageErrMsg: ""
        })
        this.form.reset();
        window.$(this.FinishModal).modal('hide');
        this.GetBooking();
    }
    cancelComplete=(e) => {
        this.setState({
            BookingCompleteRemarks: "", BookingCompleteRemarksGujarati: "", TenderLiquidityDamagesCondition: "", BookingCompleteStatus: "",
            LogSheetTaskFile: [], LogSheetImage: "",
        })
        window.$(this.CompleteModal).modal('hide');
        this.GetBooking();
    }
    onCancelApproval=(e) => {
        debugger;
        e.preventDefault();
        this.setState({
            BookingApprovalRemarks: "", BookingApprovals: [{ 'label': 'Approved', 'value': 'Approved' }, { 'label': 'Referred Back', 'value': 'Referred Back' }], BookingApprovalStatus: { 'label': '--Select Booking Status--', 'value': '--Select Booking Status--' }
        })
        window.$(this.ApprovedModal).modal('hide');
        this.GetBooking();
    }
    cancelReferredBackAssign=(e) => {
        this.setState({
            vehicles: [], drivers: [], helpers: [{ 'id': 'No Helpers', 'value': 'No Helpers' }],
            isChecked: false,
            VehicleID: { 'label': '--Select Vehicle--', 'value': '--Select Vehicle--' },
            DriverID: { 'label': '--Select Driver--', 'value': '--Select Driver--' },
            VehicleErrMsg: "", DriverErrMsg: "", HelperErrMsg: "", RefferBackAssignDate: "",
            BookingZoneID: "", BookingDistrictID: "", BookingMunicipalityID: ""
        })
        window.$(this.ReferredAssignModal).modal('hide');
        this.GetBooking();
    }
    ValidateParkingLocation=(e) => {
        this.setState({ ParkingLocationErrMsg: "" });
    }
    ValidateCancelParkingLocation=(e) => {
        this.setState({ ParkingLocationErrMsg: "required" });
    }
    EditBooking(e) {
        window.location.href="/task?id="+e;
    }
    onParkingLocationChange=(e) => {
        if (e!=null) {
            this.setState({ ParkingLocationID: e }, () => { this.ValidateParkingLocation() });
        }
        else {
            this.setState({ ParkingLocationID: { 'label': '--Select Parking Location--', 'value': '--Select Parking Location--' } }, () => { this.ValidateCancelParkingLocation() });
        }
    }
    ValidateCurrentAddress=(Latitude, Longitude, CurrentAddress) => e => {
        debugger;
        //this.setState({ ParkingLocationErrMsg: "" });
        this.setState({ Latitude: Latitude });
        this.setState({ Longitude: Longitude });
        this.setState({ CurrentAddress: CurrentAddress });
    }
    onGetGPSLocation=(e) => {
        debugger;
        // const address = "";
        const lat="";
        const long="";
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);


            // this.setState({ Logitudes: position.coords.longitude });

            Geocode.setApiKey("AIzaSyCHWhwpVwgDuwit10HARKJ2eS1IjrSmHeU");
            Geocode.setLanguage("en");
            Geocode.setRegion("es");
            Geocode.setLocationType("ROOFTOP");
            Geocode.enableDebug();
            Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
                (response) => {
                    debugger;
                    const address=response.results[0].formatted_address;
                    //this.setState({ CurrentAddress: address });
                    // lat=position.coords.latitude;
                    // long=position.coords.longitude;
                    console.log(address);
                },
                (error) => {
                    console.error(error);
                }
            );

        });
        //this.setState({ getCurrentLocation: true }, () => { this.ValidateCurrentAddress(lat,long,address) });
    }
    OnStartTaskSubmit=(e) => {
        debugger;
        let checklistdatas=[];
        e.preventDefault();
        var allvalid=true;
        this.forms.validateFields();
        if (this.state.ParkingLocationID.value=="--Select Parking Location--") {
            this.setState({ ParkingLocationErrMsg: "required" });
            allvalid=false;
        }
        if (this.state.TaskFile.length==0) {
            this.setState({ TaskImageErrMsg: "required" });
            allvalid=false;
        }
        let checklists=this.state.checklists;
        var allvalueselectted=false;
        checklists.forEach(checklists => {

            // if (helpers.id===e.target.value) {
            //    // helpers.isChecked=e.target.checked;
            //     helperdatas.push(helpers.id)
            // }
            if (checklists.isCheckListChecked==true) {
                allvalueselectted=true;
                checklistdatas.push({ "CheckListID": checklists.id })
            }

            // if (allvalueselectted==false) {
            //     this.setState({ CheckListErrMsg: 'required' });
            //     allvalid=false;
            // }
            // this.setState({helpers:true});
            //this.setState({isChecked:true});
        });
        if (checklistdatas.length==0) {
            this.setState({ CheckListErrMsg: 'required' });
            allvalid=false;
        }
        if (this.form.isValid()) {
            if (allvalid==true) {
                var BookingTaskDetailID=this.state.BookingTaskDetailID;
                var BookingID=this.state.BookingID;
                var ParkingLocationID=this.state.ParkingLocationID.value
                var VehicleLeaveParkingTime=this.state.VehicleLeaveParkingTime
                var VehicleReachedLocationTime=this.state.VehicleReachedLocationTime
                var VehicleLeaveParkingOdometer=this.state.VehicleLeaveParkingOdometer
                var JettingStartMeterReading=this.state.JettingStartMeterReading
                var SuctionPumpStartMeterReading=this.state.SuctionPumpStartMeterReading
                var filess=this.state.TaskFile;
                var Latitude="";
                var Longitude="";
                var CurrentAddress="";
                // navigator.geolocation.getCurrentPosition(function (position) {
                //     console.log("Latitude is :", position.coords.latitude);
                //     console.log("Longitude is :", position.coords.longitude);
                //     Latitude=position.coords.latitude;
                //     Longitude=position.coords.longitude;

                //     // this.setState({ Logitudes: position.coords.longitude });

                //     Geocode.setApiKey("AIzaSyCHWhwpVwgDuwit10HARKJ2eS1IjrSmHeU");
                //     Geocode.setLanguage("en");
                //     Geocode.setRegion("es");
                //     Geocode.setLocationType("ROOFTOP");
                //     Geocode.enableDebug();
                //     // Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
                //     //     (response) => {
                //     //         debugger;
                //     //         const address=response.results[0].formatted_address;
                //     //         CurrentAddress=address;


                //     //     },
                //     //     (error) => {
                //     //         console.error(error);
                //     //     }
                //     // );


                // });

                var form=new FormData();
                form.append('BookingTaskDetailID', BookingTaskDetailID);
                form.append('BookingID', BookingID);
                form.append('ParkingLocationID', ParkingLocationID);
                form.append('VehicleLeaveParkingTime', VehicleLeaveParkingTime);
                form.append('VehicleReachedLocationTime', VehicleReachedLocationTime);
                form.append('VehicleLeaveParkingOdometer', VehicleLeaveParkingOdometer);
                form.append('JettingStartMeterReading', JettingStartMeterReading);
                form.append('SuctionPumpStartMeterReading', SuctionPumpStartMeterReading);
                form.append('BookingStartLatitude', Latitude);
                form.append('BookingStartLongitude', Longitude);
                form.append('BookingStartAddress', CurrentAddress);
                form.append('CheckListData', JSON.stringify(checklistdatas));
                for (let i=0; i<this.state.TaskFile.length; i++) { form.append("TaskImages", this.state.TaskFile[i]); }
                // form.append("TaskImages", filess);
                // for (let i = 0; i < this.state.TaskFile.length; i++) 
                // { 
                //     form.append("TaskImages", filess);
                //     debugger;

                //     // form.append("TaskImages", fs.createReadStream(this.state.TaskFile[i] )); 
                // }
                console.log("formdata", form);
                services.FormValue(form).then(response => {
                    if (response.data.status) {
                        Swal.fire({
                            title: 'Successfully Started', icon: "success", timer: 1500
                        });
                        this.cancelStart();
                        this.GetBooking();
                        //UserService.GetServiceData().then(response => { this.setState({ data: response.data.data }) }, error => { })
                    } else {
                        Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
                    }
                    this.setState({ CarTypeID: '', Type: '', Title: '', file: [], filename: '', Price: '', Timeline: '', content: '', rows: [{ Title: '', Description: '' }] });
                }, error => { })
            }

        }

    }
    OnFinishTaskSubmit=(e) => {
        debugger;
        e.preventDefault();
        var allvalid=true;
        this.finishform.validateFields();
        if (this.state.FinishTaskFile.length==0) {
            this.setState({ FinishTaskImageErrMsg: "required" });
            allvalid=false;
        }

        if (this.form.isValid()) {
            if (allvalid==true) {
                var data=new FormData();
                data.append('BookingTaskDetailID', this.state.BookingTaskDetailID);
                data.append('BookingID', this.state.BookingID);
                data.append('VehicleReachedLocationOdometer', this.state.VehicleReachedLocationOdometer);
                data.append('VehicleReturnLocationTime', this.state.VehicleReturnLocationTime);
                data.append('VehicleReturnLocationOdometer', this.state.VehicleReturnLocationOdometer);
                data.append('VehicleReachedParkingTime', this.state.VehicleReachedParkingTime);
                data.append('VehicleReachedParkingOdometer', this.state.VehicleReachedParkingOdometer);
                data.append('JettingFinishMeterReading', this.state.JettingFinishMeterReading);
                data.append('SuctionPumpFinishMeterReading', this.state.SuctionPumpFinishMeterReading);
                data.append('TotalNoOfDranageLine', this.state.TotalNoOfDranageLine);
                data.append('DrainageLine150to300mmDiaMeter', this.state.DrainageLine150to300mmDiaMeter);
                data.append('DrainageLine301to600mmDiaMeter', this.state.DrainageLine301to600mmDiaMeter);
                data.append('DrainageLine601to900mmDiaMeter', this.state.DrainageLine601to900mmDiaMeter);
                data.append('DrainageLine901to1200mmDiaMeter', this.state.DrainageLine901to1200mmDiaMeter);
                data.append('JettingSystem', this.state.JettingSystem);
                data.append('SuctionSystem', this.state.SuctionSystem);
                data.append('SuctionHose5Diameter3MeterLong', this.state.SuctionHose5Diameter3MeterLong);
                data.append('JettingHose32Diameter120MeterLong', this.state.JettingHose32Diameter120MeterLong);
                data.append('JettingNozzleDeChockingNozzle', this.state.JettingNozzleDeChockingNozzle);
                data.append('DeSiltingNozzleFlatNozzle', this.state.DeSiltingNozzleFlatNozzle);
                data.append('BalanceNozzleBombNozzle', this.state.BalanceNozzleBombNozzle);
                data.append('BookingFinishLatitude', '');
                data.append('BookingFinishLongitude', '');
                data.append('BookingFinishAddress', '');
                data.append('Shift', this.state.Shift);
                for (let i=0; i<this.state.FinishTaskFile.length; i++) { data.append("TaskImages", this.state.FinishTaskFile[i]); }

                services.FinishFormValue(data).then(response => {
                    if (response.data.status) {
                        Swal.fire({
                            title: 'Successfully Finished', icon: "success", timer: 1500
                        });
                        //this.GetBooking();
                        //UserService.GetServiceData().then(response => { this.setState({ data: response.data.data }) }, error => { })
                    } else {
                        Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
                    }
                    this.cancelFinish();

                }, error => { })

            }
        }

    }
    OnCompleteTaskSubmit=(e) => {
        debugger;
        var UserID="";
        //var BookingDate = "";
        if (this.props.allCookies.UserID!==undefined) {
            UserID=this.props.allCookies.UserID;
        }
        e.preventDefault();
        var allvalid=true;
        this.completeform.validateFields();
        if (this.state.LogSheetTaskFile.length==0) {
            this.setState({ CompleteTaskErrImage: "required" });
            allvalid=false;
        }

        if (this.form.isValid()) {
            if (allvalid==true) {
                var data=new FormData();
                data.append('BookingTaskDetailID', this.state.BookingTaskDetailID);
                data.append('BookingID', this.state.BookingID);
                data.append('BookingCompleteRemarks', this.state.BookingCompleteRemarks);
                data.append('BookingCompleteRemarksGujarati', this.state.BookingCompleteRemarksGujarati);
                data.append('TenderLiquidityDamagesCondition', this.state.TenderLiquidityDamagesCondition);
                data.append('BookingCompleteStatus', 'Complete');
                data.append('BookingCompleteUserID', UserID);
                for (let i=0; i<this.state.LogSheetTaskFile.length; i++) { data.append("LogSheetImage", this.state.LogSheetTaskFile[i]); }

                services.CompleteFormValue(data).then(response => {
                    if (response.data.status) {
                        Swal.fire({
                            title: 'Successfully Completed', icon: "success", timer: 1500
                        });
                        //this.GetBooking();
                        //UserService.GetServiceData().then(response => { this.setState({ data: response.data.data }) }, error => { })
                    } else {
                        Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
                    }
                    this.cancelComplete();

                }, error => { })

            }
        }

    }
    OnCompleteReferredBackTaskSubmit=(e) => {
        debugger;
        var UserID="";
        //var BookingDate = "";
        if (this.props.allCookies.UserID!==undefined) {
            UserID=this.props.allCookies.UserID;
        }
        e.preventDefault();
        var allvalid=true;
        this.completeform.validateFields();
        if (this.state.LogSheetTaskFile.length==0) {
            this.setState({ CompleteTaskErrImage: "required" });
            allvalid=false;
        }

        if (this.form.isValid()) {
            if (allvalid==true) {
                var data=new FormData();
                data.append('BookingTaskDetailID', this.state.BookingTaskDetailID);
                data.append('BookingID', this.state.BookingID);
                data.append('BookingCompleteRemarks', this.state.BookingCompleteRemarks);
                data.append('BookingCompleteRemarksGujarati', this.state.BookingCompleteRemarksGujarati);
                data.append('TenderLiquidityDamagesCondition', this.state.TenderLiquidityDamagesCondition);
                data.append('BookingCompleteStatus', 'Referred Back');
                data.append('BookingCompleteUserID', UserID);
                for (let i=0; i<this.state.LogSheetTaskFile.length; i++) { data.append("LogSheetImage", this.state.LogSheetTaskFile[i]); }

                services.CompleteFormValue(data).then(response => {
                    if (response.data.status) {
                        Swal.fire({
                            title: 'Successfully Completed', icon: "success", timer: 1500
                        });
                        //this.GetBooking();
                        //UserService.GetServiceData().then(response => { this.setState({ data: response.data.data }) }, error => { })
                    } else {
                        Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
                    }
                    this.cancelComplete();

                }, error => { })

            }
        }

    }
    ValidateCancelBookingApproval=(e) => {
        this.setState({ BookingApprovalStatusErrMsg: 'required' })
    }
    ValidateBookingApproval=(e) => {
        this.setState({ BookingApprovalStatusErrMsg: '' });
    }
    onBookingApprovalChange=(e) => {
        if (e!=null) {
            this.setState({ BookingApprovalStatus: e }, () => { this.ValidateBookingApproval() });
        }
        else {
            this.setState({ Priority: { 'label': '--Select Booking Status--', 'value': '--Select Booking Status--' } }, () => { this.ValidateCancelBookingApproval() });
        }
    }
    OnApprovedTaskSubmit=(e) => {
        debugger;
        var UserID="";
        //var BookingDate = "";
        if (this.props.allCookies.UserID!==undefined) {
            UserID=this.props.allCookies.UserID;
        }
        e.preventDefault();
        var allvalid=true;
        this.form.validateFields();
        if (this.state.BookingApprovalStatus.value=="--Select Booking Status--") {
            this.setState({ BookingApprovalStatusErrMsg: 'required' });
            allvalid=false;
        }

        if (this.form.isValid()) {
            if (allvalid==true) {
                var data=JSON.stringify({
                    "BookingTaskDetailID": this.state.BookingTaskDetailID,
                    "BookingID": this.state.BookingID,
                    "BookingApprovalRemarks": this.state.BookingApprovalRemarks,
                    "BookingApprovalUserID": UserID,
                    "BookingApprovalStatus": this.state.BookingApprovalStatus.value
                });
                var config={
                    method: 'POST',
                    url: services.API_URL+"Booking/setApprovalBooking",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    ////debugger;
                    if (response.data.status) {
                        //debugger;
                        Swal.fire({
                            title: response.data.message, icon: "success", timer: 1500
                        });
                        this.onCancelApproval();
                    }
                    else {
                        Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
                    }
                }, error => { })
            }
        }

    }
    OnReferredVisibleChange() {
        debugger;
        this.setState({ IsReferredAssignDataVisible: true });
        var ZoneID=this.state.BookingZoneID;
        var DistrictID=this.state.BookingDistrictID;
        var MuncipalityID=this.state.BookingMunicipalityID;
        var ReferredDate=moment(this.state.RefferBackAssignDate).format('DD-MM-YYYY')

        this.GetVehicle(ReferredDate, ZoneID, DistrictID, MuncipalityID);
        this.GetDriver(ReferredDate, ZoneID, DistrictID, MuncipalityID);
        this.GetHelper(ReferredDate, ZoneID, DistrictID, MuncipalityID);
    }
    ValidateCancelReferredBackAssign() {
        this.setState({ vehicles: [] });
        this.setState({ drivers: [] });
        this.setState({ helpers: [] });
        this.setState({ IsReferredAssignDataVisible: false });

    }
    OnReferredBackChange=(e) => {
        // e.preventDefault();
        if (e!=null) {
            this.setState({ RefferBackAssignDate: e }, () => { this.OnReferredVisibleChange() });
        }
        else {
            this.setState({ RefferBackAssignDate: "" }, () => { this.ValidateCancelReferredBackAssign() });

        }

    }
    handleReferredBackAssign=(e) => {
        debugger;
        var CompanyID="";
        var ClientID="";
        var UserID="";
        var UserType="";
        let helperdatas=[];
        e.preventDefault();
        var allvalid=true;
        if (this.state.VehicleID.value=="--Select Vehicle--") {
            this.setState({ VehicleErrMsg: 'required' });
            allvalid=false;
        }

        if (this.state.DriverID.value=="--Select Driver--") {
            this.setState({ DriverErrMsg: 'required' });
            allvalid=false;
        }

        let helpers=this.state.helpers;
        var allvalueselectted=false;
        helpers.forEach(helpers => {

            // if (helpers.id===e.target.value) {
            //    // helpers.isChecked=e.target.checked;
            //     helperdatas.push(helpers.id)
            // }
            if (helpers.isChecked==true) {
                allvalueselectted=true;
                helperdatas.push({ "UserID": helpers.id })
            }

            // if (allvalueselectted==false) {
            //     this.setState({ HelperErrMsg: 'required' });
            //     allvalid=false;
            // }
            // this.setState({helpers:true});
            //this.setState({isChecked:true});
        });
        if (helperdatas.length===0) {
            this.setState({ HelperErrMsg: 'required' });
            allvalid=false;
        }
        if (allvalid==true) {
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

            if (CompanyID!=""&&ClientID!="") {



                var data="";
                data=JSON.stringify({
                    "BookingID": this.state.BookingID,
                    "AssignSupervisorID": UserID,
                    "VehicleID": this.state.VehicleID.value,
                    "DriverID": this.state.DriverID.value,
                    "RefferBackAssignDate": moment(this.state.RefferBackAssignDate).format('DD-MM-YYYY'),
                    "EntryByUserType": UserType,
                    "EntryByUserID": UserID,
                    "HelperData": helperdatas
                });
                var config={
                    method: 'POST',
                    url: services.API_URL+"Booking/setAssignBooking",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    ////debugger;
                    if (response.data.status) {
                        //debugger;
                        Swal.fire({
                            title: 'Successfully Assign', icon: "success", timer: 1500
                        });
                        this.cancelReferredBackAssign();
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
    onFinishEditClick=(e) => {
        this.setState({ isFinishEditVisible: false });
        this.setState({ IsFinishUpdatesVisible: true });
        this.setState({ IsCompleteDisabled: false });
    }
    onFinishEditCancel=(e) => {

        this.setState({ isFinishEditVisible: true });
        this.setState({ IsFinishUpdatesVisible: false });
        this.setState({ IsCompleteDisabled: true }, () => { this.GetFinishData(this.state.BookingID); });


    }
    OnFinishUpdate=(e) => {
        debugger;
        e.preventDefault();
        this.completeform.validateFields();
        if (this.form.isValid()) {
            var data=new FormData();
            data.append('BookingTaskDetailID', this.state.BookingTaskDetailID);
            data.append('BookingID', this.state.BookingID);
            data.append('VehicleReachedLocationOdometer', this.state.VehicleReachedLocationOdometer);
            data.append('VehicleReturnLocationTime', this.state.VehicleReturnLocationTime);
            data.append('VehicleReturnLocationOdometer', this.state.VehicleReturnLocationOdometer);
            data.append('VehicleReachedParkingTime', this.state.VehicleReachedParkingTime);
            data.append('VehicleReachedParkingOdometer', this.state.VehicleReachedParkingOdometer);
            data.append('JettingFinishMeterReading', this.state.JettingFinishMeterReading);
            data.append('SuctionPumpFinishMeterReading', this.state.SuctionPumpFinishMeterReading);
            data.append('TotalNoOfDranageLine', this.state.TotalNoOfDranageLine);
            data.append('DrainageLine150to300mmDiaMeter', this.state.DrainageLine150to300mmDiaMeter);
            data.append('DrainageLine301to600mmDiaMeter', this.state.DrainageLine301to600mmDiaMeter);
            data.append('DrainageLine601to900mmDiaMeter', this.state.DrainageLine601to900mmDiaMeter);
            data.append('DrainageLine901to1200mmDiaMeter', this.state.DrainageLine901to1200mmDiaMeter);
            data.append('JettingSystem', this.state.JettingSystem);
            data.append('SuctionSystem', this.state.SuctionSystem);
            data.append('SuctionHose5Diameter3MeterLong', this.state.SuctionHose5Diameter3MeterLong);
            data.append('JettingHose32Diameter120MeterLong', this.state.JettingHose32Diameter120MeterLong);
            data.append('JettingNozzleDeChockingNozzle', this.state.JettingNozzleDeChockingNozzle);
            data.append('DeSiltingNozzleFlatNozzle', this.state.DeSiltingNozzleFlatNozzle);
            data.append('BalanceNozzleBombNozzle', this.state.BalanceNozzleBombNozzle);
            data.append('BookingFinishLatitude', '');
            data.append('BookingFinishLongitude', '');
            data.append('BookingFinishAddress', '');
            data.append('Shift', this.state.Shift);
            for (const value of data.values()) {
                console.log(value);
            }
            // for (let i=0; i<this.state.FinishTaskFile.length; i++) { data.append("TaskImages", this.state.FinishTaskFile[i]); }

            // services.FinishFormValue(data).then(response => {
            //     if (response.data.status) {
            //         Swal.fire({
            //             title: 'Successfully Finished', icon: "success", timer: 1500
            //         });
            //         //this.GetBooking();
            //         //UserService.GetServiceData().then(response => { this.setState({ data: response.data.data }) }, error => { })
            //     } else {
            //         Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
            //     }
            //     this.cancelFinish();

            // }, error => { })
        }

    }
    render() {
        return (
            <div>
                <div className="container-fluid" style={{ marginTop: '10%' }}>
                    {this.state.isFilterVisible&&
                        <div className="row" style={{ marginBottom: '1%' }} id="divFilter">
                            <div className="col-md-3">
                                <div className="form-group formgroupcss">
                                    <label>Start Date </label>
                                    <DatePicker dateFormat="dd-MM-yyyy" selected={this.state.StartDate} autoComplete="off" className="form-control readonly" id="txtTaskDate" value={this.state.StartDate} onChange={this.onStartDateChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group formgroupcss">
                                    <label>End Date </label>
                                    <DatePicker dateFormat="dd-MM-yyyy" selected={this.state.EndDate} minDate={this.state.StartDate} autoComplete="off" className="form-control readonly" id="txtTaskDate" value={this.state.EndDate} onChange={(e) => {
                                        this.setState({ EndDate: e });
                                    }} />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group formgroupcss">
                                    <label>Task No </label>
                                    <input type="text" value={this.state.BookingNo} onChange={(e) => this.setState({ BookingNo: e.target.value })} onKeyPress={this.allowOnlyNumbers} className="form-control" placeholder="Enter Task No" />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group formgroupcss">
                                    <label>Municipality </label>

                                    <MultiSelect style={{ borderColor: 'none', borderWidth: 'noe', borderStyle: 'none' }}
                                        options={this.state.municipalities} selected={this.state.MunicipalityID} checked={false}
                                        onSelectedChanged={this.onMunicipalityChange}
                                        overrideStrings={{
                                            selectSomeItems: "Municipalities", allItemsAreSelected: "All Municipality are Selected",
                                            selectAll: "Select All", search: "Search"
                                        }} />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <button type="button" onClick={this.onSearchBookingClick} className="btn btn-primary mt-12 mr-3">Search </button>
                                <button type="button" onClick={this.OnSearchCancelClientClick} className="btn btn-danger mt-12">Cancel </button>
                            </div>
                        </div>
                    }
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card card-custom">
                                <div className="card-body">
                                    <MaterialTable columns={this.state.cols} data={this.state.data}
                                        tableRef={this.tableRef}
                                        detailPanel={[{
                                            // icon: () => null,

                                            render: (rowData) => {
                                                return (
                                                    <MaterialTable style={{ border: '1px solid' }} className="DetailGrid" columns={this.state.detailcols} data={this.state.detaildata}
                                                        options={{
                                                            headerStyle: { color: 'black' }, toolbar: true, search: false,
                                                            paging: false, pageSize: 5, emptyRowsWhenPaging: true, pageSizeOptions: [5, 10, 15, 20],
                                                        }}
                                                        components={{

                                                            Toolbar: props => (
                                                                <div className="row" style={{ marginBottom: '2%' }}>
                                                                    <div className="col-md-12" style={{ marginTop: '1%', textAlign: 'center' }}>
                                                                        <h3 className="tabletitle">Assign Task</h3>

                                                                    </div>
                                                                </div>
                                                            )
                                                        }}
                                                    />
                                                )
                                            }
                                        }
                                        ]}
                                        // detailPanel={rowData => <div><h1>Hello, mate!</h1></div>}
                                        actions={[
                                            rowData => ({
                                                hidden: (rowData.BookingStatus=="New")? false:true,
                                                //hidden: true,
                                                icon: 'edit', tooltip: 'Edit', onClick: (e, r) => this.EditBooking(r.BookingID)
                                            }),
                                            rowData => ({
                                                hidden: (rowData.BookingStatus=="New")? false:true,
                                                icon: 'delete', tooltip: 'Delete', onClick: (e, r) => this.CheckAlert(r.BookingID)
                                            })
                                        ]}

                                        options={{
                                            headerStyle: { color: 'black' }, toolbar: true, search: false,
                                            paging: true, pageSize: 5, emptyRowsWhenPaging: true, pageSizeOptions: [5, 10, 15, 20],
                                            detailPanelType: "single",
                                            rowStyle: rowData => {
                                                if (rowData.BookingStatus==="Referred Back") {
                                                    return { backgroundColor: '#F64E60' };
                                                }
                                                return {};
                                            }
                                        }}
                                        components={{

                                            Toolbar: props => (
                                                <div className="row" style={{ marginBottom: '2%' }}>
                                                    <div className="col-md-9" style={{ display: 'flex', alignItems: 'center' }}>
                                                        <h3 className="tabletitle">View Task</h3>

                                                    </div>
                                                    <div className="col-md-3" style={{ textAlign: 'right' }}>
                                                        {/* <a href="/booking" className="btn btn-outline-primary font-weight-bolder mr-5">
                                                            <span className="svg-icon svg-icon-md">
                                                                <i className="fa fa-plus" />
                                                            </span>Add Task</a> */}

                                                        <NavLink hidden={this.state.AddTaskHidden} to={"/task"} className="btn btn-outline-primary font-weight-bolder mr-5">
                                                            <span className="svg-icon svg-icon-md">
                                                                <i className="fa fa-plus" />
                                                            </span>Add Task
                                                        </NavLink >
                                                        <a className="btn btn-outline-dark font-weight-bolder" onClick={this.OnFilterClick}>
                                                            <i id="btnFilter" className={this.state.iconFilter} /> Filter
                                                        </a>
                                                    </div>
                                                </div>
                                            )
                                        }}


                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <div className="modal fade" ref={modal => this.modal=modal} id="exampleModal" data-backdrop="static" tabIndex={-1} role="dialog" aria-labelledby="staticBackdrop" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Assign Task
                                </h5>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-11">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword1">Vehicle </label>
                                            <Select isClearable={true} options={this.state.vehicles} value={this.state.VehicleID} onChange={this.onVehicleChange} />
                                            {this.state.VehicleErrMsg&&<span className="text-danger">{this.state.VehicleErrMsg==='required'? '*':''}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-1" style={{ display: 'flex', alignItems: 'center' }}>
                                        <i className="fa fa-calendar-alt " >
                                        </i>
                                    </div>
                                    <div className="col-md-11">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword1">Driver </label>
                                            <Select isClearable={true} options={this.state.drivers} value={this.state.DriverID} onChange={this.onDriverChange} />
                                            {this.state.DriverErrMsg&&<span className="text-danger">{this.state.DriverErrMsg==='required'? '*':''}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-1" style={{ display: 'flex', alignItems: 'center' }}>
                                        <i className="fa fa-calendar-alt " >
                                        </i>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword1">Helper </label>
                                            <div className="checkbox-inline">
                                                {
                                                    this.state.HelperDataAvailable&&
                                                    <label className="checkbox" >
                                                        <input checked={this.state.isChecked} style={{ marginRight: 0 }} value="Select All" type="checkbox" onChange={this.onHelperAllChange} />
                                                        <span />Select All
                                                    </label>

                                                }

                                                {
                                                    this.state.helpers.map((item, index) => (

                                                        <label className="checkbox" key={index}>

                                                            <input checked={item.isChecked} style={{ marginRight: 0 }} value={item.id} type="checkbox" onChange={this.onHelperChange} />
                                                            <span />{item.value}

                                                        </label>
                                                    ))
                                                }
                                                {
                                                    this.state.NoHelperVisibleMsg&&
                                                    <label>No Helper Available</label>
                                                }

                                            </div>
                                            {this.state.HelperErrMsg&&<span className="text-danger">{this.state.HelperErrMsg==='required'? '*':''}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" onClick={this.handleAssign} className="btn btn-primary font-weight-bold">
                                    Submit
                                </button>
                                <button type="submit" onClick={this.cancelAssign} className="btn btn-light-danger font-weight-bold" data-dismiss="modal">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" ref={modal => this.modals=modal} id="exampleModal" data-backdrop="static" tabIndex={-1} role="dialog" aria-labelledby="staticBackdrop" aria-hidden="true">
                    <div className="modal-dialog startmodaldialog" role="document">
                        <div className="modal-content">
                            <FormWithConstraints
                                ref={form => this.forms=form}
                                onSubmit={this.OnStartTaskSubmit}
                                noValidate>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">
                                        Start Booking
                                    </h5>
                                </div>
                                <div className="modal-body">

                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Parking Location <span className="text-danger">*</span> </label>
                                                <Select isClearable={true} options={this.state.parkinglocations} value={this.state.ParkingLocationID} onChange={this.onParkingLocationChange} />
                                                {this.state.ParkingLocationErrMsg&&<span className="text-danger">{this.state.ParkingLocationErrMsg==='required'? '*':''}</span>}
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Vehicle Leaving Parking Time <span className="text-danger">*</span>
                                                </label>
                                                <input className="form-control" name="VehicleLeaveParkingTime" required type="time" defaultValue={this.state.VehicleLeaveParkingTime} onChange={(e) => { this.setState({ VehicleLeaveParkingTime: e.target.value }, () => { this.forms.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="VehicleLeaveParkingTime">
                                                    <FieldFeedback when="*">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">
                                                </label>

                                                <button type="button" onClick={this.position} className="btn btn-primary" style={{ width: '100%', marginTop: '10%' }}>Get GPS Location</button>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Vehicle Reaching Location Time <span className="text-danger">*</span>
                                                </label>
                                                <input className="form-control" name="VehicleReachedLocationTime" required type="time" defaultValue={this.state.VehicleReachedLocationTime} onChange={(e) => { this.setState({ VehicleReachedLocationTime: e.target.value }, () => { this.forms.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="VehicleReachedLocationTime">
                                                    <FieldFeedback when="*">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Odometer of Leaving Parking <span className="text-danger">*</span></label>
                                                <input type="text" name="VehicleLeaveParkingOdometer" required value={this.state.VehicleLeaveParkingOdometer} onChange={(e) => this.setState({ VehicleLeaveParkingOdometer: e.target.value }, () => { this.forms.validateFields(e.target) })} onKeyPress={this.allowOnlyNumbers} className="form-control" placeholder="" />
                                                <FieldFeedbacks for="VehicleLeaveParkingOdometer">
                                                    <FieldFeedback when="*">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Jetting Starting Meter Reading <span className="text-danger">*</span></label>
                                                <input type="text" name="JettingStartMeterReading" required value={this.state.JettingStartMeterReading} onChange={(e) => this.setState({ JettingStartMeterReading: e.target.value }, () => { this.forms.validateFields(e.target) })} onKeyPress={this.allowOnlyNumbers} className="form-control" placeholder="" />
                                                <FieldFeedbacks for="JettingStartMeterReading">
                                                    <FieldFeedback when="*">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Suction Pump Starting Meter Reading <span className="text-danger">*</span></label>
                                                <input type="text" name="SuctionPumpStartMeterReading" required value={this.state.SuctionPumpStartMeterReading} onChange={(e) => this.setState({ SuctionPumpStartMeterReading: e.target.value }, () => { this.forms.validateFields(e.target) })} onKeyPress={this.allowOnlyNumbers} className="form-control" placeholder="" />
                                                <FieldFeedbacks for="SuctionPumpStartMeterReading">
                                                    <FieldFeedback when="*">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label className="mobbottom" htmlFor="exampleInputPassword1" >Capture
                                                    Details <span className="text-danger">*</span></label>
                                                <input type="file" value={this.state.TaskImages} style={{ height: "37px" }} multiple onChange={this.OnTaskImageUpload} className="form-control" accept="image/png, image/gif, image/jpeg" />
                                                {this.state.TaskImageErrMsg&&<span className="text-danger">{this.state.TaskImageErrMsg==='required'? '*':''}</span>}
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label className="mobbottom" htmlFor="exampleInputPassword1">Check List <span className="text-danger">*</span></label>
                                                <div className="checkbox-inline">
                                                    <div className="row" style={{ width: '100%' }}>
                                                        <div className="col-md-2">
                                                            <label className="checkbox" style={{ marginBottom: '10%' }}>
                                                                <input checked={this.state.isCheckListChecked} style={{ marginRight: 0 }} value="Select All" type="checkbox" onChange={this.onCheckListAllChange} />
                                                                <span />Select All
                                                            </label>
                                                        </div>
                                                        {
                                                            this.state.checklists.map((item, index) => (
                                                                <div className="col-md-2" key={index}>
                                                                    <label className="checkbox" key={index} style={{ marginBottom: '10%' }}>

                                                                        <input checked={item.isCheckListChecked} style={{ marginRight: 0 }} value={item.id} type="checkbox" onChange={this.onCheckListChange} />
                                                                        <span />{item.value}

                                                                    </label>
                                                                </div>
                                                            ))
                                                        }

                                                    </div>
                                                </div>
                                                {this.state.CheckListErrMsg&&<span className="text-danger">{this.state.CheckListErrMsg==='required'? '*':''}</span>}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="modal-footer">
                                    <button type="submit" onSubmit={this.OnStartTaskSubmit} className="btn btn-primary font-weight-bold">
                                        Submit
                                    </button>
                                    <button type="button" onClick={this.cancelStart} className="btn btn-light-danger font-weight-bold" data-dismiss="modal">
                                        Cancel
                                    </button>
                                </div>
                            </FormWithConstraints>
                        </div>
                    </div>
                </div>
                <div className="modal fade" ref={modal => this.FinishModal=modal} id="exampleModal" data-backdrop="static" tabIndex={-1} role="dialog" aria-labelledby="staticBackdrop" aria-hidden="true">
                    <div className="modal-dialog startmodaldialog" role="document">
                        <div className="modal-content">
                            <FormWithConstraints
                                ref={form => this.finishform=form}
                                onSubmit={this.OnFinishTaskSubmit}
                                noValidate>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">
                                        Finish Booking
                                    </h5>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Odometer of Vehicle Reaching Work Location <span className="text-danger">*</span></label>
                                                <input className="form-control" name="VehicleReachedLocationOdometer" required onKeyPress={this.allowOnlyNumbers} type="text" value={this.state.VehicleReachedLocationOdometer} onChange={(e) => { this.setState({ VehicleReachedLocationOdometer: e.target.value }, () => { this.finishform.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="VehicleReachedLocationOdometer">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc', marginBottom: '9%' }} className="mobbottom" htmlFor="exampleInputPassword1">Vehicle Leaving Work Location Time <span className="text-danger">*</span> </label>
                                                <input className="form-control" name="VehicleReturnLocationTime" required type="time" value={this.state.VehicleReturnLocationTime} onChange={(e) => { this.setState({ VehicleReturnLocationTime: e.target.value }, () => { this.finishform.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="VehicleReturnLocationTime">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} className="mobbottom" htmlFor="exampleInputPassword1">Odometer of Vehicle Leaving Work Location <span className="text-danger">*</span></label>
                                                <input className="form-control" name="VehicleReturnLocationOdometer" required type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.VehicleReturnLocationOdometer} onChange={(e) => { this.setState({ VehicleReturnLocationOdometer: e.target.value }, () => { this.finishform.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="VehicleReturnLocationOdometer">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <button type="button" className="btn btn-outline-primary font-weight-bold mt-13" style={{ width: '100%' }}>
                                                Get GPS Location
                                            </button>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} className="mobbottom" htmlFor="exampleInputPassword1">Vehicle Reaching Parking Location Time <span className="text-danger">*</span></label>
                                                <input className="form-control" name="VehicleReachedParkingTime" required type="time" defaultValue={this.state.VehicleReachedParkingTime} onChange={(e) => { this.setState({ VehicleReachedParkingTime: e.target.value }, () => { this.finishform.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="VehicleReachedParkingTime">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Odometer Reaching Parking Location <span className="text-danger">*</span></label>
                                                <input name="VehicleReachedParkingOdometer" required className="form-control" type="text" value={this.state.VehicleReachedParkingOdometer} onChange={(e) => { this.setState({ VehicleReachedParkingOdometer: e.target.value }, () => { this.finishform.validateFields(e.target) }) }} onKeyPress={this.allowOnlyNumbers} id="example-time-input" />
                                                <FieldFeedbacks for="VehicleReachedParkingOdometer">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} className="mobbottom" htmlFor="exampleInputPassword1">Jetting Finish Meter Reading <span className="text-danger">*</span></label>
                                                <input name="JettingFinishMeterReading" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.JettingFinishMeterReading} onChange={(e) => { this.setState({ JettingFinishMeterReading: e.target.value }, () => { this.finishform.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="JettingFinishMeterReading">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Suction Pump Finish Meter Reading <span className="text-danger">*</span></label>
                                                <input name="SuctionPumpFinishMeterReading" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.SuctionPumpFinishMeterReading} onChange={(e) => { this.setState({ SuctionPumpFinishMeterReading: e.target.value }, () => { this.finishform.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="SuctionPumpFinishMeterReading">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc', marginBottom: '11%' }} className="mobbottom" htmlFor="exampleInputPassword1">Total number of drainage line <span className="text-danger">*</span></label>
                                                <input name="TotalNoOfDranageLine" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.TotalNoOfDranageLine} onChange={(e) => { this.setState({ TotalNoOfDranageLine: e.target.value }, () => { this.finishform.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="TotalNoOfDranageLine">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Drainage line 150 mm to 300 mm dia meter <span className="text-danger">*</span></label>
                                                <input name="DrainageLine150to300mmDiaMeter" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.DrainageLine150to300mmDiaMeter} onChange={(e) => { this.setState({ DrainageLine150to300mmDiaMeter: e.target.value }, () => { this.finishform.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="DrainageLine150to300mmDiaMeter">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Drainage line 301 mm to 600 mm dia meter <span className="text-danger">*</span></label>
                                                <input name="DrainageLine301to600mmDiaMeter" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.DrainageLine301to600mmDiaMeter} onChange={(e) => { this.setState({ DrainageLine301to600mmDiaMeter: e.target.value }, () => { this.finishform.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="DrainageLine301to600mmDiaMeter">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Drainage line 601 mm to 900 mm dia meter <span className="text-danger">*</span></label>
                                                <input name="DrainageLine601to900mmDiaMeter" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.DrainageLine601to900mmDiaMeter} onChange={(e) => { this.setState({ DrainageLine601to900mmDiaMeter: e.target.value }, () => { this.finishform.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="DrainageLine601to900mmDiaMeter">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Drainage line 901 mm to 1200 mm dia meter <span className="text-danger">*</span></label>
                                                <input name="DrainageLine901to1200mmDiaMeter" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.DrainageLine901to1200mmDiaMeter} onChange={(e) => { this.setState({ DrainageLine901to1200mmDiaMeter: e.target.value }, () => { this.finishform.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="DrainageLine901to1200mmDiaMeter">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>

                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc', marginBottom: '9%' }} className="mobbottom" htmlFor="exampleInputPassword1">Jetting system <span className="text-danger">*</span></label>
                                                <input name="JettingSystem" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.JettingSystem} onChange={(e) => { this.setState({ JettingSystem: e.target.value }, () => { this.finishform.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="JettingSystem">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc', marginBottom: '9%' }} className="mobbottom" htmlFor="exampleInputPassword1">Suction system <span className="text-danger">*</span></label>
                                                <input name="SuctionSystem" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.SuctionSystem} onChange={(e) => { this.setState({ SuctionSystem: e.target.value }, () => { this.finishform.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="SuctionSystem">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc', marginBottom: '9%' }} htmlFor="exampleInputPassword1">Suction hose 5 diameter - 3 meter long <span className="text-danger">*</span></label>
                                                <input name="SuctionHose5Diameter3MeterLong" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.SuctionHose5Diameter3MeterLong} onChange={(e) => { this.setState({ SuctionHose5Diameter3MeterLong: e.target.value }, () => { this.finishform.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="SuctionHose5Diameter3MeterLong">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Jetting hose - 32 m.m. dia, 120 m. long <span className="text-danger">*</span></label>
                                                <input name="JettingHose32Diameter120MeterLong" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.JettingHose32Diameter120MeterLong} onChange={(e) => { this.setState({ JettingHose32Diameter120MeterLong: e.target.value }, () => { this.finishform.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="JettingHose32Diameter120MeterLong">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Jetting nozzle: De
                                                    Chocking nozzle <span className="text-danger">*</span></label>
                                                <input name="JettingNozzleDeChockingNozzle" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.JettingNozzleDeChockingNozzle} onChange={(e) => { this.setState({ JettingNozzleDeChockingNozzle: e.target.value }, () => { this.finishform.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="JettingNozzleDeChockingNozzle">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">De Silting nozzle - flat nozzle <span className="text-danger">*</span></label>
                                                <input name="DeSiltingNozzleFlatNozzle" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.DeSiltingNozzleFlatNozzle} onChange={(e) => { this.setState({ DeSiltingNozzleFlatNozzle: e.target.value }, () => { this.finishform.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="DeSiltingNozzleFlatNozzle">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Balance nozzle bomb nozzle <span className="text-danger">*</span></label>
                                                <input name="BalanceNozzleBombNozzle" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.BalanceNozzleBombNozzle} onChange={(e) => { this.setState({ BalanceNozzleBombNozzle: e.target.value }, () => { this.finishform.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="BalanceNozzleBombNozzle">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Shift <span className="text-danger">*</span></label>
                                                <input name="Shift" required className="form-control" type="text" value={this.state.Shift} onChange={(e) => { this.setState({ Shift: e.target.value }, () => { this.finishform.validateFields(e.target) }) }} id="example-time-input" placeholder="Enter Shift" />
                                                <FieldFeedbacks for="Shift">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Upload Multiple Images <span className="text-danger">*</span></label>
                                                <input type="file" value={this.state.FinishTaskImages} style={{ height: "37px" }} multiple onChange={this.OnFinishTaskImageUpload} className="form-control" accept="image/png, image/gif, image/jpeg" />
                                                {this.state.FinishTaskImageErrMsg&&<span className="text-danger">{this.state.FinishTaskImageErrMsg==='required'? '*':''}</span>}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" onSubmit={this.OnFinishTaskSubmit} className="btn btn-primary font-weight-bold">
                                        Finish
                                    </button>
                                    <button type="button" onClick={this.cancelFinish} className="btn btn-light-danger font-weight-bold" data-dismiss="modal">
                                        Cancel
                                    </button>
                                </div>
                            </FormWithConstraints>
                        </div>
                    </div>
                </div>
                <div className="modal fade" ref={modal => this.CompleteModal=modal} id="exampleModal" data-backdrop="static" tabIndex={-1} role="dialog" aria-labelledby="staticBackdrop" aria-hidden="true">
                    <div className="modal-dialog startmodaldialog" role="document">
                        <div className="modal-content">
                            <FormWithConstraints
                                ref={form => this.completeform=form}
                                onSubmit={this.OnCompleteTaskSubmit}
                                noValidate>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">
                                        Complete Task
                                    </h5>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-9">
                                            <label style={{ fontSize: 14, fontWeight: 'bold' }}>Finish Detail</label>
                                        </div>
                                        <div className="col-md-3" style={{ textAlign: 'right' }}>
                                            {this.state.isFinishEditVisible&&
                                                <button type="button" onClick={this.onFinishEditClick} style={{ float: 'right' }} className="btn btn-outline-primary mr-2">
                                                    <i className="fa fa-pencil-alt" /> Edit
                                                </button>
                                            }
                                            {this.state.IsFinishUpdatesVisible&&
                                                <>
                                                    <button type="button" onClick={this.OnFinishUpdate} className="btn btn-outline-primary mr-2">
                                                        <i className="fa fa-file-invoice" /> Update
                                                    </button>
                                                    <button type="button" onClick={this.onFinishEditCancel} className="btn btn-outline-danger">
                                                        <i className="fa fa-arrow-alt-circle-left" /> Cancel
                                                    </button>
                                                </>
                                            }
                                        </div>

                                        <div className="col-md-12">
                                            <hr />
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Odometer of Vehicle Reaching Work Location <span className="text-danger">*</span></label>
                                                <input className="form-control" disabled={this.state.IsCompleteDisabled} name="VehicleReachedLocationOdometer" required onKeyPress={this.allowOnlyNumbers} type="text" value={this.state.VehicleReachedLocationOdometer} onChange={(e) => { this.setState({ VehicleReachedLocationOdometer: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} id="example-time-input" />
                                                <FieldFeedbacks for="VehicleReachedLocationOdometer">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc', marginBottom: '9%' }} className="mobbottom" htmlFor="exampleInputPassword1">Vehicle Leaving Work Location Time <span className="text-danger">*</span> </label>
                                                <input className="form-control" name="VehicleReturnLocationTime" required type="time"
                                                    defaultValue={this.state.VehicleReturnLocationTime} onChange={(e) => { this.setState({ VehicleReturnLocationTime: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} id="example-time-input" disabled={this.state.IsCompleteDisabled} />
                                                <FieldFeedbacks for="VehicleReturnLocationTime">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} className="mobbottom" htmlFor="exampleInputPassword1">Odometer of Vehicle Leaving Work Location <span className="text-danger">*</span></label>
                                                <input className="form-control" name="VehicleReturnLocationOdometer" required type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.VehicleReturnLocationOdometer} onChange={(e) => { this.setState({ VehicleReturnLocationOdometer: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} id="example-time-input" disabled={this.state.IsCompleteDisabled} />
                                                <FieldFeedbacks for="VehicleReturnLocationOdometer">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <button type="button" className="btn btn-outline-primary font-weight-bold mt-13" style={{ width: '100%' }}>
                                                Get GPS Location
                                            </button>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} className="mobbottom" htmlFor="exampleInputPassword1">Vehicle Reaching Parking Location Time <span className="text-danger">*</span></label>
                                                <input className="form-control" name="VehicleReachedParkingTime" required type="time" defaultValue={this.state.VehicleReachedParkingTime} onChange={(e) => { this.setState({ VehicleReachedParkingTime: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} id="example-time-input" disabled={this.state.IsCompleteDisabled} />
                                                <FieldFeedbacks for="VehicleReachedParkingTime">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Odometer Reaching Parking Location <span className="text-danger">*</span></label>
                                                <input name="VehicleReachedParkingOdometer" required className="form-control" type="text" value={this.state.VehicleReachedParkingOdometer} onChange={(e) => { this.setState({ VehicleReachedParkingOdometer: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} onKeyPress={this.allowOnlyNumbers} id="example-time-input" disabled={this.state.IsCompleteDisabled} />
                                                <FieldFeedbacks for="VehicleReachedParkingOdometer">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} className="mobbottom" htmlFor="exampleInputPassword1">Jetting Finish Meter Reading <span className="text-danger">*</span></label>
                                                <input name="JettingFinishMeterReading" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.JettingFinishMeterReading} onChange={(e) => { this.setState({ JettingFinishMeterReading: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} id="example-time-input" disabled={this.state.IsCompleteDisabled} />
                                                <FieldFeedbacks for="JettingFinishMeterReading">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Suction Pump Finish Meter Reading <span className="text-danger">*</span></label>
                                                <input name="SuctionPumpFinishMeterReading" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.SuctionPumpFinishMeterReading} onChange={(e) => { this.setState({ SuctionPumpFinishMeterReading: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} id="example-time-input" disabled={this.state.IsCompleteDisabled} />
                                                <FieldFeedbacks for="SuctionPumpFinishMeterReading">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc', marginBottom: '11%' }} className="mobbottom" htmlFor="exampleInputPassword1">Total number of drainage line <span className="text-danger">*</span></label>
                                                <input name="TotalNoOfDranageLine" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.TotalNoOfDranageLine} onChange={(e) => { this.setState({ TotalNoOfDranageLine: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} id="example-time-input" disabled={this.state.IsCompleteDisabled} />
                                                <FieldFeedbacks for="TotalNoOfDranageLine">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Drainage line 150 mm to 300 mm dia meter <span className="text-danger">*</span></label>
                                                <input name="DrainageLine150to300mmDiaMeter" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.DrainageLine150to300mmDiaMeter} onChange={(e) => { this.setState({ DrainageLine150to300mmDiaMeter: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} id="example-time-input" disabled={this.state.IsCompleteDisabled} />
                                                <FieldFeedbacks for="DrainageLine150to300mmDiaMeter">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Drainage line 301 mm to 600 mm dia meter <span className="text-danger">*</span></label>
                                                <input name="DrainageLine301to600mmDiaMeter" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.DrainageLine301to600mmDiaMeter} onChange={(e) => { this.setState({ DrainageLine301to600mmDiaMeter: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} id="example-time-input" disabled={this.state.IsCompleteDisabled} />
                                                <FieldFeedbacks for="DrainageLine301to600mmDiaMeter">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Drainage line 601 mm to 900 mm dia meter <span className="text-danger">*</span></label>
                                                <input name="DrainageLine601to900mmDiaMeter" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.DrainageLine601to900mmDiaMeter} onChange={(e) => { this.setState({ DrainageLine601to900mmDiaMeter: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} id="example-time-input" disabled={this.state.IsCompleteDisabled} />
                                                <FieldFeedbacks for="DrainageLine601to900mmDiaMeter">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Drainage line 901 mm to 1200 mm dia meter <span className="text-danger">*</span></label>
                                                <input name="DrainageLine901to1200mmDiaMeter" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.DrainageLine901to1200mmDiaMeter} onChange={(e) => { this.setState({ DrainageLine901to1200mmDiaMeter: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} id="example-time-input" disabled={this.state.IsCompleteDisabled} />
                                                <FieldFeedbacks for="DrainageLine901to1200mmDiaMeter">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>

                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc', marginBottom: '9%' }} className="mobbottom" htmlFor="exampleInputPassword1">Jetting system <span className="text-danger">*</span></label>
                                                <input name="JettingSystem" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.JettingSystem} onChange={(e) => { this.setState({ JettingSystem: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} id="example-time-input" disabled={this.state.IsCompleteDisabled} />
                                                <FieldFeedbacks for="JettingSystem">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc', marginBottom: '9%' }} className="mobbottom" htmlFor="exampleInputPassword1">Suction system <span className="text-danger">*</span></label>
                                                <input name="SuctionSystem" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.SuctionSystem} onChange={(e) => { this.setState({ SuctionSystem: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} id="example-time-input" disabled={this.state.IsCompleteDisabled} />
                                                <FieldFeedbacks for="SuctionSystem">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc', marginBottom: '9%' }} htmlFor="exampleInputPassword1">Suction hose 5 diameter - 3 meter long <span className="text-danger">*</span></label>
                                                <input name="SuctionHose5Diameter3MeterLong" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.SuctionHose5Diameter3MeterLong} onChange={(e) => { this.setState({ SuctionHose5Diameter3MeterLong: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} id="example-time-input" disabled={this.state.IsCompleteDisabled} />
                                                <FieldFeedbacks for="SuctionHose5Diameter3MeterLong">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Jetting hose - 32 m.m. dia, 120 m. long <span className="text-danger">*</span></label>
                                                <input name="JettingHose32Diameter120MeterLong" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.JettingHose32Diameter120MeterLong} onChange={(e) => { this.setState({ JettingHose32Diameter120MeterLong: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} id="example-time-input" disabled={this.state.IsCompleteDisabled} />
                                                <FieldFeedbacks for="JettingHose32Diameter120MeterLong">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Jetting nozzle: De
                                                    Chocking nozzle <span className="text-danger">*</span></label>
                                                <input name="JettingNozzleDeChockingNozzle" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.JettingNozzleDeChockingNozzle} onChange={(e) => { this.setState({ JettingNozzleDeChockingNozzle: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} id="example-time-input" disabled={this.state.IsCompleteDisabled} />
                                                <FieldFeedbacks for="JettingNozzleDeChockingNozzle">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">De Silting nozzle - flat nozzle <span className="text-danger">*</span></label>
                                                <input name="DeSiltingNozzleFlatNozzle" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.DeSiltingNozzleFlatNozzle} onChange={(e) => { this.setState({ DeSiltingNozzleFlatNozzle: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} id="example-time-input" disabled={this.state.IsCompleteDisabled} />
                                                <FieldFeedbacks for="DeSiltingNozzleFlatNozzle">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Balance nozzle bomb nozzle <span className="text-danger">*</span></label>
                                                <input name="BalanceNozzleBombNozzle" required className="form-control" type="text" onKeyPress={this.allowOnlyNumbers} value={this.state.BalanceNozzleBombNozzle} onChange={(e) => { this.setState({ BalanceNozzleBombNozzle: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} id="example-time-input" disabled={this.state.IsCompleteDisabled} />
                                                <FieldFeedbacks for="BalanceNozzleBombNozzle">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Shift <span className="text-danger">*</span></label>
                                                <input name="Shift" required className="form-control" type="text" value={this.state.Shift} onChange={(e) => { this.setState({ Shift: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} id="example-time-input" disabled={this.state.IsCompleteDisabled} placeholder="Enter Shift" />
                                                <FieldFeedbacks for="Shift">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label style={{ color: '#2b7acc' }} htmlFor="exampleInputPassword1">Upload Multiple Images <span className="text-danger">*</span></label>
                                                <input type="file" disabled={this.state.IsCompleteDisabled} value={this.state.FinishTaskImages} style={{ height: "37px" }} multiple onChange={this.OnFinishTaskImageUpload} className="form-control" accept="image/png, image/gif, image/jpeg" />
                                                {this.state.FinishTaskImageTextVisible&&
                                                    <label>{this.state.FinishTaskImageText}</label>
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <hr style={{ marginTop: 5, borderTop: '1px solid black' }} />
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Remarks<span className="text-danger">*</span></label>
                                                <textarea name="BookingCompleteRemarks" required className="form-control" rows={3} defaultValue={this.state.BookingCompleteRemarks} onChange={(e) => { this.setState({ BookingCompleteRemarks: e.target.value }, () => { this.completeform.validateFields(e.target) }) }} />
                                                <FieldFeedbacks for="BookingCompleteRemarks">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Remarks in Gujarati</label>
                                                <textarea className="form-control" rows={3} defaultValue={this.state.BookingCompleteRemarksGujarati} onChange={(e) => { this.setState({ BookingCompleteRemarksGujarati: e.target.value }) }} />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Tender liquidity damages condition</label>
                                                <textarea className="form-control" rows={3} defaultValue={this.state.TenderLiquidityDamagesCondition} onChange={(e) => { this.setState({ TenderLiquidityDamagesCondition: e.target.value }) }} />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Upload Log Sheet Image<span className="text-danger">*</span></label>
                                                <input type="file" value={this.state.LogSheetImage} style={{ height: "37px" }} multiple onChange={this.OnCompleteTaskImageUpload} className="form-control" accept="image/png, image/gif, image/jpeg" />
                                                {this.state.CompleteTaskErrImage&&<span className="text-danger">{this.state.CompleteTaskErrImage==='required'? '*':''}</span>}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Capture Log Sheet Image</label>
                                                <br />
                                                <button type="button" className="btn btn-light-primary font-weight-bold" style={{ width: '100%' }}>
                                                    Capture Image
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" onSubmit={this.OnCompleteTaskSubmit} className="btn btn-light-primary  font-weight-bold">
                                        Complete
                                    </button>
                                    <button type="button" onClick={this.OnCompleteReferredBackTaskSubmit} className="btn btn-light-dark font-weight-bold">
                                        Referred Back
                                    </button>
                                    <button type="button" onClick={this.cancelComplete} className="btn btn-light-danger font-weight-bold" data-dismiss="modal">
                                        Cancel
                                    </button>
                                </div>
                            </FormWithConstraints>
                        </div>
                    </div>
                </div>
                <div className="modal fade" ref={modal => this.ApprovedModal=modal} id="exampleModal" data-backdrop="static" tabIndex={-1} role="dialog" aria-labelledby="staticBackdrop" aria-hidden="true">
                    <div className="modal-dialog startmodaldialog" role="document">
                        <div className="modal-content">
                            <FormWithConstraints
                                ref={form => this.form=form}
                                onSubmit={this.OnApprovedTaskSubmit}
                                noValidate>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">
                                        Approval Task
                                    </h5>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Status<span className="text-danger">*</span></label>
                                                <Select isClearable={true} options={this.state.BookingApprovals} value={this.state.BookingApprovalStatus} onChange={this.onBookingApprovalChange} />
                                                {this.state.BookingApprovalStatusErrMsg&&<span className="text-danger">{this.state.BookingApprovalStatusErrMsg==='required'? '*':''}</span>}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Remarks<span className="text-danger">*</span></label>
                                                <textarea className="form-control" name="BookingApprovalRemarks" required rows={3} defaultValue={this.state.BookingApprovalRemarks} onChange={(e) => { this.setState({ BookingApprovalRemarks: e.target.value }, () => { this.form.validateFields(e.target) }) }} />
                                                <FieldFeedbacks for="BookingApprovalRemarks">
                                                    <FieldFeedback when="valueMissing">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-md-4 mt-8">
                                            <div className="form-group">
                                                <button type="button" className="btn btn-primary font-weight-bold">
                                                    GPS Tracking
                                                </button>
                                                <button type="button" className="btn btn-primary font-weight-bold ml-5">
                                                    CCD Tracking
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" onSubmit={this.OnApprovedTaskSubmit} className="btn btn-primary font-weight-bold">
                                        Submit
                                    </button>
                                    <button type="button" onClick={this.onCancelApproval} className="btn btn-light-danger font-weight-bold" data-dismiss="modal">
                                        Cancel
                                    </button>
                                </div>
                            </FormWithConstraints>
                        </div>
                    </div>
                </div>
                <div className="modal fade" ref={modal => this.ReferredAssignModal=modal} id="exampleModal" data-backdrop="static" tabIndex={-1} role="dialog" aria-labelledby="staticBackdrop" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Assign Task (Referred)
                                </h5>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label>Date</label>
                                            <DatePicker isClearable={true} dateFormat="dd-MM-yyyy" selected={this.state.RefferBackAssignDate} minDate={new Date()} autoComplete="off" className="form-control readonly" id="txtTaskDate" value={this.state.RefferBackAssignDate} onChange={this.OnReferredBackChange} />
                                        </div>
                                    </div>
                                    {this.state.IsReferredAssignDataVisible&&
                                        <>
                                            <div className="col-md-11">
                                                <div className="form-group">
                                                    <label htmlFor="exampleInputPassword1">Vehicle </label>
                                                    <Select isClearable={true} options={this.state.vehicles} value={this.state.VehicleID} onChange={this.onVehicleChange} />
                                                    {this.state.VehicleErrMsg&&<span className="text-danger">{this.state.VehicleErrMsg==='required'? '*':''}</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-1" style={{ display: 'flex', alignItems: 'center' }}>
                                                <i className="fa fa-calendar-alt " >
                                                </i>
                                            </div>
                                            <div className="col-md-11">
                                                <div className="form-group">
                                                    <label htmlFor="exampleInputPassword1">Driver </label>
                                                    <Select isClearable={true} options={this.state.drivers} value={this.state.DriverID} onChange={this.onDriverChange} />
                                                    {this.state.DriverErrMsg&&<span className="text-danger">{this.state.DriverErrMsg==='required'? '*':''}</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-1" style={{ display: 'flex', alignItems: 'center' }}>
                                                <i className="fa fa-calendar-alt " >
                                                </i>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label htmlFor="exampleInputPassword1">Helper </label>
                                                    <div className="checkbox-inline">
                                                        {
                                                            this.state.HelperDataAvailable&&
                                                            <label className="checkbox" >
                                                                <input checked={this.state.isChecked} style={{ marginRight: 0 }} value="Select All" type="checkbox" onChange={this.onHelperAllChange} />
                                                                <span />Select All
                                                            </label>

                                                        }

                                                        {
                                                            this.state.helpers.map((item, index) => (

                                                                <label className="checkbox" key={index}>

                                                                    <input checked={item.isChecked} style={{ marginRight: 0 }} value={item.id} type="checkbox" onChange={this.onHelperChange} />
                                                                    <span />{item.value}

                                                                </label>
                                                            ))
                                                        }
                                                        {
                                                            this.state.NoHelperVisibleMsg&&
                                                            <label>No Helper Available</label>
                                                        }

                                                    </div>
                                                    {this.state.HelperErrMsg&&<span className="text-danger">{this.state.HelperErrMsg==='required'? '*':''}</span>}
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" onClick={this.handleReferredBackAssign} className="btn btn-primary font-weight-bold">
                                    Submit
                                </button>
                                <button type="submit" onClick={this.cancelReferredBackAssign} className="btn btn-light-danger font-weight-bold" data-dismiss="modal">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}
export default withCookies(viewbooking);