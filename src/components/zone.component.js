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
class zone extends Component {
    static propTypes={
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        const { cookies }=props;
        this.state={
            data: [],
            ZoneID: "", ZoneName: "", CodeName: "",
            rows: [{ Email: '', ZoneEmailDetailID: '' }],
            cols: [
                { title: 'Sr.No', width: '5%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px',textAlign:'center' }}>{rowData.tableData.id+1}</p>) } },
                { title: 'Code Name', width: '40%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.CodeName}</p>) } },
                { title: 'Zone Name', width: '40%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.ZoneName}</p>) } }
            ]
        }

    }

    componentDidMount() {
        this.GetZone();
    }
    GetZone() {
        debugger;
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
                //debugger;
                this.setState({ data: response.data.data })
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
    EditZone(id) {
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
                "ZoneID": id,
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
                this.setState({
                    ZoneID: response.data.data[0].ZoneID,
                    ZoneName: response.data.data[0].ZoneName,
                    CodeName: response.data.data[0].CodeName,
                    //rows: response.data.data[0].ZoneEmailDetail
                });
                if(response.data.data[0].ZoneEmailDetail != null)
                {
                    this.setState({rows: response.data.data[0].ZoneEmailDetail});
                }
                else{
                    this.setState({rows: [{Email: '', ZoneEmailDetailID: ''}]});
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
            ZoneEmailDetailID: "",
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
        debugger;
        if (idx>0) {
            const rows=[...this.state.rows]

            var data=JSON.stringify({
                "ZoneEmailDetailID": rows[idx].ZoneEmailDetailID
            });
            var config={
                method: 'POST',
                url: services.API_URL+"Zone/removeZoneEmail",
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
            ZoneEmailDetailID: rows[idx].ZoneEmailDetailID,
            Email: value
        };
        this.setState({ rows });
    }

    ClearData=(e) => {
        debugger;
        this.setState({
            ZoneID: "", ZoneName: "", CodeName: "",
            rows: [{ Email: '' }]
        });
        this.form.reset();
    }

    CheckAlert(id) {
        Swal.fire({
            title: 'Are you Sure You Want to Delete?', icon: "warning", showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                var data=JSON.stringify({
                    "ZoneID": id
                });
                var config={
                    method: 'POST',
                    url: services.API_URL+"Zone/removeZone",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    if (response.data.status) {
                        this.GetZone();
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

        const rows=[...this.state.rows]

        var CompanyID="";
        var ClientID="";

        if (this.props.allCookies.MainCompanyID!==undefined) {
            CompanyID=this.props.allCookies.MainCompanyID;
        }
        if (this.props.allCookies.MainClientID!==undefined) {
            ClientID=this.props.allCookies.MainClientID
        }
        for (let index = 0; index < rows.length; index++) {
            if(rows[index].Email == '')
            {
                rows[index] = []
            }
        }
        // for(let i=0; i< rows.length, i++)
        // {

        // }

        if (CompanyID!=""&&ClientID!="") {
            if (this.form.isValid()) {
                var data="";
                if (this.state.ZoneID!="") {
                    data=JSON.stringify({
                        "ZoneID": this.state.ZoneID,
                        "CompanyID": CompanyID,
                        "ClientID": ClientID,
                        "ZoneName": this.state.ZoneName,
                        "CodeName": this.state.CodeName,
                        "EntryByUserType": "",
                        "EntryByUserID": "",
                        "EmailData": rows
                    });
                }
                else {
                    data=JSON.stringify({
                        "ZoneID": "",
                        "CompanyID": CompanyID,
                        "ClientID": ClientID,
                        "ZoneName": this.state.ZoneName,
                        "CodeName": this.state.CodeName,
                        "EntryByUserType": "",
                        "EntryByUserID": "",
                        "EmailData": rows
                    });
                }

                var config={
                    method: 'POST',
                    url: services.API_URL+"Zone/setZone",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    //debugger;
                    if (response.data.status) {
                        debugger;
                        if (this.state.ZoneID!="") {
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
                        this.GetZone();
                    }
                    else {
                        Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
                    }
                }, error => { })
            }

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

    render() {
        return (

            <>
                <div className="container-fluid" style={{ marginTop: '10%' }}>
                    <div className="row">
                        <div className="col-md-5">
                            <div className="card card-custom gutter-b example example-compact">
                                <div className="card-header">
                                    <h3 className="card-title">Add Zone</h3>
                                </div>
                                <FormWithConstraints
                                    ref={form => this.form=form}
                                    onSubmit={this.handleSubmit}
                                    noValidate>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-12">
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
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label>Zone Name </label>
                                                    <input type="text" name="ZoneName" required onKeyPress={this.allowOnlyCharacters} value={this.state.ZoneName} onChange={(e) => this.setState({ ZoneName: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter Zone Name" />
                                                    <FieldFeedbacks for="ZoneName">
                                                        <FieldFeedback when="valueMissing">
                                                            *
                                                        </FieldFeedback>
                                                    </FieldFeedbacks>
                                                </div>
                                            </div>
                                            {this.state.rows.map((item, idx) => (
                                                <div className="col-md-12" key={idx}>
                                                    <div className="row" >
                                                        <div className="col-md-10" >
                                                            <div className="form-group">
                                                                <label>Email ID {idx+1} </label>
                                                                <label>{ }</label>
                                                                <input type="text" value={this.state.rows[idx].Email} onChange={this.onEmailChange(idx)} className="form-control" placeholder="Enter Email ID" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-2">
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
                        <div className="col-md-7">
                            <div className="card card-custom">
                                <div className="card-body">
                                    <MaterialTable title="View Zones" columns={this.state.cols} data={this.state.data}
                                        detailPanel={[
                                            {
                                                icon: 'add', tooltip: 'Click here to see details', title: 'show',
                                                render: ({ rowData }) => {
                                                    debugger;
                                                    if (rowData.ZoneEmailDetail != null) {
                                                        return (
                                                            <div style={{ width: '100%', padding: '5px', paddingLeft: '35px', display: 'block' }}>
                                                                <table cellSpacing="0" rules="all" border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>

                                                                    <tbody>
                                                                        <tr>
                                                                            {rowData.ZoneEmailDetail.map((value, inx1) => {
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
                                        actions={[{ icon: 'edit', tooltip: 'Edit', onClick: (e, r) => this.EditZone(r.ZoneID) },
                                        { icon: 'delete', tooltip: 'Delete', onClick: (e, r) => this.CheckAlert(r.ZoneID) }
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
            </>
        );
    }
}
export default withCookies(zone);