import React from 'react'
import PropTypes from 'prop-types'

class TextAreaField extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    errors: PropTypes.arrayOf(PropTypes.string),
    forceErrorDisplay: PropTypes.bool,
    focus: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
      touched: false,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  handleChange(event) {
    const target = event.target
    this.setState(
      () => ({ value: target.value, touched: true }),
      () => {
        if (this.props.onChange) this.props.onChange(target.value)
      }
    )
  }

  handleFocus(event) {
    const target = event.target
    if (this.props.onFocus) {
      this.props.onFocus(target.name)
    }
  }

  componentWillReceiveProps(props) {
    this.setState(() => ({ value: props.value }))
  }

  setFocus() {
    if (this.props.focus === this.props.name) {
      this.ref.focus()
    }
  }
  componentDidMount() {
    this.setFocus()
  }
  componentDidUpdate() {
    this.setFocus()
  }

  render() {
    const { name, label, placeholder, errors, forceErrorDisplay } = this.props
    const { value, touched } = this.state
    const labelTag = label
      ? <label htmlFor={name}>
          {label}
        </label>
      : null
    const errorTags = []
    if (errors) {
      errors.forEach((msg, i) =>
        errorTags.push(
          <div key={i} className='error'>
            {msg}
          </div>
        )
      )
    }
    const className = touched && errorTags.length > 0 ? 'with-errors' : ''
    const props = {
      name,
      className,
      placeholder,
      value,
      onChange: this.handleChange,
      onFocus: this.handleFocus,
      ref: input => (this.ref = input),
    }

    return (
      <div className='control-group'>
        {labelTag}
        <textarea {...props} />
        {(forceErrorDisplay || touched) &&
          errorTags.length > 0 &&
          <div className='errors'>
            {errorTags}
          </div>}
      </div>
    )
  }
}

export default TextAreaField
