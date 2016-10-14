// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm, getFormValues, Field } from 'redux-form'
import type { AsyncValidateFunction, OnSubmitFunction } from 'redux-form'

import InputField from '../../forms/InputField.js'
import AddressField from '../../forms/AddressField.js'
import TextAreaField from '../../forms/TextAreaField.js'
import * as Validations from '../../../utils/FormValidation.js'
import { saveRealEstate } from '../../../actions/RealEstateActions.js'

const RealEstateForm = (props: { handleSubmit: Function }) => {
  const { handleSubmit } = props,
        addressFields = {
          address1: 'address1',
          address2: 'address2',
          address3: 'address3',
          postcode: 'postcode',
          locality: 'locality',
          state: 'state'
        }

  return (
    <form className="form form-stacked" onSubmit={handleSubmit}>
      <fieldset>
        <Field name="id" type="hidden" component={InputField}/>
        <Field name="name" type="text" label="Name" component={InputField}/>
        <Field name="address" meta={{ subfields: addressFields }}
               component={AddressField}/>
        <Field name="notes" label="Notes" component={TextAreaField}/>

        <button type="submit"
                className="button button-primary foo bar">Save</button>
      </fieldset>
    </form>
  )
}

const asyncValidate: AsyncValidateFunction = values =>
  // eslint-disable-next-line max-statements
  new Promise((resolve, reject) => {
    let errors = {}

    errors = Validations.required(values, errors, ['name'])
    errors = Validations.minLength(values, errors,
               [ 'name', 'address1', 'address2', 'address3', 'locality' ], 3)
    errors = Validations.maxLength(values, errors,
               [ 'name', 'address1', 'address2', 'address3', 'locality' ], 100)
    errors = Validations.isLength(values, errors, ['postcode'], 4)

    if (Object.keys(errors).length > 0) reject(errors)
    else resolve()
  })

const onSubmit: OnSubmitFunction = (values, dispatch) =>
  dispatch(saveRealEstate(values))

export default reduxForm({
  form: 'realEstate',
  asyncBlurFields: [ 'name', 'address1', 'address2', 'address3', 'locality',
                     'postcode', 'notes' ],
  asyncValidate,
  onSubmit
})(RealEstateForm)