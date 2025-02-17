import React, { Component, PropTypes } from 'react'
import Radium from 'radium'
import { connect } from 'react-redux'

import CommonFieldOptions from 'forms/CommonFieldOptions'

import editWidgetStyles from 'forms/editors/EditWidgetStyles'
import CheckInput from '../../components/forms/CheckInput'
import { Tooltip } from '../../components/ui';

@connect(({ forms, app }) => ({ forms, app }))
@Radium
export default class TextAreaEditor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      minLengthEnabled: props.field.props.minLength >= 0,
      maxLengthEnabled: props.field.props.maxLength >= 0,
      error: false
    }

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleMaxInput = this.handleMaxInput.bind(this)
    this.handleMinInput = this.handleMinInput.bind(this)
  }
  extendFieldProps(attrs){
    const { field, onEditorChange } = this.props
    onEditorChange({
      ...field,
      props: {
        ...field.props,
        ...attrs
      }
    })
  }
  deleteFieldProp(prop) {
    const { field, onEditorChange } = this.props
    const { [prop]:v, ...props } = field.props
    onEditorChange({
      ...field,
      props
    })
  }
  handleInputChange(value, prop) {
    this.extendFieldProps({
      [prop]: Number(value)
    })
  }
  handleMaxInput(e) {
    const maxValue = e.target.value;
    const { minLength } = this.props.field.props
    const { minLengthEnabled, maxLengthEnabled } = this.state
    const error = minLengthEnabled && maxLengthEnabled && maxValue < minLength

    if (!error) {
      this.handleInputChange(maxValue, 'maxLength')
    }

    this.setState({
      error: error
    })
  }
  handleMinInput(e) {
    const minValue = e.target.value;
    const { maxLength } = this.props.field.props
    const { minLengthEnabled, maxLengthEnabled } = this.state
    const error = minLengthEnabled && maxLengthEnabled && minValue > maxLength

    if (!error) {
      this.handleInputChange(minValue, 'minLength')
    }

    this.setState({
      error: error
    })
  }
  handleCheckboxChange(e, prop) {
    this.setState({
      [`${prop}Enabled`]: e.target.checked
    })

    if (!e.target.checked) {
      this.deleteFieldProp(prop)
    } else {
      this.handleInputChange(0, prop)
    }
  }
  onIncludeInGroups(e) {
    this.extendFieldProps({
      includeInGroups: e.target.checked
    })
  }
  render() {
    const { handleMinInput, handleMaxInput, props, state } = this;
    const { field } = props
    const { minLengthEnabled, maxLengthEnabled, error } = state

    return (
      <div>
        {
          error
            ? <span style={ [styles.error] }> {`Min. Chars can't be greater than Max. Chars`} </span>
            : null
        }
        <div style={styles.bottomOptions}>
          <div style={styles.bottomOptionsLeft}>
            <CheckInput
              className="form-min-limit"
              label={'Min. Chars'}
              enabled={minLengthEnabled}
              handleCheckbox={ (e) => this.handleCheckboxChange(e, 'minLength') }
              handleInput={handleMinInput}
              defaultValue={field.props.minLength}
            />
            <CheckInput
              className="form-max-limit"
              label={'Max. Chars'}
              enabled={maxLengthEnabled}
              handleCheckbox={ (e) => this.handleCheckboxChange(e, 'maxLength') }
              handleInput={handleMaxInput}
              defaultValue={field.props.maxLength}
            />
            <Tooltip htmlFor="includeInGroups"  text="Include these answers in grouped submissions">
              <label style={styles.bottomCheck}>
                <input type="checkbox"
                  className="form-include-in-groups"
                  onChange={ (e) => this.onIncludeInGroups(e) }
                  value={ field.props.includeInGroups }
                  checked={ field.props.includeInGroups } />
                  Include in Groups (API)
              </label>
            </Tooltip>
          </div>
          <CommonFieldOptions
            {...this.props}
          />
        </div>
      </div>
    );
  }

}

const styles = {
  error: {
    color: 'red',
    display: 'block',
    fontSize: '12px'
  },
  page: {
    backgroundColor: '#F7F7F7'
  },
  bottomCheck: {
    display: 'inline-block',
    fontSize: '10pt',
    marginBottom: '20px',
    cursor: 'pointer',
    lineHeight: '30px',
    marginRight: '5px'
  },
  bottomOptions: {
    display: 'flex',
    width: '100%'
  },
  bottomOptionsLeft: {
    flexGrow: '1'
  },
  bottomOptionsRight: {
    textAlign: 'right',
    flexGrow: '1'
  },
  bottomCheckTextInput: {
    display: 'inline-block',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    marginLeft: '10px',
    fontSize: '12pt',
    width: '50px',
    textAlign: 'center',
    padding: '4px'
  },
  disabled: {
    color: '#AAA'
  }

};
