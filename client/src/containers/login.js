import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginUser } from '../actions';
import { bindActionCreators } from 'redux';

class Login extends Component {

    state = {
        id:'',
        password:'',
        error:'',
        seccess:false, 
        loginBtn:'Login'
    }
    
    handleInputID = (event) => {
        this.setState({id:event.target.value})
    }

    handleInputPassword = (event) => {
        this.setState({password:event.target.value})
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.user.login && nextProps.user.login.isAuth){
            this.props.history.push('/');
        }
    }
    submitForm = (e) => {
        e.preventDefault();
        this.props.loginUser(this.state);
    }
    
    render() {
        let user = this.props.user;

        return (
            <div className="rl_container">
                <form onSubmit={this.submitForm}> 
                    <div>
                        <input 
                            type="text" 
                            className="loginInput"
                            placeholder="ID"
                            value={this.state.id}
                            onChange={this.handleInputID}
                        />
                    </div>
                    <div>
                        <input 
                            type="password"
                            className="loginInput"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.handleInputPassword}
                        />
                    </div>    
                    <button type="submit" className="loginInputBtn link">Login</button> 
                    <div>
                        {
                            user.login ?
                                <div>{user.login.message}</div>
                            : null
                        }
                    </div>
                </form>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        user: state.user
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({loginUser},dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);