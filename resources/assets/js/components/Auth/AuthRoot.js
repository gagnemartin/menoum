import React, { PureComponent} from 'react'

export default class AuthRoot extends  PureComponent
{
	constructor(props)
	{
		super(props)

		this.auth = {
			user: {},
			accessToken: null,
			isAuthenticated: false
		}
	}

	static isAuthenticated()
	{
		return this.auth.isAuthenticated
	}

	static authenticate(token, remember)
	{
		this.auth.isAuthenticated = true

		AuthRoot.setAccessToken(token, remember)
		AuthRoot.setAxiosHeader(token)
	}

	static deAuthenticate()
	{
		this.auth.isAuthenticated = false
		this.auth.user = {}
		this.auth.accessToken = null

		AuthRoot.removeAccessToken()
	}

	static setAccessToken(token, remember)
	{
		localStorage.removeItem('access_token')
		sessionStorage.removeItem('access_token')

		let storage = sessionStorage

		if (remember) {
			storage = localStorage
		}

		storage.setItem('access_token', token)
	}

	static getAccessToken()
	{
		const token = localStorage.getItem('access_token')

		if (token) return token

		return sessionStorage.getItem(('access_token'))
	}

	static removeAccessToken()
	{
		localStorage.removeItem('access_token')
		sessionStorage.removeItem('access_token')
	}

	static setAxiosHeader(token)
	{
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + token,
			'Accept': 'application/json'
		}
	}

	static async login(data)
	{
		if (!AuthRoot.isAuthenticated() && typeof data !== 'undefined') {
			return axios.post('/api/login', data)
				.then(response => {
					const token = response.data.token

					if (typeof token !== 'undefined') {

						AuthRoot.authenticate(token, data.remember)

						return AuthRoot.setUser().then((response) => {
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

	static async logout()
	{
		if (AuthRoot.isAuthenticated()) {
			return axios.get('api/logout')
				.then(response => {
					AuthRoot.deAuthenticate()

					return { success: true, message: response.data }
				})
				.catch(thrown => {
					return thrown.response
				})
		}

		AuthRoot.deAuthenticate()

		return { success: true, message: 'User logged out!' }
	}

	static async setUser()
	{
		if (AuthRoot.isAuthenticated()) {
			return axios.get('api/user')
				.then(response => {
					this.user = response.data

					return this.user
				})
				.catch(thrown => {
					AuthRoot.deAuthenticate()
					return thrown
				})
		}
	}

	static async getUser()
	{
		if (!AuthRoot.isAuthenticated()) {
			const token = AuthRoot.getAccessToken()

			if (token) {
				AuthRoot.authenticate(token)

				return AuthRoot.setUser().then((response) => {
					return response
				}).catch(thrown => {
					return thrown
				})
			}
		}

		return this.user
	}
}