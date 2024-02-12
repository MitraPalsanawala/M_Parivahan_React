import React from 'react'
import { PrivateRoute } from 'react-auth-kit'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/login.component'
import Dashboard from './components/dashboard.component'
import Country from './components/country.component'
import State from './components/state.component'
import City from './components/city.component'
import Company from './components/company.component'
import Client from './components/client.component'
import ViewClient from './components/viewclient.component'
import Zone from './components/zone.component'
import { createBrowserHistory } from 'history';
import District from './components/district.component'
import Municipality from './components/municipality.component'
import Adminlogin from './components/adminlogin.component'
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import Booking from './components/booking.component'
import ViewBooking from './components/viewbooking.component'
import ParkingLocation from './components/parkinglocation.component'
import CheckList from './components/checklist.component'
import UserType from './components/usertype.component'
import VehicleType from './components/vehicletype.component'
import User from './components/user.component'


const Routing=() => {
    const history=createBrowserHistory();
    const cookies = new Cookies();
    const propTypes={
        cookies: instanceOf(Cookies).isRequired
      };
      console.log("cookies",cookies.get('UserType'));
    return (
        // <BrowserRouter history={history}>
        <Routes>
            <Route path={'/'} element={<Adminlogin />} exact />
            <Route path={'/login'} element={<Login />} exact />
            <Route path={'/adminlogin'} element={<Adminlogin />} />
            <Route path={'/dashboard'} element={<Dashboard />} loginPath={'/login'} />
            <Route path={'/country'} element={<Country />} />
            <Route path={'/state'} element={<State />} >
            </Route>
            <Route path={'/city'} element={<City />} />
            <Route exact path={'/company'} element={<Company />} />
            <Route path={'/client'} element={<Client />} />
            <Route path={'/viewclient'} element={<ViewClient />} />
            <Route path={'/zone'} element={<Zone />} />
            <Route path={'/district'} element={<District />} />
            <Route path={'/municipality'} element={<Municipality />} />
            <Route path={'/task'} element={<Booking />} />
            <Route path={'/viewtask'} element={<ViewBooking />} />
            <Route path={'/parkinglocation'} element={<ParkingLocation />} />
            <Route path={'/checklist'} element={<CheckList />} />
            <Route path={'/usertype'} element={<UserType />} />
            <Route path={'/vehicletype'} element={<VehicleType />} />
            <Route path={'/user'} element={<User />} />
        </Routes>
        // </BrowserRouter>
    )
}

export default Routing