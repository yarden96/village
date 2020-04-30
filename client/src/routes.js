import React from 'react';
import { Switch, Route} from 'react-router-dom';

import Home from './Components/home';
import Laundry from './containers/laundry';
import CleaningDuty from './Components/cleaningDuty';
import Layout from './hoc/layout';
import Login from './containers/login';
import Auth from './hoc/auth';
import UsersManagement from './containers/userMgmt';

const Routes = () => {
    return (
        <Layout>
            <Switch>
                <Route path="/" exact component={Auth(Home, true)}/>
                <Route path="/login" exact component={Login}/>
                <Route path="/laundry" exact component={Laundry}/>
                <Route path="/cleaning-duty" exact component={CleaningDuty}/>
                <Route path="/usersMgmt" exact component={Auth(UsersManagement)}/>
            </Switch>
        </Layout>
    );
};

export default Routes;