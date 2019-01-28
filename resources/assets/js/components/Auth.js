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

const authenticate = (token) => {
    this.isAuthenticated = true

    setAccessToken(token)
    setAxiosHeader(token)
}

const deAuthenticate = () => {
    this.isAuthenticated = false
    this.user = {}
    this.accessToken = null

    removeAccessToken()
}

const setAccessToken = (token) => {
    localStorage.setItem('access_token', token)
}

const getAccessToken = () => {
    return localStorage.getItem('access_token')
}

const removeAccessToken = () => {
    localStorage.removeItem('access_token')
}

const setAxiosHeader = (token) =>
{
    axios.defaults.headers.common = {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json'
    }
}

const login = async (data) => {
    if (!isAuthenticated() && typeof data !== 'undefined') {
        return axios.post('/api/login', data)
            .then(response => {
                const token = response.data.token

                if (typeof token !== 'undefined') {

                    authenticate(token)

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
                return thrown.response
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
                deAuthenticate()
                return thrown
            })
    }
}

const getUser = async () =>
{
    if (!isAuthenticated()) {
        const token = getAccessToken()

        if (token) {
            authenticate(token)

            return setUser().then((response) => {
                return response
            }).catch(thrown => {
                return thrown
            })
        }
    }

    return this.user
}