import React, {Component} from 'react';
import logo from './logo.svg';
import picture from './pict.svg';
import '../Styles/Login.css';
import {Grid, Button, TextField, Link, IconButton} from '@material-ui/core';
import Axios from 'axios';
import Swal from 'sweetalert2';
import HomeIcon from '@material-ui/icons/Home';
import jwtdecode from "jwt-decode";
import { LoginUser } from "../Redux/Actions/auth";
import {connect} from "react-redux";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      token: localStorage.getItem('token') || '',
      decode: ''
    }

    this.handleLogin = this
      .handleLogin
      .bind(this);
  }

  redirectRegister = () => {
    Swal
      .fire({
      title: "Choose Account",
      showCancelButton: true,
      confirmButtonText: 'Company',
      cancelButtonText: 'Engineer',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    })
      .then((result) => {
        if (result.value) {
          this
            .props
            .history
            .push('/register/company');
        } else if (result.dismiss === "cancel") {
          this
            .props
            .history
            .push('/register/engineer');
        }
      })
  }

  redirectHome = () => {
    this
      .props
      .history
      .push('/');
  }

  handleLogin = async(e) => {
    e.preventDefault();

    let data = {
      username: this.state.email,
      password: this.state.password
    }

    await this
        .props
        .dispatch(LoginUser(data));
      const loginUser = await this.props.loginUser;
      let msg = loginUser.LoginUserData.msg

      if (msg === "error") {
        Swal.fire({title: "Failed", text: loginUser.LoginUserData.errors, icon: "error", timer: 1000, showConfirmButton: false});
      } else if (msg === "success") {
        Swal.fire({title: "Success", text: "Redirecting... ", icon: "success", timer: 1000, showConfirmButton: false});

        localStorage.setItem('token', loginUser.LoginUserData.data.token);

        setTimeout(function () {
          this
            .props
            .history
            .push('/')
        }.bind(this), 1000);
      }
  }

  componentWillMount() {
    if (this.state.token !== '') {
      this.setState({
        decode: jwtdecode(this.state.token)
      });
    }
  }

  render() {
    let expired = this.state.decode.exp * 1000

    if (Date.now() <= expired) {
      this
        .props
        .history
        .push('/')
    }
    return (
      <div className="body">
        <Grid container spacing={0}>
          <Grid item sm={7} className="Right">
            <img src={logo} className="Logo"/><br/>
            <img src={picture} className="Picture"/>
            <div className="box">
              <p className="text1">Hire expert freelancers for any job, online</p>
              <p className="text2">Millions of small businesses use Freelancer to turn their ideas into reality.</p>
            </div>
          </Grid>
          <Grid item sm={5} className="Left">
            <div className="leftBody">
              <h3 className="loginTitle">Login
                <IconButton
                  onClick={this.redirectHome}
                  style={{
                  float: "right",
                  color: "black"
                }}><HomeIcon/></IconButton>
              </h3>
              <form onSubmit={this.handleLogin}>
                <div className="inputGroup1">
                  <TextField
                    label="Email"
                    placeholder="input email..."
                    type="text"
                    value={this.state.email}
                    onChange={event => {
                    const {value} = event.target;
                    this.setState({email: value});
                  }}
                    className="input"/>
                  <TextField
                    label="Password"
                    margin="normal"
                    placeholder="input password..."
                    value={this.state.password}
                    onChange={event => {
                    const {value} = event.target;
                    this.setState({password: value});
                  }}
                    type="password"
                    className="input"/>
                  <Link href="#" className="Link" color="inherit">Forgot Password?</Link><br/><br/><br/>
                  <Button type="submit" variant="contained" className="button" color="primary">Login</Button><br/><br/>
                  <Button
                    variant="outlined"
                    onClick={this.redirectRegister}
                    className="button"
                    color="secondary">Register</Button><br/><br/><br/><br/>
                </div>
              </form>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state =>{
  return {
    loginUser: state.loginUser
  }
}

export default connect(mapStateToProps)(Login);
