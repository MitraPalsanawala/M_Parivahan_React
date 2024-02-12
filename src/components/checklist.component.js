import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { WithRouter } from "react-router";
import { connect } from "react-redux";
import services from "../services/services";
import Swal from "sweetalert2";
import MaterialTable from '@material-table/core';
import '../style.css';
import {
    Async,
    FieldFeedback,
    FieldFeedbacks,
    FormWithConstraints,
    Input
} from 'react-form-with-constraints';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

const headerTblStyle={ color: 'black' };

class CheckList extends Component {
    static propTypes={
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        const { cookies }=props;
        this.state={
            data: [], CheckListTitle: "", CheckListID: "", cols: [
                { title: 'Sr.No', width: '5%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px', textAlign: 'center' }}>{rowData.tableData.id+1}</p>) } },
                { title: 'Title', width: '80%', field: 'CheckListTitle', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.CheckListTitle}</p>) } },

            ]
        }
    }
    allowOnlyCharacters=(event) => {
        const keyCode=event.keyCode||event.which;
        const keyValue=String.fromCharCode(keyCode);
        if (!new RegExp("^[a-zA-Z ]+$").test(keyValue)) event.preventDefault();
        return;
    };
    componentDidMount() {
        this.GetCheckList();
    }
    GetCheckList() {
        var CompanyID="";
        var ClientID="";
        if (this.props.allCookies.MainCompanyID!==undefined) {
            CompanyID=this.props.allCookies.MainCompanyID;
        }
        if (this.props.allCookies.MainClientID!==undefined) {
            ClientID=this.props.allCookies.MainClientID
        }

        if(CompanyID != "" && ClientID != "")
        {
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
                this.setState({ data: response.data.data })
            }, error => { })
        }
        else{
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
    EditCheckList(id) {
        var CompanyID="";
        var ClientID="";
        if (this.props.allCookies.MainCompanyID!==undefined) {
            CompanyID=this.props.allCookies.MainCompanyID;
        }
        if (this.props.allCookies.MainClientID!==undefined) {
            ClientID=this.props.allCookies.MainClientID
        }
        var data=JSON.stringify({
            "CheckListID": id,
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
            this.setState({
                CheckListID: response.data.data[0].CheckListID,
                CheckListTitle: response.data.data[0].CheckListTitle
            });
        }, error => { })
    }
    CheckAlert(id) {
        Swal.fire({
            title: 'Are you Sure You Want to Delete?', icon: "warning", showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                var data=JSON.stringify({
                    "CheckListID": id
                });
                var config={
                    method: 'POST',
                    url: services.API_URL+"CheckList/removeCheckList",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    if (response.data.status) {
                        this.GetCheckList();
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
    ClearData=(e) => {
        debugger;
        this.setState({ CheckListID: "", CheckListTitle: "" });
        this.form.reset();
    }
    // ClearData = (e) => { this.form.reset(); e.preventDefault(); }
    handleSubmit=(e) => {
        debugger;
        e.preventDefault();
        this.form.validateFields();

        if (this.form.isValid()) {
            var CompanyID="";
            var ClientID="";

            if (this.props.allCookies.MainCompanyID!==undefined) {
                CompanyID=this.props.allCookies.MainCompanyID;
            }
            if (this.props.allCookies.MainClientID!==undefined) {
                ClientID=this.props.allCookies.MainClientID
            }
            var data="";
            if (this.state.CheckListID!="") {
                data=JSON.stringify({
                    "CheckListID": this.state.CheckListID,
                    "CompanyID": CompanyID,
                    "ClientID": ClientID,
                    "CheckListTitle": this.state.CheckListTitle,
                    "EntryByUserType": "",
                    "EntryByUserID": ""
                });
            }
            else {
                data=JSON.stringify({
                    "CompanyID": CompanyID,
                    "ClientID": ClientID,
                    "CheckListTitle": this.state.CheckListTitle,
                    "EntryByUserType": "",
                    "EntryByUserID": ""
                });
            }

            var config={
                method: 'POST',
                url: services.API_URL+"CheckList/setCheckList",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            services.JsonValue(config).then(response => {
                debugger;
                if (response.data.status) {
                    debugger;
                    if (this.state.CheckListID !="") {
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
                    this.GetCheckList();
                }
                else {
                    Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
                }
            }, error => { })
        } else {
            //Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: 'something went wrong', showConfirmButton: false, timer: 3000 });
        }

        var fields="";

    }

    render() {

        return (
            <div>
                <div className="container-fluid" style={{ marginTop: '10%' }}>
                    <div className="row">
                        <div className="col-md-5">
                            <div className="card card-custom gutter-b example example-compact">
                                <div className="card-header">
                                    <h3 className="card-title">Add CheckList</h3>
                                </div>
                                {/* <form onSubmit={this.handleSubmit} ref={(c) => { this.form=c; }}> */}
                                <FormWithConstraints
                                    ref={form => this.form=form}
                                    onSubmit={this.handleSubmit}
                                    noValidate>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label>Title </label>
                                                    <input name="CheckListTitle" required type="text" onKeyPress={this.allowOnlyCharacters} value={this.state.CheckListTitle} onChange={(e) => this.setState({ CheckListTitle: e.target.value })} className="form-control" placeholder="Enter Title" />
                                                    <FieldFeedbacks for="CheckListTitle">
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
                        <div className="col-md-7">
                            <div className="card card-custom">
                                {/* <div className="card-header flex-wrap border-0 pt-6 pb-0">
                                    <div className="card-title">
                                        <h3 className="card-label">View Country</h3>
                                    </div>
                                </div> */}
                                <div className="card-body">
                                    <MaterialTable title="View Check List" columns={this.state.cols} data={this.state.data}
                                        actions={[{ icon: 'edit', tooltip: 'Edit', onClick: (e, r) => this.EditCheckList(r.CheckListID) },
                                        { icon: 'delete', tooltip: 'Delete', onClick: (e, r) => this.CheckAlert(r.CheckListID) }
                                        ]}
                                        options={{
                                            headerStyle: { color: 'black' }, toolbar: true, search: false, sorting: false,
                                            paging: true, pageSize: 5, emptyRowsWhenPaging: true, pageSizeOptions: [5, 10, 15, 20],
                                        }}
                                    />
                                    {/* <div className="datatable datatable-default datatable-bordered datatable-loaded">
                                        <table className="datatable-bordered datatable-head-custom datatable-table" id="kt_datatable" style={{ display: 'block', overflow: 'auto' }}>
                                            <thead className="datatable-head">
                                                <tr className="datatable-row" style={{ left: 0 }}>
                                                    <th style={{ width: '5%' }} data-field="Car Make" className="datatable-cell datatable-cell-sort">
                                                        <span>Sr No</span>
                                                    </th>
                                                    <th style={{ width: '15%' }} data-field="Order ID" className="datatable-cell datatable-cell-sort">
                                                        <span>Country Name</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody style={{}} className="datatable-body">
                                                {this.state.data.map((item, index) => (
                                                    <tr key={index} className="datatable-row" style={{ left: 0 }}>
                                                        <td style={{ width: '5%' }} data-field="Car Make" aria-label="Land Rover" className="datatable-cell">
                                                            <span>{index + 1}</span>
                                                        </td>
                                                        <td style={{ width: '15%' }} data-field="Order ID" aria-label="0006-3629" className="datatable-cell">
                                                            <span>{item["CountryName"]}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="datatable-pager datatable-paging-loaded">
                                            <ul className="datatable-pager-nav my-2 mb-sm-0">
                                                <li>
                                                    <a title="First" className="datatable-pager-link datatable-pager-link-first datatable-pager-link-disabled" data-page={1} disabled="disabled"><i className="flaticon2-fast-back" /></a>
                                                </li>
                                                <li>
                                                    <a title="Previous" className="datatable-pager-link datatable-pager-link-prev datatable-pager-link-disabled" data-page={1} disabled="disabled"><i className="flaticon2-back" /></a>
                                                </li>
                                                <li style={{ display: 'none' }}>
                                                    <input type="text" className="datatable-pager-input form-control" title="Page number" />
                                                </li>
                                                <li style={{}}>
                                                    <a className="datatable-pager-link datatable-pager-link-number datatable-pager-link-active" data-page={1} title={1}>1</a>
                                                </li>
                                                <li>
                                                    <a title="Next" className="datatable-pager-link datatable-pager-link-next" data-page={2}><i className="flaticon2-next" /></a>
                                                </li>
                                                <li>
                                                    <a title="Last" className="datatable-pager-link datatable-pager-link-last" data-page={15}><i className="flaticon2-fast-next" /></a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
function mapStateToProps(state) {
    const { user }=state.auth;
    return { user };
}
export default withCookies(CheckList);