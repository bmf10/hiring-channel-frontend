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
  MenuItem
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import DeleteIcon from '@material-ui/icons/Delete';
import Notification from '@material-ui/icons/Notifications';
import Message from '@material-ui/icons/Message';
import ExitToApp from '@material-ui/icons/ExitToApp'
import '../Styles/EngineerHome.css';
import logo from './logo2.svg';
import Axios from 'axios';
import photo from './DefaultPicture.png'
import stylesprofile from '../Styles/profile.module.css'
import stylesskill from '../Styles/skill.module.css'
import jwtdecode from "jwt-decode";
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Swal from 'sweetalert2';
import {getEngineerProfile, getSkillEngineer, updateEngineerProfile, addSkillEngineer, deleteSkillEngineer} from "../Redux/Actions/engineeruser";
import {connect} from "react-redux";

class EngineerHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      token: localStorage.getItem('token'),
      decode: '',
      user: '',
      skill: '',
      name: null,
      description: null,
      location: null,
      date_of_birth: null,
      username: null,
      skill_name: null,
      level: null,
      skill_id: null
    }
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

  componentWillMount() {
    this.decode();
  }

  logout = () => {
    localStorage.clear();
    this
      .props
      .history
      .push('/login');
  }

  handleProfile = async() => {
    let headers = {
      'Authorization': 'Bearer '.concat(this.state.token)
    }
    await this
      .props
      .dispatch(getEngineerProfile(headers));
    const engineerUser = await this.props.engineerUser;

    if (!engineerUser && engineerUser.engineerUserData.data.msg === 'error') {
      this
        .props
        .history
        .push('/login');
    } else if (!engineerUser && engineerUser.engineerUserData.data.message == "jwt expired") {
      this
        .props
        .history
        .push('/login');
    } else {
      let original_date = engineerUser.engineerUserData.data ? engineerUser.engineerUserData.data[0].date_of_birth: '';
      let day = parseInt(original_date.substr(8, 2)) + 1;
      let month = original_date.substr(5, 2);
      let year = original_date.substr(0, 4);

      day = ('0' + day).slice(-2);

      this.setState({
        user: engineerUser.engineerUserData.data ? engineerUser.engineerUserData.data[0] : '',
        name: engineerUser.engineerUserData.data ? engineerUser.engineerUserData.data[0].name: '',
        description: engineerUser.engineerUserData.data ? engineerUser.engineerUserData.data[0].description:'',
        location: engineerUser.engineerUserData.data ? engineerUser.engineerUserData.data[0].location : '',
        date_of_birth: year + '-' + month + '-' + day,
        username: engineerUser.engineerUserData.data ? engineerUser.engineerUserData.data[0].username : ''
      })
    }
  }

  handleSkill = async() => {
    let headers = {
      'Authorization': 'Bearer '.concat(this.state.token)
    }
    await this
      .props
      .dispatch(getSkillEngineer(headers));
    const engineerSkill = await this.props.engineerSkill;

    if (engineerSkill.engineerSkillData.msg === 'error') {
      this
        .props
        .history
        .push('/login');
    } else if (engineerSkill.engineerSkillData.message == "jwt expired") {
      this
        .props
        .history
        .push('/login');
    } else {
      this.setState({skill: engineerSkill.engineerSkillData.data})
    }
  }

  onReset = () => {
    const {engineerUser} = this.props

    let original_date = engineerUser.engineerUserData.data[0].date_of_birth
    let day = parseInt(original_date.substr(8, 2)) + 1;
    let month = original_date.substr(5, 2);
    let year = original_date.substr(0, 4);

    day = ('0' + day).slice(-2);

    this.setState({
      name: engineerUser.engineerUserData.data[0].name,
      description: engineerUser.engineerUserData.data[0].description,
      location: engineerUser.engineerUserData.data[0].location,
      date_of_birth: year + '-' + month + '-' + day,
      username: engineerUser.engineerUserData.data[0].username
    })
  }

  handleUpdate = async() => {
    let headers = {
      'Authorization': 'Bearer '.concat(this.state.token)
    }

    let data = {
      name: this.state.name,
      description: this.state.description,
      location: this.state.location,
      date_of_birth: this.state.date_of_birth
    }

    await this
      .props
      .dispatch(updateEngineerProfile(headers, data));
    const engineerUpdate = await this.props.engineerUpdate;

    if (engineerUpdate.engineerUpdateData.msg == "success") {
      Swal.fire({title: "Success", text: "Data updated successfully", icon: "success", timer: 1000, showConfirmButton: false});
      this.handleProfile();
    } else {
      Swal.fire({title: "Failed", text: "Data failed to update", icon: "error", timer: 1000, showConfirmButton: false});
    }
  }

  addSkill = async() => {
    let data = {
      skill_name: this.state.skill_name,
      level: this.state.level
    }
    let headers = {
      'Authorization': 'Bearer '.concat(this.state.token)
    }

    await this.props.dispatch(addSkillEngineer(headers,data));
    const engineerAddSkill = await this.props.engineerAddSkill;

    if (engineerAddSkill.engineerSkillAddData.msg == "success") {
      Swal.fire({title: "Success", text: "Data updated successfully", icon: "success", timer: 1000, showConfirmButton: false});
      this.handleSkill();
      this.handleProfile();
      this.setState({skill_name: ''})
    } else {
      Swal.fire({title: "Failed", text: "Data failed to add", icon: "error", timer: 1000, showConfirmButton: false});
    }
  }

  deleteSkill = async() => {
    let skill_id = this.state.skill_id
    let headers = {
      'Authorization': 'Bearer '.concat(this.state.token)
    }

    await this.props.dispatch(deleteSkillEngineer(skill_id.id, headers));
    const engineerDeleteSkill = await this.props.engineerDeleteSkill;

    if (engineerDeleteSkill.engineerSkillDeleteData.msg == "success") {
      Swal.fire({title: "Success", text: "Data successfully deleted", icon: "success", timer: 1000, showConfirmButton: false});
      this.handleSkill();
      this.handleProfile();
    } else {
      Swal.fire({title: "Failed", text: "Data failed to delete", icon: "error", timer: 1000, showConfirmButton: false});
    }
  }

  Skill = () => {
    const {skill} = this.state
    return (
      <div className={stylesskill.skillbox}>
        <div className={stylesskill.header}>
          <h1>List Skill</h1>
        </div>
        <div className={stylesskill.field}>
          <ValidatorForm onSubmit={this.addSkill} className={stylesskill.form}>
            <Grid container direction="row" justify="center" alignItems="center">
              <TextValidator
                className={stylesskill.textfield}
                label="Name"
                value={this.state.skill_name}
                variant="standard"
                placeholder="input skill name..."
                validators={['required']}
                errorMessages={['This field is required']}
                type="text"
                onChange={event => {
                const {value} = event.target;
                this.setState({skill_name: value});
              }}/>&nbsp;&nbsp;
              <TextValidator
                className={stylesskill.textfield}
                label="Level"
                value={this.state.level}
                variant="standard"
                placeholder="input level"
                validators={['required']}
                errorMessages={['This field is required']}
                type="text"
                select
                onChange={event => {
                const {value} = event.target;
                this.setState({level: value});
              }}>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
                <MenuItem value="expert">Expert</MenuItem>
              </TextValidator>&nbsp;&nbsp;
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
        <div className={stylesskill.list}>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item sm={10}>
              <Table className={stylesskill.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">No</TableCell>
                    <TableCell align="center">Skill Name</TableCell>
                    <TableCell align="center">Level</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {skill.length > 0
                    ? skill.map(({
                      id,
                      skill_name,
                      level
                    }, index) => {
                      return (
                        <TableRow hover key={id}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">
                            {skill_name}
                          </TableCell>
                          <TableCell align="center">{level
                              .charAt(0)
                              .toUpperCase() + level.slice(1)}</TableCell>
                          <TableCell align="center">
                            <IconButton className="link" aria-label="cart">
                              <DeleteIcon
                                onClick={async() => {
                                await this.setState({skill_id: {
                                    id
                                  }});
                                this.deleteSkill();
                              }}
                                style={{
                                color: "#F50057"
                              }}/>
                            </IconButton>
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
              <TextValidator
                className={stylesprofile.textfield}
                value={this.state.date_of_birth}
                validators={['required']}
                errorMessages={['This field is required']}
                label="Date of Birth"
                variant="standard"
                type="date"
                placeholder="input Date of Birth..."
                margin="dense"
                onChange={event => {
                const {value} = event.target;
                this.setState({date_of_birth: value});
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

  redirectHome = () => {
    this
      .props
      .history
      .push('/login');
  }

  componentDidMount() {
    this.handleProfile();
    this.handleSkill();
  }

  render() {

    const {user} = this.state
    if (this.state.decode.login_as != 'engineer') {
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
                          .name
                          .charAt(0)
                        : ''}</Avatar>&nbsp;{this.state.user !== ''
                      ? this
                        .state
                        .user
                        .name
                        .substr(0, this.state.user.name.indexOf(' '))
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
                <h2>{user.name}</h2>
                <p>{user.description}</p>
                <p>Skill: {user.skill_list}</p>
              </div>
              <div className="card-stats">
                <div className="stat">
                  <div className="value">{user.success_rate == null
                      ? '0'
                      : user.success_rate}%
                  </div>
                  <div className="type">Success Rate</div>
                </div>
                <div className="stat border">
                  <div className="value">{user.total_project}</div>
                  <div className="type">Project</div>
                </div>
                <div className="stat border">
                  <div className="value">{user.accept_project}</div>
                  <div className="type">Project Accepted</div>
                </div>
              </div>
            </div>
            <this.Profile/>
            <this.Skill/>
          </Grid>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {engineerUser: state.engineerUser, engineerSkill: state.engineerSkill, engineerUpdate: state.engineerUpdate, engineerAddSkill: state.engineerAddSkill, engineerDeleteSkill: state.engineerDeleteSkill}
}

export default connect(mapStateToProps)(EngineerHome);