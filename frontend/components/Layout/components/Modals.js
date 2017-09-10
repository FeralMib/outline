// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Modal from 'components/Modal';
import UiStore from 'stores/UiStore';
import CollectionNew from 'scenes/CollectionNew';
import CollectionEdit from 'scenes/CollectionEdit';
import KeyboardShortcuts from 'scenes/KeyboardShortcuts';
import Settings from 'scenes/Settings';

@observer class Modals extends Component {
  props: {
    ui: UiStore,
  };

  handleClose = () => {
    this.props.ui.clearActiveModal();
  };

  render() {
    const { activeModalName, activeModalProps } = this.props.ui;

    return (
      <span>
        <Modal
          isOpen={activeModalName === 'create-collection'}
          onRequestClose={this.handleClose}
          title="Create a collection"
        >
          <CollectionNew onSubmit={this.handleClose} {...activeModalProps} />
        </Modal>
        <Modal
          isOpen={activeModalName === 'edit-collection'}
          onRequestClose={this.handleClose}
          title="Edit collection"
        >
          <CollectionEdit onSubmit={this.handleClose} {...activeModalProps} />
        </Modal>
        <Modal
          isOpen={activeModalName === 'keyboard-shortcuts'}
          onRequestClose={this.handleClose}
          title="Keyboard shortcuts"
        >
          <KeyboardShortcuts />
        </Modal>
        <Modal
          isOpen={activeModalName === 'settings'}
          onRequestClose={this.handleClose}
          title="Settings"
        >
          <Settings />
        </Modal>
      </span>
    );
  }
}

export default Modals;
