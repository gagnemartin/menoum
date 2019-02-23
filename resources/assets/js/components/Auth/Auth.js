import React  from 'react'
import AuthRoot from './AuthRoot'

export default class Auth extends AuthRoot
{

    static login(data)
    {
        return AuthRoot.login(data)
    }

    static logout()
    {
        return AuthRoot.logout()
    }

    static async getUser()
    {
        return AuthRoot.getUser()
    }

    static isAuthenticated()
    {
        return AuthRoot.isAuthenticated()
    }
}