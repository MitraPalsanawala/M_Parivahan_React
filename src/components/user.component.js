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

class User extends Component {
    static propTypes={
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        const { cookies }=props;
        this.state={
            name: cookies.get('name')||'Ben'
        };
    }
}
export default withCookies(User);