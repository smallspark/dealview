/* global expect */

import { balanceSheetOverTime } from './balanceSheet.js'
import { validAssetWithId1, validAssetWithId2 } from '../test/fixtures/asset.js'

describe('balanceSheetOverTime', () => {
  const assets = {
    [validAssetWithId1.id]: validAssetWithId1,
    [validAssetWithId2.id]: validAssetWithId2
  }
  const liabilities = {}

  it('should return correct results', () => {
    const result = balanceSheetOverTime(assets, liabilities, '2014-01-01', '2017-01-01')
    expect(result).toMatchSnapshot()
  })
})
