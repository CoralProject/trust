import React, { PropTypes } from 'react'
import Radium from 'radium'

const CheckInput = ({ label, enabled, handleCheckbox, handleInput, defaultValue, className }) => (
  <label style={styles.bottomCheck} className={className} >
    <input
      type="checkbox"
      checked={enabled}
      onChange={handleCheckbox}
      defaultValue={enabled}
    />
    <span style={ [ styles.bottomLabelText, enabled ? '' : styles.disabled ] }>
      {label}
    </span>
    <input
      onChange={handleInput}
      defaultValue={defaultValue}
      type="number"
      min="0"
      step="1"
      disabled={!enabled}
      style={ [ styles.bottomCheckTextInput, !enabled ? styles.disabled : '' ] }
    />
  </label>
)

CheckInput.propTypes = {
  label: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  handleCheckbox: PropTypes.func.isRequired,
  handleInput: PropTypes.func.isRequired
}

CheckInput.defaultProps = {
  label: "Label",
  enabled: false,
  defaultValue: 0
}

const styles = {
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
    display: 'inline',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    marginLeft: '10px',
    fontSize: '12pt',
    width: '50px',
    textAlign: 'center',
    padding: '4px',
    ':focus': {
      outline: 'none'
    }
  },
  bottomLabelText: {
    height: '30px',
    display: 'inline-block'
  },
  disabled: {
    color: '#AAA'
  }
}
export default Radium(CheckInput)
