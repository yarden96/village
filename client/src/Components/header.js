import React, { Component } from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { auth, logoutUser } from '../actions';
import { bindActionCreators } from 'redux';

class Header extends Component {

    state = {
        btnVal: 'Login',
        btnPath:'Login'
    }

    UNSAFE_componentWillMount = () => {
        this.props.auth();
    }

    UNSAFE_componentWillReceiveProps = (nextProps) => {
        if(nextProps.user.login && nextProps.user.login.isAuth){
            this.setState({btnVal:'Logout', btnPath:''})
        } else {
            this.setState({btnVal:'Login', btnPath:'login'})
        }

    }

    loginOrOut = () => {
        if(this.props.user.login && this.props.user.login.isAuth){
            this.props.logoutUser();
            this.setState({btnVal:'Login', btnPath:'login'})
        }
    }

    render() {
        return (
            <header className="header">
                <div className="Home-header">
                    <div className='userName'>{
                        this.props.user.login && this.props.user.login.name ?
                            <div> Hello {this.props.user.login.name} </div>
                        :null                      
                      }</div>
                    <Link to={`/${this.state.btnPath}`} onClick={() => this.loginOrOut()} className="loginBtn link">{this.state.btnVal}</Link>
                    <Link to='/' className="Home-header link">My village</Link>
                </div>
                <div className="Home-border"></div>
            </header>
        );
    }
}


function mapStateToProps (state) {
    return {
        user: state.user
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({auth, logoutUser},dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);