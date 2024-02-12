import React, { Component } from "react";
import services from "../services/services";
import Swal from "sweetalert2";
import MaterialTable, { MTableToolbar } from '@material-table/core';
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

class district extends Component {
    static propTypes={
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        const { cookies }=props;
        this.state={
            data: [], zones: [],
            ZoneID: { 'label': '--Select Zone--', 'value': '--Select Zone--' },
            SearchZoneID: { 'label': '--Select Zone--', 'value': '--Select Zone--' },
            DistrictID: "", DistrictName: "", CodeName: "",
            ZoneErrMsg: "",
            AddDistrictVisible: false, iconAdd: "fa fa-plus", iconFilter: "fa fa-plus", isFilterVisible: false,
            rows: [{ Email: '', DistrictEmailDetailID: '' }],
            cols: [
                { title: 'Sr.No', width: '5%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px',textAlign:'center' }}>{rowData.tableData.id+1}</p>) } },
                { title: 'Zone Name', width: '15%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.ZoneName}</p>) } },
                { title: 'Company Name', width: '15%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.CompanyName}</p>) } },
                { title: 'Client Name', width: '15%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.ClientName}</p>) } },
                { title: 'Code Name', width: '15%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.CodeName}</p>) } },
                { title: 'District Name', width: '25%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.DistrictName}</p>) } }
            ]
        }

    }

    componentDidMount() {
        this.GetDistrict();
        this.GetZone();
    }
    GetDistrict() {
        debugger;
        var CompanyID="";
        var ClientID="";
        var SearchZoneID=""

        if (this.state.SearchZoneID.value!="--Select Zone--") {
            SearchZoneID=this.state.SearchZoneID.value;
        }
        else {
            SearchZoneID="";
        }

        if (this.props.allCookies.MainCompanyID!==undefined) {
            CompanyID=this.props.allCookies.MainCompanyID;
        }
        if (this.props.allCookies.MainClientID!==undefined) {
            ClientID=this.props.allCookies.MainClientID
        }

        if (CompanyID!=""&&ClientID!="") {
            var data=JSON.stringify({
                "DistrictID": "",
                "CompanyID": CompanyID,
                "ClientID": ClientID,
                "ZoneID": SearchZoneID
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
                //debugger;
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

    GetZone() {
        var CompanyID="";
        var ClientID="";

        if (this.props.allCookies.MainCompanyID!==undefined) {
            CompanyID=this.props.allCookies.MainCompanyID;
        }
        if (this.props.allCookies.MainClientID!==undefined) {
            ClientID=this.props.allCookies.MainClientID
        }

        var data=JSON.stringify({
            "ZoneID": "",
            "CompanyID": CompanyID,
            "ClientID": ClientID
        });
        var config={
            method: 'POST',
            url: services.API_URL+"Zone/getZone",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        services.JsonValue(config).then(response => {
            debugger;
            this.setState({ zones: response.data.data.map(item => ({ value: item.ZoneID, label: item.ZoneName })) });
        }, error => { })
    }
    ValidateZone=(e) => {
        this.setState({ ZoneErrMsg: '' })
    }
    onZoneChange=(e) => {
        debugger;
        this.setState({ ZoneID: e },()=>{this.ValidateZone();});
       
    }

    EditDistrict(id) {
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
                "DistrictID": id,
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
                this.setState({
                    DistrictID: response.data.data[0].DistrictID,
                    ZoneID: { 'label': response.data.data[0].ZoneName, 'value': response.data.data[0].ZoneID },
                    DistrictName: response.data.data[0].DistrictName,
                    CodeName: response.data.data[0].CodeName,
                   // rows: response.data.data[0].DistrictEmailDetail
                });
                if(response.data.data[0].DistrictEmailDetail != null)
                {
                    this.setState({rows: response.data.data[0].DistrictEmailDetail});
                }
                else{
                    this.setState({rows: [{Email: '', DistrictEmailDetailID: ''}]});
                }
                this.setState({ AddDistrictVisible: true });
                this.setState({ iconAdd: "fa fa-minus" });
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
            DistrictEmailDetailID:"",
            Email: ""
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
                "DistrictEmailDetailID": rows[idx].DistrictEmailDetailID
            });
            var config={
                method: 'POST',
                url: services.API_URL+"District/removeDistrictEmail",
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
            DistrictEmailDetailID: rows[idx].DistrictEmailDetailID,
            Email: value
        };
        this.setState({ rows });
    }

    ClearData=(e) => {
        debugger;
        this.setState({
            zones: [],
            ZoneID: { 'label': '--Select Zone--', 'value': '--Select Zone--' },
            DistrictID: "", ZoneErrMsg:"", DistrictName: "", CodeName: "",
            rows: [{ Email: '' }]
        });
        this.form.reset();
        this.GetZone();
    }

    CheckAlert(id) {
        Swal.fire({
            title: 'Are you Sure You Want to Delete?', icon: "warning", showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                var data=JSON.stringify({
                    "DistrictID": id
                });
                var config={
                    method: 'POST',
                    url: services.API_URL+"District/removeDistrict",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    if (response.data.status) {
                        this.GetDistrict();
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

        if (this.state.ZoneID.value=="--Select Zone--") {
            this.setState({ ZoneErrMsg: 'required' });
        }

        

        if (this.form.isValid()&&this.state.ZoneID.value!="--Select Zone--") {
            const rows=[...this.state.rows]
            for (let index = 0; index < rows.length; index++) {
                if(rows[index].Email == '')
                {
                    rows[index] = []
                }
            }
            var CompanyID="";
            var ClientID="";

            if (this.props.allCookies.MainCompanyID!==undefined) {
                CompanyID=this.props.allCookies.MainCompanyID;
            }
            if (this.props.allCookies.MainClientID!==undefined) {
                ClientID=this.props.allCookies.MainClientID
            }

            if (CompanyID!=""&&ClientID!="") {
                var data="";
                if (this.state.DistrictID!="") {
                    data=JSON.stringify({
                        "DistrictID": this.state.DistrictID,
                        "CompanyID": CompanyID,
                        "ClientID": ClientID,
                        "ZoneID": this.state.ZoneID.value,
                        "DistrictName": this.state.DistrictName,
                        "CodeName": this.state.CodeName,
                        "EntryByUserType": "",
                        "EntryByUserID": "",
                        "EmailData": rows
                    });
                }
                else {
                    data=JSON.stringify({
                        "DistrictID": "",
                        "CompanyID": CompanyID,
                        "ClientID": ClientID,
                        "ZoneID": this.state.ZoneID.value,
                        "DistrictName": this.state.DistrictName,
                        "CodeName": this.state.CodeName,
                        "EntryByUserType": "",
                        "EntryByUserID": "",
                        "EmailData": rows
                    });
                }

                var config={
                    method: 'POST',
                    url: services.API_URL+"District/setDistrict",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    //debugger;
                    if (response.data.status) {
                        debugger;
                        if (this.state.DistrictID!="") {
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
                        this.GetDistrict();
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

    onAddDistrictClick=(e) => {
        if (this.state.AddDistrictVisible==false) {
            this.setState({ AddDistrictVisible: true });
            this.setState({ iconAdd: "fa fa-minus" });
        }
        else {
            this.setState({ AddDistrictVisible: false });
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

    OnSearchDistrictClick=(e) => {
        e.preventDefault();
        this.GetDistrict();
    }

    OnSearchCancelDistrictClick=() => {
        debugger;


        this.setState({ SearchZoneID: { 'label': '--Select Zone--', 'value': '--Select Zone--' } }, () => {
            this.GetDistrict();
        });
        //window.location.reload(true);

    }

    render() {
        return (

            <>
                <div className="container-fluid" style={{ marginTop: '10%' }}>
                    <div className="row">
                        {this.state.AddDistrictVisible&&
                            <div className="col-md-12">
                                <div className="card card-custom gutter-b example example-compact">
                                    <div className="card-header">
                                        <h3 className="card-title">Add District</h3>
                                    </div>
                                    <FormWithConstraints
                                        ref={form => this.form=form}
                                        onSubmit={this.handleSubmit}
                                        noValidate>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Zone Name </label>
                                                        <Select options={this.state.zones} value={this.state.ZoneID} onChange={this.onZoneChange} />
                                                        {this.state.ZoneErrMsg&&<span className="text-danger">{this.state.ZoneErrMsg==='required'? '*':''}</span>}
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Code </label>
                                                        <input type="text" name="CodeName" required value={this.state.CodeName} onChange={(e) => this.setState({ CodeName: e.target.value },()=>{this.form.validateFields(e.target)})} className="form-control" placeholder="Enter Code" />
                                                        <FieldFeedbacks for="CodeName">
                                                            <FieldFeedback when="valueMissing">
                                                                *
                                                            </FieldFeedback>
                                                        </FieldFeedbacks>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>District Name </label>
                                                        <input type="text" name="DistrictName" required onKeyPress={this.allowOnlyCharacters} value={this.state.DistrictName} onChange={(e) => this.setState({ DistrictName: e.target.value },()=>{this.form.validateFields(e.target)})} className="form-control" placeholder="Enter District Name" />
                                                        <FieldFeedbacks for="DistrictName">
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
                                                                    <i onClick={this.handleAddRow} className="fa fa-plus-circle pt-10" style={{ fontSize: 30, color: '#3699ff', marginRight: '15%' }} />
                                                                    <i onClick={this.handleRemoveSpecificRow(idx)} className="fa fa-minus-circle pt-10" style={{ fontSize: 30, color: '#3699ff' }} />
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
                                    <label>Zone Name </label>
                                    <Select options={this.state.zones} value={this.state.SearchZoneID} onChange={(e) => this.setState({ SearchZoneID: e })} />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <button type="button" onClick={this.OnSearchDistrictClick} className="btn btn-primary mt-12 mr-3">Search </button>
                                <button type="button" onClick={this.OnSearchCancelDistrictClick} className="btn btn-danger mt-12">Cancel </button>
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
                                                    if (rowData.DistrictEmailDetail != null) {
                                                        return (
                                                            <div style={{ width: '100%', padding: '5px', paddingLeft: '35px', display: 'block' }}>
                                                                <table cellSpacing="0" rules="all" border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>

                                                                    <tbody>
                                                                        <tr>
                                                                            {rowData.DistrictEmailDetail.map((value, inx1) => {
                                                                                return (
                                                                                    <td style={{ lineHeight: '22px', padding: '4px', borderBottom: '1px solid #808080' }} >
                                                                                        <p className="customtd">{value.Email}</p>
                                                                                    </td>
                                                                                );
                                                                            })}
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        );
                                                    } else { return false; }
                                                }
                                            }
                                        ]}
                                        actions={[{ icon: 'edit', tooltip: 'Edit', onClick: (e, r) => this.EditDistrict(r.DistrictID) },
                                        { icon: 'delete', tooltip: 'Delete', onClick: (e, r) => this.CheckAlert(r.DistrictID) }
                                        ]}
                                        options={{
                                            headerStyle: { color: 'black' }, toolbar: true, search: false,
                                            paging: true, pageSize: 5, emptyRowsWhenPaging: true, pageSizeOptions: [5, 10, 15, 20],
                                        }}
                                        components={{

                                            Toolbar: props => (
                                                <div className="row" style={{ marginBottom: '2%' }}>
                                                    <div className="col-md-9" style={{ display: 'flex', alignItems: 'center' }}>
                                                        <h3 className="tabletitle">View Districts</h3>

                                                    </div>
                                                    <div className="col-md-3" style={{ textAlign: 'right' }}>
                                                        <a onClick={this.onAddDistrictClick} className="btn btn-outline-primary font-weight-bolder mr-5">
                                                            <span className="svg-icon svg-icon-md">
                                                                <i id="btnAdd" className={this.state.iconAdd} />
                                                            </span>Add District</a>
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
export default withCookies(district);