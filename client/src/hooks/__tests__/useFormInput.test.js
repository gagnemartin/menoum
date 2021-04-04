import { act } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import useFormInput from '../useFormInput'

describe('useFormInput()', () => {
  it('should set the value for a text input from event.currentTarget.value', () => {
    const { result } = renderHook(() => useFormInput())
    const {
      current: { onChange }
    } = result
    const text = 'test123'

    act(() => {
      onChange({
        currentTarget: { value: text }
      })
    })

    expect(result.current.value).toBe(text)
  })

  it('should set the value for a text input from event.value', () => {
    const { result } = renderHook(() => useFormInput())
    const {
      current: { onChange }
    } = result
    const text = 'test123'

    act(() => {
      onChange({
        value: text
      })
    })

    expect(result.current.value).toBe(text)
  })

  it('should set the value to empty if no value is specified', () => {
    const { result } = renderHook(() => useFormInput('default'))
    const {
      current: { onChange }
    } = result

    act(() => {
      onChange({ event: {} })
    })

    expect(result.current.value).toBe('')
  })

  it('should apply the text formatter', () => {
    const textFormatter = (value) => {
      return value.replace('-', '')
    }
    const { result } = renderHook(() => useFormInput('', { textFormatter }))
    const {
      current: { onChange }
    } = result
    const text = 'test-123'
    const textFormatted = 'test123'

    act(() => {
      onChange({
        currentTarget: { value: text }
      })
    })

    expect(result.current.value).toBe(textFormatted)
  })

  it('should set the value for a checkbox input', () => {
    const { result } = renderHook(() => useFormInput('', { type: 'checkbox' }))
    const {
      current: { onChange }
    } = result

    act(() => {
      onChange()
    })

    expect(result.current.value).toBeTruthy()
  })
})
