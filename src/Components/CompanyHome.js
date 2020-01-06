import React, {Component} from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Button,
  Avatar,
  Divider,
  Grid,
  Badge,
  IconButton,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import Notification from '@material-ui/icons/Notifications';
import Message from '@material-ui/icons/Message';
import ExitToApp from '@material-ui/icons/ExitToApp'
import '../Styles/EngineerHome.css';
import logo from './logo2.svg';
import photo from './DefaultPicture.png'
import stylesprofile from '../Styles/profile.module.css'
import stylesproject from '../Styles/projectcompany.module.css'
import jwtdecode from "jwt-decode";
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Swal from 'sweetalert2';
import {connect} from "react-redux";
import {
  getCompanyProfile,
  updateCompanyProfile,
  getProjectCompany,
  addProjectCompany,
  deleteProjectCompany,
  finishProjectData
} from "../Redux/Actions/companyuser";

class CompanyHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      token: localStorage.getItem('token'),
      decode: '',
      user: '',
      name: null,
      description: null,
      location: null,
      logo: null,
      username: null,
      project_name: '',
      project_desc: '',
      project: [],
      project_id: null
    }
  }

  handleProject = async() => {
    let headers = {
      'Authorization': 'Bearer '.concat(this.state.token)
    }
    await this
      .props
      .dispatch(getProjectCompany(headers));
    const companyProject = await this.props.companyProject;

    if (companyProject.companyProjectData.msg === 'error') {
      this
        .props
        .history
        .push('/login');
    } else if (companyProject.companyProjectData.message == "jwt expired") {
      this
        .props
        .history
        .push('/login');
    } else {
      this.setState({project: companyProject.companyProjectData.data})
    }

  }

  addProject = async() => {
    let data = {
      project_name: this.state.project_name,
      description: this.state.project_desc
    }
    let headers = {
      'Authorization': 'Bearer '.concat(this.state.token)
    }

    await this
      .props
      .dispatch(addProjectCompany(headers, data));
    const companyAddProject = await this.props.companyAddProject;

    if (companyAddProject.companyProjectAddData.msg == "success") {
      Swal.fire({title: "Success", text: "Data updated successfully", icon: "success", timer: 1000, showConfirmButton: false});
      this.handleProject();
      this.setState({project_name: '', project_desc: ''});
    } else {
      Swal.fire({title: "Failed", text: "Data failed to add", icon: "error", timer: 1000, showConfirmButton: false});
    }
  }

  deleteProject = async() => {
    let id_project = this.state.project_id.id_project;
    let headers = {
      'Authorization': 'Bearer '.concat(this.state.token)
    }

    await this
      .props
      .dispatch(deleteProjectCompany(id_project, headers));
    const companyDeleteProject = await this.props.companyDeleteProject;

    if (companyDeleteProject.companyProjectDeleteData.msg === 'failed') {
      Swal.fire({title: "Failed", text: "Data failed to delete, status is 'Ongoing' or 'Finish'", icon: "error", timer: 1000, showConfirmButton: false});
    } else if (companyDeleteProject.companyProjectDeleteData.msg === 'success') {
      Swal.fire({title: "Success", text: "Data successfully deleted", icon: "success", timer: 1000, showConfirmButton: false});
      this.handleProject();
    }
  }

  handleFinishProject = async() => {
    let params = {
      id_project: this.state.project_id.id_project
    };
    let headers = {
      'Authorization': 'Bearer '.concat(this.state.token)
    }

    await this
      .props
      .dispatch(finishProjectData(headers, params));
    const finishProject = await this.props.finishProject;

    if(finishProject.finishProjectData && finishProject.finishProjectData.msg == 'success'){
      Swal.fire({title: "Success", text: "Project completed", icon: "success", timer: 1000, showConfirmButton: false});
      this.handleProject();
    }

  }

  Project = () => {
    const {project} = this.state
    return (
      <div className={stylesproject.projectbox}>
        <div className={stylesproject.header}>
          <h1>List Project</h1>
        </div>
        <div className={stylesproject.field}>
          <ValidatorForm onSubmit={this.addProject} className={stylesproject.form}>
            <Grid container direction="row" justify="center" alignItems="center">
              <TextValidator
                className={stylesproject.textfield}
                label="Project Name"
                value={this.state.project_name}
                variant="standard"
                placeholder="input project name..."
                validators={['required']}
                errorMessages={['This field is required']}
                type="text"
                onChange={event => {
                const {value} = event.target;
                this.setState({project_name: value});
              }}/>&nbsp;&nbsp;
              <TextValidator
                className={stylesproject.textfield}
                label="Description"
                value={this.state.project_desc}
                variant="standard"
                multiLine="true"
                style={{
                width: "40%"
              }}
                placeholder="input project description..."
                validators={['required', "maxStringLength: 255"]}
                errorMessages={['This field is required', "Description maximum length 255 characters"]}
                type="text"
                onChange={event => {
                const {value} = event.target;
                this.setState({project_desc: value});
              }}/>&nbsp;&nbsp;
              <Button
                style={{
                marginTop: "3%"
              }}
                size="small"
                type="submit"
                variant="contained"
                color="primary">Save</Button>
            </Grid>
          </ValidatorForm>
        </div>
        <div className={stylesproject.list}>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item sm={10}>
              <Table className={stylesproject.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">No</TableCell>
                    <TableCell align="center">Project Name</TableCell>
                    <TableCell align="center">Description</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Engineer</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {project.length > 0
                    ? project.map(({
                      id_project,
                      project_name,
                      description,
                      status,
                      id_engineer,
                      name
                    }, index) => {
                      return (
                        <TableRow hover key={id_project}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">
                            {project_name}
                          </TableCell>
                          <TableCell align="center">
                            {description}
                          </TableCell>
                          <TableCell align="center">
                            {status}
                          </TableCell>
                          <TableCell align="center">
                            {name}
                          </TableCell>
                          <TableCell align="center">
                            <div
                              style={{
                              whiteSpace: "nowrap"
                            }}>
                              {status == 'Pending'
                                ? <IconButton className="link" aria-label="cart">
                                    <DeleteIcon
                                      onClick={async() => {
                                      await this.setState({project_id: {
                                          id_project
                                        }});
                                      this.deleteProject();
                                    }}
                                      style={{
                                      color: "#F50057"
                                    }}/>
                                  </IconButton>
                                : ''}

                              {status == "Ongoing"
                                ? <IconButton className="link" aria-label="cart">
                                    <DoneAllIcon
                                      onClick={async() => {
                                      await this.setState({project_id: {
                                          id_project
                                        }});
                                      this.handleFinishProject();
                                    }}
                                      style={{
                                      color: "green"
                                    }}/>
                                  </IconButton>
                                : ''}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                    : <h3 align="center">Data Not Found</h3>}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }

  Profile = () => {
    return (
      <div className={stylesprofile.profilebox}>
        <h1 className={stylesprofile.header}>Profile</h1>
        <ValidatorForm onSubmit={this.handleUpdate}>
          <Grid
            className={stylesprofile.field}
            container
            direction="row"
            justify="center"
            alignItems="center">
            <Grid item sm={12}>
              <TextValidator
                className={stylesprofile.textfield}
                label="Name"
                value={this.state.name}
                variant="standard"
                placeholder="input name..."
                validators={['required']}
                errorMessages={['This field is required']}
                type="text"
                margin="dense"
                onChange={event => {
                const {value} = event.target;
                this.setState({name: value});
              }}
                InputLabelProps={{
                shrink: true
              }}/>
              <TextValidator
                className={stylesprofile.textfield}
                value={this.state.description}
                label="Description"
                variant="standard"
                validators={['required', "maxStringLength: 50"]}
                errorMessages={['This field is required', "Description maximum length 50 characters"]}
                placeholder="input description..."
                type="text"
                margin="dense"
                onChange={event => {
                const {value} = event.target;
                this.setState({description: value});
              }}
                InputLabelProps={{
                shrink: true
              }}/>
              <TextValidator
                className={stylesprofile.textfield}
                label="Location"
                value={this.state.location}
                variant="standard"
                placeholder="input location..."
                validators={['required']}
                errorMessages={['This field is required']}
                type="text"
                onChange={event => {
                const {value} = event.target;
                this.setState({location: value});
              }}
                margin="dense"
                InputLabelProps={{
                shrink: true
              }}/>
              <TextField
                className={stylesprofile.textfield}
                value={this.state.logo}
                margin="dense"
                label="Logo"
                variant="standard"
                placeholder="input logo..."
                type="text"
                onChange={event => {
                const {value} = event.target;
                this.setState({logo: value});
              }}
                InputLabelProps={{
                shrink: true
              }}/>
              <TextValidator
                className={stylesprofile.textfield}
                value={this.state.username}
                margin="dense"
                label="Username"
                variant="standard"
                placeholder="input username..."
                type="text"
                disabled
                onChange={event => {
                const {value} = event.target;
                this.setState({username: value});
              }}
                InputLabelProps={{
                shrink: true
              }}/>
            </Grid>
          </Grid>

          <Grid
            className={stylesprofile.button}
            container
            direction="row"
            justify="left"
            alignItems="left">
            <Grid item sm={12}>
              <Button
                type="submit"
                variant="contained"
                className={stylesprofile.btn}
                color="primary">Save</Button>&nbsp;&nbsp;
              <Button
                onClick={this.onReset}
                type="reset"
                variant="contained"
                className={stylesprofile.btn}
                color="secondary">Cancel</Button>
            </Grid>
          </Grid>
        </ValidatorForm>

      </div>
    )
  }

  logout = () => {
    localStorage.clear();
    this
      .props
      .history
      .push('/login');
  }

  decode = () => {
    if (this.state.token == '' || !this.state.token) {
      this
        .props
        .history
        .push('/login');
    } else {
      this.setState({
        decode: jwtdecode(this.state.token)
      });
    }
  }

  redirectHome = () => {
    this
      .props
      .history
      .push('/login');
  }

  componentWillMount() {
    this.decode();
  }

  componentDidMount() {
    this.handleProfile();
    this.handleProject();
  }

  handleUpdate = async() => {
    let headers = {
      'Authorization': 'Bearer '.concat(this.state.token)
    }

    let data = {
      company_name: this.state.name,
      logo: this.state.logo,
      description: this.state.description,
      location: this.state.location,
      date_of_birth: this.state.date_of_birth
    }

    await this
      .props
      .dispatch(updateCompanyProfile(headers, data));
    const companyUpdate = await this.props.companyUpdate;

    if (companyUpdate.companyUpdateData.msg == "success") {
      Swal.fire({title: "Success", text: "Data updated successfully", icon: "success", timer: 1000, showConfirmButton: false});
      this.handleProfile();
    } else {
      Swal.fire({title: "Failed", text: "Data failed to update", icon: "error", timer: 1000, showConfirmButton: false});
    }
  }

  onReset = () => {
    const {user} = this.state;

    this.setState({name: user.company_name, description: user.description, location: user.location, logo: user.logo, username: user.username})
  }

  handleProfile = async(e) => {
    let headers = {
      'Authorization': 'Bearer '.concat(this.state.token)
    }
    await this
      .props
      .dispatch(getCompanyProfile(headers));
    const companyUser = await this.props.companyUser;

    if (!companyUser && companyUser.companyUserData.data[0].msg === 'error') {
      this
        .props
        .history
        .push('/login');
    } else if (!companyUser && companyUser.companyUserData.data[0].message == "jwt expired") {
      this
        .props
        .history
        .push('/login');
    } else if (companyUser) {

      this.setState({
        user: companyUser.companyUserData.data
          ? companyUser.companyUserData.data[0]
          : '',
        name: companyUser.companyUserData.data
          ? companyUser.companyUserData.data[0].company_name
          : '',
        description: companyUser.companyUserData.data
          ? companyUser.companyUserData.data[0].description
          : '',
        location: companyUser.companyUserData.data
          ? companyUser.companyUserData.data[0].location
          : '',
        logo: companyUser.companyUserData.data
          ? companyUser.companyUserData.data[0].logo
          : '',
        username: companyUser.companyUserData.data
          ? companyUser.companyUserData.data[0].username
          : ''
      })
    }
  }

  render() {
    const {user} = this.state
    if (this.state.decode.login_as != 'company') {
      this
        .props
        .history
        .push('/');
    }
    return (
      <div>
        <Container>
          <AppBar>
            <Toolbar className="toolbar">
              <Grid container direction="row" justify="center" alignItems="center">
                <Typography className="logo">
                  <img src={logo}></img>
                </Typography>
                <Typography className="searchtypo">
                  <div className="search">
                    <div className="searchIcon">
                      <SearchIcon/>
                    </div>
                    <div className="inputSearch">
                      <InputBase
                        onKeyPress={({key, target}) => {
                        if (key === 'Enter') {
                          this.componentDidMount();
                        }
                      }}
                        onChange={event => {
                        const {value} = event.target;
                        this.setState({name: value});
                      }}
                        className="input"
                        placeholder="Search…"
                        inputProps={{
                        'aria-label': 'search'
                      }}/>
                    </div>
                  </div>
                </Typography>
                <Typography className="linknav">
                  <Button onClick={this.redirectHome} className="link"><HomeIcon style={{
        color: "#bdbdbd"
      }}/>&nbsp;Home</Button>
                  <Button className="link" href="#text-buttons">
                    <Avatar
                      style={{
                      height: "20px",
                      width: "20px"
                    }}>{this.state.user !== ''
                        ? this
                          .state
                          .user
                          .company_name
                          .charAt(0)
                        : ''}</Avatar>&nbsp;{this.state.user !== ''
                      ? this
                        .state
                        .user
                        .company_name
                        .substr(0, this.state.user.company_name.indexOf(' '))
                      : ''}</Button><Divider variant="middle" orientation="vertical"/>
                  <IconButton className="link">
                    <Badge color="secondary">
                      <Message
                        style={{
                        color: "#bdbdbd"
                      }}/>
                    </Badge>
                  </IconButton>
                  <IconButton className="link" aria-label="cart">
                    <Badge variant="dot" color="secondary">
                      <Notification
                        style={{
                        color: "#bdbdbd"
                      }}/>
                    </Badge>
                  </IconButton>
                  <IconButton onClick={this.logout} className="link" aria-label="cart">
                    <ExitToApp
                      style={{
                      color: "#bdbdbd"
                    }}/>
                  </IconButton>
                </Typography>
              </Grid>
            </Toolbar>
          </AppBar>
        </Container>
        <Container className="middle"></Container>
        <Container className="body" fixed>
          <Grid container direction="row" justify="center" alignItems="center">
            <div className="card">
              <div className="card-image"><img className="card-img" src={photo}/></div>
              <div className="card-text">
                <h2>{user.company_name}</h2>
                <p>{user.description}</p>
                <p>Location: {user.location}</p>
              </div>
              <div className="card-stats">
                <div className="stat"></div>
                <div className="stat border"></div>
                <div className="stat border"></div>
              </div>
            </div>
            <this.Profile/>
            <this.Project/>
          </Grid>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    companyUser: state.companyUser,
    companyUpdate: state.companyUpdate,
    companyProject: state.companyProject,
    companyAddProject: state.companyAddProject,
    companyDeleteProject: state.companyDeleteProject,
    finishProject: state.finishProject
  }
}

export default connect(mapStateToProps)(CompanyHome);