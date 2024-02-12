import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import services from "../services/services";
import Swal from "sweetalert2";
import MaterialTable from '@material-table/core';
import '../style.css';
import Select from 'react-select'
import {
    Async,
    FieldFeedback,
    FieldFeedbacks,
    FormWithConstraints,
    Input
} from 'react-form-with-constraints';

const headerTblStyle={ color: 'black' };

class state extends Component {
    constructor(props) {
        super(props);
        this.state={
            pathName: "/state",
            data: [], StateName: "", StateID: "", countries: [], SelectCountryLabel: "", SelectCountryValue: "",
            CountryID: { 'label': '--Select Country--', 'value': '--Select Country--' },
            cols: [
                { title: 'Sr.No', width: '5%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px',textAlign:'center' }}>{rowData.tableData.id+1}</p>) } },
                { title: 'Country Name', width: '30%', field: 'CountryName', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.CountryName}</p>) } },
                { title: 'State Name', width: '50%', field: 'StateName', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.StateName}</p>) } },

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
        this.GetCountry();
        this.setState({ CountryID: { 'label': 'India', 'value': '1' } })
        this.GetState();

    }
    GetState() {
        var data=JSON.stringify({
            "StateID": ""
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
            this.setState({ data: response.data.data })
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
    EditState(id) {
        var data=JSON.stringify({
            "StateID": id
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
            this.setState({
                StateID: response.data.data[0].StateID,
                CountryID: { 'label': response.data.data[0].CountryName, 'value': response.data.data[0].CountryID },
                StateName: response.data.data[0].StateName
            });
        }, error => { })
    }
    CheckAlert(id) {
        Swal.fire({
            title: 'Are you Sure You Want to Delete?', icon: "warning", showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                var data=JSON.stringify({
                    "StateID": id
                });
                var config={
                    method: 'POST',
                    url: services.API_URL+"State/removeState",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    if (response.data.status) {
                        this.GetState();
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
        this.setState({ StateID: "", StateName: "" });
        this.form.reset();
    }

    onChange=(e) => {
        debugger;
        this.setState({ CountryID: e });
    }
    // ClearData = (e) => { this.form.reset(); e.preventDefault(); }
    handleSubmit=(e) => {
        debugger;
        e.preventDefault();
        this.form.validateFields();

        if (this.form.isValid()) {

            var data="";
            if (this.state.StateID!="") {
                data=JSON.stringify({
                    "StateID": this.state.StateID,
                    "CountryID": this.state.CountryID.value,
                    "StateName": this.state.StateName
                });
            }
            else {
                data=JSON.stringify({
                    "CountryID": this.state.CountryID.value,
                    "StateName": this.state.StateName
                });
            }

            var config={
                method: 'POST',
                url: services.API_URL+"State/setState",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            services.JsonValue(config).then(response => {
                //debugger;
                if (response.data.status) {
                    debugger;
                    if (this.state.StateID!="") {
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
                    this.GetState();
                }
                else {
                    Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
                }
            }, error => { })
        }
        else{

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
                                    <h3 className="card-title">Add State</h3>
                                </div>
                                <FormWithConstraints
                                    ref={form => this.form=form}
                                    onSubmit={this.handleSubmit}
                                    noValidate>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label>Country Name </label>
                                                    {/* <select style={{ width: '100%' }} options={this.state.countries} className="form-control select2" id="kt_select2_1" name="param">
                                                        <option value="AK">India</option>
                                                    </select> */}
                                                    <Select options={this.state.countries} value={this.state.CountryID} onChange={this.onChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label>State Name </label>
                                                    <input type="text" required name="StateName" onKeyPress={this.allowOnlyCharacters} value={this.state.StateName} onChange={(e) => this.setState({ StateName: e.target.value })} className="form-control" placeholder="Enter State Name" />
                                                    <FieldFeedbacks for="StateName">
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
                                        <h3 className="card-label">View State</h3>
                                    </div>
                                </div> */}
                                <div className="card-body">
                                    <MaterialTable title="View State" columns={this.state.cols} data={this.state.data}
                                        actions={[{ icon: 'edit', tooltip: 'Edit', onClick: (e, r) => this.EditState(r.StateID) },
                                        { icon: 'delete', tooltip: 'Delete', onClick: (e, r) => this.CheckAlert(r.StateID) }
                                        ]}
                                        options={{
                                            headerStyle: { color: 'black' }, toolbar: true, search: false,
                                            paging: true, pageSize: 5, emptyRowsWhenPaging: true, pageSizeOptions: [5, 10, 15, 20],
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
export default state;