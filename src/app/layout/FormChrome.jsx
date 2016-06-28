import React, {PropTypes} from 'react';
import Radium from 'radium';
import _ from 'lodash';
import Select from 'react-select';
import Badge from 'components/Badge';
import color from 'color';

import settings from 'settings';

@Radium
export default class FormChrome extends React.Component {

  static propTypes = {
    name: PropTypes.string,
    activeTab: PropTypes.oneOf(['builder', 'submissions', 'gallery']).isRequired,
    form: PropTypes.object,
    gallery: PropTypes.object,
    updateStatus: PropTypes.func
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  buildForm() { // navigate to the form builder or editor
    if (this.props.activeTab === 'builder') return;

    if (this.props.form) { // edit the current form
      return this.context.router.push(`/forms/${this.props.form.id}`);
    }

    // build a new form
    this.context.router.push('/forms/create');
  }

  reviewSubmissions() {
    if (this.props.activeTab === 'submissions' || !this.props.form) return;

    this.context.router.push(`/forms/${this.props.form.id}/submissions`);
  }

  manageGallery() {
    if (this.props.activeTab === 'gallery' || !this.props.form) return;

    this.context.router.push(`/forms/${this.props.form.id}/gallery`);
  }

  galleryBadge() {
    return this.props.gallery ? <Badge style={styles.badge} count={this.props.gallery.answers.length} /> : '';
  }

  submissionBadge() {
    return this.props.submissions ? <Badge style={styles.badge} count={this.props.submissions.length} /> : '';
  }

  render() {

    const name = _.has(this.props, 'form.header.title') ? this.props.form.header.title : 'Untitled Form';

    const statusOptions = [
      {label: 'Open', value: 'open'},
      {label: 'Closed', value: 'closed'}
    ];

    return (
      <div style={styles.base}>
        <div style={styles.menu}>

          <div style={styles.formName}>{name}</div>

          <div style={styles.formControls}>
            <div key="huey" style={[
              styles.option,
              this.props.activeTab === 'builder' && styles.active]}
              onClick={this.buildForm.bind(this)}>
              {this.props.form ? 'Edit Form' : 'Build Form'}
            </div>
            <div key="dewey" style={[
              styles.option,
              this.props.activeTab === 'submissions' && styles.active,
              !this.props.form && styles.disabled]}
              onClick={this.reviewSubmissions.bind(this)}>
              Submissions {this.submissionBadge()}
            </div>
            <div key="louie" style={[
              styles.option,
              this.props.activeTab === 'gallery' && styles.active,
              !this.props.form && styles.disabled]}
              onClick={this.manageGallery.bind(this)}>
              Gallery {this.galleryBadge()}
            </div>
          </div>

          <div style={styles.statusSelect}>
            <Select
              options={statusOptions}
              style={styles.statusPicker}
              value={this.props.form && this.props.form.status}
              onChange={this.props.updateStatus} />
          </div>

        </div>

      </div>
    );
  }
}

const styles = {
  base: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -50,
    padding: 5
  },
  formName: {
    color: 'white',
    padding: 10,
    fontWeight: 'bold',
    fontSize: '20px',
    cursor: 'auto',
    ':hover': {
      backgroundColor: 'transparent'
    }
  },

  formControls: {
    display: 'flex'
  },

  menu: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  option: {
    fontSize: '16px',
    transition: 'all 300ms',
    cursor: 'pointer',
    borderRadius: 4,
    marginRight: 5,
    padding: '12px 12px 0 12px',
    color: 'white',
    backgroundColor: 'transparent',
    ':hover': {
      backgroundColor: color(settings.brandColor).darken(0.1).hexString()
    }
  },
  active: {
    backgroundColor: settings.brandColor,
    color: 'white'
  },
  disabled: {
    display: 'none'
  },
  statusSelect: {
    width: 110
  },
  badge: {
    backgroundColor: color(settings.brandColor).darken(0.2).hexString(),
    fontSize: '14px',
    color: 'white'
  }
};
