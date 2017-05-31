// @flow

import React from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import type { Dispatch } from 'redux'

import { loadBalanceSheet, updateBalanceSheet } from 'actions/balanceSheet'
import { DateFormat, formatDollars } from 'types/commonTypes'
import DateSlider from 'components/DateSlider/DateSlider'
import type { GlobalState } from 'store'
import type { AssetState } from 'reducers/assets'
import type { BalanceSheetState } from 'reducers/balanceSheet'

type Props = {
  assets: AssetState,
  balanceSheet: BalanceSheetState,
  dispatch: Dispatch
}
type State = {
  date: string,
}

class Portfolio extends React.Component {
  props: Props
  state: State
  handleDateChange: (date: string) => void

  constructor(props: Props) {
    super(props)
    if (this.props.balanceSheet.fresh === false) {
      this.props.dispatch(updateBalanceSheet(this.props.assets.objects, {}, '2017-05-28', '2027-05-28'))
    } else if (this.props.balanceSheet.status === 'uninitialised') {
      this.props.dispatch(loadBalanceSheet())
    }
    this.state = { date: '2018-05-28' }

    this.handleDateChange = this.handleDateChange.bind(this)
  }

  handleDateChange(date: string): void {
    this.setState(() => ({ date }))
  }

  render() {
    const date = moment(this.state.date)
    const balanceSheet = typeof this.props.balanceSheet.balanceSheet === 'object'
      ? this.props.balanceSheet.balanceSheet[this.state.date]
      : undefined
    const dates = typeof this.props.balanceSheet.balanceSheet === 'object'
      ? Object.keys(this.props.balanceSheet.balanceSheet)
      : []

    return (
      <div className='portfolio'>
        <DateSlider dates={dates} onChange={this.handleDateChange} />
        <DatePicker showYearDropdown dateFormat={DateFormat} selected={date} onChange={moment => this.setState({ date: moment.format(DateFormat) })} />
        <div className='assets'>
          <Link to='/portfolio/assets'>Assets</Link>
          <span className='assets-total'>{balanceSheet ? formatDollars(balanceSheet.totalAssets) : '?'}</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: GlobalState) => {
  return {
    assets: state.assets,
    balanceSheet: state.balanceSheet,
  }
}

export default connect(mapStateToProps)(Portfolio)
