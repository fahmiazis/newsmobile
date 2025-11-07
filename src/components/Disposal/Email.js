/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Platform,
  Image,
  FlatList,
  Button,
  Dimensions,
  Picker,
} from 'react-native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconAwe from 'react-native-vector-icons/FontAwesome';
import IconMateri from 'react-native-vector-icons/MaterialIcons';

class EmailDisposal extends Component {
    state = {
        message: '',
        subject: '',
    }

    onEnter = (val) => {
        const data = {
            message: val,
        };
        this.setState(data);
        setTimeout(() => {
            const {message, subject} = this.state;
            this.props.handleData({message: message, subject: subject});
         }, 500);
    }

    formatCurrency = (val) => {
      if (!val) {return '';}
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    componentDidMount() {
      const { draftEmail } = this.props.tempmail;
      const {detailDis} = this.props.disposal;
      const cek = draftEmail.result;
      const stat = detailDis[0].status_form;
      const no = detailDis[0].no_disposal;
      const message = cek === undefined ? '' : `${cek.message} (${no})`;
      const subject = cek === undefined ? '' : `${cek.type === 'submit' ? '' : cek.type} ${cek.menu} NO ${no}`;
      this.setState({message: message, subject: subject});
      this.props.handleData({message: message, subject: subject});
    }

  render() {
    const {detailDis} = this.props.disposal;
    const { type } = this.props.typeEmail;
    const { draftEmail, dataResmail } = this.props.tempmail;
    const statMail = this.props.statMail || '';
    return (
      <View style={styles.overlayModal}>
        <View style={styles.popupContainerModal}>
          <ScrollView style={styles.scrollContentModal}>
              {/* Header */}
              <View style={styles.headerContainerModal}>
                  <Text style={styles.headerTitleModal}>Email Pemberitahuan</Text>
                  <Text style={styles.headerSubModal}>{detailDis.length > 0 ? detailDis[0].no_disposal : ''}</Text>
              </View>

              {/* Info Utama */}
              <View style={styles.infoCardModal}>
                <Text style={styles.infoTextModal}>To:</Text>
                <View style={styles.bodyCc}>
                  {draftEmail.to.length === undefined ? (
                    <View style={styles.ccEmail}>
                      <IconAwe style={styles.iconEmail} name="check-square" size={15} color={'blue'}/>
                      <Text style={styles.nameEmail}>{`${draftEmail.to.role.name}: ${draftEmail.to.fullname}`}</Text>
                    </View>
                  ) : draftEmail.to.length > 0 && draftEmail.to.map(item => {
                      return (
                        <View key={item.id} style={styles.ccEmail}>
                          <IconAwe style={styles.iconEmail} name="check-square" size={15} color={'blue'}/>
                          <Text style={styles.nameEmail}>{`${item.role.name}: ${item.fullname}`}</Text>
                        </View>
                      )
                    })
                  }
                </View>

                <Text>{''}</Text>
                <Text style={styles.infoTextModal}>Cc:</Text>
                <View style={styles.bodyCc}>
                    {draftEmail.cc.length !== 0 && draftEmail.cc.map(item => {
                        return (
                            <View key={item.id} style={styles.ccEmail}>
                                <IconAwe style={styles.iconEmail} name="check-square" size={15} color={'blue'}/>
                                <Text style={styles.nameEmail}>{`${item.role.name}: ${item.fullname}`}</Text>
                            </View>
                        )
                    })}
                </View>
              </View>

              {/* Subject & Message */}
              <Text style={styles.sectionTitleModal}>Subject</Text>
              <TextInput
                style={styles.subjectEmail}
                multiline={true}
                // onChangeText={(val) => this.setState({ alasan: val })}
                editable={false}
                value={this.state.subject}
              />

              <Text style={styles.sectionTitleModal}>Message</Text>
              <TextInput
                style={styles.subjectEmail}
                multiline={true}
                onChangeText={(val) => this.onEnter(val)}
                value={this.state.message}
              />

              {/* Daftar Asset */}
              <Text style={styles.sectionTitleModal}>Daftar Asset</Text>
              {detailDis.length > 0 && detailDis.map((item, index) => (
                <View key={index} style={styles.assetCardModal}>
                  <Text style={styles.assetTitleModal}>{item.nama_asset}</Text>
                  <View style={styles.assetRowModal}>
                    <Text style={styles.assetLabelModal}>No Asset:</Text>
                    <Text style={styles.assetValueModal}>{item.no_asset}</Text>
                  </View>
                  <View style={styles.assetRowModal}>
                    <Text style={styles.assetLabelModal}>Type/Merk:</Text>
                    <Text style={styles.assetValueModal}>{item.merk === null ? '-' : item.merk}</Text>
                  </View>
                  <View style={styles.assetRowModal}>
                    <Text style={styles.assetLabelModal}>Kategori:</Text>
                    <Text style={styles.assetValueModal}>{item.kategori === null ? '-' : item.kategori}</Text>
                  </View>
                  <View style={styles.assetRowModal}>
                    <Text style={styles.assetLabelModal}>Nilai Buku:</Text>
                    <Text style={styles.assetValueModal}>Rp {item.nilai_buku === null ? '-' : this.formatCurrency(item.nilai_buku)}</Text>
                  </View>
                  <View style={styles.assetRowModal}>
                    <Text style={styles.assetLabelModal}>Nilai Jual:</Text>
                    <Text style={styles.assetValueModal}>Rp {item.nilai_jual === null ? '-' : this.formatCurrency(item.nilai_jual)}</Text>
                  </View>
                  <View style={styles.assetRowModal}>
                    {/* <Text style={styles.assetLabelModal}>Keterangan:</Text> */}
                    <Text style={[styles.assetValueModal, { marginVertical: 10 }]}>{item.keterangan}</Text>
                  </View>
                </View>
              ))}
          </ScrollView>

          <View style={styles.footerModal}>
            <TouchableOpacity
              style={[styles.buttonModal, styles.btnColorClose]}
              onPress={() => this.props.handleSubmit()}
            >
              <Text style={styles.buttonTextModal}>{type === undefined ? '' : `${type} &`} Send Email</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerModal}>
            <TouchableOpacity
              style={[styles.buttonModal, styles.btnColorSec]}
              onPress={() => this.props.handleClose()}
            >
              <Text style={styles.buttonTextModal}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
    overlayModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popupContainerModal: {
    width: '95%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    elevation: 10,
  },
  scrollContentModal: {
    marginBottom: 10,
  },
  headerContainerModal: {
    backgroundColor: '#e53935',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  headerTitleModal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubModal: {
    fontSize: 12,
    color: '#f9d6d5',
    textAlign: 'center',
    marginTop: 4,
  },
  infoCardModal: {
    backgroundColor: '#fbe9e7',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  infoTextModal: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  sectionTitleModal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
    color: '#e53935',
  },
  assetCardModal: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f1f1f1',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  assetTitleModal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#e35d5b',
    marginBottom: 6,
  },
  assetRowModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  assetLabelModal: {
    fontSize: 13,
    color: '#666',
  },
  assetValueModal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    flexWrap: 'wrap',
  },
  sectionModal: {
    marginTop: 10,
  },
  smallTextModal: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  footerModal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonModal: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  btnColorProses: {
    backgroundColor: '#2196F3',
  },
  btnColorClose: {
    backgroundColor: '#e53935',
  },
  btnColorReject: {
    backgroundColor: '#dc3545',
  },
  btnColorApprove: {
    backgroundColor: '#28a745',
  },
  btnColorTrack: {
    backgroundColor: '#FFC107',
  },
  btnColorSec: {
    backgroundColor: '#6B7280',
  },
  buttonTextModal: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  ccEmail: {
    marginRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameEmail: {
    color: '#666',
  },
  iconEmail: {
    marginRight: 2,
  },
  bodyCc: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subjectEmail: {
    height: 'auto',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    textAlignVertical: 'top',
    marginTop: 5,
    borderRadius: 10,
  },
  messageEmail: {
    height: 'auto',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    textAlignVertical: 'top',
    marginTop: 5,
    borderRadius: 10,
  },
};

const mapStateToProps = (state) => ({
  disposal: state.disposal,
  menu: state.menu,
  reason: state.reason,
  tempmail: state.tempmail,
});

export default connect(mapStateToProps)(EmailDisposal);
