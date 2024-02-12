import React, { Component } from "react";
import services from "../services/services";
import Swal from "sweetalert2";
import MaterialTable, { MTableToolbar } from '@material-table/core';
import '../style.css';
import Select from 'react-select'
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
const headerTblStyle={ color: 'black' };

class viewclient extends Component {
    constructor(props) {
        super(props);
        const { cookies }=props;
        this.state={
            name: cookies.get('name')||'Ben'
        };
        this.state={
            data: [], countries: [], states: [], cities: [],
            CountryID: { 'label': '--Select Country--', 'value': '--Select Country--' },
            StateID: { 'label': '--Select State--', 'value': '--Select State--' },
            CityID: { 'label': '--Select City--', 'value': '--Select City--' },
            SearchStateID: { 'label': '--Select State--', 'value': '--Select State--' },
            SearchCityID: { 'label': '--Select City--', 'value': '--Select City--' },
            ClientID: "", ClientName: "", GSTNo: "", MobileNo: "", Address: "",
            isFilterVisible: false, iconFilter: "fa fa-plus",
            cols: [
                { title: 'Sr.No', width: '5%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.tableData.id+1}</p>) } },
                { title: (<div style={{ width: '100%' }}><span>Country Name</span><hr style={{ marginTop: '5px', marginBottom: '5px' }} /><span>State Name</span><hr style={{ marginTop: '5px', marginBottom: '5px' }} /><span>City Name</span></div>), width: '20%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px', paddingLeft: '3%' }}>{rowData.CountryName}<hr />{rowData.StateName}<hr />{rowData.CityName}</p>) } },
                { title: 'Company Name', width: '20%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px', paddingLeft: '5%' }}>{rowData.CompanyName}</p>) } },
                { title: 'Client Name', width: '15%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px', paddingLeft: '5%' }}>{rowData.ClientName}</p>) } },
                { title: (<div style={{ width: '100%' }}><span>Phone No</span><hr style={{ marginTop: '5px', marginBottom: '5px' }} /><span>GST No</span></div>), width: '20%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.MobileNo}<hr />{rowData.GSTNO}</p>) } },
                { title: 'Address', width: '30%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.Address}</p>) } }
            ]
        }
    }

    componentDidMount() {
        this.GetClient();
        this.GetState();
    }
    GetState()
    {
        var data="";
            data=JSON.stringify({
                "CountryID": '1'
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
                    this.setState({ SearchStateID: { 'label': '--Select State--', 'value': '--Select State--' } })
                    this.setState({ cities: [] })
                    this.setState({ SearchCityID: { 'label': '--Select City--', 'value': '--Select City--' } })
                }
                else {
                    this.setState({ states: [] })
                    this.setState({ SearchStateID: { 'label': '--Select State--', 'value': '--Select State--' } })
                    this.setState({ cities: [] })
                    this.setState({ SearchCityID: { 'label': '--Select City--', 'value': '--Select City--' } })
                }
            }, error => { })
    }
    GetClient() {

        var SearchStateID = ""
        var SearchCityID = ""

        if (this.state.SearchStateID.value!="--Select State--") {
            SearchStateID=this.state.SearchStateID.value;
        }
        else {
            SearchStateID = "";
        }

        if (this.state.SearchCityID.value!="--Select City--") {
            SearchCityID=this.state.SearchCityID.value;
        }
        else {
            SearchCityID = "";
        }

        var data=JSON.stringify({
            "ClientID": "",
            "StateID":SearchStateID,
            "CityID":SearchCityID
        });
        var config={
            method: 'POST',
            url: services.API_URL+"Client/getClient",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        services.JsonValue(config).then(response => {
            if(response.data.status)
            {
                this.setState({ data: response.data.data })
            }
            else{
                this.setState({ data: [] })
            }
            
        }, error => { })
    }

    EditClient(id) {

        window.location.href="client?id="+id;
    }

    CheckAlert(id) {
        Swal.fire({
            title: 'Are you Sure You Want to Delete?', icon: "warning", showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                var data=JSON.stringify({
                    "ClientID": id
                });
                var config={
                    method: 'POST',
                    url: services.API_URL+"Client/removeClient",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                services.JsonValue(config).then(response => {
                    if (response.data.status) {
                        const { cookies }=this.props;
                        if (this.props.allCookies.MainClientID!==undefined) {
                            if (this.props.allCookies.MainClientID===id) {
                                cookies.remove("MainClientID");
                                cookies.remove("MainClientName");
                            }
                        }
                        this.GetClient();
                        Swal.fire({
                            title: 'Successfully Deleted', icon: "success", timer: 1500
                        }).then(() => {
                            window.location.href="/viewclient";
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
    onSearchClientClick=(e) => {
        e.preventDefault();
        this.GetClient();
    }

    OnSearchCancelClientClick=() => {
        debugger;

        this.setState({ SearchStateID: { 'label': '--Select State--', 'value': '--Select State--' } });
        this.setState({ SearchCityID: { 'label': '--Select City--', 'value': '--Select City--' } },()=>{
            this.GetClient();
        });
        //window.location.reload(true);

    }

    render() {
        return (
            <div>
                <div className="container-fluid" style={{ marginTop: '10%' }}>
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
                                <button type="button" onClick={this.onSearchClientClick} className="btn btn-primary mt-12 mr-3">Search </button>
                                <button type="button" onClick={this.OnSearchCancelClientClick} className="btn btn-danger mt-12">Cancel </button>
                            </div>
                        </div>
                    }
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card card-custom">
                                <div className="card-body">
                                    <MaterialTable columns={this.state.cols} data={this.state.data}
                                        actions={[{ icon: 'edit', tooltip: 'Edit', onClick: (e, r) => this.EditClient(r.ClientID) },
                                        { icon: 'delete', tooltip: 'Delete', onClick: (e, r) => this.CheckAlert(r.ClientID) }
                                        ]}
                                        options={{
                                            headerStyle: { color: 'black' }, toolbar: true, search: false,
                                            paging: true, pageSize: 5, emptyRowsWhenPaging: true, pageSizeOptions: [5, 10, 15, 20],
                                        }}
                                        components={{

                                            Toolbar: props => (
                                                <div className="row" style={{ marginBottom: '2%' }}>
                                                    <div className="col-md-9" style={{ display: 'flex', alignItems: 'center' }}>
                                                        <h3 className="tabletitle">View Client</h3>

                                                    </div>
                                                    <div className="col-md-3" style={{ textAlign: 'right' }}>
                                                        <a href="/client" className="btn btn-outline-primary font-weight-bolder mr-5">
                                                            <span className="svg-icon svg-icon-md">
                                                                <i className="fa fa-plus" />
                                                            </span>Add Client</a>
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
export default withCookies(viewclient);