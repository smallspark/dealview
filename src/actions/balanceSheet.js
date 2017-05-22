// @flow

import { putObject, getObject } from 'data/database'
import type { BalanceSheetOverTime } from 'data/balanceSheet'
import type { Thunk } from 'data/commonTypes'

const objectStore = 'BalanceSheet'
const theOneAndOnlyKey = 'BalanceSheet'

type LoadBalanceSheetRequestAction = {
  type: 'LOAD_BALANCE_SHEET_REQUEST'
}
type LoadBalanceSheetSuccessAction = {
  type: 'LOAD_BALANCE_SHEET_SUCCESS',
  balanceSheet: BalanceSheetOverTime
}
type LoadBalanceSheetFailureAction = {
  type: 'LOAD_BALANCE_SHEET_FAILURE',
  error: string|null
}

type UpdateBalanceSheetRequestAction = {
  type: 'UPDATE_BALANCE_SHEET_REQUEST'
}
type UpdateBalanceSheetSuccessAction = {
  type: 'UPDATE_BALANCE_SHEET_SUCCESS',
  balanceSheet: BalanceSheetOverTime
}
type UpdateBalanceSheetFailureAction = {
  type: 'UPDATE_BALANCE_SHEET_FAILURE',
  error: string|null
}

export type BalanceSheetAction = LoadBalanceSheetRequestAction
                               | LoadBalanceSheetSuccessAction
                               | LoadBalanceSheetFailureAction
                               | UpdateBalanceSheetRequestAction
                               | UpdateBalanceSheetSuccessAction
                               | UpdateBalanceSheetFailureAction

export const updateBalanceSheetRequest = (): UpdateBalanceSheetRequestAction => {
  return { type: 'UPDATE_BALANCE_SHEET_REQUEST' }
}

export const updateBalanceSheetSuccess = (balanceSheet: BalanceSheetOverTime): UpdateBalanceSheetSuccessAction => {
  return {
    type: 'UPDATE_BALANCE_SHEET_SUCCESS',
    balanceSheet,
  }
}

export const updateBalanceSheetFailure = (error: string|null): UpdateBalanceSheetFailureAction => {
  return {
    type: 'UPDATE_BALANCE_SHEET_FAILURE',
    error,
  }
}

export const loadBalanceSheetRequest = (): LoadBalanceSheetRequestAction => {
  return { type: 'LOAD_BALANCE_SHEET_REQUEST' }
}

export const loadBalanceSheetSuccess = (balanceSheet: BalanceSheetOverTime): LoadBalanceSheetSuccessAction => {
  return {
    type: 'LOAD_BALANCE_SHEET_SUCCESS',
    balanceSheet,
  }
}

export const loadBalanceSheetFailure = (error: string|null): LoadBalanceSheetFailureAction => {
  return {
    type: 'LOAD_BALANCE_SHEET_FAILURE',
    error,
  }
}

export const updateBalanceSheet = (balanceSheet: BalanceSheetOverTime): Thunk => {
  return dispatch => {
    dispatch(updateBalanceSheetRequest())
    return new Promise((resolve, reject) => {
      putObject(objectStore, balanceSheet, theOneAndOnlyKey).then(saved => {
        dispatch(updateBalanceSheetSuccess(saved))
        resolve(saved)
      }).catch(error => {
        dispatch(updateBalanceSheetFailure(error))
        reject(error)
      })
    })
  }
}

export const loadBalanceSheet = (): Thunk => {
  return dispatch => {
    dispatch(loadBalanceSheetRequest())
    return new Promise((resolve, reject) => {
      getObject(objectStore, theOneAndOnlyKey).then(balanceSheet => {
        dispatch(loadBalanceSheetSuccess(balanceSheet))
        resolve(balanceSheet)
      }).catch(error => {
        dispatch(loadBalanceSheetFailure(error))
        reject(error)
      })
    })
  }
}