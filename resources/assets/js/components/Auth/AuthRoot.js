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

	isAuthenticated()
	{
		return this.auth.isAuthenticated
	}

	authenticate(token, remember)
	{
		this.auth.isAuthenticated = true

		this.setAccessToken(token, remember)
		this.setAxiosHeader(token)
	}

	deAuthenticate()
	{
		this.auth.isAuthenticated = false
		this.auth.user = {}
		this.auth.accessToken = null

		this.removeAccessToken()
	}

	setAccessToken(token, remember)
	{
		localStorage.removeItem('access_token')
		sessionStorage.removeItem('access_token')

		let storage = sessionStorage

		if (remember) {
			storage = localStorage
		}

		storage.setItem('access_token', token)
	}

	getAccessToken()
	{
		const token = localStorage.getItem('access_token')

		if (token) return token

		return sessionStorage.getItem(('access_token'))
	}

	removeAccessToken()
	{
		localStorage.removeItem('access_token')
		sessionStorage.removeItem('access_token')
	}

	setAxiosHeader(token)
	{
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + token,
			'Accept': 'application/json'
		}
	}

	async login(data)
	{
		if (!this.isAuthenticated() && typeof data !== 'undefined') {
			return axios.post('/api/login', data)
				.then(response => {
					const token = response.data.token

					if (typeof token !== 'undefined') {

						this.authenticate(token, data.remember)

						return this.setUser().then((response) => {
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

	async logout()
	{
		if (this.isAuthenticated()) {
			return axios.get('api/logout')
				.then(response => {
					this.deAuthenticate()

					return { success: true, message: response.data }
				})
				.catch(thrown => {
					return thrown.response
				})
		}

		this.deAuthenticate()

		return { success: true, message: 'User logged out!' }
	}

	async setUser()
	{
		if (this.isAuthenticated()) {
			return axios.get('api/user')
				.then(response => {
					this.user = response.data

					return this.user
				})
				.catch(thrown => {
					this.deAuthenticate()
					return thrown
				})
		}
	}

	async getUser()
	{
		if (!this.isAuthenticated()) {
			const token = this.getAccessToken()

			if (token) {
				this.authenticate(token)

				return this.setUser().then((response) => {
					return response
				}).catch(thrown => {
					return thrown
				})
			}
		}

		return this.user
	}
}