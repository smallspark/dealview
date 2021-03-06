import React from 'react'
import { shallow } from 'enzyme'
import DatePicker from 'react-datepicker'
import moment from 'moment'

import DateField from './DateField.js'
import { DateStorageFormat } from '../data/commonTypes.js'

describe('DateField', () => {
  it('should render', () => {
    const props = {
      name: 'someDate',
      value: '1981-07-26',
      label: 'Some Date',
    }
    const wrapper = shallow(<DateField {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should be tolerant of an undefined value prop', () => {
    const props = {
      name: 'someDate',
      label: 'Some Date',
    }
    const wrapper = shallow(<DateField {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should be tolerant of an empty value prop', () => {
    const props = {
      name: 'someDate',
      label: 'Some Date',
      value: '',
    }
    const wrapper = shallow(<DateField {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should display errors if touched', () => {
    const props = {
      name: 'someDate',
      value: '1981-07-26',
      label: 'Some Date',
      errors: [ 'does not look right', 'smells funny' ],
    }
    const wrapper = shallow(<DateField {...props} />)
    wrapper.setState(
      {
        value: '2013-06-10',
        touched: true,
      },
      () => {
        expect(wrapper.find('.error')).toHaveLength(2)
        expect(wrapper).toMatchSnapshot()
      }
    )
  })

  it('should not display errors if not touched', () => {
    const props = {
      name: 'someDate',
      value: '1981-07-26',
      errors: [ 'does not look right', 'smells funny' ],
    }
    const wrapper = shallow(<DateField {...props} />)
    expect(wrapper.find('.error')).toHaveLength(0)
  })

  it('should display errors if not touched but forceErrorDisplay is true', () => {
    const props = {
      name: 'someDate',
      value: '1981-07-26',
      errors: [ 'does not look right', 'smells funny' ],
      forceErrorDisplay: true,
    }
    const wrapper = shallow(<DateField {...props} />)
    expect(wrapper.find('.error')).toHaveLength(2)
  })

  it('should call onChange when the input changes', () => {
    const props = {
      name: 'someDate',
      value: '1981-07-26',
      onChange: jest.fn(),
    }
    const wrapper = shallow(<DateField {...props} />)
    wrapper.find(DatePicker).prop('onChange')(
      moment('2014-09-25', DateStorageFormat)
    )
    expect(props.onChange).toHaveBeenCalledWith('2014-09-25')
  })

  it('should call onFocus when the input is focused', () => {
    const props = {
      name: 'someInput',
      type: 'text',
      onFocus: jest.fn(),
    }
    const wrapper = shallow(<DateField {...props} />)
    wrapper.find(DatePicker).prop('onFocus')({ target: { name: 'someInput' } })
    expect(props.onFocus).toHaveBeenCalledWith('someInput')
  })

  it('should focus the input when the focus prop is passed', () => {
    const props = {
      name: 'someInput',
      type: 'text',
      focus: 'someInput',
    }
    const wrapper = shallow(<DateField {...props} />)
    expect(wrapper.find(DatePicker).prop('autoFocus')).toBe(true)
  })

  it('should pass minimum date to date picker if set', () => {
    const minDate = moment('2017-06-29', DateStorageFormat)
    const props = {
      name: 'someInput',
      minDate,
    }
    const wrapper = shallow(<DateField {...props} />)
    expect(wrapper.find(DatePicker).prop('minDate').isSame(minDate)).toBe(true)
  })

  it('should pass maximum date to date picker if set', () => {
    const maxDate = moment('2017-06-29', DateStorageFormat)
    const props = {
      name: 'someInput',
      maxDate,
    }
    const wrapper = shallow(<DateField {...props} />)
    expect(wrapper.find(DatePicker).prop('maxDate').isSame(maxDate)).toBe(true)
  })

  it('should not pass minimum date to date picker if unset', () => {
    const props = {
      name: 'someInput',
    }
    const wrapper = shallow(<DateField {...props} />)
    expect(wrapper.find(DatePicker).prop('minDate')).toBe(undefined)
  })

  it('should not pass maximum date to date picker if unset', () => {
    const props = {
      name: 'someInput',
    }
    const wrapper = shallow(<DateField {...props} />)
    expect(wrapper.find(DatePicker).prop('maxDate')).toBe(undefined)
  })
})
