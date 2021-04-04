import { useState } from 'react'

const useFormInput = (initialValue = '', options = {}) => {
  const { textFormatter, type } = options
  const formatInputValue = (value) => (textFormatter ? textFormatter(value) : value)
  const [value, setValue] = useState(formatInputValue(initialValue))

  const onChange = (event) => {
    if (type === 'checkbox') {
      setValue((prevValue) => !prevValue)
    } else {
      const newValue = event.currentTarget?.value || event?.value || ''
      setValue(formatInputValue(newValue))
    }
  }

  return {
    value,
    onChange
  }
}

export default useFormInput
