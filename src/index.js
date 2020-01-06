import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import { BrowserRouter as Router, Route} from 'react-router-dom';
import Login from './Components/Login';
import Home from './Components/Home';
import RegisterCompany from './Components/RegisterCompany';
import RegisterEngineer from './Components/RegisterEngineer';
import EngineerHome from './Components/EngineerHome'
import CompanyHome from './Components/CompanyHome';

import { Provider } from "react-redux";
import store from "./Redux/store";

const AppWithRoute=()=>{
    return(
        <Router>
            <Route path="/login" exact component={Login} />
            <Route path="/register/company" exact component={RegisterCompany}/>
            <Route path="/register/engineer" exact component={RegisterEngineer}/>
            <Route path="/engineer/" exact component={EngineerHome}/>
            <Route path="/company/" exact component={CompanyHome}/>
            <Route path="/" exact component={Home} />
        </Router>
    )
}

const AppUsingRedux = () =>{
    return(
        <Provider store={store}>
            <AppWithRoute/>
        </Provider>
    )
}

ReactDOM.render(<AppUsingRedux/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
