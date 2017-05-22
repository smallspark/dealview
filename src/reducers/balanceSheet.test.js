/* global expect */

import BalanceSheetReducer from 'reducers/balanceSheet'
import * as BalanceSheetActions from 'actions/balanceSheet'
import { validBalanceSheet1, validBalanceSheet2 } from 'fixtures/balanceSheet'

describe('BalanceSheetReducer', () => {
  const initialState = {
    status: 'loaded',
    balanceSheet: validBalanceSheet1,
  }

  it('should update state upon request', () => {
    const actions = [
      BalanceSheetActions.updateBalanceSheetRequest,
      BalanceSheetActions.loadBalanceSheetRequest,
    ]
    actions.forEach(action => {
      const nextState = BalanceSheetReducer(initialState, action())
      expect(nextState).toMatchSnapshot()
    })
  })

  it('should update state upon update success', () => {
    const action = BalanceSheetActions.updateBalanceSheetSuccess(validBalanceSheet2)
    const nextState = BalanceSheetReducer(initialState, action)
    expect(nextState).toMatchSnapshot()
  })

  it('should update state upon load success', () => {
    const action = BalanceSheetActions.loadBalanceSheetSuccess(validBalanceSheet2)
    const nextState = BalanceSheetReducer(initialState, action)
    expect(nextState).toMatchSnapshot()
  })

  it('should update state upon failure', () => {
    const actions = [
      BalanceSheetActions.updateBalanceSheetFailure,
      BalanceSheetActions.loadBalanceSheetFailure,
    ]
    actions.forEach(action => {
      const nextState = BalanceSheetReducer(initialState, action('Some error'))
      expect(nextState).toMatchSnapshot()
    })
  })
})