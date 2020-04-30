import React, { Component } from 'react';
import { connect } from 'react-redux';
import { auth } from '../actions';
import { bindActionCreators } from 'redux';

export default function(ComposedClass, accessable){
    class AuthenticatoinCheck extends Component {
        
        state = {
            loading:true
        }

        UNSAFE_componentWillMount = () => {
            this.props.auth();
        }

        UNSAFE_componentWillReceiveProps(nextProps){
            if((nextProps.user.login && nextProps.user.login.isAuth) || accessable){
                this.setState({loading:false})
            }
        }

        render() {
            if(this.state.loading){
                return <div>Loading...</div>
            }
            return (
                <ComposedClass {...this.props}/>
            );
        }
    }  
    
    function mapStateToProps (state) {
        return {
            user: state.user
        }
    }

    function mapDispatchToProps (dispatch) {
        return bindActionCreators({auth},dispatch);
    }
    

    return connect(mapStateToProps, mapDispatchToProps)(AuthenticatoinCheck);
}
