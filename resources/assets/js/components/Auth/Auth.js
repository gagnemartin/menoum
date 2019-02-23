import React  from 'react'
import AuthRoot from './AuthRoot'

let auth = new AuthRoot()

export default class Auth extends AuthRoot
{

    static login(data)
    {
        return auth.login(data)
    }

    static logout()
    {
        return auth.logout()
    }

    static async getUser()
    {
        return auth.getUser()
    }

    static isAuthenticated()
    {
        return auth.isAuthenticated()
    }
}