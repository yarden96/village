import React from 'react';
import Header from '../Components/header';
import '../Components/style.css';

const Layout = (props) => {  
    return (
        <div className="Home">
            <div className="layout-split-header">
                <Header className="layout-header"/>
            </div>
            <div className="body layout-split-body">
                {props.children}
            </div>
        </div>
    );
}

export default Layout;