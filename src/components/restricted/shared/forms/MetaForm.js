import React, { Children, Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
// import getDefaultValues from './getDefaultValues';
// import FormInput from './FormInput';
// import Toolbar from './Toolbar';
import getDefaultValues from 'admin-on-rest/lib/mui/form/getDefaultValues'
import FormInput from 'admin-on-rest/lib/mui/form/FormInput'
import Toolbar from 'admin-on-rest/lib/mui/form/Toolbar'
// import { crudUpdate as crudUpdateAction } from 'admin-on-rest'
// import { Toolbar, FormInput, getDefaultValues } from 'admin-on-rest';
import { setModType, setModData } from '../buttons/actionReducers'
import { setToken } from '../../../menu/authentication/actionReducers'
import properties from '../../../../properties'
import decodeJwt from 'jwt-decode'
import { showNotification } from 'admin-on-rest'
const formStyle = { padding: '0 1em 1em 1em' }

export class MetaForm extends Component {
  handleSubmitWithRedirect = (redirect = this.props.redirect, value) =>
    this.props.handleSubmit(values => {
      console.debug(this.props)

      const { initialValues } = this.props

      const nextBodyByType = {
        ruler: [values.name, values.color, values.url],
        culture: [values.name, values.color, values.url],
        religion: [values.name, values.color, values.url],
        capital: values.url,
        province: values.url
      }

      const bodyToSend = {}
      const metadataItem = values.type
      bodyToSend['subEntityId'] = values.select || values.name
      bodyToSend['nextBody'] = nextBodyByType[metadataItem]

      const token = localStorage.getItem('token')
      fetch(properties.chronasApiHost + '/metadata/' + metadataItem + '/single', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyToSend)
      })
        .then((res) => {
          if (res.status === 200) {
            console.debug(res, this.props)
            this.props.showNotification((redirect === 'edit') ? 'Metadata successfully updated' : 'Metadata successfully added')
            setModType('')
            this.props.history.goBack()
            // this.props.save(values, redirect)
            // // this.props.history.push('/article')
            // this.props.handleClose()
            // this.forceUpdate()
          } else {
            this.props.showNotification((redirect === 'edit') ? 'Metadata not updated' : 'Metadata not added', 'warning')
          }
        })
    });

  componentWillUnmount () {
    const { setModType } = this.props
    setModType('')
  }

  componentDidMount () {
    const { setModType, selectedItem, setModData } = this.props
    const selectedProvince = selectedItem.province
    if (selectedProvince) setModData([selectedProvince])
    setModType('metadata')

    // const currLocation = this.props.location.pathname
    // const selectedProvinces = currLocation.split("/mod/areas/")[1]
    // if (typeof selectedProvinces !== "undefined" && selectedProvinces !== "") {
    //   this.props.change ("provinces" , selectedProvinces)
    //   selectedProvinces.split(",").forEach( (prov) => this.props.addModData(prov) )
    // }
  }

  render () {
    const {
      basePath,
      children,
      invalid,
      record,
      resource,
      submitOnEnter,
      toolbar,
      version,
    } = this.props

    return (
      <form className='simple-form'>
        <div style={formStyle} key={version}>
          {Children.map(children, input => (
            <FormInput
              basePath={basePath}
              input={input}
              record={record}
              resource={resource}
            />
          ))}
        </div>
        {toolbar &&
        React.cloneElement(toolbar, {
          handleSubmitWithRedirect: this.handleSubmitWithRedirect,
          invalid,
          submitOnEnter,
        })}
      </form>
    )
  }
}

MetaForm.propTypes = {
  basePath: PropTypes.string,
  children: PropTypes.node,
  defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  handleSubmit: PropTypes.func, // passed by redux-form
  invalid: PropTypes.bool,
  record: PropTypes.object,
  resource: PropTypes.string,
  redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
  submitOnEnter: PropTypes.bool,
  toolbar: PropTypes.element,
  validate: PropTypes.func,
  version: PropTypes.number,
}

MetaForm.defaultProps = {
  submitOnEnter: true,
  toolbar: <Toolbar />,
}

const enhance = compose(
  connect((state, props) => ({
    initialValues: getDefaultValues(state, props),
    modActive: state.modActive,
    selectedYear: state.selectedYear,
    selectedItem: state.selectedItem,
  }),
    {
      // crudUpdate: crudUpdateAction,
      setModType,
      setModData,
      showNotification
    }),
  reduxForm({
    form: 'record-form',
    enableReinitialize: true,
  }),
)
export default enhance(MetaForm)