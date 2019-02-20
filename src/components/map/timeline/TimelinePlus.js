import vis from 'vis/dist/vis-timeline-graph2d.min'
import 'vis/dist/vis-timeline-graph2d.min.css'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import difference from 'lodash/difference'
import intersection from 'lodash/intersection'
import each from 'lodash/each'
import omit from 'lodash/omit'
import keys from 'lodash/keys'

const noop = function () {}
const events = [
  'click',
  // 'contextmenu',
  // 'doubleClick',
  // 'groupDragged',
  // 'changed',
  'rangechange',
  'rangechanged',
  // 'select',
  // 'timechange',
  // 'timechanged',
  // 'mouseOver',
  'mouseMove',
  // 'itemover',
  // 'itemout',
]

const eventPropTypes = {}
const eventDefaultProps = {}

each(events, event => {
  eventPropTypes[event] = PropTypes.func
  eventDefaultProps[`${event}Handler`] = noop
})

export default class TimelinePlus extends Component {
  constructor (props) {
    super(props)
    this.state = {
      customTimes: [],
    }
  }

  componentWillUnmount () {
    this.$el.destroy()
  }

  componentDidMount () {
    const { container } = this.refs

    this.$el = new vis.Timeline(container, undefined, this.props.options)

    events.forEach(event => {
      this.$el.on(event, this.props[`${event}Handler`])
    })

    this.init()
  }

  // componentDidUpdate() {
  //   this.init()
  // }

  componentWillReceiveProps (nextProps) {
    const { items, groups, options, selection, selectionOptions = {}, customTimes,
      animate = true,
    } = nextProps

    const itemsChange = items !== this.props.items
    const groupsChange = groups !== this.props.groups
    const optionsChange = options !== this.props.options
    const customTimesChange = customTimes !== this.props.customTimes
    const selectionChange = selection !== this.props.selection

    if (groupsChange) {
      if (groups.length > 0) {
        const groupsDataset = new vis.DataSet()
        groupsDataset.add(groups)
        this.$el.setGroups(groupsDataset)
      }
    }

    if (itemsChange) {
      this.$el.setItems(items)
    }

    if (optionsChange) {
      let timelineOptions = options

      if (animate) {
        // If animate option is set, we should animate the timeline to any new
        // start/end values instead of jumping straight to them
        timelineOptions = omit(options, 'start', 'end')

        this.$el.setWindow(options.start, options.end, {
          animation: animate,
        })
      }

      this.$el.setOptions(timelineOptions)
    }

    if (selectionChange) {
      this.$el.setSelection(selection, selectionOptions)
    }

    if (customTimesChange) {
      // diff the custom times to decipher new, removing, updating
      const customTimeKeysPrev = keys(this.state.customTimes)
      const customTimeKeysNew = keys(customTimes)
      const customTimeKeysToAdd = difference(
        customTimeKeysNew,
        customTimeKeysPrev
      )
      const customTimeKeysToRemove = difference(
        customTimeKeysPrev,
        customTimeKeysNew
      )
      const customTimeKeysToUpdate = intersection(
        customTimeKeysPrev,
        customTimeKeysNew
      )

      // NOTE this has to be in arrow function so context of `this` is based on
      // this.$el and not `each`
      each(customTimeKeysToRemove, id => this.$el.removeCustomTime(id))
      each(customTimeKeysToAdd, id => {
        const datetime = customTimes[id]
        this.$el.addCustomTime(datetime, id)
      })
      each(customTimeKeysToUpdate, id => {
        const datetime = customTimes[id]
        this.$el.setCustomTime(datetime, id)
      })

      // store new customTimes in state for future diff
      this.setState({ customTimes })
    }

    // return (
    //   itemsChange ||
    //   groupsChange ||
    //   optionsChange ||
    //   customTimesChange ||
    //   selectionChange
    // )
  }

  init () {
    const {
      items,
      groups,
      options,
      selection,
      selectionOptions = {},
      customTimes,
      animate = true,
      currentTime,
    } = this.props

    let timelineOptions = options

    if (animate) {
      // If animate option is set, we should animate the timeline to any new
      // start/end values instead of jumping straight to them
      timelineOptions = omit(options, 'start', 'end')

      this.$el.setWindow(options.start, options.end, {
        animation: animate,
      })
    }

    this.$el.setOptions(timelineOptions)

    if (groups.length > 0) {
      const groupsDataset = new vis.DataSet()
      groupsDataset.add(groups)
      this.$el.setGroups(groupsDataset)
    }

    this.$el.setItems(items)
    this.$el.setSelection(selection, selectionOptions)

    if (currentTime) {
      this.$el.setCurrentTime(currentTime)
    }

    // diff the custom times to decipher new, removing, updating
    const customTimeKeysPrev = keys(this.state.customTimes)
    const customTimeKeysNew = keys(customTimes)
    const customTimeKeysToAdd = difference(
      customTimeKeysNew,
      customTimeKeysPrev
    )
    const customTimeKeysToRemove = difference(
      customTimeKeysPrev,
      customTimeKeysNew
    )
    const customTimeKeysToUpdate = intersection(
      customTimeKeysPrev,
      customTimeKeysNew
    )

    // NOTE this has to be in arrow function so context of `this` is based on
    // this.$el and not `each`
    each(customTimeKeysToRemove, id => this.$el.removeCustomTime(id))
    each(customTimeKeysToAdd, id => {
      const datetime = customTimes[id]
      this.$el.addCustomTime(datetime, id)
    })
    each(customTimeKeysToUpdate, id => {
      const datetime = customTimes[id]
      this.$el.setCustomTime(datetime, id)
    })

    // store new customTimes in state for future diff
    this.setState({ customTimes })
  }

  render () {
    return <div ref='container' />
  }
}

TimelinePlus.propTypes = {
    items: PropTypes.array,
    groups: PropTypes.array,
    options: PropTypes.object,
    selection: PropTypes.array,
    customTimes: PropTypes.shape({
      datetime: PropTypes.instanceOf(Date),
      id: PropTypes.string,
    }),
    animate: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    currentTime: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
      PropTypes.number,
    ]),
    ...eventPropTypes,
}

TimelinePlus.defaultProps = {
    items: [],
    groups: [],
    options: {},
    selection: [],
    customTimes: {},
    ...eventDefaultProps,
}
