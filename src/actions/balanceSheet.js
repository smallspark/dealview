// @flow

import { putObject, getObject } from 'db/db'
import { balanceSheetOverTime } from 'types/balanceSheet'
import type { BalanceSheetOverTime } from 'types/balanceSheet'
import type { AssetMap } from 'types/assets/asset'
import type { LiabilityMap } from 'types/liabilities/liability'
import type { Thunk } from 'types/commonTypes'

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
  type: 'UPDATE_BALANCE_SHEET_REQUEST',
  assets: AssetMap,
  liabilities: LiabilityMap,
  startDate: string,
  endDate: string,
}
type UpdateBalanceSheetSuccessAction = {
  type: 'UPDATE_BALANCE_SHEET_SUCCESS',
  balanceSheet: BalanceSheetOverTime,
}
type UpdateBalanceSheetFailureAction = {
  type: 'UPDATE_BALANCE_SHEET_FAILURE',
  error: string|null,
}

type InvalidateBalanceSheetAction = {
  type: 'INVALIDATE_BALANCE_SHEET'
}

export type BalanceSheetAction = LoadBalanceSheetRequestAction
                               | LoadBalanceSheetSuccessAction
                               | LoadBalanceSheetFailureAction
                               | UpdateBalanceSheetRequestAction
                               | UpdateBalanceSheetSuccessAction
                               | UpdateBalanceSheetFailureAction
                               | InvalidateBalanceSheetAction

export const updateBalanceSheetRequest = (assets: AssetMap, liabilities: LiabilityMap, startDate: string, endDate: string): UpdateBalanceSheetRequestAction => {
  return {
    type: 'UPDATE_BALANCE_SHEET_REQUEST',
    assets,
    liabilities,
    startDate,
    endDate,
  }
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

export const invalidateBalanceSheet = (): InvalidateBalanceSheetAction => {
  return { type: 'INVALIDATE_BALANCE_SHEET' }
}

export const updateBalanceSheet = (assets: AssetMap, liabilities: LiabilityMap,
                                   startDate: string, endDate: string): Thunk => {
  return dispatch => {
    dispatch(updateBalanceSheetRequest(assets, liabilities, startDate, endDate))
    return new Promise(async (resolve, reject) => {
      try {
        const balanceSheet = await balanceSheetOverTime(assets, liabilities, startDate, endDate)
        const saved = await putObject(objectStore, balanceSheet, theOneAndOnlyKey)
        dispatch(updateBalanceSheetSuccess(saved))
        resolve(saved)
      } catch (error) {
        dispatch(updateBalanceSheetFailure(error))
        reject(error)
      }
    })
  }
}

export const loadBalanceSheet = (): Thunk => {
  return dispatch => {
    dispatch(loadBalanceSheetRequest())
    return new Promise(async (resolve, reject) => {
      try {
        const balanceSheet = await getObject(objectStore, theOneAndOnlyKey)
        dispatch(loadBalanceSheetSuccess(balanceSheet))
        resolve(balanceSheet)
      } catch (error) {
        dispatch(loadBalanceSheetFailure(error))
        reject(error)
      }
    })
  }
}
