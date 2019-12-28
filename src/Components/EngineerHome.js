import React, {useState, Component} from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Button,
  Avatar,
  Divider,
  Grid,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Badge,
  IconButton,
  Container,
  TextField,
  NativeSelect,
  InputLabel,
  FormControl,
  Paper
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import Notification from '@material-ui/icons/Notifications';
import Message from '@material-ui/icons/Message';
import ExitToApp from '@material-ui/icons/ExitToApp'
import '../Styles/EngineerHome.css';
import logo from './logo2.svg';
import Axios from 'axios';
import photo from './DefaultPicture.png'
import styles from '../Styles/pagination.module.css'
import jwtdecode from "jwt-decode";

class EngineerHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      token: localStorage.getItem('token'),
      decode: '',
      user: [],
      skill: ''
    }
  }

  componentWillMount() {
    if (this.state.token == '' || this.token) {
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

  logout = () => {
    localStorage.clear();
    this
      .props
      .history
      .push('/login');
  }

  handleProfile = (e) => {
    Axios
      .get('http://localhost:8000/engineeruser/', {
      headers: {
        'Authorization': 'Bearer '.concat(this.state.token)
      }
    })
      .then(({data}) => {
        if (data.msg === 'error') {
          this
            .props
            .history
            .push('/login');
        } else if (data.message == "jwt expired") {
          this
            .props
            .history
            .push('/login');
        } else {
          this.setState({user: data.data[0]})
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  handleSkill = () => {
    Axios
      .get('http://localhost:8000/engineeruser/skill/', {
      headers: {
        "Authorization": "Bearer ".concat(this.state.token)
      }
    })
      .then(({data}) => {
        if (data.msg === 'error') {
          this
            .props
            .history
            .push('/login');
        } else if (data.message == "jwt expired") {
          this
            .props
            .history
            .push('/login');
        } else {
          this.setState({skill: data.data})
        }
      })
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
    console.log(user)
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
                        value={this.state.name}
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
                    }}>{this.state.decode !== ''
                        ? this
                          .state
                          .decode
                          .name
                          .charAt(0)
                        : ''}</Avatar>&nbsp;{this.state.decode !== ''
                      ? this
                        .state
                        .decode
                        .name
                        .substr(0, this.state.decode.name.indexOf(' '))
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
          </Grid>
        </Container>
      </div>
    )
  }
}

export default EngineerHome;