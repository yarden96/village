import React, { Component } from 'react';
import './style.css';
import { Link } from 'react-router-dom';

class Home extends Component {
  render() {
    let user = this.props.user;

    return (
      <div className="Home-links-div">
        {
          user.login && user.login.role === 'admin'  ?
          <Link to="/usersMgmt" className="Home-button link" >Users Management</Link>
          : null
        }
        <Link to='/laundry' className="Home-button link">Laundry</Link>
        <Link to='/cleaning-duty' className="Home-button link">Cleaning Dudy</Link>
      </div>
  );
  }
}

export default Home;