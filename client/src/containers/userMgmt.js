import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUser, getUsers, addNewUser, updateUser, deleteUser } from '../actions';

import '../containers/userMgmt.css';
import Modal from '../Components/modal';
import Table from '../Components/table';

class UsersManagement extends Component {

    state = {
        show: false,
        edit: false,
        readOnly:false,
        modalHeadline:'',
        id:'',
        password:'',
        name:'',
        lastname:'',
        role:'user',
        numberOfDuties:'',
        searchInput:'',
        users: ''
    }

    componentWillMount = () => {
        this.props.getUsers();
    }

    componentWillReceiveProps = (nextProps) => {
        if((nextProps.newUser && nextProps.newUser.seccess) || this.state.edit) {
            this.setState({
                show: false,
                id:'',
                password:'',
                name:'',
                lastname:'',
                role:'user'
            })
        }

        if(nextProps.users) {
            this.setState({users:nextProps.users})
        }
    }

    showModal = () => {
        this.setState({show: true});
    }

    hideModal = () => {
        this.setState({show: false,
            edit: false,
            readOnly:false,
            modalHeadline:'',
            id:'',
            password:'',
            name:'',
            lastname:'',
            role:'user',
            numberOfDuties:'',
            searchInput:''});
    }

    handleChange = (evt) => {
        const value = evt.target.value;
        this.setState({
          ...this.state,
          [evt.target.name]: value
        });
    }

    addNewUserBtn = (e) => {
        e.preventDefault();
        this.setState({
            edit:false, 
            readOnly:false, 
            modalHeadline:'Add New User'})
        this.showModal();
    }

    submitForm = async (e) => {
        e.preventDefault();
        if(this.state.edit) {
            await this.props.updateUser(this.state);
        } else {
            await this.props.addNewUser(this.state);
        }
        this.props.getUsers();
    }

    search = (e) => {
        this.props.getUser(e.target.value)
    }

    clickRow = (user) => {
        if(user) {
            this.setState({
                show: true,
                edit: true,
                readOnly: true,
                modalHeadline:'Edit User',
                id:user.id,
                password:'********',
                name:user.name,
                lastname:user.lastname,
                numberOfDuties:user.numberOfDuties,
                role:user.role
            })
        }
    }

    deleteUser = () => {
        this.props.deleteUser(this.state.id);
    }

    render() {
        let newUser = this.props.newUser;
        return (
            <div>
                <Modal show={this.state.show} handleClose={this.hideModal}>
                    <p className="modalHeader">{this.state.modalHeadline}</p>
                        <form onSubmit={this.submitForm}> 
                        <div>
                            <input 
                                name="id"
                                type="text" 
                                className="input"
                                placeholder="ID"
                                value={this.state.id}
                                onChange={this.handleChange}
                                readOnly={this.state.readOnly}
                            />
                        </div>
                        <div>
                            <input 
                                name="password"
                                type="text"
                                className="input"
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.handleChange}
                            />
                            <input 
                                name="name"
                                type="text"
                                className="input"
                                placeholder="First Name"
                                value={this.state.name}
                                onChange={this.handleChange}
                            />
                            <input 
                                name="lastname"
                                type="text"
                                className="input"
                                placeholder="Last Name"
                                value={this.state.lastname}
                                onChange={this.handleChange}
                            />
                            {
                                this.state.edit ? 
                                <input name="numberOfDuties"
                                    type="number"
                                    className="input"
                                    placeholder="Number of duties"
                                    value={this.state.numberOfDuties}
                                    onChange={this.handleChange}/>
                                 :null
                            }
                            <select name="role" className="input" onChange={this.handleChange}>
                            <option value="User" selected={this.state.role === 'user'}>User</option>
                            <option value="Admin" selected={this.state.role === 'admin'}>Admin</option>
                            </select>
                        </div>    
                        <button type="submit" className="loginInputBtn link">Save</button> 
                        {
                            this.state.edit ? 
                                <button type="submit" className="loginInputBtn link" onClick={this.deleteUser}>delete</button>       
                            :null
                        }
                        {
                            newUser && !newUser.seccess && !this.state.edit ?
                            <div className="modalHeader">
                                Failed to save user  - {newUser.error._message}
                            </div>
                            : null
                        }
                    </form>
                </Modal>
                <div>
                    <form className="searchForm" onChange={this.search} >
                        <input name="searchInput" type="text" placeholder="Search" className="input"/>
                    </form>
                    <button onClick={this.addNewUserBtn} className="addUserBtn">Add user</button>
                </div>
                <div className="tableDiv">
                    <Table rows={this.state.users} column={["ID", "Name", "Role", "Number of Duties"]}
                        clickRow={this.clickRow}/>
                </div>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        newUser: state.manageUsers.newUser,
        users: state.manageUsers.users
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({getUser, getUsers, addNewUser, updateUser, deleteUser},dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersManagement);