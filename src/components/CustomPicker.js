/* eslint-disable prettier/prettier */
// CustomPicker.js
import React, {Component} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

export default class CustomPicker extends Component {
  state = {
    visible: false,
    loading: false,
  };

  open = async () => {
    const {onBeforeOpen, disabled} = this.props;
    if (disabled) {
        return;
    }

    if (onBeforeOpen) {
        try {
        this.setState({loading: true});
        // support sync / async
        const result = await onBeforeOpen();

        // kalau return false, cancel buka modal
        if (result === false) {
            this.setState({loading: false});
            return;
        }
        } catch (err) {
        console.warn('onBeforeOpen error:', err);
        this.setState({loading: false});
        return;
        }
        this.setState({loading: false});
    }

    // baru buka modal
    this.setState({visible: true});
    };

  close = () => this.setState({visible: false});

  handleValueChange = (val) => {
    const {onValueChange} = this.props;
    if (onValueChange) onValueChange(val);
    this.close();
  };

  renderLabel = () => {
    const {items = [], value, placeholder = 'Select...'} = this.props;
    const found = items.find((it) => it.value === value);
    return found ? found.label : placeholder;
  };

  renderOption = ({item}) => {
    const {value} = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.optionItem,
          value === item.value && styles.optionItemSelected,
        ]}
        onPress={() => this.handleValueChange(item.value)}>
        <Text
          style={[
            styles.optionText,
            value === item.value && styles.optionTextSelected,
          ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {visible, loading} = this.state;
    const {items = [], modalTitle = 'Select', disabled} = this.props;

    return (
      <View>
        {/* Trigger */}
        <TouchableOpacity
          style={[styles.trigger, disabled && styles.triggerDisabled]}
          onPress={this.open}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.triggerText,
              disabled && styles.triggerTextDisabled,
            ]}>
            {loading ? 'Loading...' : this.renderLabel()}
          </Text>
        </TouchableOpacity>

        {/* Modal */}
        <Modal
          visible={visible}
          transparent
          animationType="slide"
          onRequestClose={this.close}>
          <View style={styles.backdrop}>
            <View style={styles.modalBox}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{modalTitle}</Text>
                <TouchableOpacity onPress={this.close}>
                  <Text style={styles.modalClose}>Close</Text>
                </TouchableOpacity>
              </View>

              {/* FlatList untuk opsi */}
              <FlatList
                data={items}
                keyExtractor={(item) => `${item.value}`}
                renderItem={this.renderOption}
                contentContainerStyle={{paddingBottom: 16}}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  trigger: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  triggerDisabled: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  triggerText: {
    color: '#111827',
  },
  triggerTextDisabled: {
    color: '#9ca3af',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '60%', // biar scrollable
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 6,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalClose: {
    color: '#2563eb',
    fontWeight: '600',
  },
  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  optionItemSelected: {
    backgroundColor: '#f3f4f6',
  },
  optionText: {
    fontSize: 15,
    color: '#111827',
  },
  optionTextSelected: {
    fontWeight: '600',
    color: '#2563eb',
  },
});
