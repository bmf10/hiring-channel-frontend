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
import '../Styles/Home.css';
import logo from './logo2.svg';
import Axios from 'axios';
import photo from './DefaultPicture.png'
import styles from '../Styles/pagination.module.css'
import jwtdecode from "jwt-decode";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      paginate: [],
      token: localStorage.getItem('token') || '',
      decode: '',
      name: '',
      sort_by: 'id' || '',
      order_by: '',
      skill: '',
      total: '',
      per_page: '',
      current_page: '',
      limit: ''
    }
  }

  logout = () => {
    localStorage.clear();
    this
      .props
      .history
      .push('/login');
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

  sortOnchange = (e) => {
    this.setState({sort_by: e.target.value})
  }

  orderOnchange = (e) => {
    this.setState({order_by: e.target.value})
  }

  limitOnchange = (e) => {
    this.setState({limit: e.target.value})
  }

  handleSearch = (pageNumbers) => {
    Axios.get('http://localhost:8000/engineer/', {
      headers: {
        'Authorization': 'Bearer '.concat(this.state.token)
      },
      params: {
        name: this.state.name || '',
        limit: this.state.limit || 8,
        page: pageNumbers,
        sort: this.state.sort_by,
        order: this.state.order_by || 'asc',
        skill: this.state.skill || null
      }
    }).then(({data}) => {
      if (data.msg === 'error') {
        this
          .props
          .history
          .push('/login');
      } else if (data.message == "invalid signature") {
        this.setState({user: ''})
      } else if (data.message == "jwt expired") {
        this
          .props
          .history
          .push('/login');
      } else {
        this.setState({user: data.data, total: data.paginate.total, per_page: data.paginate.per_page, current_page: data.paginate.page})
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  componentDidMount() {
    this.handleSearch();
  }

  profileLink= () =>{
    if(this.state.decode.login_as != 'company'){
      this.props.history.push('/engineer')
    }else if (this.state.decode.login_as == 'company'){
      this.props.history.push('/company')
    }
  }

  render() {
    const {user} = this.state;

    console.log(user);

    let renderPageNumbers;

    const pageNumbers = [];
    if (this.state.total !== null) {
      for (let i = 1; i <= Math.ceil(this.state.total / this.state.per_page); i++) {
        pageNumbers.push(i);
      }
    }

    renderPageNumbers = pageNumbers.map(number => {
      let classes = this.state.current_page === number
        ? styles.active
        : '';

      return (
        <span
          key={number}
          className={classes}
          onClick={() => this.handleSearch(number)}>{number}</span>
      )
    })

    return (
      <div className="container">
        <Container className="navbar" fixed>
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
                  <Button className="link"><HomeIcon style={{
        color: "#bdbdbd"
      }}/>&nbsp;Home</Button>
                  <Button className="link" onClick={this.profileLink}>
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
        <Container className="middle">
          <Paper square className="paper">
            <Grid container direction="row" justify="center" alignItems="center">
              <TextField
                onChange={event => {
                const {value} = event.target;
                this.setState({skill: value});
              }}
                value={this.state.skill}
                onKeyPress={({key, target}) => {
                if (key === 'Enter') {
                  this.componentDidMount();
                }
              }}
                margin="normal"
                id="outlined-basic"
                className="inputsearch"
                label="Skill Name"/>&nbsp;&nbsp;&nbsp;
              <FormControl margin="normal" className="inputsearch">
                <InputLabel htmlFor="demo-customized-select-native">Sort By</InputLabel>
                <NativeSelect
                  value={this.state.sort_by}
                  onChange={this.sortOnchange}
                  variant="outlined"
                  id="demo-customized-select-native">
                  <option value=""/>
                  <option value="name">Name</option>
                  <option value="skill_name">Skill</option>
                  <option value="date_update">Date Updated</option>
                </NativeSelect>
              </FormControl>&nbsp;&nbsp;&nbsp;
              <FormControl margin="normal" className="inputsearch">
                <InputLabel htmlFor="demo-customized-select-native1">Order By</InputLabel>
                <NativeSelect
                  value={this.state.order_by}
                  onChange={this.orderOnchange}
                  variant="outlined"
                  id="demo-customized-select-native1">
                  <option value=""/>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </NativeSelect>
              </FormControl>&nbsp;&nbsp;&nbsp;
              <FormControl margin="normal" className="inputsearch">
                <InputLabel htmlFor="demo-customized-select-native1">Per Page</InputLabel>
                <NativeSelect
                  style={{
                  width: "100px"
                }}
                  value={this.state.limit}
                  onChange={this.limitOnchange}
                  variant="outlined"
                  id="demo-customized-select-native1">
                  <option value=""/>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </NativeSelect>
              </FormControl>&nbsp;&nbsp;&nbsp;
              <Button
                style={{
                marginTop: "17px"
              }}
                variant="outlined"
                color="primary"
                onClick={this.handleSearch}>Apply</Button>
            </Grid>
          </Paper>
        </Container>
        <Container className="body" fixed>
          <Grid container direction="row" justify="center" alignItems="center">
            {user.length > 0
              ? user.map(({
                name,
                description,
                skill_list,
                success_rate,
                total_project,
                accept_project
              }, index) => {
                return (
                  <div className="card">
                    <div className="card-image"><img className="card-img" src={photo}/></div>
                    <div className="card-text">
                      <h2>{name}</h2>
                      <p>{description}</p>
                      <p>Skill: {skill_list}</p>
                    </div>
                    <div className="card-stats">
                      <div className="stat">
                        <div className="value">{success_rate == null
                            ? '0'
                            : success_rate}%
                        </div>
                        <div className="type">Success Rate</div>
                      </div>
                      <div className="stat border">
                        <div className="value">{total_project}</div>
                        <div className="type">Project</div>
                      </div>
                      <div className="stat border">
                        <div className="value">{accept_project}</div>
                        <div className="type">Project Accepted</div>
                      </div>
                    </div>
                  </div>
                );
              })
              : <h3>Data Not Found</h3>
}
          </Grid>
        </Container>
        <Container>
          <Grid container direction="row" justify="center" alignItems="center">
            <div className={styles.pagination}>
              <span onClick={() => this.handleSearch(this.state.current_page - 1)}>&laquo;</span>
              {renderPageNumbers}
              <span onClick={() => this.handleSearch(this.state.current_page + 1)}>&raquo;</span>
            </div>
          </Grid>
        </Container>
      </div>

    )
  }
}

export default Home;