import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import LayersIcon from 'material-ui/svg-icons/maps/layers';
import { Link } from 'react-router-dom';
import pure from 'recompose/pure';
import { connect } from 'react-redux'
import compose from 'recompose/compose';
import { translate, defaultTheme } from 'admin-on-rest';
import { toggleRightDrawer as toggleRightDrawerAction } from './actionReducers';
import { chronasMainColor } from '../../styles/chronasColors'
import { tooltip } from '../../styles/chronasStyleComponents'

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: '100%',
    padding: '8px 4px',
  },
  iframe: {
    display: 'block',
    padding: '2px 8px',
    border: 'none'
  }
};

const Content = ({ toggleRightDrawer, hasDashboard, selectedItem, onRightTap, resources, translate }) => (
  <div style={styles.main}>
    <iframe style={styles.iframe} src={"http://en.wikipedia.org/wiki/" + selectedItem + "?printable=yes"}
            height="100%" frameBorder="0"></iframe>
  </div>
);

Content.propTypes = {
  translate: PropTypes.func.isRequired,
};

Content.defaultProps = {
  onContentTap: () => null,
};

const enhance = compose(
  connect(state => ({
    theme: state.theme,
    locale: state.locale,
    selectedItem: state.selectedItem,
    rightDrawerOpen: state.rightDrawerOpen,
  }), {
    toggleRightDrawer: toggleRightDrawerAction,
  }),
  pure,
  translate,
);

export default enhance(Content);
