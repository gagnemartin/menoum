import { useReducer } from 'react'
import { render } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react-hooks'
import { BrowserRouter as Router } from 'react-router-dom'
import Navigation from '../'
import { UserProvider, DEFAULT_STATE, ACTION_TYPES, userReducer } from '../../../context/userContext'

/**
 * A custom render to setup providers. Extends regular
 * render options with `providerProps` to allow injecting
 * different scenarios to test with.
 *
 * @see https://testing-library.com/docs/react-testing-library/setup#custom-render
 */
const customRender = (children) => {
  return render(<UserProvider>{children}</UserProvider>)
}

describe('<Navigation />', () => {
  it('should not have login button when loading', () => {
    const updatedState = {
      ...DEFAULT_STATE,
      status: ACTION_TYPES.success,
      user: {
        email: 'test@test.com'
      },
      loading: false
    }
    const { result, rerender } = renderHook(() => useReducer(userReducer, DEFAULT_STATE))
    const [state, dispatch] = result.current
    // dispatch({ type: ACTION_TYPES.success, data: { token: 'as' } })
    act(() => {
      dispatch({
        type: ACTION_TYPES.success,
        payload: {
          data: {
            token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.J78feKgEv-EbpTKGLYT74KT-qtaXjZDAGlpd3Rxwhy4'
          }
        }
      })
      // rerender({
      //   status: ACTION_TYPES.success,
      //   user: {
      //     email: 'test@test.com'
      //   },
      //   loading: false
      // })
    })
    rerender(updatedState)

    const { queryByTestId, queryByText, asFragment } = customRender(
      <Router>
        <Navigation />
      </Router>
    )

    // customRender(<Navigation />, { providerProps })
    //const { getByTestId, asFragment } = render(<Navigation />)
    const element = queryByText(updatedState.user.email)

    expect(element).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })
})
