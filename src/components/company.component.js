import React, { Component } from "react";
import services from "../services/services";
import Swal from "sweetalert2";
import MaterialTable from '@material-table/core';
import '../style.css';
import Select from 'react-select'
import { render } from "@testing-library/react";
import {
    Async,
    FieldFeedback,
    FieldFeedbacks,
    FormWithConstraints,
    Input
} from 'react-form-with-constraints';

const headerTblStyle={ color: 'black' };
class Company extends Component {
    constructor(props) {
        super(props);
        this.state={
            data: [], countries: [], states: [], cities: [],
            CountryID: { 'label': '--Select Country--', 'value': '--Select Country--' },
            StateID: { 'label': '--Select State--', 'value': '--Select State--' },
            CityID: { 'label': '--Select City--', 'value': '--Select City--' },
            SearchStateID: { 'label': '--Select State--', 'value': '--Select State--' },
            SearchCityID: { 'label': '--Select City--', 'value': '--Select City--' },
            CompanyID: "", CompanyName: "", GSTNO: "", MobileNo: "", Address: "",
            StateErrMsg:"",CityErrMsg:"",
            AddCompanyVisible: false, iconAdd: "fa fa-plus", iconFilter: "fa fa-plus", isFilterVisible: false, isClear: false,
            IsEdit: false,
            cols: [
                { title: 'Sr.No', width: '5%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.tableData.id+1}</p>) } },
                { title: (<div><span>State Name</span><hr style={{ marginTop: '5px', marginBottom: '5px' }} /><span>City Name</span></div>), width: '20%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.StateName}<hr />{rowData.CityName}</p>) } },
                { title: 'Company Name', width: '20%', field: 'CompanyName', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px'}}>{rowData.CompanyName}</p>) } },
                { title: (<div><span>Phone No</span><hr style={{ marginTop: '5px', marginBottom: '5px' }} /><span>GST No</span></div>), width: '20%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px'}}>{rowData.MobileNo}<hr />{rowData.GSTNO}</p>) } },
                { title: 'Address', width: '30%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.Address}</p>) } }
            ]
        }

    }
    allowOnlyCharacters=(event) => {
        const keyCode=event.keyCode||event.which;
        const keyValue=String.fromCharCode(keyCode);
        if (!new RegExp("^[a-zA-Z ]+$").test(keyValue)) event.preventDefault();
        return;
    };
    allowOnlyNumbers=(event) => {
        const keyCode=event.keyCode||event.which;
        const keyValue=String.fromCharCode(keyCode);
        if (!new RegExp("[0-9]").test(keyValue)) event.preventDefault();
        return;
    };
    componentDidMount() {
        this.GetCompany();
        this.GetCountry();
        this.onCountryChange(1);
        this.setState({ CountryID: { 'label': 'India', 'value': '1' } })

    }
    GetCompany() {
        debugger;
        var SearchStateID=""
        var SearchCityID=""

        if (this.state.SearchStateID.value!="--Select State--") {
            SearchStateID=this.state.SearchStateID.value;
        }
        else {
            SearchStateID="";
        }

        if (this.state.SearchCityID.value!="--Select City--") {
            SearchCityID=this.state.SearchCityID.value;
        }
        else {
            SearchCityID="";
        }

        var data=JSON.stringify({
            "CompanyID": "",
            "StateID": SearchStateID,
            "CityID": SearchCityID
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
            if (response.data.status) {
                this.setState({ data: response.data.data })
            }
            else {
                this.setState({ data: [] })
            }

        }, error => { })
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
            debugger;
            this.setState({ countries: response.data.data.map(item => ({ value: item.CountryID, label: item.CountryName })) });
        }, error => { })
    }
    EditCompany(id) {
        this.setState({ AddCompanyVisible: true });
        this.setState({ iconAdd: "fa fa-minus" });
        var data=JSON.stringify({
            "CompanyID": id
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
            // this.onCountryChange(response.data.data[0].CountryID);
            // this.onStateChange(response.data.data[0].StateID);
            this.setState({ IsEdit: true });
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
            this.setState({
                CompanyID: response.data.data[0].CompanyID,
                CountryID: { 'label': response.data.data[0].CountryName, 'value': response.data.data[0].CountryID },
                StateID: { 'label': response.data.data[0].StateName, 'value': response.data.data[0].StateID },
                CityID: { 'label': response.data.data[0].CityName, 'value': response.data.data[0].CityID },
                CompanyName: response.data.data[0].CompanyName,
                GSTNO: response.data.data[0].GSTNO,
                MobileNo: response.data.data[0].MobileNo,
                Address: response.data.data[0].Address
            });

            // this.setState({ IsEdit: false });
        }, error => { })
    }
    CheckAlert(id) {
        Swal.fire({
            title: 'Are you Sure You Want to Delete?', icon: "warning", showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                var data=JSON.stringify({
                    "CompanyID": id
                });
                var config={
                    method: 'POST',
                    url: services.API_URL+"Company/removeCompany",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    if (response.data.status) {
                        this.GetCompany();
                        Swal.fire({
                            title: 'Successfully Deleted', icon: "success", timer: 1500
                        });
                    } else {
                        Swal.fire({ title: response.data.message, icon: 'error', showConfirmButton: false, timer: 1500 });
                    }
                }, error => { })


            } else if (result.isDenied) {
                Swal.close();
            }
        });
    }
    ClearData=(e) => {
        debugger;
        this.setState({

            StateID: { 'label': '--Select State--', 'value': '--Select State--' },
            CityID: { 'label': '--Select City--', 'value': '--Select City--' },
            CompanyID: "", CompanyName: "", GSTNO: "", MobileNo: "", Address: "", states: [], cities: []

        });
        this.onCountryChange(1);
        this.setState({ CountryID: { 'label': 'India', 'value': '1' } })
    }
    onCountryChange=(e) => {
        debugger;
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
                debugger;
                var checkstatus=this.state.IsEdit
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
        debugger;
        if (e!=null) {
            this.setState({ StateID: e },()=>{this.ValidateState()});
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
                    debugger;

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
                this.setState({ StateID: { 'label': '--Select State--', 'value': '--Select State--' }});
            }
        }
        else {
            this.setState({ StateID: { 'label': '--Select State--', 'value': '--Select State--' } },()=>{this.ValidateCancelState()});
            this.setState({ cities: [] })
            this.setState({ CityID: { 'label': '--Select City--', 'value': '--Select City--' } },()=>{this.ValidateCancelCity()})
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
            this.setState({ CityID: e },()=>{this.ValidateCity()});
        }
        else {
            this.setState({ CityID: { 'label': '--Select City--', 'value': '--Select City--' } },()=>{this.ValidateCancelCity()});
        }
    }
    handleSubmit=(e) => {
        debugger;
        e.preventDefault();
        var data="";
        this.form.validateFields();

        if (this.state.StateID.value =="--Select State--") {
            this.setState({ StateErrMsg: 'required' });
        }

        if (this.state.CityID.value =="--Select City--") {
            this.setState({ CityErrMsg: 'required' });
        }

        if (this.form.isValid()) {
            if (this.state.CompanyID!="") {
                data=JSON.stringify({
                    "CompanyID": this.state.CompanyID,
                    "CompanyName": this.state.CompanyName,
                    "Address": this.state.Address,
                    "MobileNo": this.state.MobileNo,
                    "CountryID": this.state.CountryID.value,
                    "StateID": this.state.StateID.value,
                    "CityID": this.state.CityID.value,
                    "GSTNO": this.state.GSTNO,
                    "EmailDetail": "",
                    "MobileNoDetail": ""
                });
            }
            else {
                data=JSON.stringify({
                    "CompanyName": this.state.CompanyName,
                    "Address": this.state.Address,
                    "MobileNo": this.state.MobileNo,
                    "CountryID": this.state.CountryID.value,
                    "StateID": this.state.StateID.value,
                    "CityID": this.state.CityID.value,
                    "GSTNO": this.state.GSTNO,
                    "EmailDetail": "",
                    "MobileNoDetail": ""
                });
            }

            var config={
                method: 'POST',
                url: services.API_URL+"Company/setCompany",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            services.JsonValue(config).then(response => {
                //debugger;
                if (response.data.status) {
                    debugger;
                    if (this.state.CompanyID!="") {
                        // Swal.fire({ position: 'top-end', toast: true, icon: 'success', title: 'Successfully Updated', showConfirmButton: false, timer: 1500 });
                        Swal.fire({
                            title: 'Successfully Updated', icon: "success", timer: 1500
                        });
                    }
                    else {
                        Swal.fire({
                            title: 'Successfully Inserted', icon: "success", timer: 1500
                        });
                    }
                    this.ClearData();
                    this.GetCompany();
                }
                else {
                    Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
                }
            }, error => { })
        }
    }
    onAddCompanyClick=(e) => {
        if (this.state.AddCompanyVisible==false) {
            this.setState({ AddCompanyVisible: true });
            this.setState({ iconAdd: "fa fa-minus" });
        }
        else {
            this.setState({ AddCompanyVisible: false });
            this.setState({ iconAdd: "fa fa-plus" });
        }
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

    onSearchStateChange=(e) => {
        debugger;
        if (e!=null) {
            this.setState({ SearchStateID: e });
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
                    debugger;

                    if (response.data.status) {
                        this.setState({ SearchCityID: { 'label': '--Select City--', 'value': '--Select City--' } })
                        this.setState({ cities: response.data.data.map(item => ({ value: item.CityID, label: item.CityName })) });
                    }
                    else {
                        this.setState({ cities: [] })
                        this.setState({ SearchCityID: { 'label': '--Select City--', 'value': '--Select City--' } })
                    }

                }, error => { })
            }
            else {
                this.setState({ SearchStateID: { 'label': '--Select State--', 'value': '--Select State--' } });
            }
        }
        else {
            this.setState({ SearchStateID: { 'label': '--Select State--', 'value': '--Select State--' } });
            this.setState({ cities: [] })
            this.setState({ SearchCityID: { 'label': '--Select City--', 'value': '--Select City--' } })
        }


    }
    onSearchCityChange=(e) => {
        if (e!==null) {
            this.setState({ SearchCityID: e });
        }
        else {
            this.setState({ SearchCityID: { 'label': '--Select City--', 'value': '--Select City--' } });
        }
    }
    onSearchCompanyClick=(e) => {
        e.preventDefault();
        this.GetCompany();
    }

    OnSearchCancelCompanyClick=() => {
        debugger;

        this.setState({ SearchStateID: { 'label': '--Select State--', 'value': '--Select State--' } });
        this.setState({ SearchCityID: { 'label': '--Select City--', 'value': '--Select City--' } }, () => {
            this.GetCompany();
        });


    }

    render() {
        return (
            <div>
                <div className="container-fluid" style={{ marginTop: '10%' }}>
                    <div className="row">
                        {this.state.AddCompanyVisible&&
                            <div className="col-md-12">
                                <div className="card card-custom gutter-b example example-compact">
                                    <div className="card-header">
                                        <h3 className="card-title">Add Company</h3>
                                    </div>
                                    <FormWithConstraints
                                        ref={form => this.form=form}
                                        onSubmit={this.handleSubmit}
                                        noValidate>
                                        <div className="card-body">
                                            <div className="row">
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
                                                        <label>Company Name <span className="text-danger">*</span> </label>
                                                        <input type="text" name="CompanyName" required onKeyPress={this.allowOnlyCharacters} value={this.state.CompanyName} onChange={(e) => this.setState({ CompanyName: e.target.value },()=>{this.form.validateFields(e.target)})} className="form-control" placeholder="Enter Company Name" />
                                                        <FieldFeedbacks for="CompanyName">
                                                            <FieldFeedback when="valueMissing">
                                                                *
                                                            </FieldFeedback>
                                                        </FieldFeedbacks>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>GST No </label>
                                                        <input type="text" name="GSTNo" required onKeyPress={this.allowOnlyNumbers} value={this.state.GSTNO} onChange={(e) => this.setState({ GSTNO: e.target.value })} className="form-control" placeholder="Enter GST No" />

                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Mobile No <span className="text-danger">*</span> </label>
                                                        <input type="text" name="MobileNo" required onKeyPress={this.allowOnlyNumbers} value={this.state.MobileNo} onChange={(e) => this.setState({ MobileNo: e.target.value },()=>{this.form.validateFields(e.target)})} className="form-control" placeholder="Enter Mobile No" />
                                                        <FieldFeedbacks for="MobileNo">
                                                            <FieldFeedback when="valueMissing">
                                                                *
                                                            </FieldFeedback>
                                                        </FieldFeedbacks>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Address <span className="text-danger">*</span></label>
                                                        <textarea rows={3} name="Address" required className="form-control" value={this.state.Address} onChange={(e) => this.setState({ Address: e.target.value },()=>{this.form.validateFields(e.target)})} />
                                                        <FieldFeedbacks for="Address">
                                                            <FieldFeedback when="*">
                                                                *
                                                            </FieldFeedback>
                                                        </FieldFeedbacks>
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
                                        </div>
                                    </FormWithConstraints>
                                </div>
                            </div>
                        }
                    </div>
                    {this.state.isFilterVisible&&
                        <div className="row" style={{ marginBottom: '1%' }} id="divFilter">
                            <div className="col-md-3">
                                <div className="form-group formgroupcss">
                                    <label>State </label>
                                    <Select isClearable={true} options={this.state.states} value={this.state.SearchStateID} onChange={this.onSearchStateChange} />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group formgroupcss">
                                    <label>City </label>
                                    <Select isClearable={true} options={this.state.cities} value={this.state.SearchCityID} onChange={this.onSearchCityChange} />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <button type="button" onClick={this.onSearchCompanyClick} className="btn btn-primary mt-12 mr-3">Search </button>
                                <button type="button" onClick={this.OnSearchCancelCompanyClick} className="btn btn-danger mt-12">Cancel </button>
                            </div>
                        </div>
                    }
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card card-custom">
                                <div className="card-body">
                                    <MaterialTable columns={this.state.cols} data={this.state.data}
                                        actions={[{ icon: 'edit', tooltip: 'Edit', onClick: (e, r) => this.EditCompany(r.CompanyID) },
                                        { icon: 'delete', tooltip: 'Delete', onClick: (e, r) => this.CheckAlert(r.CompanyID) }
                                        ]}
                                        options={{
                                            headerStyle: { color: 'black' }, toolbar: true, search: false,
                                            paging: true, pageSize: 5, emptyRowsWhenPaging: true, pageSizeOptions: [5, 10, 15, 20],
                                        }}
                                        components={{

                                            Toolbar: props => (
                                                <div className="row" style={{ marginBottom: '2%' }}>
                                                    <div className="col-md-9" style={{ display: 'flex', alignItems: 'center' }}>
                                                        <h3 className="tabletitle">View Company</h3>

                                                    </div>
                                                    <div className="col-md-3" style={{ textAlign: 'right' }}>
                                                        <a onClick={this.onAddCompanyClick} className="btn btn-outline-primary font-weight-bolder mr-5">
                                                            <span className="svg-icon svg-icon-md">
                                                                <i id="btnAdd" className={this.state.iconAdd} />
                                                            </span>Add Company</a>
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
            </div>
        );
    }
}
export default Company;