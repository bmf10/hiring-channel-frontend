import React, {Component} from 'react';
import logo from './logo.svg';
import picture from './pict.svg';
import '../Styles/Register.css';
import {Grid, Button, TextField, Link} from '@material-ui/core';
import Axios from 'axios';
import Swal from 'sweetalert2';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import jwtdecode from "jwt-decode";

class RegisterCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company_name: '',
      logo: '',
      location: '',
      description: '',
      username: '',
      password: '',
      token: localStorage.getItem('token') || '',
      decode: ''
    }
  }

  handleRegister = e => {
    e.preventDefault();
    Axios
      .post('http://localhost:8000/auth/company', {
      company_name: this.state.company_name,
      logo: this.state.logo,
      location: this.state.location,
      description: this.state.description,
      username: this.state.username,
      password: this.state.password
    })
      .then(response => {
        let msg = response.data.msg

        if (msg === "error") {
          Swal.fire({title: "Failed", text: response.data.errors, icon: "error", timer: 1000, showConfirmButton: false});
        } else if (msg === "success") {
          Swal.fire({title: "Success", text: "Redirecting... ", icon: "success", timer: 1000, showConfirmButton: false});
          setTimeout(function () {
            this
              .props
              .history
              .push('/login/')
          }.bind(this), 1000);
        }
      })
      .catch(err => {
        console.log(err)
      })
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
    const {company_name} = this.state;
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
              <h3 className="loginTitle">Register Company</h3>
              <div className="inputGroup">
                <ValidatorForm onSubmit={this.handleRegister}>
                  <TextValidator
                    label="Company Name"
                    placeholder="input company name.."
                    type="text"
                    value={this.state.company_name}
                    validators={['required']}
                    errorMessages={['This field is required']}
                    onChange={event => {
                    const {value} = event.target;
                    this.setState({company_name: value});
                  }}
                    className="input"/>
                  <TextValidator
                    label="Logo"
                    margin="normal"
                    placeholder="input logo.."
                    type="text"
                    value={this.state.logo}
                    onChange={event => {
                    const {value} = event.target;
                    this.setState({logo: value});
                  }}
                    className="input"/>
                  <TextValidator
                    label="Location"
                    margin="normal"
                    placeholder="input location.."
                    type="text"
                    value={this.state.location}
                    validators={['required']}
                    errorMessages={['This field is required']}
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
                    value={this.state.description}
                    validators={['required']}
                    errorMessages={['This field is required']}
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
                    errorMessages={['This field is required', 'Username minimum length 6 characters', 'Username minimum length 16 characters']}
                    onChange={event => {
                    const {value} = event.target;
                    this.setState({username: value});
                  }}
                    className="input"/>
                  <TextValidator
                    label="Password"
                    ref="password"
                    id="password"
                    margin="normal"
                    placeholder="input password..."
                    value={this.state.password}
                    validators={['required', 'minStringLength: 6', 'maxStringLength: 16']}
                    errorMessages={['This field is required', 'Username minimum length 6 characters', 'Username minimum length 32 characters']}
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

export default RegisterCompany;
