import React, { Component } from "react";
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
            pathName: "/city",
            data: [], CityName: "", CityID: "", states: [],
            StateID: { 'label': '--Select State--', 'value': '--Select State--' },
            formIsValid: false,
            StateErrMsg: '',
            submitButtonDisabled: false,
            cols: [
                { title: 'Sr.No', width: '5%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px',textAlign:'center' }}>{rowData.tableData.id+1}</p>) } },
                { title: 'State Name', width: '30%', field: 'StateName', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.StateName}</p>) } },
                { title: 'City Name', width: '50%', field: 'CityName', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.CityName}</p>) } },

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
        this.GetState();
        this.GetCity();
    }
    GetCity() {
        var data=JSON.stringify({
            "CityID": ""
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
            this.setState({ data: response.data.data })
        }, error => { })
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
            debugger;
            this.setState({ states: response.data.data.map(item => ({ value: item.StateID, label: item.StateName })) });
        }, error => { })
    }
    EditCity(id) {
        var data=JSON.stringify({
            "CityID": id
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
            this.setState({
                CityID: response.data.data[0].CityID,
                StateID: { 'label': response.data.data[0].StateName, 'value': response.data.data[0].StateID },
                CityName: response.data.data[0].CityName
            });
        }, error => { })
    }
    CheckAlert(id) {
        Swal.fire({
            title: 'Are you Sure You Want to Delete?', icon: "warning", showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                var data=JSON.stringify({
                    "CityID": id
                });
                var config={
                    method: 'POST',
                    url: services.API_URL+"City/removeCity",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    if (response.data.status) {
                        this.GetCity();
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
        this.setState({ CityID: "",StateErrMsg:"", CityName: "", StateID: { 'label': '--Select State--', 'value': '--Select State--' } });
        this.form.reset();
    }
    ValidateState=(e) => {
        this.setState({ StateErrMsg: '' })
    }
    onChange=(e) => {
        debugger;
        this.setState({ StateID: e }, () => { this.ValidateState(); });
        // this.setState({ StateErrMsg: '' });
        //this.form.validateFields(e.value);
    }
    handleSubmit=(e) => {
        debugger;
        e.preventDefault();
        // this.form.current.validateForm();
        this.form.validateFields();

        if (this.state.StateID.value =="--Select State--") {
            this.setState({ StateErrMsg: 'required' });
        }


        //const checkState=this.form.isValid();

        //console.log("Check",this.form.isValid());
        var StateID=this.state.StateID.value;

        if (this.form.isValid()&&this.state.StateID.value!="--Select State--") {
            var data="";
            if (this.state.CityID!="") {
                data=JSON.stringify({
                    "CityID": this.state.CityID,
                    "StateID": this.state.StateID.value,
                    "CityName": this.state.CityName
                });
            }
            else {
                data=JSON.stringify({
                    "StateID": this.state.StateID.value,
                    "CityName": this.state.CityName
                });
            }

            var config={
                method: 'POST',
                url: services.API_URL+"City/setCity",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            services.JsonValue(config).then(response => {
                //debugger;
                if (response.data.status) {
                    debugger;
                    if (this.state.CityID!="") {
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
                    this.GetCity();
                }
                else {
                    Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
                }
            }, error => { })
        }
    }

    render() {

        return (
            <div>
                <div className="container-fluid" style={{ marginTop: '10%' }}>
                    <div className="row">
                        <div className="col-md-5">
                            <div className="card card-custom gutter-b example example-compact">
                                <div className="card-header">
                                    <h3 className="card-title">Add City</h3>
                                </div>
                                <FormWithConstraints
                                    ref={form => this.form=form}
                                    onSubmit={this.handleSubmit}
                                    noValidate>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label>State Name </label>
                                                    {/* <select style={{ width: '100%' }} options={this.state.countries} className="form-control select2" id="kt_select2_1" name="param">
                                                        <option value="AK">India</option>
                                                    </select> */}
                                                    <Select name="StateName" options={this.state.states} value={this.state.StateID} onChange={this.onChange} />
                                                    {this.state.StateErrMsg&&<span className="text-danger">{this.state.StateErrMsg==='required'? '*':''}</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label>City Name </label>
                                                    <input type="text" name="CityName" required onKeyPress={this.allowOnlyCharacters} value={this.state.CityName} onChange={(e) => { this.setState({ CityName: e.target.value },()=>{this.form.validateFields(e.target)})}} className="form-control" placeholder="Enter City Name" />
                                                    <FieldFeedbacks for="CityName">
                                                        <FieldFeedback when="valueMissing">
                                                            *
                                                        </FieldFeedback>
                                                    </FieldFeedbacks>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <button type="submit" className="btn btn-primary mr-2">
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
                                <div className="card-body">
                                    <MaterialTable title="View City" columns={this.state.cols} data={this.state.data}
                                        actions={[{ icon: 'edit', tooltip: 'Edit', onClick: (e, r) => this.EditCity(r.CityID) },
                                        { icon: 'delete', tooltip: 'Delete', onClick: (e, r) => this.CheckAlert(r.CityID) }
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