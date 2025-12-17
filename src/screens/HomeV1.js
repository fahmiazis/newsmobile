import React, { Component } from 'react';
import { View, TouchableOpacity, RefreshControl, TextInput, Dimensions, Platform,
  Text, StyleSheet, ImageBackground, Image, ScrollView } from 'react-native';
import { db } from '../helpers/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import imgBackground from '../assets/bckHome.jpg';
import io from '../assets/io.png';
import disposal from '../assets/dis.png';
import mutasi from '../assets/mutasis.png';
import stock from '../assets/opname.png';
import IconAwe from 'react-native-vector-icons/FontAwesome5';
import Modal from 'react-native-modal';

import {connect} from 'react-redux';
import user from '../redux/actions/user';
import newnotif from '../redux/actions/newnotif';
import auth from '../redux/actions/auth';
import dashboard from '../redux/actions/dashboard';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const { width } = Dimensions.get('window');
const numColumns = 2;
const cardWidthList = (width / numColumns) - 50;

class Home extends Component {
  state = {
    items: [],
    onRefresh: false,
    selectedYear: moment().startOf('month'),
    showDate: false,
    modalChange: false,
  };

  componentDidMount() {
    this.getDataDashboard();
  }

  getDataDashboard = async () => {
    const token = this.props.auth.token;
    const {selectedYear} = this.state;
    await this.props.getDashboard(token, moment(selectedYear).format('YYYY'));
    this.cekUser();
  }

  cekUser = async () => {
    const {dataUser, token, chplant, listUser} = this.props.auth;
    console.log(dataUser);
    const level = dataUser.user_level;
    const cekUser = listUser.length;
    const idUser = dataUser.id;
    const cekPlant = chplant === undefined || chplant === null || chplant === '';
    await this.props.getDetailUser(token, idUser);
    const { detailUser } = this.props.user;
    if (level == '50' && detailUser.status_request === 2) {
      this.prosesRelog();
    } else if (level == '50' && detailUser.status_request === 1) {
      this.prosesOpenInfo();
    } else if (level == '50') {
      await this.props.getDepo(token, 1000, '');
      await this.props.getRole(token, '');
      this.prosesOpenRequest();
    } else if (cekUser > 1 && cekPlant) {
      this.prosesOpenChange();
    }
  }
  // componentWillUnmount() {
  //   this.getData()
  // }

  changeUser = async (val) => {
    const {token} = this.props.auth;
    await this.props.getToken(token, val.id);

    const {dataToken} = this.props.auth;
    console.log(dataToken);
    console.log(val);
    const chPlant = (val.kode_plant === undefined || val.kode_plant === null || val.kode_plant === '') ? val.username : val.kode_plant;
    await this.props.getAllNewNotif(dataToken.Token);
    const dataSelect = {
      data: {
        ...val,
        role: val.role.name,
      },
      token: dataToken.Token,
      chplant: chPlant,
    };
    await this.props.setDataUser(dataSelect);
    this.setState({modalChange: false});
  }


  prosesOpenChange = async (val) => {
    const {token, dataUser} = this.props.auth;
    // await this.props.getLogin(token, dataUser.id);
    this.openChange();
  }

  openChange = () => {
    this.setState({modalChange: !this.state.modalChange});
  }

  refreshPage = async () => {
    this.setState({onRefresh: true});
    const token = this.props.auth.token;
    await this.props.getAllNewNotif(token);
    this.setState({onRefresh: false});
  }

  getData = async () => {
      const token = this.props.auth.token;
      await this.props.getAllNewNotif(token);
  }

  goRoute = (val) => {
    this.props.navigation.navigate(`${val}`);
  }

  setDate = (event, selectedDate, type) => {
    this.setState({showDate: false});
    if (selectedDate) {
      this.setState({selectedYear: selectedDate});
      this.getDataDashboard();
    }
  };

  render() {
    const { items, selectedYear, showDate } = this.state;
    const { dataDashboard } = this.props.dashboard;
    const { dataUser, listUser } = this.props.auth;
    console.log(dataUser);
    const level = dataUser.user_level;
    const loadingDashboard = this.props.dashboard.isLoading;
    const loadingAuth = this.props.auth.isLoading;
    const loadingUser = this.props.user.isLoading;
    const loadingNewnotif = this.props.newnotif.isLoading;

    const loadingAll = false;

    return (
      <ImageBackground
          source={imgBackground}
          style={styles.bg}
          resizeMode="cover"
      >
        <ScrollView
          style={styles.container}
          refreshControl={
              <RefreshControl refreshing={this.state.onRefresh} onRefresh={this.refreshPage} />
          }
        >

          <Text style={styles.title}>Asset Mobile</Text>
          <Text style={styles.subtitle}>Please select an option</Text>

          <View style={styles.filterContainer}>
            {/* <Text style={styles.filterLabel}>Select Year:</Text>
            <TextInput
              style={styles.yearInput}
              value={selectedYear.toString()}
              keyboardType="numeric"
              onChangeText={(text) => this.setState({ selectedYear: text })}
            /> */}
            <Text>Selected Year:</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => this.setState({showDate: true})}>
              <Text style={styles.dateButtonText}>
                 {moment(selectedYear).format('YYYY')}
              </Text>
            </TouchableOpacity>
          </View>

          {showDate && (
            <DateTimePicker
              value={new Date(selectedYear)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, date) => this.setDate(e, date, 'from')}
            />
          )}

          <View style={styles.body}>
            {/* Pengadaan */}
            <TouchableOpacity style={styles.assetCard} >
              <Image source={io} style={styles.watermark} />
              <Text style={styles.cardTitle}>Pengadaan Aset</Text>
              {(dataDashboard.length > 0 && dataDashboard.filter(x => x.transaksi === 'pengadaan').length > 0 ? dataDashboard.filter(x => x.transaksi === 'pengadaan') : [1]).map(item => {
                return (
                  <View style={styles.statsContainer} key={item === 1 ? 1 : item.transaksi}>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Total</Text>
                      <Text style={styles.statsValue}>{item === 1 ? 0 : item.totalData}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Finished</Text>
                      <Text style={styles.statsValue}>{item === 1 ? 0 : item.finished}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>In progress</Text>
                      <Text style={styles.statsValue}>{item === 1 ? 0 : (item.totalData - (item.finished + item.rejected + item.revisi))}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Rejected</Text>
                      <Text style={styles.statsValue}>{item === 1 ? 0 : item.rejected}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Revisi</Text>
                      <Text style={styles.statsValue}>{item === 1 ? 0 : item.revisi}</Text>
                    </View>
                  </View>
                );
              })}
              <TouchableOpacity style={styles.btnDetail} onPress={() => this.goRoute('PengadaanTab')}>
                <Text style={styles.txtBtn}>Detail</Text>
              </TouchableOpacity>
              {/* <Image source={io} style={styles.imgCard} />
              <Text>Pengadaan Aset</Text> */}
            </TouchableOpacity>
            <TouchableOpacity style={styles.assetCard}>
              <Image source={disposal} style={styles.watermark} />
              <Text style={styles.cardTitle}>Disposal Aset</Text>
              {(dataDashboard.length > 0 && dataDashboard.filter(x => x.transaksi === 'disposal').length > 0 ? dataDashboard.filter(x => x.transaksi === 'disposal') : [1]).map(item => {
                return (
                  <View style={styles.statsContainer} key={item === 1 ? 1 : item.transaksi}>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Total</Text>
                      <Text style={styles.statsValue}>{item === 1 ? 0 : item.totalData}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Finished</Text>
                      <Text style={styles.statsValue}>{item === 1 ? 0 : item.finished}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>In progress</Text>
                      <Text style={styles.statsValue}>{item === 1 ? 0 : (item.totalData - (item.finished + item.rejected + item.revisi))}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Rejected</Text>
                      <Text style={styles.statsValue}>{item === 1 ? 0 : item.rejected}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Revisi</Text>
                      <Text style={styles.statsValue}>{item === 1 ? 0 : item.revisi}</Text>
                    </View>
                  </View>
                );
              })}
              <TouchableOpacity style={styles.btnDetail} onPress={() => this.goRoute('DisposalTab')}>
                <Text style={styles.txtBtn}>Detail</Text>
              </TouchableOpacity>
              {/* <Image source={disposal} style={styles.imgCard} />
              <Text>Disposal Aset</Text> */}
            </TouchableOpacity>
            <TouchableOpacity style={styles.assetCard} >
              <Image source={stock} style={styles.watermark} />
              <Text style={styles.cardTitle}>Stock Opname Aset</Text>
              {(dataDashboard.length > 0 && dataDashboard.filter(x => x.transaksi === 'stock opname').length > 0 ? dataDashboard.filter(x => x.transaksi === 'stock opname') : [1]).map(item => {
                return (
                  <View style={styles.statsContainer} key={item === 1 ? 1 : item.transaksi}>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Total</Text>
                      <Text style={styles.statsValue}>{item === 1 ? 0 : item.totalData}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Finished</Text>
                      <Text style={styles.statsValue}>{item === 1 ? 0 : item.finished}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>In progress</Text>
                      <Text style={styles.statsValue}>{item === 1 ? 0 : (item.totalData - (item.finished + item.rejected + item.revisi))}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Rejected</Text>
                      <Text style={styles.statsValue}>{item === 1 ? 0 : item.rejected}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Revisi</Text>
                      <Text style={styles.statsValue}>{item === 1 ? 0 : item.revisi}</Text>
                    </View>
                  </View>
                );
              })}
              <TouchableOpacity style={styles.btnDetail} onPress={() => this.goRoute('StockTab')}>
                <Text style={styles.txtBtn}>Detail</Text>
              </TouchableOpacity>
              {/* <Image source={stock} style={styles.imgCard} />
              <Text>Stock Opname Aset</Text> */}
            </TouchableOpacity>
            <TouchableOpacity style={styles.assetCard} >
              <Image source={mutasi} style={styles.watermark} />
              <Text style={styles.cardTitle}>Mutasi Aset</Text>
              {(dataDashboard.length > 0 && dataDashboard.filter(x => x.transaksi === 'mutasi').length > 0 ? dataDashboard.filter(x => x.transaksi === 'mutasi') : [1]).map(item => {
                return (
                  <View style={styles.statsContainer} key={item === 1 ? 1 : item.transaksi}>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Total</Text>
                      <Text style={styles.statsValue}>{item === 1 ? 0 : item.totalData}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Finished</Text>
                      <Text style={styles.statsValue}>{item === 1 ? 0 : item.finished}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>In progress</Text>
                      <Text style={styles.statsValue}>{item === 1 ? 0 : (item.totalData - (item.finished + item.rejected + item.revisi))}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Rejected</Text>
                      <Text style={styles.statsValue}>{item === 1 ? 0 : item.rejected}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Revisi</Text>
                      <Text style={styles.statsValue}>{item === 1 ? 0 : item.revisi}</Text>
                    </View>
                  </View>
                );
              })}
              <TouchableOpacity style={styles.btnDetail} onPress={() => this.goRoute('MutasiTab')}>
                <Text style={styles.txtBtn}>Detail</Text>
              </TouchableOpacity>
              {/* <Image source={mutasi} style={styles.imgCard} />
              <Text>Mutasi Aset</Text> */}
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Modal
          style={{ margin: 0 }}
          isVisible={this.state.modalChange}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          onBackdropPress={this.openChange}
          useNativeDriver={true}
        >
          <View style={styles.overlayModal}>
            <View style={styles.popupContainerModal}>

              {/* Header */}
              <View style={styles.headerContainerModal}>
                <Text style={styles.headerTitleModal}>Please select your user</Text>
              </View>

              <View style={styles.rowCard}>
                {listUser !== undefined && listUser.length > 0 && listUser.map(item => {
                  return (
                    <TouchableOpacity
                      style={[styles.userCard, { width: cardWidthList }, styles.normal]}
                      onPress={() => this.changeUser(item)}
                    >
                      <IconAwe name="user" size={100}  />
                      <View style={[styles.nameContainerCard, styles.normal]}>
                        <Text style={styles.nameTextCard} numberOfLines={2}>{item.username}{(level == '5' || level == '9') ? `-${item.kode_plant}` : ''}</Text>
                      </View>
                  </TouchableOpacity>
                  );
                })}

              </View>
            </View>
          </View>
        </Modal>
        <Modal
          style={{margin: 0}}
          isVisible={loadingAll}
          animationIn="fadeIn"
          animationOut="fadeOut"
          backdropOpacity={0.4}
          useNativeDriver={true}
        >
          <View style={styles.overlayModal}>
            <View style={styles.popupContainerInfo}>
              <ScrollView style={styles.scrollContentModal}>
                <View style={styles.sectionInfo}>
                  <IconAwe name="spinner" size={50}/>
                  <Text style={styles.sectionTitleInfo}>Waiting.....</Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  bg: {
    flex: 1,
  },
  body: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  assetCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    padding: 12,
    marginBottom: 12,
    width: width / 2.3,   // otomatis 2 kolom
    minHeight: 200,       // biar gak kependekan
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  statsContainer: {
    marginTop: 6,
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  statsLabel: {
    fontSize: 12,
    color: '#333',
  },
  statsValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111',
  },
  watermark: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.2,
    resizeMode: 'contain',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111',
    alignSelf: 'flex-start',
  },
  btnDetail: {
    marginTop: 'auto',   // tombol selalu di bawah
    height: 32,
    backgroundColor: '#e35d5b',
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
  },
  txtBtn: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 10,
  },
  yearInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 80,
    textAlign: 'center',
  },
  dateButton: {
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    width: width * 0.2,   // fleksibel sesuai layar
  },
  dateButtonText: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },

  //modal info
  popupContainerInfo: {
    width: '95%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 10,
    elevation: 10,
  },
  sectionInfo: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  sectionTitleInfo: {
    fontSize: 14,
    marginTop: 10,
    fontWeight: 'bold',
  },

  // modal detail
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
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  buttonDoc: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
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
  btnColorSec: {
    backgroundColor: '#6B7280',
  },
  btnColorSelect: {
    backgroundColor: 'rgba(235, 87, 87, 0.85)',
  },
  buttonTextModal: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // body card
  containerCard: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  rowCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
    padding: 2,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 10,
  },
  imageCard: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  nameContainerCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 6,
    marginBottom: 8,
    width: '100%',
  },
  nameTextCard: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  detailTextCard: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
    alignSelf: 'flex-start',
  },
  buttonCard: {
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  btnLabel: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'flex-end',
    width: 40,
    height: 20,
    borderRadius: 5,
    backgroundColor: '#2196F3',
    opacity: 0.7,
    marginRight: 10,
    justifyContent: 'center',
  },
  normal: {
    backgroundColor: '#fff',
  },
});

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.user,
    newnotif: state.newnotif,
    dashboard: state.dashboard,
});

const mapDispatchToProps = {
    updateUser: user.updateUser,
    reset: user.resetError,
    logout: auth.logout,
    changePassword: user.changePassword,
    getAllNewNotif: newnotif.getAllNewNotif,
    getDashboard: dashboard.getDashboard,
    setDataUser: auth.setDataUser,
    getLogin: auth.getLogin,
    getDetailUser: user.getDetailUser,
    getToken: auth.getToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
