import React from 'react'
import { configure, shallow, mount, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import renderer from 'react-test-renderer'
import { MemoryRouter, Redirect } from 'react-router-dom'

import Register from '../components/User/Register'

configure({ adapter: new Adapter() })

describe('User register', () => {

    it("Can't access when authenticated", () => {
        const auth = {
            isAuthenticated: true
        }
        const component = shallow(<Register auth={ auth } />)
        const redirect = component.find(Redirect).exists()

        expect(redirect).toBeTruthy();
    })

    it('Matches the snapshot', () => {
        const component = renderer.create(<MemoryRouter><Register /></MemoryRouter>)
        const tree = component.toJSON()

        expect(tree).toMatchSnapshot()
    })

    it('Renders the form', () => {
        const component = shallow(<Register />)
        const $form = component.find('form.user-register')

        const form = $form.exists()
        expect(form).toBeTruthy()

        const usernameInput = $form.find('input[name="username"]').exists()
        expect(usernameInput).toBeTruthy()

        const emailInput = $form.find('input[name="email"]').exists()
        expect(emailInput).toBeTruthy()

        const passwordInput = $form.find('input[name="password"]').exists()
        expect(passwordInput).toBeTruthy()

        const passwordConfirmInput = $form.find('input[name="password_confirmation"]').exists()
        expect(passwordConfirmInput).toBeTruthy()
    })

    it('Changing input values changes the state', () => {
        const component = shallow(<Register />)
        const event = {
            target: {
                name: 'username',
                value: 'myUsername'
            }
        }

        const usernameInput = component.find('input[name="username"]')
        usernameInput.simulate('change', event)
        expect(component.state().username).toEqual(event.target.value)

        const emailInput = component.find('input[name="email"]')
        event.target.name = 'email'
        event.target.value = 'email@test.com'
        emailInput.simulate('change', event)
        expect(component.state().email).toEqual(event.target.value)

        const passwordInput = component.find('input[name="password"]')
        event.target.name = 'password'
        event.target.value = 'myPassword'
        passwordInput.simulate('change', event)
        expect(component.state().password).toEqual(event.target.value)

        const passwordConfirmInput = component.find('input[name="password_confirmation"]')
        event.target.name = 'password_confirmation'
        event.target.value = 'myPasswordConfirm'
        passwordConfirmInput.simulate('change', event)
        expect(component.state().password_confirmation).toEqual(event.target.value)
    })

    it('Submits the form', () => {
        const component = shallow(<Register />)
        const preventDefault = jest.fn()
        const form = component.find('form.user-register')

        form.simulate('submit', { preventDefault })
        expect(preventDefault).toHaveBeenCalled()
    })
})