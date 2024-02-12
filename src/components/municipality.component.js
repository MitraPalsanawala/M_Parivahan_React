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

const headerTblStyle={ color: 'black' };

class municipality extends Component {
    static propTypes={
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        const { cookies }=props;
        this.state={
            data: [], districts: [],
            DistrictID: { 'label': '--Select District--', 'value': '--Select District--' },
            SearchDistrictID: { 'label': '--Select District--', 'value': '--Select District--' },
            MuncipalityID: "", MuncipalityName: "", CodeName: "",
            DistrictErrMsg: "",
            AddMunicipalityVisible: false, iconAdd: "fa fa-plus", iconFilter: "fa fa-plus", isFilterVisible: false, isClear: false,
            rows: [{ Email: '', MuncipalityEmailDetailID: '' }],
            mobilenorows: [{ MobileNo: "", MuncipalityMobileNoDetailID: "" }],
            cols: [
                { title: 'Sr.No', width: '5%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px', textAlign:'center' }}>{rowData.tableData.id+1}</p>) } },
                { title: 'Zone Name', width: '10%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.ZoneName}</p>) } },
                { title: 'District Name', width: '10%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.DistrictName}</p>) } },
                { title: 'Company Name', width: '20%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.CompanyName}</p>) } },
                { title: 'Client Name', width: '15%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.ClientName}</p>) } },
                { title: 'Code Name', width: '10%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.CodeName}</p>) } },
                { title: 'Muncipality Name', width: '20%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.MuncipalityName}</p>) } }
            ]
        }

    }

    componentDidMount() {
        this.GetMuncipality();
        this.GetDistrict();
    }

    GetMuncipality() {
        debugger;
        var CompanyID="";
        var ClientID="";
        var SearchDistrictID=""

        if (this.state.SearchDistrictID.value!="--Select District--") {
            SearchDistrictID=this.state.SearchDistrictID.value;
        }
        else {
            SearchDistrictID="";
        }


        if (this.props.allCookies.MainCompanyID!==undefined) {
            CompanyID=this.props.allCookies.MainCompanyID;
        }
        if (this.props.allCookies.MainClientID!==undefined) {
            ClientID=this.props.allCookies.MainClientID
        }

        if (CompanyID!=""&&ClientID!="") {
            var data=JSON.stringify({
                "MuncipalityID": "",
                "CompanyID": CompanyID,
                "ClientID": ClientID,
                "DistrictID": SearchDistrictID
            });
            var config={
                method: 'POST',
                url: services.API_URL+"Muncipality/getMuncipality",
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

    GetDistrict() {
        var CompanyID="";
        var ClientID="";

        if (this.props.allCookies.MainCompanyID!==undefined) {
            CompanyID=this.props.allCookies.MainCompanyID;
        }
        if (this.props.allCookies.MainClientID!==undefined) {
            ClientID=this.props.allCookies.MainClientID
        }

        var data=JSON.stringify({
            "DistrictID": "",
            "CompanyID": CompanyID,
            "ClientID": ClientID
        });
        var config={
            method: 'POST',
            url: services.API_URL+"District/getDistrict",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        services.JsonValue(config).then(response => {
            debugger;
            this.setState({ districts: response.data.data.map(item => ({ value: item.DistrictID, label: item.DistrictName })) });
        }, error => { })
    }
    ValidateDistrict=(e) => {
        this.setState({ DistrictErrMsg: '' })
    }

    onDistrictChange=(e) => {
        debugger;
        if(e != null)
        {
            this.setState({ DistrictID: e }, (e) => { this.ValidateDistrict(); });

        }
        else{
            this.setState({ DistrictID: e }, (e) => { this.ValidateDistrict(); });
        }
        
    }

    EditMuncipality(id) {
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
                "MuncipalityID": id,
                "CompanyID": CompanyID,
                "ClientID": ClientID
            });
            var config={
                method: 'POST',
                url: services.API_URL+"Muncipality/getMuncipality",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            services.JsonValue(config).then(response => {
                this.setState({ AddMunicipalityVisible: true });
                this.setState({ iconAdd: "fa fa-minus" });
                debugger;
                this.setState({
                    MuncipalityID: response.data.data[0].MuncipalityID,
                    DistrictID: { 'label': response.data.data[0].DistrictName, 'value': response.data.data[0].DistrictID },
                    MuncipalityName: response.data.data[0].MuncipalityName,
                    CodeName: response.data.data[0].CodeName,
                    //rows: response.data.data[0].MuncipalityEmailDetail
                });
                if (response.data.data[0].MuncipalityEmailDetail!=null) {
                    this.setState({ rows: response.data.data[0].MuncipalityEmailDetail });
                }
                else {
                    this.setState({ rows: [{ Email: '', MuncipalityEmailDetailID: '' }] });
                }

                if (response.data.data[0].MuncipalityMobileNoDetail!=null) {
                    this.setState({ mobilenorows: response.data.data[0].MuncipalityMobileNoDetail });
                }
                else {
                    this.setState({ mobilenorows: [{ MobileNo: '', MuncipalityMobileNoDetailID: '' }] });
                }

                // this.setState({ IsEdit: false });
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

    handleAddRow=() => {
        debugger;
        const rows=[...this.state.rows]
        const item={
            Email: "",
            MuncipalityEmailDetailID:""
        };
        this.setState({
            rows: [...this.state.rows, item]
        });
    }

    handleRemoveRow=() => {
        this.setState({
            rows: this.state.rows.slice(0, -1)
        });
    };

    handleRemoveSpecificRow=(idx) => () => {

        if (idx>0) {
            const rows=[...this.state.rows]
            var data=JSON.stringify({
                "MuncipalityEmailDetailID": rows[idx].MuncipalityEmailDetailID
            });
            var config={
                method: 'POST',
                url: services.API_URL+"Muncipality/removeMuncipalityEmail",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            services.JsonValue(config).then(response => {
                //debugger;
                //this.setState({ data: response.data.data })
            }, error => { })
            rows.splice(idx, 1)
            this.setState({ rows })
        }
        else {
            Swal.fire({ icon: 'error', title: 'Cannot Remove Row', showConfirmButton: false, timer: 1500 });
        }

    }

    onEmailChange=idx => e => {
        debugger;
        const { value }=e.target;
        var rows=[...this.state.rows], result=rows[idx];
        rows[idx]={
            MuncipalityEmailDetailID: rows[idx].MuncipalityEmailDetailID,
            Email: value
        };
        this.setState({ rows });
    }

    handleAddMobileNoRow=() => {
        debugger;
        const mobilenorows=[...this.state.mobilenorows]
        const item={
            MobileNo: "",
            MuncipalityMobileNoDetailID: ""
        };
        this.setState({
            mobilenorows: [...this.state.mobilenorows, item]
        });
    }

    handleRemoveSpecificMobileNoRow=(idx) => () => {

        if (idx>0) {
            const mobilenorows=[...this.state.mobilenorows]

            var data=JSON.stringify({
                "MuncipalityMobileNoDetailID": mobilenorows[idx].MuncipalityMobileNoDetailID
            });
            var config={
                method: 'POST',
                url: services.API_URL+"Muncipality/removeMuncipalityMobileNo",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            services.JsonValue(config).then(response => {
                //debugger;
                //this.setState({ data: response.data.data })
            }, error => { })
            mobilenorows.splice(idx, 1)
            this.setState({ mobilenorows })
        }
        else {
            Swal.fire({ icon: 'error', title: 'Cannot Remove Mobile No Row', showConfirmButton: false, timer: 1500 });
        }

    }

    onMobileNoChange=idx => e => {
        debugger;
        const { value }=e.target;
        var mobilenorows=[...this.state.mobilenorows], result=mobilenorows[idx];
        mobilenorows[idx]={
            MuncipalityMobileNoDetailID: mobilenorows[idx].MuncipalityMobileNoDetailID,
            MobileNo: value
        };
        this.setState({ mobilenorows });
    }

    ClearData=(e) => {
        debugger;
        this.setState({
            districts: [],
            DistrictID: { 'label': '--Select District--', 'value': '--Select District--' },
            MuncipalityID: "", MuncipalityName: "", CodeName: "",
            DistrictErrMsg: "",
            rows: [{ Email: '', MuncipalityEmailDetailID: "" }],
            mobilenorows: [{ MobileNo: "", MuncipalityMobileNoDetailID: "" }],
        });
        this.form.reset();
        this.GetDistrict();
    }

    CheckAlert(id) {
        Swal.fire({
            title: 'Are you Sure You Want to Delete?', icon: "warning", showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                var data=JSON.stringify({
                    "MuncipalityID": id
                });
                var config={
                    method: 'POST',
                    url: services.API_URL+"Muncipality/removeMuncipality",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    if (response.data.status) {
                        this.GetMuncipality();
                        Swal.fire({
                            title: 'Successfully Deleted', icon: "success", timer: 1500
                        });
                    } else {
                        Swal.fire({ icon: 'error', title: response.data.message, showConfirmButton: false, timer: 1500 });
                    }
                }, error => { })
            } else if (result.isDenied) {
                Swal.close();
            }
        });
    }

    handleSubmit=(e) => {
        debugger;


        e.preventDefault();

        this.form.validateFields();


        if (this.state.DistrictID.value=="--Select District--") {
            this.setState({ DistrictErrMsg: 'required' });
        }

        if (this.form.isValid()&&this.state.DistrictID.value!="--Select District--") {
            const rows=[...this.state.rows]
            const mobilenorows=[...this.state.mobilenorows]
            var CompanyID="";
            var ClientID="";

            for (let index=0; index<rows.length; index++) {
                if (rows[index].Email=='') {
                    rows[index]=[]
                }
            }

            for (let index=0; index<mobilenorows.length; index++) {
                if (mobilenorows[index].MobileNo=='') {
                    mobilenorows[index]=[]
                }
            }


            if (this.props.allCookies.MainCompanyID!==undefined) {
                CompanyID=this.props.allCookies.MainCompanyID;
            }
            if (this.props.allCookies.MainClientID!==undefined) {
                ClientID=this.props.allCookies.MainClientID
            }

            if (CompanyID!=""&&ClientID!="") {
                var data="";
                if (this.state.MuncipalityID!="") {
                    data=JSON.stringify({
                        "MuncipalityID": this.state.MuncipalityID,
                        "CompanyID": CompanyID,
                        "ClientID": ClientID,
                        "DistrictID": this.state.DistrictID.value,
                        "MuncipalityName": this.state.MuncipalityName,
                        "CodeName": this.state.CodeName,
                        "EntryByUserType": "",
                        "EntryByUserID": "",
                        "EmailData": rows,
                        "MobileNoData": mobilenorows
                    });
                }
                else {
                    data=JSON.stringify({
                        "MuncipalityID": "",
                        "CompanyID": CompanyID,
                        "ClientID": ClientID,
                        "DistrictID": this.state.DistrictID.value,
                        "MuncipalityName": this.state.MuncipalityName,
                        "CodeName": this.state.CodeName,
                        "EntryByUserType": "",
                        "EntryByUserID": "",
                        "EmailData": rows,
                        "MobileNoData": mobilenorows
                    });
                }

                var config={
                    method: 'POST',
                    url: services.API_URL+"Muncipality/setMuncipality",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    //debugger;
                    if (response.data.status) {
                        debugger;
                        if (this.state.MuncipalityID!="") {
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
                        this.GetMuncipality();
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

    onAddMunicipalityClick=(e) => {
        if (this.state.AddMunicipalityVisible==false) {
            this.setState({ AddMunicipalityVisible: true });
            this.setState({ iconAdd: "fa fa-minus" });
        }
        else {
            this.setState({ AddMunicipalityVisible: false });
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

    OnSearchMunicipalityClick=(e) => {
        e.preventDefault();
        this.GetMuncipality();
    }

    OnSearchCancelMunicipalityClick=() => {
        debugger;

        this.setState({ SearchDistrictID: { 'label': '--Select District--', 'value': '--Select District--' } }, () => {
            this.GetMuncipality();
        });


    }

    render() {
        return (

            <>
                <div className="container-fluid" style={{ marginTop: '10%' }}>
                    <div className="row">
                        {this.state.AddMunicipalityVisible&&
                            <div className="col-md-12">
                                <div className="card card-custom gutter-b example example-compact">
                                    <div className="card-header">
                                        <h3 className="card-title">Add Municipality</h3>
                                    </div>
                                    <FormWithConstraints
                                        ref={form => this.form=form}
                                        onSubmit={this.handleSubmit}
                                        noValidate>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>District Name </label>
                                                        <Select options={this.state.districts} value={this.state.DistrictID} onChange={this.onDistrictChange} />
                                                        {this.state.DistrictErrMsg&&<span className="text-danger">{this.state.DistrictErrMsg==='required'? '*':''}</span>}
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Code </label>
                                                        <input type="text" name="CodeName" required value={this.state.CodeName} onChange={(e) => this.setState({ CodeName: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter Code" />
                                                        <FieldFeedbacks for="CodeName">
                                                            <FieldFeedback when="valueMissing">
                                                                *
                                                            </FieldFeedback>
                                                        </FieldFeedbacks>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Municipality Name </label>
                                                        <input type="text" name="MunicipalityName" required onKeyPress={this.allowOnlyCharacters} value={this.state.MuncipalityName} onChange={(e) => this.setState({ MuncipalityName: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter Municipality Name" />
                                                        <FieldFeedbacks for="MunicipalityName">
                                                            <FieldFeedback when="valueMissing">
                                                                *
                                                            </FieldFeedback>
                                                        </FieldFeedbacks>
                                                    </div>
                                                </div>
                                                {this.state.rows.map((item, idx) => (
                                                    <div className="col-md-3" key={idx}>
                                                        <div className="row" >
                                                            <div className="col-md-8" >
                                                                <div className="form-group">
                                                                    <label>Email ID {idx+1} </label>
                                                                    <label>{ }</label>
                                                                    <input type="text" value={this.state.rows[idx].Email} onChange={this.onEmailChange(idx)} className="form-control" placeholder="Enter Email ID" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <i onClick={this.handleAddRow} className="fa fa-plus-circle pt-10" style={{ fontSize: 30, color: '#3699ff', marginRight: '10%' }} />
                                                                    <i onClick={this.handleRemoveSpecificRow(idx)} className="fa fa-minus-circle pt-10" style={{ fontSize: 30, color: '#3699ff' }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {this.state.mobilenorows.map((item, idx) => (
                                                    <div className="col-md-3" key={idx}>
                                                        <div className="row" >
                                                            <div className="col-md-8" >
                                                                <div className="form-group">
                                                                    <label>Mobile No {idx+1} </label>
                                                                    <label>{ }</label>
                                                                    <input type="text" maxLength='10' value={this.state.mobilenorows[idx].MobileNo} onChange={this.onMobileNoChange(idx)} className="form-control" placeholder="Enter Mobile No" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <i onClick={this.handleAddMobileNoRow} className="fa fa-plus-circle pt-10" style={{ fontSize: 30, color: '#3699ff', marginRight: '10%' }} />
                                                                    <i onClick={this.handleRemoveSpecificMobileNoRow(idx)} className="fa fa-minus-circle pt-10" style={{ fontSize: 30, color: '#3699ff' }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
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
                                    </FormWithConstraints></div>

                            </div>
                        }
                    </div>
                    {this.state.isFilterVisible&&
                        <div className="row" style={{ marginBottom: '1%' }} id="divFilter">
                            <div className="col-md-3">
                                <div className="form-group formgroupcss">
                                    <label>District Name </label>
                                    <Select options={this.state.districts} value={this.state.SearchDistrictID} onChange={(e) => this.setState({ SearchDistrictID: e })} />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <button type="button" onClick={this.OnSearchMunicipalityClick} className="btn btn-primary mt-12 mr-3">Search </button>
                                <button type="button" onClick={this.OnSearchCancelMunicipalityClick} className="btn btn-danger mt-12">Cancel </button>
                            </div>
                        </div>
                    }
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card card-custom">
                                <div className="card-body">
                                    <MaterialTable columns={this.state.cols} data={this.state.data}
                                        detailPanel={[
                                            {
                                                icon: 'add', tooltip: 'Click here to see details', title: 'show',
                                                render: ({ rowData }) => {
                                                    debugger;
                                                    if (rowData.MuncipalityEmailDetail!=null||rowData.MuncipalityMobileNoDetail!=null) {
                                                        return (
                                                            <>
                                                                <div style={{ width: '100%', padding: '5px', paddingLeft: '35px', display: 'block' }}>
                                                                    <table className="table table-light-dark" cellSpacing="0" rules="all" border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                        <thead>
                                                                            <tr>
                                                                                <td>Email ID</td>
                                                                                <td>Mobile No</td>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td style={{ width: '50%' }}>
                                                                                    <table cellSpacing="0" rules="all" border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                                        <tr>
                                                                                            {
                                                                                                rowData.MuncipalityEmailDetail!=null&&
                                                                                                rowData.MuncipalityEmailDetail.map((value, inx1) => {
                                                                                                    return (
                                                                                                        <td style={{ lineHeight: '22px', padding: '4px', borderTop: '1px solid' }} >
                                                                                                            <p className="customnopaddingtd" style={{ padding: 'unset !important' }}>{value.Email}</p>
                                                                                                        </td>
                                                                                                    );
                                                                                                })}
                                                                                        </tr>
                                                                                    </table>

                                                                                </td>
                                                                                <td style={{ width: '50%' }}>
                                                                                    <table cellSpacing="0" rules="all" border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                                        <tr>
                                                                                            {
                                                                                                rowData.MuncipalityMobileNoDetail!=null&&
                                                                                                rowData.MuncipalityMobileNoDetail.map((value, inx1) => {
                                                                                                    return (
                                                                                                        <td style={{ lineHeight: '22px', padding: '4px', borderTop: '1px solid' }} >
                                                                                                            <p className="customnopaddingtd" style={{ padding: 'unset !important' }}>{value.MobileNo}</p>
                                                                                                        </td>
                                                                                                    );
                                                                                                })}
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </>
                                                        );
                                                    }

                                                }
                                            }
                                        ]}
                                        actions={[{ icon: 'edit', tooltip: 'Edit', onClick: (e, r) => this.EditMuncipality(r.MuncipalityID) },
                                        { icon: 'delete', tooltip: 'Delete', onClick: (e, r) => this.CheckAlert(r.MuncipalityID) }
                                        ]}
                                        options={{
                                            headerStyle: { color: 'black' }, toolbar: true, search: false,
                                            paging: true, pageSize: 5, emptyRowsWhenPaging: true, pageSizeOptions: [5, 10, 15, 20],
                                        }}
                                        components={{

                                            Toolbar: props => (
                                                <div className="row" style={{ marginBottom: '2%' }}>
                                                    <div className="col-md-9" style={{ display: 'flex', alignItems: 'center' }}>
                                                        <h3 className="tabletitle">View Muncipalities</h3>

                                                    </div>
                                                    <div className="col-md-3" style={{ textAlign: 'right' }}>
                                                        <a onClick={this.onAddMunicipalityClick} className="btn btn-outline-primary font-weight-bolder mr-5">
                                                            <span className="svg-icon svg-icon-md">
                                                                <i id="btnAdd" className={this.state.iconAdd} />
                                                            </span>Add Municipality</a>
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
            </>
        );
    }
}
export default withCookies(municipality);