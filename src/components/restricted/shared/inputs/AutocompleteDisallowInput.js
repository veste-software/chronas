import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash.get'
import isEqual from 'lodash.isequal'
import AutoComplete from 'material-ui/AutoComplete'
import { FieldTitle, translate} from 'admin-on-rest'

/**
 * An Input component for an autocomplete field, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property an the option text
 * @example
 * const choices = [
 *    { id: 'M', name: 'Male' },
 *    { id: 'F', name: 'Female' },
 * ];
 * <AutocompleteDisallowInput source="gender" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <AutocompleteDisallowInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <AutocompleteDisallowInput source="author_id" choices={choices} optionText={optionRenderer} />
 *
 * You can customize the `filter` function used to filter the results.
 * By default, it's `AutoComplete.fuzzyFilter`, but you can use any of
 * the functions provided by `AutoComplete`, or a function of your own
 * @see http://www.material-ui.com/#/components/auto-complete
 * @example
 * import { Edit, SimpleForm, AutocompleteDisallowInput } from 'admin-on-rest/mui';
 * import AutoComplete from 'material-ui/AutoComplete';
 *
 * export const PostEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <AutocompleteDisallowInput source="category" filter={AutoComplete.caseInsensitiveFilter} choices={choices} />
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * The choices are translated by default, so you can use translation identifiers as choices:
 * @example
 * const choices = [
 *    { id: 'M', name: 'myroot.gender.male' },
 *    { id: 'F', name: 'myroot.gender.female' },
 * ];
 *
 * However, in some cases (e.g. inside a `<ReferenceInput>`), you may not want
 * the choice to be translated. In that case, set the `translateChoice` prop to false.
 * @example
 * <AutocompleteDisallowInput source="gender" choices={choices} translateChoice={false}/>
 *
 * The object passed as `options` props is passed to the material-ui <AutoComplete> component
 *
 * @example
 * <AutocompleteDisallowInput source="author_id" options={{ fullWidth: true }} />
 */
export class AutocompleteDisallowInput extends Component {

  constructor (props) {
    super(props)
    this.state = {
      isValid: 0
    }
  }

  componentWillMount() {
    this.setSearchText(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.choices, nextProps.choices)) {
      return;
    }

    if (this.props.input.value !== nextProps.input.value) {
      this.setSearchText(nextProps)
    }
  }

  setSearchText(props) {
    const { choices, input, optionValue, translate } = props

    const selectedSource = choices.find(
      choice => get(choice, optionValue) === input.value
    )

    if (typeof selectedSource !== "undefined") {

    }
    // const searchText =
    //   (selectedSource && this.getSuggestion(selectedSource)) ||
    //   translate('aor.input.autocomplete.none')
    // this.setState({ searchText })
  }

  handleNewRequest = (chosenRequest, index) => {
    console.debug('wants to handle new request chosenRequest, index', chosenRequest, index)
    const { allowEmpty, choices, input, optionValue } = this.props
    let choiceIndex = allowEmpty ? index - 1 : index

    // The empty item is always at first position
    if (index !== 0) {
      this.setState({ isValid: 0 })
      return input.onChange('')
    }

    this.setState({ isValid: 1 })
    input.onChange(optionValue)
  };

  handleUpdateInput = searchText => {
    const { input, setFilter } = this.props
    const found = this.props.choices.filter(function(el) {
      return el.name === searchText
    }).length !== 0

    this.setState({ searchText })
    setFilter && setFilter(searchText)

    if (found) {
      this.setState({ isValid: 0 })
      return input.onChange('')
    } else {
      this.setState({ isValid: 1 })
      input.onChange(searchText)
    }
  };

  getSuggestion(choice) {
    const { optionText, translate, translateChoice } = this.props
    const choiceName =
      typeof optionText === 'function'
        ? optionText(choice)
        : get(choice, optionText)
    return translateChoice
      ? translate(choiceName, { _: choiceName })
      : choiceName
  }

  addAllowEmpty = choices => {
    const { allowEmpty, translate } = this.props

    if (allowEmpty) {
      return [
        {
          value: '',
          text: translate('aor.input.autocomplete.none'),
        },
        ...choices,
      ];
    }

    return choices
  };

  render() {
    const {
      choices,
      elStyle,
      filter,
      isRequired,
      label,
      meta,
      options,
      optionValue,
      resource,
      source,
    } = this.props;
    if (typeof meta === 'undefined') {
      throw new Error(
        "The AutocompleteDisallowInput component wasn't called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/admin-on-rest/Inputs.html#writing-your-own-input-component for details."
      );
    }
    const { touched, error } = meta;

    const dataSource = this.addAllowEmpty(
      choices.map(choice => ({
        value: get(choice, optionValue),
        text: this.getSuggestion(choice),
      }))
    );

    const validMessage = {
      0: 'Specify an original value, if you like to edit an existing resource click Edit Meta on top.',
      1: ''
    }

    return (
      <AutoComplete
        searchText={this.state.searchText}
        dataSource={dataSource}
        textFieldStyle={{ color: 'red' }}
        floatingLabelText={
          <FieldTitle
            label={label}
            source={source}
            resource={resource}
            isRequired={isRequired}
          />
        }
        filter={filter}
        onNewRequest={this.handleNewRequest}
        onUpdateInput={this.handleUpdateInput}
        openOnFocus
        style={elStyle}
        errorText={validMessage[this.state.isValid]}
        {...options}
      />
    );
  }
}

AutocompleteDisallowInput.propTypes = {
  addField: PropTypes.bool.isRequired,
  allowEmpty: PropTypes.bool.isRequired,
  choices: PropTypes.arrayOf(PropTypes.object),
  elStyle: PropTypes.object,
  filter: PropTypes.func.isRequired,
  input: PropTypes.object,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
  meta: PropTypes.object,
  options: PropTypes.object,
  optionElement: PropTypes.element,
  optionText: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
    .isRequired,
  optionValue: PropTypes.string.isRequired,
  resource: PropTypes.string,
  setFilter: PropTypes.func,
  source: PropTypes.string,
  translate: PropTypes.func.isRequired,
  translateChoice: PropTypes.bool.isRequired,
};

AutocompleteDisallowInput.defaultProps = {
  addField: true,
  allowEmpty: false,
  choices: [],
  filter: AutoComplete.fuzzyFilter,
  options: {},
  optionText: 'name',
  optionValue: 'id',
  translateChoice: true,
};

export default translate(AutocompleteDisallowInput);