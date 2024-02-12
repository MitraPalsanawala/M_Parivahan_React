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

const headerTblStyle={ color: 'black' };

class VehicleType extends Component {
    constructor(props) {
        super(props);
        this.state={
            data: [], VehicleType: "", VehicleTypeID: "", cols: [
                { title: 'Sr.No', width: '5%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px',textAlign:'center' }}>{rowData.tableData.id+1}</p>) } },
                { title: 'Vehicle Type', width: '80%', field: 'VehicleType', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.VehicleType}</p>) } },

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
        this.GetVehicleType();
    }
    GetVehicleType() {
        var data=JSON.stringify({
            "VehicleTypeID": ""
        });
        var config={
            method: 'POST',
            url: services.API_URL+"VehicleType/getVehicleType",
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
    EditVehicleType(id) {
        var data=JSON.stringify({
            "VehicleTypeID": id
        });
        var config={
            method: 'POST',
            url: services.API_URL+"VehicleType/getVehicleType",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        services.JsonValue(config).then(response => {
            this.setState({
                VehicleTypeID: response.data.data[0].VehicleTypeID,
                VehicleType: response.data.data[0].VehicleType
            });
        }, error => { })
    }
    CheckAlert(id) {
        Swal.fire({
            title: 'Are you Sure You Want to Delete?', icon: "warning", showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                var data=JSON.stringify({
                    "VehicleTypeID": id
                });
                var config={
                    method: 'POST',
                    url: services.API_URL+"VehicleType/removeVehicleType",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    if (response.data.status) {
                        this.GetVehicleType();
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
        this.setState({ VehicleTypeID: "", VehicleType: "" });
        this.form.reset();
    }
    // ClearData = (e) => { this.form.reset(); e.preventDefault(); }
    handleSubmit=(e) => {
        debugger;
        e.preventDefault();
        this.form.validateFields();

        if (this.form.isValid()) {
            var data="";
            if (this.state.VehicleTypeID!="") {
                data=JSON.stringify({
                    "VehicleTypeID": this.state.VehicleTypeID,
                    "VehicleType": this.state.VehicleType
                });
            }
            else {
                data=JSON.stringify({
                    "VehicleType": this.state.VehicleType
                });
            }

            var config={
                method: 'POST',
                url: services.API_URL+"VehicleType/setVehicleType",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            services.JsonValue(config).then(response => {
                debugger;
                if (response.data.status) {
                    debugger;
                    if (this.state.VehicleTypeID!="") {
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
                    this.GetVehicleType();
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
                                    <h3 className="card-title">Add Vehicle Type</h3>
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
                                                    <label>Vehicle Type </label>
                                                    <input name="VehicleType" required type="text" onKeyPress={this.allowOnlyCharacters} value={this.state.VehicleType} onChange={(e) => this.setState({ VehicleType: e.target.value })} className="form-control" placeholder="Enter Vehicle Type" />
                                                    <FieldFeedbacks for="VehicleType">
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
                                        <h3 className="card-label">View VehicleType</h3>
                                    </div>
                                </div> */}
                                <div className="card-body">
                                    <MaterialTable title="View Vehicle Type" columns={this.state.cols} data={this.state.data}
                                        actions={[{ icon: 'edit', tooltip: 'Edit', onClick: (e, r) => this.EditVehicleType(r.VehicleTypeID) },
                                        { icon: 'delete', tooltip: 'Delete', onClick: (e, r) => this.CheckAlert(r.VehicleTypeID) }
                                        ]}
                                        options={{
                                            headerStyle: { color: 'black' }, toolbar: true, search: false,sorting:false,
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
                                                        <span>VehicleType Name</span>
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
                                                            <span>{item["VehicleType"]}</span>
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
export default VehicleType;