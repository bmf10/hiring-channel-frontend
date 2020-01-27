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
  Badge,
  IconButton,
  Container,
  TextField,
  NativeSelect,
  InputLabel,
  FormControl,
  Paper,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear"
import HomeIcon from '@material-ui/icons/Home';
import Notification from '@material-ui/icons/Notifications';
import Message from '@material-ui/icons/Message';
import ExitToApp from '@material-ui/icons/ExitToApp'
import '../Styles/Home.css';
import logo from './logo2.svg';
import photo from './DefaultPicture.png'
import styles from '../Styles/pagination.module.css'
import jwtdecode from "jwt-decode";
import Swal from 'sweetalert2';
import {connect} from "react-redux";
import {getEngineerProfile, getProjectEngineer, getRequestProject, executeRequestProject} from "../Redux/Actions/engineeruser";
import {getCompanyProfile, getAvailableProject, sendRequestData} from "../Redux/Actions/companyuser";
import {searchGetData} from "../Redux/Actions/search";
import stylesEproject from "../Styles/projectengineer.module.css";

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
      limit: '',
      name_login: '',
      list_project: false,
      project: [],
      project_request: null,
      engineer_request: null,
      project_of_engineer: [],
      request_of_engineer: [],
      request_is_accept: '',
      request_id_project: '',
      request_id_request:''
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

  sortOnchange = (e) => {
    this.setState({sort_by: e.target.value})
  }

  orderOnchange = (e) => {
    this.setState({order_by: e.target.value})
  }

  limitOnchange = (e) => {
    this.setState({limit: e.target.value})
  }

  handleSearch = async(pageNumbers) => {
    let headers = {
      'Authorization': 'Bearer '.concat(this.state.token)
    }
    let params = {
      name: this.state.name || '',
      limit: this.state.limit || 8,
      page: pageNumbers,
      sort: this.state.sort_by,
      order: this.state.order_by || 'asc',
      skill: this.state.skill || null
    }
    await this
      .props
      .dispatch(searchGetData(headers, params));
    const search = await this.props.search;

    if (search.searchData.msg === 'error') {
      this
        .props
        .history
        .push('/login');
    } else if (search.searchData.message == "invalid signature") {
      this.setState({user: ''})
    } else if (search.searchData.message == "jwt expired") {
      this
        .props
        .history
        .push('/login');
    } else {
      this.setState({
        user: search.searchData.data,
        total: search.searchData.paginate
          ? search.searchData.paginate.total
          : '',
        per_page: search.searchData.paginate
          ? search.searchData.paginate.per_page
          : '',
        current_page: search.searchData.paginate
          ? search.searchData.paginate.page
          : ''
      })
    }
  }

  handleProfile = async() => {
    if (this.state.decode.login_as === 'company') {
      // this.setState({name_login: "company "})
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
      } else {
        this.setState({
          name_login: companyUser.companyUserData.data
            ? companyUser.companyUserData.data[0].company_name
            : ''
        });
      }

    } else if (this.state.decode.login_as === 'engineer') {
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
        this.setState({
          name_login: engineerUser.engineerUserData.data
            ? engineerUser.engineerUserData.data[0].name
            : ''
        });
      }
    }
  }

  handleLoginAs = () => {
    if (this.state.decode.login_as == 'company') {
      const {user} = this.state;

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
        <div>
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
                  id,
                  name,
                  description,
                  skill_list,
                  success_rate,
                  total_project,
                  accept_project
                }, index) => {
                  return (
                    <div
                      className="card"
                      onClick={() => {
                      this.setState({engineer_request: id});
                      this.onCardClick()
                    }}
                      key={id}>
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
    } else if (this.state.decode.login_as == 'engineer') {
      const {project_of_engineer, request_of_engineer} = this.state
      return (
        <Container className="body" fixed>
          <Grid container direction="row" justify="center" alignItems="center">
            <div className={stylesEproject.projectbox}>
              <div className={stylesEproject.header}>
                <h1>Your Project</h1>
              </div>
              <div className={stylesEproject.list}>
                <Grid container direction="row" justify="center" alignItems="center">
                  <Grid item sm={11}>
                    <Table className={stylesEproject.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">No</TableCell>
                          <TableCell align="center">Project Name</TableCell>
                          <TableCell align="center">Description</TableCell>
                          <TableCell align="center">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {project_of_engineer && project_of_engineer.length > 0
                          ? project_of_engineer.map(({
                            id_project,
                            project_name,
                            description,
                            status
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
            <div className={stylesEproject.projectbox}>
              <div className={stylesEproject.header}>
                <h1>Request Project</h1>
              </div>
              <div className={stylesEproject.list}>
                <Grid container direction="row" justify="center" alignItems="center">
                  <Grid item sm={11}>
                    <Table className={stylesEproject.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">No</TableCell>
                          <TableCell align="center">Project Name</TableCell>
                          <TableCell align="center">Description</TableCell>
                          <TableCell align="center">Company Name</TableCell>
                          <TableCell align="center">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {request_of_engineer && request_of_engineer.length > 0
                          ? request_of_engineer.map(({
                            id_project,
                            id,
                            project_name,
                            description,
                            company_name
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
                                  {company_name}
                                </TableCell>
                                <TableCell>
                                  <div className={stylesEproject.link}>
                                    <IconButton className="link" aria-label="cart">
                                      <CheckIcon
                                        onClick={async() => {
                                        await this.setState({request_is_accept: '1', request_id_project: id_project, request_id_request: id});
                                        this.requestConfirm();
                                      }}
                                        style={{
                                        color: "green"
                                      }}/>
                                    </IconButton>
                                    <IconButton className="link" aria-label="cart">
                                      <ClearIcon
                                        onClick={async() => {
                                        await this.setState({request_is_accept: '0', request_id_project: id_project, request_id_request: id});
                                        this.requestConfirm();
                                      }}
                                        style={{
                                        color: "red"
                                      }}/>
                                    </IconButton>
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
          </Grid>
        </Container>
      )
    }else{
      return(
        <div></div>
      )
    }
  }

  requestConfirm = () => {
    if (this.state.request_is_accept == '1') {
      Swal
        .fire({
        title: "You are sure to accept the project",
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
      })
        .then(async(result) => {
          if (result.value) {
            let params = {
              is_accept: this.state.request_is_accept,
              id_project: this.state.request_id_project,
              id_request: this.state.request_id_request
            }

            let headers = {
              'Authorization': 'Bearer '.concat(this.state.token)
            }

            await this
              .props
              .dispatch(executeRequestProject(headers, params));
            const executeRequest = await this.props.executeRequest;
            let msg = executeRequest.executeRequestData.msg

            if (msg == 'failed') {
              Swal.fire({title: "Failed", text: "You have two projects with ongoing status", icon: "error", timer: 1000, showConfirmButton: false});
            } else if (msg == 'success') {
              this.handleEngineerRequest();
              this.handleEngineerProject();
              Swal.fire({title: "Success", text: "Request received successfully", icon: "success", timer: 1000, showConfirmButton: false});
            }
          } else if (result.dismiss) {
            this.setState({request_is_accept: '', request_id_project: ''})
          }
        })
    } else if (this.state.request_is_accept == '0') {
      Swal
        .fire({
        title: "You are sure to reject the project",
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6'
      })
        .then(async(result) => {
          if (result.value) {
            let params = {
              is_accept: this.state.request_is_accept,
              id_project: this.state.request_id_project,
              id_request: this.state.request_id_request
            }

            let headers = {
              'Authorization': 'Bearer '.concat(this.state.token)
            }

            await this
              .props
              .dispatch(executeRequestProject(headers, params));
            const executeRequest = await this.props.executeRequest;
            let msg = executeRequest.executeRequestData.msg

            if (msg == 'failed') {
              Swal.fire({title: "Failed", text: "You have two projects with ongoing status", icon: "error", timer: 1000, showConfirmButton: false});
            } else if (msg == 'success') {
              this.handleEngineerRequest();
              this.handleEngineerProject();
              Swal.fire({title: "Success", text: "Request succeeded in reject", icon: "success", timer: 1000, showConfirmButton: false});
            }
          } else if (result.dismiss) {
            this.setState({request_is_accept: '', request_id_project: ''})
          }
        })
    }
  }

  handleEngineerProject = async() => {
    let headers = {
      'Authorization': 'Bearer '.concat(this.state.token)
    }
    await this
      .props
      .dispatch(getProjectEngineer(headers));
    const engineerProject = await this.props.engineerProject;

    this.setState({
      project_of_engineer: engineerProject.engineerProjectData.data
        ? engineerProject.engineerProjectData.data
        : ''
    })
  }

  handleEngineerRequest = async() => {
    let headers = {
      'Authorization': 'Bearer '.concat(this.state.token)
    }
    await this
      .props
      .dispatch(getRequestProject(headers));
    const engineerRequest = await this.props.engineerRequest;

    this.setState({
      request_of_engineer: engineerRequest.requestEngineerData.data
        ? engineerRequest.requestEngineerData.data
        : ''
    })
  }

  componentDidMount() {
    this.handleSearch();
    this.handleListProject();
    this.handleProfile();
    this.handleEngineerProject();
    this.handleEngineerRequest();
  }

  profileLink = () => {
    if (this.state.decode.login_as != 'company') {
      this
        .props
        .history
        .push('/engineer')
    } else if (this.state.decode.login_as == 'company') {
      this
        .props
        .history
        .push('/company')
    }
  }

  onCardClick = () => {
    Swal
      .fire({
      title: "Are you sure you want to hire?",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    })
      .then((result) => {
        if (result.value) {
          this.setState({list_project: true})
        } else if (result.dismiss) {
          this.setState({engineer_request: null})
        }
      })
  }

  handleListClose = () => {
    this.setState({list_project: false})
  }

  handleListProject = async() => {
    let headers = {
      'Authorization': 'Bearer '.concat(this.state.token)
    }
    await this
      .props
      .dispatch(getAvailableProject(headers));
    const companyAvailableProject = await this.props.companyAvailableProject;

    if (companyAvailableProject.companyAvailableProjectData.msg === 'error') {
      this
        .props
        .history
        .push('/login');
    } else if (companyAvailableProject.companyAvailableProjectData.message == "jwt expired") {
      this
        .props
        .history
        .push('/login');
    } else {
      this.setState({project: companyAvailableProject.companyAvailableProjectData.data})
    }
  }

  handleSendRequest = async() => {
    let data = {
      id_project: this.state.project_request.id_project,
      id_engineer: this.state.engineer_request
    }

    let headers = {
      'Authorization': 'Bearer '.concat(this.state.token)
    }
    await this
      .props
      .dispatch(sendRequestData(headers, data));
    const sendRequest = await this.props.sendRequest;
    console.log(sendRequest)

    this.setState({list_project: false});
    Swal.fire({title: "Success", text: "Request successfully sent", icon: "success", timer: 1000, showConfirmButton: false});
  }

  listProject = () => {
    const {project} = this.state
    return (
      <Dialog
        aria-labelledby="simple-dialog-title"
        onClose={this.handleListClose}
        open={this.state.list_project}>
        <DialogTitle id="simple-dialog-title">List Project</DialogTitle>
        <List>
          {project && project.length > 0
            ? project.map(({
              id_project,
              project_name
            }, index) => {
              return (
                <ListItem
                  onClick={async() => {
                  await this.setState({project_request: {
                      id_project
                    }});
                  this.handleSendRequest();
                }}
                  button
                  key={id_project}>
                  <ListItemText primary={project_name}/>
                </ListItem>
              )
            })
            : <p>Data Not Found</p>}
        </List>
      </Dialog>
    )
  }

  render() {
    let expired = this.state.decode.exp * 1000
    if (Date.now() >= expired) {
      this
        .props
        .history
        .push('/login')
    }

    return (
      <div className="container">
        <this.listProject/>
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
                    }}>{this.state.name_login !== ''
                        ? this
                          .state
                          .name_login
                          .charAt(0)
                        : ''}</Avatar>&nbsp;{this.state.name_login !== ''
                      ? this
                        .state
                        .name_login
                        .substr(0, this.state.name_login.indexOf(' '))
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
        <this.handleLoginAs/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    engineerUser: state.engineerUser,
    companyUser: state.companyUser,
    companyAvailableProject: state.companyAvailableProject,
    search: state.search,
    sendRequest: state.sendRequest,
    engineerProject: state.engineerProject,
    engineerRequest: state.engineerRequest,
    executeRequest: state.executeRequest
  }
}

export default connect(mapStateToProps)(Home);