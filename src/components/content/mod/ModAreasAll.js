import React from 'react'
import {
  translate,
  BooleanField,
  Create,
  Datagrid,
  DateField,
  DateInput,
  DisabledInput,
  SingleFieldList,
  ChipField,
  EmailField,
  Filter,
  FormTab,
  Edit,
  Delete,SimpleForm,
  UrlField,
  NullableBooleanInput,
  NumberField,
  NumberInput,
  ReferenceManyField,
  ReferenceArrayField,
  TabbedForm,
  TextField,
  TextInput,
  LongTextInput,
  SelectArrayInput,
  required,
  minLength
} from 'admin-on-rest'
import { Link } from 'react-router-dom'
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import AssignAddEditNavigation from '../../restricted/shared/AssignAddEditNavigation'
import AutocompleteInput from '../../restricted/shared/inputs/AutocompleteInput'
import AreaForm from '../../restricted/shared/forms/AreaForm'
import utils from "../../map/utils/general"

export const ModAreasAll = (props) => {
  const selectedProvince = props.selectedItem.value || ''

  const defaultValues = {
    'provinces': [selectedProvince] || [],
    'dataRuler': (props.activeArea.data[selectedProvince] || {})[utils.activeAreaDataAccessor('ruler')] || '',
    'dataCulture': (props.activeArea.data[selectedProvince] || {})[utils.activeAreaDataAccessor('culture')] || '',
    'dataReligion': (props.activeArea.data[selectedProvince] || {})[utils.activeAreaDataAccessor('religion')] || '',
    'dataCapital': (props.activeArea.data[selectedProvince] || {})[utils.activeAreaDataAccessor('capital')] || '',
    'dataPopulation': (props.activeArea.data[selectedProvince] || {})[utils.activeAreaDataAccessor('population')] || 1000,
    'yearStart': props.selectedYear,
    'yearEnd': props.selectedYear,
  }

  const choicesRuler = Object.keys(props.metadata['ruler']).map((rulerId) => {
    return { id: rulerId, name: props.metadata['ruler'][rulerId][0]}
  }) || {}

  const choicesReligion = Object.keys(props.metadata['religion']).map((religionId) => {
    return { id: religionId, name: props.metadata['religion'][religionId][0]}
  }) || {}

  const validateValueInput = (values) => {
    const errors = {}

    if (JSON.stringify(values.provinces) === JSON.stringify(defaultValues.provinces) &&
      values.ruler === defaultValues.dataRuler &&
      values.culture === defaultValues.dataCulture &&
      values.religion === defaultValues.dataReligion &&
      // values.capital === defaultValues.dataCapital &&
      values.population === defaultValues.dataPopulation) {
      errors.ruler = ['At least one of ruler, culture, religion, capital or population is required']
    }
    if (!values.start) {
      errors.start = ['Start value is required']
    }
    if (values.start && values.end && values.start > values.end) {
      errors.end = ['End year must be higher than start year']
    }
    return errors
  }

  return <div>
    <AssignAddEditNavigation pathname={props.location.pathname} />
    <Divider/>
    <Create title='Assign Area' {...props}>
      <AreaForm validate={validateValueInput} {...props} >
          <Subheader>Provinces</Subheader>
          <SelectArrayInput options={{ fullWidth: true }} onChange={(val,v) => { props.setModData(v) }} validation={required} elStyle={{width: '60%', minWidth: '300px'}} defaultValue={defaultValues.provinces} source="provinces" label="resources.areas.fields.province_list" />
          <Subheader>Data</Subheader>
        {/*<TextInput source="ruler" choices={choicesRuler} defaultValue={defaultValues.dataRuler} label="resources.areas.fields.ruler" />*/}
          <AutocompleteInput options={{ fullWidth: true }} source="ruler" choices={choicesRuler} defaultValue={defaultValues.dataRuler} label="resources.areas.fields.ruler" />
          <TextInput options={{ fullWidth: true }} source="culture" defaultValue={defaultValues.dataCulture} label="resources.areas.fields.culture" />
        {/*<TextInput source="religion" choices={choicesReligion} label="resources.areas.fields.religion" defaultValue={defaultValues.dataReligion} />*/}
          <AutocompleteInput options={{ fullWidth: true }} source="religion" choices={choicesReligion} label="resources.areas.fields.religion" defaultValue={defaultValues.dataReligion} />
          <TextInput options={{ fullWidth: true }} source="capital" defaultValue={defaultValues.dataCapital} label="resources.areas.fields.capital" />
          <NumberInput options={{ fullWidth: true }} source="population" defaultValue={+defaultValues.dataPopulation} label="resources.areas.fields.population" />
          <Subheader>Year Range</Subheader>
          <NumberInput style={{ width: '50%', float: 'left' }} validation={required} source="start" defaultValue={defaultValues.yearStart} label="resources.areas.fields.startYear" />
          <NumberInput style={{ width: '50%', float: 'right' }} source="end" defaultValue={defaultValues.yearEnd} label="resources.areas.fields.endYear" />
    </AreaForm>
    </Create>
  </div>
};
