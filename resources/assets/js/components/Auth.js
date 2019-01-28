import React, { Component } from 'react'

this.user = {}
this.accessToken = null
this.isAuthenticated = false

export default class Auth extends Component
{

    static login(data)
    {
        return login(data)
    }

    static logout()
    {
        return logout()
    }

    static async getUser()
    {
        return getUser()
    }

    static isAuthenticated()
    {
        return isAuthenticated()
    }
}

const isAuthenticated = () =>
{
    return this.isAuthenticated
}

const authenticate = () => {
    this.isAuthenticated = true
}

const deAuthenticate = () => {
    this.isAuthenticated = false
    this.user = {}
    this.accessToken = null
}

const login = async (data) => {
    if (!isAuthenticated() && typeof data !== 'undefined') {
        return axios.post('/api/login', data)
            .then(response => {
                const token = response.data.token

                if (typeof token !== 'undefined') {
                    axios.defaults.headers.common = {
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json'
                    }

                    authenticate()

                    return setUser().then((response) => {
                        return response
                    })
                }
            })
            .catch(thrown => {
                return thrown.response
            })
    }

    return this.user
}

const logout = async () =>
{
    if (isAuthenticated()) {
        return axios.get('api/logout')
            .then(response => {
                deAuthenticate()

                return { success: true, message: response.data }
            })
            .catch(thrown => {
                console.log(thrown.response)
            })
    }

    deAuthenticate()

    return { success: true, message: 'User logged out!' }
}

const setUser = async () =>
{
    if (isAuthenticated()) {
        return axios.get('api/user')
            .then(response => {
                this.user = response.data

                return this.user
            })
            .catch(thrown => {
                console.log(thrown.response)
            })
    }
}

const getUser = () =>
{
    return this.user
}