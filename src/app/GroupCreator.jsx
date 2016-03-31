import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';

import settings from 'settings';

import {userSelected} from 'users/UsersActions';
import {fetchCommentsByUser} from 'comments/CommentsActions';
import {saveQueryFromState} from 'groups/GroupActions';
import { fetchAllTags } from 'tags/TagActions';
import { makeQueryFromState } from 'groups/GroupActions';
import {
  fetchSections,
  fetchAuthors
} from 'filters/FiltersActions';

import Page from 'app/layout/Page';
import ContentHeader from 'components/ContentHeader';
import UserList from 'users/UserList';
import UserDetail from 'users/UserDetail';
import GroupFilters from 'groups/GroupFilters';
import Button from 'components/Button';
import FaFloopyO from 'react-icons/lib/fa/floppy-o';
import Modal from 'components/modal/Modal';
import TextField from 'components/forms/TextField';

@connect(state => ({
  groups: state.groups,
  comments: state.comments,
  users: state.users
}))
@Radium
export default class GroupCreator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {saveModalOpen: false};
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  // only the first time
  componentWillMount() {
    // redirect user to /login if they're not logged in
    //   TODO: refactor: pass in a function that calculates auth state
    if (window.requireLogin && !this.props.groups.authorized) {
      let {router} = this.context;
      return router.push('/login');
    }

    /* set up the initial default / unfiltered view, this was previously in UserFilters */
    this.props.dispatch(fetchAllTags());
    this.props.dispatch(fetchSections());
    this.props.dispatch(fetchAuthors());
    this.props.dispatch(makeQueryFromState('user'));
  }

  updateUser(user) {
    this.props.dispatch(userSelected(user));
    this.props.dispatch(fetchCommentsByUser(user._id));
  }

  openModal() {
    this.setState({saveModalOpen: true});
  }

  cancelSave() {
    this.setState({saveModalOpen: false});
  }

  confirmSave() {
    // all the code triggered here needs to be moved to a xenia package
    const randomId = Math.floor(Math.random() * 99999);
    this.props.dispatch(saveQueryFromState(`Group ${randomId}`, 'Sample group description'));
    // show a saving icon or something?
  }

  render() {

    return (

      <Page>

        <ContentHeader title={ window.L.t('Search Creator') } />

        <div style={styles.base}>
          <div style={styles.filters}>
            <GroupFilters userOnly={true}/>
          </div>

          <div style={styles.rightPanel}>
            <Button onClick={this.openModal.bind(this)} category="primary" style={{float: 'right'}}>
              Save Search <FaFloopyO style={styles.saveIcon} />
            </Button>
            <div style={styles.userListContainer}>
              <UserList
                style={styles.userList}
                loadingQueryset={this.props.groups.loadingQueryset}
                users={this.props.groups.users} userSelected={this.updateUser.bind(this)} />
              <UserDetail
                commentsLoading={this.props.comments.loading}
                user={this.props.users.selectedUser}
                comments={this.props.comments.items}
                style={styles.userDetail} />
            </div>
          </div>

        </div>

        <Modal
          isOpen={this.state.saveModalOpen}
          confirmAction={this.confirmSave.bind(this)}
          cancelAction={this.cancelSave.bind(this)}>
          <TextField label="Name" />
          <p style={styles.modalLabel}>Description</p>
          <textarea style={styles.descriptionInput}></textarea>
          <TextField label="Tag Commenters" />
        </Modal>

      </Page>
    );
  }
}
const styles = {
  base: {
    display: 'flex',
    minHeight: 250,
    justifyContent: 'flex-start',
    flexWrap: 'no-wrap'
  },
  rightPanel: {
    flex: 1
  },
  userListContainer: {
    marginTop: 5,
    height: '100%',
    minWidth: 400,
    '@media (max-width: 1000px)': {
      marginLeft: -20
    },
    display: 'flex',
    width: '100%'
  },
  userDetail: {
    flex: 2,
    paddingLeft: 20,
    marginLeft: 20
  },
  userList: {
    minWidth: 350,
    maxWidth: 350,
    flex: 1,
    float: 'left'
  },
  modalLabel: {
    fontSize: 16,
    marginTop: 16
  },
  descriptionInput: {
    padding: 8,
    fontSize: 20,
    minHeight: 120,
    border: '1px solid ' + settings.mediumGrey,
    borderRadius: 3
  },
  saveIcon: {
    width: 25,
    height: 25
  },
  filters: {
    '@media (max-width: 1000px)': {
      'width': '100%'
    }
  }
};
