import React from 'react'
import {
  XAxis,
  YAxis,
  FlexibleWidthXYPlot,
  HorizontalGridLines,
  GradientDefs,
  AreaSeries,
  LineMarkSeries,
  VerticalRectSeries,
  Crosshair
} from 'react-vis'
import { themes } from '../../../properties'

export default class InfluenceChart extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      idSetup: '',
      crosshairValues: [],
      currentYearMarkerValues: [],
      crosshairStartValues: [],
      crosshairEndValues: [],
      series: [],
      sortedData: []
    }
    this._mouseClick = this._mouseClick.bind(this)
    this._nearestXHandler = this._nearestXHandler.bind(this)
    this._mouseLeaveHandler = this._mouseLeaveHandler.bind(this)
    this._formatCrosshairItems = this._formatCrosshairItems.bind(this)
    this._formatCrosshairTitle = this._formatCrosshairTitle.bind(this)
  }

  /**
   * Event handler for onNearestX.
   * @param {Object} value Selected value.
   * @param {number} index Index of the series.
   * @private
   */
  _nearestXHandler (value, { event, innerX, index }) {
    const { series } = this.state
    if (this.props.epicMeta) {
      this.setState({
        crosshairValues: series.map((s, i) => {
          return { ...s[0].data[index], left: value.left, top: ((s[0].data[index] || {}).top || 0) + '%' }
        })
      })
    } else {
      this.setState({
        crosshairValues: series[0].map((s, i) => {
          return { ...s.data[index], top: ((s.data[index] || {}).top || 0) + ((i !== 2) ? '' : '%') }
        })
      })
    }
  }

  /**
   * Event handler for onMouseLeave.
   * @private
   */
  _mouseLeaveHandler () {
    this.setState({ crosshairValues: [] })
  }

  _mouseClick (value, e) {
    if ((((this.state || {}).crosshairValues || {})[0] || {}).left) this.props.setYear(+this.state.crosshairValues[0].left)
  }

  /**
   * Format the title line of the crosshair.
   * @param {Array} values Array of values.
   * @returns {Object} The caption and the value of the title.
   * @private
   */
  _formatCrosshairTitle (values) {
    return {
      title: 'Year',
      value: values[0].left
    }
  }

  /**
   * A callback to format the crosshair items.
   * @param {Object} values Array of values.
   * @returns {Array<Object>} Array of objects with titles and values.
   * @private
   */
  _formatCrosshairItems (values) {
    const { rulerProps, epicMeta } = this.props
    const { series } = this.state

    if (epicMeta) {
      return values.map((v, i) => {
        return {
          title: ((rulerProps || {})[i] || {})[0],
          value: v.top
        }
      })
    } else {
      return values.map((v, i) => {
        return {
          title: series[0][i].title,
          value: v.top
        }
      })
    }
  }

  componentDidMount = () => {
    const { newData, epicMeta, selectedYear } = this.props
    const newId = (newData[0] || {}).id
    if (((newData || [])[0] || {}).data) {
      this._setupData(newData, epicMeta, selectedYear, newId)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { newData, epicMeta, selectedYear } = nextProps
    const newId = (newData[0] || {}).id
    if (((newData || [])[0] || {}).data &&
      (newId !== ((this.props.newData || [])[0] || {}).id ||
        (newId !== this.state.idSetup) ||
      selectedYear !== this.props.selectedYear)) {
      this._setupData(newData, epicMeta, selectedYear, newId)
    }
  }

  _setupData = (newData, epicMeta, selectedYear, newId) => {
    this.setState({ idSetup: newId })
    const nextSeries = newData.map((seriesEl) => seriesEl.data)

    const currentYearMarkerValues = epicMeta
      ? nextSeries.map((s, i) => {
        const nearestYear = s[0]
          .data.map(y => +y.left).reduce(function (prev, curr) {
          return (Math.abs(+curr - +selectedYear) < Math.abs(+prev - +selectedYear) ? +curr : +prev)
        },Infinity).toString()
        const topObj = s[0].data.filter(f => f.left === nearestYear)[0]
        return {
          left: selectedYear,
          top: topObj ? (topObj.top + ((i !== 2) ? '' : '%')) : ''
        }
      })
      : newData[0].data.map((s, i) => {
        const nearestYear = s.data.map(y => +y.left).reduce(function (prev, curr) {
          return (Math.abs(+curr - +selectedYear) < Math.abs(+prev - +selectedYear) ? +curr : +prev)
        }).toString()
        const topObj = s.data.filter(f => f.left === nearestYear)[0]
        return {
          left: selectedYear,
          top: topObj ? (topObj.top + ((i !== 2) ? '' : '%')) : ''
        }
      })

    const crosshairStartValues = epicMeta ? [{
      left: +epicMeta.start
    }] : undefined
    const crosshairEndValues = epicMeta ? [{
      left: +epicMeta.end || +epicMeta.start
    }] : undefined

    this.setState({
      sortedData: newData[0].data[0].data.map((el) => { if (!isNaN(el.left)) return el.left }).sort((a, b) => +a - +b),
      series: nextSeries,
      currentYearMarkerValues,
      crosshairStartValues,
      crosshairEndValues
    })
  }

  render () {
    const { series, crosshairValues, currentYearMarkerValues, crosshairStartValues, crosshairEndValues, sortedData } = this.state
    const { chartIcons, rulerProps, selectedYear, epicMeta } = this.props

    if (!sortedData || sortedData.length === 0) return null

    const entityColor = (epicMeta && epicMeta.start) ? 'red' : (rulerProps || {})[1] || 'blue'
    const xDomain = (epicMeta && epicMeta.start) ? [(+epicMeta.start - 50), ((+epicMeta.end || +epicMeta.start) + 50)] : [sortedData[0], sortedData[sortedData.length - 1]]

    return (
      <div>
        <div className='influenceChart'>
          <FlexibleWidthXYPlot
            animation
            getX={d => d.left}
            getY={d => d.top}
            onClick={this._mouseClick}
            onMouseLeave={this._mouseLeaveHandler}
            xDomain={xDomain}
            height={(epicMeta) ? 256 : 200}>
            <HorizontalGridLines />
            <GradientDefs>
              { epicMeta ? rulerProps.map((rulerEl, i) => <linearGradient key={'CoolGradient' + i} id={'CoolGradient' + i} x1='0' x2='0' y1='0' y2='1'>
                <stop offset='0%' stopColor={(rulerEl || {})[1] || 'grey'} stopOpacity={0.8} />
                <stop offset='100%' stopColor='white' stopOpacity={0.3} />
              </linearGradient>) : <linearGradient id='CoolGradient0' x1='0' x2='0' y1='0' y2='1'>
                <stop offset='0%' stopColor={entityColor} stopOpacity={0.8} />
                <stop offset='100%' stopColor='white' stopOpacity={0.3} />
              </linearGradient> }
            </GradientDefs>
            <YAxis
              orientation='left' title='Population'
              tickSizeInner={0}
              tickSizeOuter={8}
            />
            <XAxis
              tickSizeInner={0}
              tickSizeOuter={8}
            />
            {series.map((seriesEl, i) => <LineMarkSeries key={'LineMarkSeries' + i}
              color={epicMeta ? ((rulerProps || {})[i] || {})[1] || 'grey' : (rulerProps || {})[1]}
              data={epicMeta ? (seriesEl[0] || {}).data : (seriesEl[2] || {}).data}
              curve='curveMonotoneX'
              onNearestX={this._nearestXHandler} />
            )}
            {series.map((seriesEl, i) => <AreaSeries key={'AreaSeries' + i}
              color={'url(#CoolGradient' + i + ')'}
              curve='curveMonotoneX'
              data={epicMeta ? (seriesEl[0] || {}).data : (seriesEl[2] || {}).data} />
            )}
            { epicMeta && <Crosshair
              className='startMarker'
              itemsFormat={this._formatCrosshairItems}
              titleFormat={this._formatCrosshairTitle}
              values={crosshairStartValues} />}
            { epicMeta && <Crosshair
              className='endMarker'
              itemsFormat={this._formatCrosshairItems}
              titleFormat={this._formatCrosshairTitle}
              values={crosshairEndValues} />}
            <Crosshair
              itemsFormat={this._formatCrosshairItems}
              titleFormat={this._formatCrosshairTitle}
              values={crosshairValues} />
            <Crosshair
              className='currentYearMarker'
              itemsFormat={this._formatCrosshairItems}
              titleFormat={this._formatCrosshairTitle}
              values={currentYearMarkerValues} />
            { chartIcons.map((el, index) => {
            return <Crosshair

              className={(epicMeta) ? 'timelineIconBig' : 'timelineIconSmall'}
              itemsFormat={this._formatCrosshairItems}
              titleFormat={this._formatCrosshairTitle}
              values={[{
                left: +el.date,
              }]}>
              <div>
                <img title={el.name} src={"/images/transparent.png"} className={(index % 3) ? 'battleIcon1' : 'battleIcon2'} />
              </div>
            </Crosshair>})}
          </FlexibleWidthXYPlot>
        </div>
      </div>
    )
  }
}
