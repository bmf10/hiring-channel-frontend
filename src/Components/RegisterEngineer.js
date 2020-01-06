import React, {Component} from 'react';
import logo from './logo.svg';
import picture from './pict.svg';
import '../Styles/Register.css';
import {Grid, Button, Link} from '@material-ui/core';
import Axios from 'axios';
import Swal from 'sweetalert2';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import jwtdecode from "jwt-decode";
import { RegisterEngineerAction } from "../Redux/Actions/auth";
import {connect} from "react-redux";

class RegisterEngineer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      engineer_name: '',
      date_of_birth: '',
      location: '',
      description: '',
      username: '',
      password: '',
      token: localStorage.getItem('token') || '',
      decode: ''
    }
  }

  handleRegister = async(e) => {
    e.preventDefault();

    let data = {
      name: this.state.engineer_name,
      date_of_birth: this.state.date_of_birth,
      location: this.state.location,
      description: this.state.description,
      username: this.state.username,
      password: this.state.password
    }

    await this
      .props
      .dispatch(RegisterEngineerAction(data));
    const registerEngineer = await this.props.registerEngineer;
    let msg = registerEngineer.RegisterEngineerData.msg

    if (msg === "error") {
      Swal.fire({title: "Failed", text: registerEngineer.RegisterEngineerData.errors, icon: "error", timer: 1000, showConfirmButton: false});
    } else if (msg === "success") {
      Swal.fire({title: "Success", text: "Redirecting... ", icon: "success", timer: 1000, showConfirmButton: false});
      setTimeout(function () {
        this
          .props
          .history
          .push('/login/')
      }.bind(this), 1000);
    }

    // Axios
    //   .post('http://localhost:8000/auth/engineer', {
    //   name: this.state.engineer_name,
    //   date_of_birth: this.state.date_of_birth,
    //   location: this.state.location,
    //   description: this.state.description,
    //   username: this.state.username,
    //   password: this.state.password
    // })
    //   .then(response => {
    //     let msg = response.data.msg

    //     if (msg === "error") {
    //       Swal.fire({title: "Failed", text: response.data.errors, icon: "error", timer: 1000, showConfirmButton: false});
    //     } else if (msg === "success") {
    //       Swal.fire({title: "Success", text: "Redirecting... ", icon: "success", timer: 1000, showConfirmButton: false});
    //       setTimeout(function () {
    //         this.redirectLogin();
    //       }.bind(this), 1000);
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  }

  redirectLogin = () => {
    this
      .props
      .history
      .push('/login/');
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
              <h3 className="loginTitle">Register Engineer</h3>
              <div className="inputGroup">
                <ValidatorForm onSubmit={this.handleRegister}>
                  <TextValidator
                    label="Engineer Name"
                    placeholder="input engineer name.."
                    type="text"
                    value={this.state.engineer_name}
                    validators={['required']}
                    errorMessages={['This field is required']}
                    onChange={event => {
                    const {value} = event.target;
                    this.setState({engineer_name: value});
                  }}
                    className="input"/>
                  <TextValidator
                    id="date"
                    margin="normal"
                    label="Birthday"
                    type="date"
                    className="input"
                    value={this.state.date_of_birth}
                    validators={['required']}
                    errorMessages={['This field is required']}
                    onChange={event => {
                    const {value} = event.target;
                    this.setState({date_of_birth: value})
                  }}
                    InputLabelProps={{
                    shrink: true
                  }}/>
                  <TextValidator
                    label="Location"
                    margin="normal"
                    placeholder="input location.."
                    type="text"
                    validators={['required']}
                    errorMessages={['This field is required']}
                    value={this.state.location}
                    onChange={event => {
                    const {value} = event.target;
                    this.setState({location: value});
                  }}
                    className="input"/>
                  <TextValidator
                    label="Description"
                    multiline="true"
                    margin="normal"
                    placeholder="input description.."
                    type="text"
                    validators={['required', "maxStringLength: 50"]}
                    errorMessages={['This field is required', "Description maximum length 50 characters"]}
                    value={this.state.description}
                    onChange={event => {
                    const {value} = event.target;
                    this.setState({description: value});
                  }}
                    className="input"/>
                  <TextValidator
                    label="Username"
                    multiline="true"
                    margin="normal"
                    placeholder="input username.."
                    type="text"
                    value={this.state.username}
                    validators={['required', 'minStringLength: 6', 'maxStringLength: 16']}
                    errorMessages={['This field is required', 'Username minimum length 6 characters', 'Username maximum length 16 characters']}
                    onChange={event => {
                    const {value} = event.target;
                    this.setState({username: value});
                  }}
                    className="input"/>
                  <TextValidator
                    label="Password"
                    margin="normal"
                    placeholder="input password..."
                    value={this.state.password}
                    validators={['required', 'minStringLength: 6', 'maxStringLength: 16']}
                    errorMessages={['This field is required', 'Password minimum length 6 characters', 'Password maximum length 32 characters']}
                    onChange={event => {
                    const {value} = event.target;
                    this.setState({password: value});
                  }}
                    type="password"
                    className="input"/>
                  <Link onClick={this.redirectLogin} href="#" className="Link" color="inherit">Have an account? Login here</Link><br/><br/><br/>
                  <Button type="submit" variant="contained" className="button" color="primary">Register</Button><br/><br/>
                </ValidatorForm>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state =>{
  return {
    registerEngineer: state.registerEngineer
  }
}

export default connect(mapStateToProps)(RegisterEngineer);
