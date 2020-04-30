import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { getMachines, saveSchedule, getSchedule, deleteSchedule } from '../actions';
import Table from '../Components/table';

import './laundry.css';

class Laundry extends Component {
  currentDate = moment(new Date()).format('DD-MM')
    
  initState = {
    _id:'',
    userName: '',
    machineType:'woshing',
    machineName:'',
    startTime:'',
    endTime:'',
    date:this.currentDate,
    laundry:'',
    dryer:'',
    edit: false
  }

  state = {
    ...this.initState
  }

  UNSAFE_componentWillMount = () => {
    this.props.getMachines();
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if(nextProps.schedule && nextProps.schedule.seccess) {
      this.setState({
        _id:'',
        userName: '',
        startTime:'',
        endTime:'',
        edit: false
       })
    }      
  }

  handleChange = (evt) => {
    const value = evt.target.value;
    this.setState({
      ...this.state,
      [evt.target.name]: value
    });
  }

  renderMachines = (type) => {
    let machines = this.props.machines;
    
    if(machines && machines.machinesList && machines.machinesList.length > 0) {
      return machines.machinesList.map((machine, i) => {
        if (machine.available && machine.type === type) {
          return <option key={i} name={machine.name} 
                    value={machine.name} className="input">{machine.name}</option>
        }
           
        return null
      })
    }
        
    return null;
  }

  renderScheduleTable = (evt) => {
    const value = evt.target.value;
        
    this.setState({
      [evt.target.name]: value
    });

    this.props.getSchedule(value, evt.target.name === 'laundry');
  }

  submitForm = async(e) => {
    e.preventDefault();
    await this.props.saveSchedule(this.state);
      
    this.props.getSchedule(this.state.machineName, this.state.machineType === 'woshing');
    if ( this.state.machineType === 'woshing') {
      this.setState({
        laundry: this.state.machineName
      })
    } else {
      this.setState({
        dryer: this.state.machineName
      })
    }
  }

  clickRow = (schedule) => {
    if(this.state._id === schedule._id) {
      return this.setState({
        ...this.initState
       })
    }
    this.setState({
      _id:schedule._id,
      userName: schedule.userName,
      machineType: schedule.machineType,
      machineName: schedule.machineName,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      date:schedule.date,
      edit:true
    })        
  }

  deleteSchedule = async () => {
    await this.props.deleteSchedule(this.state._id);
    if (this.state.machineName === this.state.laundry || this.state.machineName === this.state.dryer) {
      this.props.getSchedule(this.state.machineName, this.state.machineType === 'woshing');
    }
    this.setState({
      ...this.initState
    })
  }

  renderDatesOption = () => {
    let dateArr = [];
    let today = new Date()
    let tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

    dateArr.push(moment(today).format('DD-MM'), moment(tomorrow).format('DD-MM'));

    return dateArr.map((date) => {
      return <option key={date} value={date}>{date}</option>
    })
  }

  render() {
    let laundrySchedule = this.props.laundrySchedule;
    let dryerSchedule = this.props.dryerSchedule;

    if (laundrySchedule) {
      laundrySchedule.scheduleList.sort((a, b) => (a.startTime < b.startTime) ? 1 : -1)
            .sort((a, b) => (a.date > b.date) ? 1 : -1)
    }

    if(dryerSchedule) {
      dryerSchedule.scheduleList.sort((a, b) => (a.startTime < b.startTime) ? 1 : -1)
        .sort((a, b) => (a.date > b.date) ? 1 : -1)
    }

    return (
      <div>
        <div className="laundry-right">
          <div className="laundry-right-right">
              <select name="laundry" className="input" onChange={this.renderScheduleTable} value={this.state.laundry}>
                  <option>Laundry</option>
                  {this.renderMachines('woshing')}
              </select>
              <Table rows={laundrySchedule ? laundrySchedule.scheduleList : null} column={["Name","date", "Hours"]}
              clickRow={this.clickRow} schedule={true}/>
          </div>
          <div className="laundry-right-left">
              <select name="dryer" className="input" onChange={this.renderScheduleTable} value={this.state.dryer}>
                  <option>Dryer</option>
                  {this.renderMachines('dryer')}
              </select>
              <Table rows={dryerSchedule ? dryerSchedule.scheduleList : null} column={["Name","date", "Hours"]}
              clickRow={this.clickRow} schedule={true}/>
          </div>
        </div>
        <div className="laundry-left">
          <p>Add new schedule</p>
          <form>
              <input type="text" 
                            name="userName" 
                            className="input" 
                            onChange={this.handleChange} 
                            value={this.state.userName} 
                            placeholder="Name"
              />
              <div className="laundry-inline">
                  <select type="text" 
                      name="machineType" 
                      className="input input-left" 
                      onChange={this.handleChange} 
                      value={this.state.machineType}
                      >
                          <option value="woshing" className="input">Woshing</option>
                          <option value="dryer" className="input">Dryer</option>
                  </select>
                  <select type="text" 
                      name="machineName" 
                      className="input input-right" 
                      onChange={this.handleChange}
                      value={this.state.machineName}
                      >
                          <option>Select</option>
                          { this.renderMachines(this.state.machineType) }
                  </select>
              </div>
              <input type="text" 
                            name="startTime" 
                            className="input" 
                            placeholder="Start Time" 
                            onChange={this.handleChange}
                  value={this.state.startTime}
                  />
              <input 
                  type="text" 
                            name="endTime" 
                            className="input" 
                            placeholder="End Time" 
                            onChange={this.handleChange}
                  value={this.state.endTime}
                  />
              <div className="laundry-inline">
                  <select 
                      type="text" 
                      name="date" 
                      className="input input-left" 
                      onChange={this.handleChange}
                      defaultValue={this.state.date}
                      >
                          {this.renderDatesOption()}
                  </select>
                  <button type="submit" className="input link input-right new-schdule-btn" onClick={this.submitForm}>Save</button> 
              </div>
              {
                  this.props.schedule && !this.props.schedule.seccess ?
                  <div className="error-message">
                      Failed to save schedule  - {this.props.schedule.err}
                  </div>
                  : null
              }
          </form>
          {
            this.state.edit ? 
              <button type="submit" className="loginInputBtn link" onClick={this.deleteSchedule}>delete</button>       
            :null
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps (state) {
    return {
        machines: state.laundry.machines,
        schedule: state.laundry.schedule,
        laundrySchedule: state.laundry.laundrySchedule,
        dryerSchedule: state.laundry.dryerSchedule
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({getMachines, saveSchedule, getSchedule, deleteSchedule},dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Laundry);