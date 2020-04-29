const axios = require('axios')

const URL = 'http://localhost:3001';

// Users
export function loginUser({id, password}){
    return axios.post(`${URL}/api/user/login`, { id, password }, { withCredentials: true })
        .then(response => {
            return {
                type: 'USER_LOGIN',
                paylod: response.data
            }
        })
}

export function logoutUser(){
    return axios.get(`${URL}/api/user/logout`, { withCredentials: true })
        .then(response => {
            return {
                type: 'USER_LOGOUT',
                paylod:response.data
            }
        })
}

export function auth(){
    return axios.get(`${URL}/api/user/isAuth`, { withCredentials: true })
        .then(response => {
            return {
                type: 'IS_AUTH',
                paylod:response.data
            }
        })
}

export function addNewUser({id, password, name, lastname, role}){
    let user = {id, password, name, lastname, role};
    return axios.post(`${URL}/api/user/register`, {user})
        .then(response => {
            return {
                type: 'REGISTER_USER',
                paylod: response.data
            }
        })
}

export function updateUser({id, password, name, lastname, role, numberOfDuties}) {
    return axios.post(`${URL}/api/user/updateUser`, {id, password, name, lastname, role, numberOfDuties})
        .then(response => {
            return {
                type: 'UPDATE_USER',
                paylod: response.data
            }
        })
}

export function getUsers(){
    return axios.get(`${URL}/api/user/getUsers`)
        .then(response => {
            return {
                type: 'GET_USERS',
                paylod: response.data
            }
        })
}

export function getUser(query){
    return axios.get(`${URL}/api/user/getUser?search=${query}`)
        .then(response => {
            return {
                type: 'GET_USER',
                paylod: response.data
            }
        })
}

export function deleteUser(query) {
    return axios.delete(`${URL}/api/user/deleteUser?id=${query}`)
        .then (response => {
            return {
                type: 'DELETE_USER',
                paylod: response.data 
            }
        })
}

// Laundry
export function getMachines() {
    return axios.get(`${URL}/api/machine/machinesList`)
        .then (response => {
            return {
                type: 'GET_MACHINES',
                paylod: response.data 
            }
        })
}

export function saveSchedule({userName, machineType, machineName, startTime, endTime, date, _id, edit}) {
    let schedule = {userName, machineType, machineName, startTime, endTime, date, _id}
    
    if (edit) {
        return axios.post(`${URL}/api/schedule/updateSchedule`, {schedule})
        .then  (response => {
            return {
                type: 'SAVE_SCHEDULE',
                paylod: response.data 
            }
        })     
    }
    return axios.post(`${URL}/api/schedule/addSchedule`, {schedule})
        .then  (response => {
            return {
                type: 'SAVE_SCHEDULE',
                paylod: response.data 
            }
        })   
}

export function getSchedule(query, laundry) {
    return axios.get(`${URL}/api/schedule/scheduleByMachine?name=${query}`)
        .then(response => {
            if (laundry) {
                return {
                    type:'GET_SCHEDULE_LAUNDRY',
                    paylod: response.data
                }
            }
            return {
                type:'GET_SCHEDULE_DRYER',
                paylod: response.data
            }
        })
}

export function deleteSchedule(id) {
    return axios.delete(`${URL}/api/schedule/deleteSchedule?id=${id}`)
    .then(response => {
        return {
            type: 'DELETE_SCHEDULE',
            paylod: response.data 
        }
    })
}