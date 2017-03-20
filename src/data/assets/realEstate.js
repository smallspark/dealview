// @flow

import moment from 'moment'

import { getDatabase, save as saveToDatabase, load as loadFromDatabase, loadAll as loadAllFromDatabase } from '../database.js'
import { AddressEmpty } from '../commonTypes.js'
import { ValuationsEmpty } from '../../components/forms/ValuationsInput.js'
import type { Values } from '../database.js'
import type { AddressValues } from '../commonTypes.js'
import type { Valuation, Valuations } from '../../components/forms/ValuationsInput.js'
import type { AssetValues } from './asset.js'

export type RealEstateValues = {
  id: string,
  name: string,
  address: AddressValues,
  notes: string,
  valuations: Valuations
}

export const RealEstateEmpty = {
  id: '',
  name: '',
  address: AddressEmpty,
  notes: '',
  valuations: ValuationsEmpty
}

export const save = (values: Values): Promise<string> => {
  return saveToDatabase('Asset.RealEstate', values)
}

export const load = (id: string): Promise<RealEstateValues> => {
  return loadFromDatabase('Asset.RealEstate', id)
}

export const loadAll = (): Promise<RealEstateValues[]> => {
  return loadAllFromDatabase('Asset.RealEstate')
}

export const assetSubscriber = (eventType: string, content: RealEstateValues): void => {
  getAssetRecord(content.id).then(existingAsset => {
    const lastValuation = content.valuations.length > 0
      ? content.valuations.slice().sort(compareValuationsByDate)[0].amount : null
    const asset: AssetValues = {
      type: 'RealEstate',
      instanceId: content.id,
      name: content.name
    }
    if (lastValuation) { asset.lastValuation = lastValuation }
    if (existingAsset) { asset.id = existingAsset.id }
    saveToDatabase('Asset', asset).catch(error => { console.error(error) })
  })
}

const compareValuationsByDate = (a: Valuation, b: Valuation): number => {
  const [milliA, milliB] = [a, b].map(v => { return v.date ? moment(v.date).valueOf() : 0 })
  return milliA - milliB
}

const getAssetRecord = (realEstateId: string): Promise<AssetValues|false> => {
  return new Promise((resolve, reject) => {
    getDatabase().then(db => {
      const transaction = db.transaction(['Asset'], 'readonly')
      const store = transaction.objectStore('Asset')
      const index = store.index('type, instanceId')
      const request = index.get(['RealEstate', realEstateId])
      request.onsuccess = event => { resolve(event.target.result) }
      request.onerror = () => { resolve(false) }
    })
  })
}
