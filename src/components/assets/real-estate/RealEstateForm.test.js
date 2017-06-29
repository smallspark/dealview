/* global expect */

import React from 'react'
import { shallow } from 'enzyme'
import _ from 'lodash'
import moment from 'moment'

import RealEstateForm from 'components/assets/real-estate/RealEstateForm'
import ValuationsInput from 'components/forms/ValuationsInput/ValuationsInput'
import { AddressEmpty } from 'types/commonTypes'
import { validRealEstate1, validRealEstate2 } from 'fixtures/realEstate'
import { DateStorageFormat } from 'types/commonTypes'
import { RealEstateDefaults } from 'types/assets/realEstate'
import type { RealEstateErrors } from 'components/assets/real-estate/RealEstateForm'

describe('RealEstateForm', () => {
  it('should render', () => {
    const wrapper = shallow(<RealEstateForm realEstate={validRealEstate1} />)
    expect(wrapper).toMatchSnapshot()
    const wrapper2 = shallow(<RealEstateForm realEstate={validRealEstate2} />)
    expect(wrapper2).toMatchSnapshot()
  })

  it('should pass valuations to ValuationsInput component', () => {
    const wrapper = shallow(<RealEstateForm realEstate={validRealEstate1} />)
    expect(wrapper.find(ValuationsInput).prop('valuations'))
      .toBe(validRealEstate1.valuations)
  })

  it('should pass minimum date to ValuationsInput component when there is a purchase', () => {
    const wrapper = shallow(<RealEstateForm realEstate={validRealEstate1} />)
    const minDate = wrapper.find(ValuationsInput).prop('minDate')
    const expectedMinDate = moment(validRealEstate1.purchaseDate, DateStorageFormat).add(1, 'd')
    expect(minDate.isSame(expectedMinDate)).toBe(true)
  })

  it('should pass maximum date to ValuationsInput component when there is a sale', () => {
    const wrapper = shallow(<RealEstateForm realEstate={validRealEstate2} />)
    const maxDate = wrapper.find(ValuationsInput).prop('maxDate')
    const expectedMaxDate = moment(validRealEstate2.saleDate, DateStorageFormat).subtract(1, 'd')
    expect(maxDate.isSame(expectedMaxDate)).toBe(true)
  })

  it('should not pass minimum date to ValuationsInput when purchase has no date', () => {
    const realEstate = { ...validRealEstate1, valuations: [
      { amount: 165000, note: 'Purchase price', type: 'purchase' },
    ] }
    const wrapper = shallow(<RealEstateForm realEstate={realEstate} />)
    const minDate = wrapper.find(ValuationsInput).prop('minDate')
    expect(minDate).toBe(undefined)
  })

  it('should not pass maximum date to ValuationsInput when sale has no date', () => {
    const realEstate = { ...validRealEstate1, valuations: [
      { amount: 340000, note: 'Sale price', type: 'sale' },
    ] }
    const wrapper = shallow(<RealEstateForm realEstate={realEstate} />)
    const maxDate = wrapper.find(ValuationsInput).prop('maxDate')
    expect(maxDate).toBe(undefined)
  })

  it('should focus the first field with errors upon submission', () => {
    const wrapper = shallow(<RealEstateForm />)
    wrapper.find({ name: 'name' }).prop('onChange')('rover')
    wrapper.find({ name: 'address' }).prop('onChange')({
      line1: '',
      line2: '',
      line3: 'a',
      locality: '',
      state: '',
      postcode: '',
    })
    wrapper.find('form').simulate('submit', { preventDefault() {} })
    expect(wrapper.state('focusedInput')).toEqual('address-line3')
  })

  it('should show all errors upon submission', () => {
    const wrapper = shallow(<RealEstateForm />)
    wrapper.find('form').simulate('submit', { preventDefault() {} })
    expect(wrapper.state('allErrorsShown')).toEqual(true)
  })
})

describe('findFirstErrorFieldName', () => {
  it('should return the name of the first field with errors', () => {
    const errors: RealEstateErrors = {
      name: [],
      address: AddressEmpty,
      notes: ['has incorrect grammar in it'],
    }
    const result = RealEstateForm.findFirstErrorFieldName(errors)
    expect(result).toEqual('notes')
  })

  it('should return a field within a complex input', () => {
    const errors: RealEstateErrors = {
      name: [],
      address: {
        line1: [],
        line2: ["is not anywhere I've ever heard of"],
        line3: [],
      },
      notes: [],
    }
    const result = RealEstateForm.findFirstErrorFieldName(errors)
    expect(result).toEqual('address-line2')
  })
})

describe('validation', () => {
  it('should require a purchase validation', () => {
    const realEstate = _.cloneDeep(validRealEstate1)
    realEstate.valuations = realEstate.valuations.filter(v => v.type !== 'purchase')
    const wrapper = shallow(<RealEstateForm realEstate={realEstate} />)
    expect(wrapper.find(ValuationsInput).prop('errors'))
      .toMatchSnapshot()
  })

  it('should require valuations to be between purchase and sale dates', () => {
    const realEstate = _.cloneDeep(validRealEstate1)
    realEstate.valuations.push({
      date: '2014-09-09', amount: 460000, note: 'Some other valuation', type: 'none',
    })
    const wrapper = shallow(<RealEstateForm realEstate={realEstate} />)
    expect(wrapper.find(ValuationsInput).prop('errors'))
      .toMatchSnapshot()
  })
})

describe('purchase and sale', () => {
  it('should update state when purchase date is changed', () => {
    const wrapper = shallow(<RealEstateForm realEstate={validRealEstate1} />)
    wrapper.find({ name: 'purchaseDate' }).prop('onChange')('2016-05-14')
    expect(wrapper.state()).toMatchSnapshot()
  })

  it('should update state when purchase amount is changed', () => {
    const wrapper = shallow(<RealEstateForm realEstate={validRealEstate1} />)
    wrapper.find({ name: 'purchaseAmount' }).prop('onChange')(350000)
    expect(wrapper.state()).toMatchSnapshot()
  })

  it('should update state when sale date is changed', () => {
    const wrapper = shallow(<RealEstateForm realEstate={validRealEstate1} />)
    wrapper.find({ name: 'saleDate' }).prop('onChange')('2016-05-14')
    expect(wrapper.state()).toMatchSnapshot()
  })

  it('should update state when sale amount is changed', () => {
    const wrapper = shallow(<RealEstateForm realEstate={validRealEstate1} />)
    wrapper.find({ name: 'saleAmount' }).prop('onChange')(350000)
    expect(wrapper.state()).toMatchSnapshot()
  })

  it('should not add empty purchase and sale upon edit of a valuation', () => {
    const realEstate = RealEstateDefaults
    const wrapper = shallow(<RealEstateForm realEstate={realEstate} />)
    wrapper.find(ValuationsInput).prop('onChange')([
      { amount: 1 },
    ])
    expect(wrapper.state('realEstate').valuations).toHaveLength(1)
  })

  it('should set minimum on sale date when purchase is present', () => {
    const expected = moment('2005-05-10', DateStorageFormat).add(1, 'd')
    const wrapper = shallow(<RealEstateForm realEstate={validRealEstate2} />)
    expect(
      wrapper.find({ name: 'saleDate' }).prop('minDate').isSame(expected))
    .toBe(true)
  })

  it('should set maximum on purchase date when sale is present', () => {
    const expected = moment('2017-01-01', DateStorageFormat).subtract(1, 'd')
    const wrapper = shallow(<RealEstateForm realEstate={validRealEstate2} />)
    expect(
      wrapper.find({ name: 'purchaseDate' }).prop('maxDate').isSame(expected))
    .toBe(true)
  })
})
