/* eslint-disable prettier/prettier */
/* eslint-disable radix */
import React, {Component} from 'react';
import {
  View, Text, ScrollView, Picker,
  TextInput, TouchableOpacity, RefreshControl,
  StyleSheet, Platform, Image,
  Button, Dimensions,
} from 'react-native';
import {Radio, Label} from 'native-base';
import { RNCamera } from 'react-native-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconAwe from 'react-native-vector-icons/FontAwesome5';
import IconMateri from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

import depo from '../../redux/actions/depo';
import stock from '../../redux/actions/stock';
import tempmail from '../../redux/actions/tempmail';
import newnotif from '../../redux/actions/newnotif';
import user from '../../redux/actions/user';
import pengadaan from '../../redux/actions/pengadaan';
import report from '../../redux/actions/report';
import dokumen from '../../redux/actions/dokumen';

import blankImg from '../../assets/blank.png';
import placeholder from '../../assets/placeholder.png';

import EmailModal from '../../components/Stock/Email';
import ModalDokumen from '../../components/ModalDokumen';
import TrackingModal from '../../components/Stock/Tracking';
import CustomPicker from '../../components/CustomPicker';

import {API_URL} from '@env';

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth / numColumns) - 20;
const cardWidthList = (screenWidth / numColumns) - 50;

class RevisiStock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      // time1: new Date(),
      // time2: new Date(),
      showDateFrom: false,
      showDateTo: false,
      status: '',
      time: 'pilih',
      time1: moment().subtract(1, 'month').startOf('month'),
      // time1: moment().startOf('month').format('DD-MM-YYYY'),
      time2: moment().endOf('month'),
      search: '',
      limit: 100,
      newStock: [],
      listStock: [],
      filter: 'available',
      openDetail: false,
      realApp: [],
      barcode: null,
      modalScan: false,
      listMut: [],
      modalTrack: false,
      modalApprove: false,
      openDraft: false,
      subject: '',
      message: '',
      modalConfirm: false,
      confirm: '',
      modalReject: false,
      selectedValue: 'option1',
      listStat: [],
      typeReject: '',
      menuRev: '',
      tipeEmail: '',
      dataRej: {},
      alasan: '',
      modalDokumen: false,
      modalSubmit: false,
      reason: '',
      total: 0,
      detailData: {},
      isModalVisible: false,
      keterangan: '',
      listStatus: [],
    };
  }

  chekApp = (val) => {
    const { listMut } = this.state;
    listMut.push(val);
    this.setState({ listMut: listMut });
  }

  chekRej = (val) => {
    const { listMut } = this.state;
    const data = [];
    for (let i = 0; i < listMut.length; i++) {
        if (listMut[i] === val) {
            data.push();
        } else {
            data.push(listMut[i]);
        }
    }
    this.setState({ listMut: data });
  }

  statusApp = (val) => {
        const { listStat } = this.state;
        listStat.push(val);
        this.setState({ listStat: listStat });
    }

  statusRej = (val) => {
    const { listStat } = this.state;
    const data = [];
    for (let i = 0; i < listStat.length; i++) {
        if (listStat[i] === val) {
            data.push();
        } else {
            data.push(listStat[i]);
        }
    }
    this.setState({ listStat: data });
  }

  rejectApp = (val) => {
    this.setState({ typeReject: val });
  }

  rejectRej = (val) => {
    const { typeReject } = this.state;
    if (typeReject === val) {
        this.setState({ typeReject: '' });
    }
  }

  menuApp = (val) => {
    this.setState({ menuRev: val });
  }

  menuRej = (val) => {
    const { menuRev } = this.state;
    if (menuRev === val) {
        this.setState({ menuRev: '' });
    }
  }

  getMessage = (val) => {
    this.setState({ message: val.message, subject: val.subject });
    console.log(val);
  }

  async componentDidMount() {
      const {dataUser, token} = this.props.auth;
      const level = dataUser.user_level;
      const id = dataUser.id;
      await this.props.getRole(token);
      // await this.props.getDepo(token, 1000, '');
      // await this.props.getDetailUser(token, id);
      this.getDataStock();
  }

  getDataStock = async () => {
      const { filter } = this.state;
      this.changeFilter(filter);
  }

   changeFilter = async (val) => {
    const {dataUser, token} = this.props.auth;
    const roleAuth = dataUser.role;
    const {time1, time2, search, limit} = this.state;
    const cekTime1 = time1 === '' ? 'undefined' : moment(time1).format('YYYY-MM-DD');
    const cekTime2 = time2 === '' ? 'undefined' : moment(time2).format('YYYY-MM-DD');

    await this.props.getStockAll(token, search, limit, 1, '', val, cekTime1, cekTime2);

    const { page } = this.props.stock;
    await this.props.getStockArea(token, search, limit,  page.currentPage === undefined ? 1 : page.currentPage, 'revisi');
    await this.props.getDetailDepo(token, 1);

    const {dataStock, stockArea} = this.props.stock;
    const {dataRole} = this.props.user;
    const level = dataUser.user_level.toString();
    const role = level === '16' || level === '13' ? dataRole.find(({nomor}) => nomor === '27').name : roleAuth;

    this.setState({filter: val, newStock: stockArea});
  }

  setDate = (event, selectedDate, type) => {
    if (type === 'from') {
      this.setState({showDateFrom: false});
      if (selectedDate) {this.setState({time1: selectedDate});}
    } else {
      this.setState({showDateTo: false});
      if (selectedDate) {this.setState({time2: selectedDate});}
    }
  };

  getDataTime = async () => {
      const { time1, time2, filter, search, limit } = this.state;
      this.changeFilter(filter);
  }

  prosesOpenDetail = async (val) => {
    const {dataUser, token} = this.props.auth;
    const level = dataUser.user_level.toString();
    this.setState({loading: true});
    const { filter } = this.state;
    await this.props.getApproveStock(token, val.id);
    await this.props.getDetailStock(token, val.no_stock);
    const {stockApp} = this.props.stock;
    const realApp = stockApp.pembuat !== undefined ? Object.values(stockApp) : [];
    const finalApp = [];
    for (let i = 0; i < realApp.length; i++) {
      const tempApp = [];
      const item = realApp[i];
      for (let j = 0; j < item.length; j++) {
        tempApp.push(item[item.length - (j + 1)]);
      }
      finalApp.push(tempApp);
    }
    this.setState({realApp: finalApp.reverse()});
    this.setState({loading: false});
    this.openDetail();
  }

  openDetail = () => {
    this.setState({openDetail: !this.state.openDetail});
  }

  prosesOpenToggle = async (val) => {
    const {dataUser, token} = this.props.auth;
    const keterangan = val.keterangan;
    await this.props.getStatusAll(token);
    this.setState({detailData: val, keterangan: keterangan});
    this.toggleModal();
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  fillStatus = (val, type) => {
    if (type === 'status_fisik' || type === 'kondisi') {
      const data = {
          [type]: val,
          grouping: null,
      };
      this.setState({detailData: { ...this.state.detailData, ...data }});
    } else {
      this.setState({detailData: { ...this.state.detailData, [type]: val}});
    }
  }

  onStatusChange = (val) => {
    this.setState({ detailData: { ...this.state.detailData, grouping: val } });
  };

  getDataStatus = async (type) => {
    const {dataUser, token} = this.props.auth;
    const { detailData } = this.state;
    const { dataAll } = this.props.stock;
    if (detailData !== undefined) {
      this.setState({stat: detailData.grouping});
      if (detailData.kondisi === null && detailData.status_fisik === null) {
        console.log('masuk double null');
        this.setState({confirm: 'failStatus'});
        this.openConfirm();
        return false;
      } else {
        const statKondisi = detailData.kondisi;
        const statFisik = detailData.status_fisik;
        const cek = dataAll.filter((x) =>  x.kondisi === statKondisi && x.fisik === statFisik && x.isSap === type);
        console.log(dataAll);
        if (cek.length === 0) {
          console.log('masuk cek length 0');
          this.setState({confirm: 'failStatus'});
          this.openConfirm();
          return false;
        } else {
          const data = cek.map(item => ({label: item.status, value: item.status}));
          this.setState({listStatus: data});
        }
      }
    } else {
      console.log('masuk cek undefined');
      this.setState({confirm: 'failStatus'});
      this.openConfirm();
      return false;
    }
  }

  updateDataStock = async (value) => {
    const {dataUser, token} = this.props.auth;
    const { detailData } = this.state;
    const data = {
        merk: detailData.merk,
        satuan: detailData.satuan,
        unit: detailData.unit,
        lokasi: detailData.lokasi,
        grouping: detailData.grouping,
        keterangan: detailData.keterangan,
        status_fisik: detailData.fisik,
        kondisi: detailData.kondisi,
    };
    await this.props.updateStockNew(token, detailData.id, data);
    await this.props.appRevisi(token, detailData.id);
    // await this.props.getDetailItem(token, detailData.id);
    await this.props.getDetailStock(token, detailData.no_stock);
    this.setState({confirm: 'update'});
    this.openConfirm();
  }

  uploadPicture = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      if (!res) {
        console.log('error file tidak ditemukan');
        return;
      }

      const {uri, size, type, name} = res;
      let filePath = uri.replace('file://', '');

      // Ambil info stat dari RNFS
      let info;
      try {
        info = await RNFS.stat(filePath);
      } catch (err) {
        console.log('RNFS stat gagal, coba fallback copy:', err);
        return;
      }

      const lastModified = info.mtime; // Date object
      this.setState({fileUpload: res});

      // Validasi size
      if (size >= 20000000) {
        this.setState({errMsg: 'Maximum upload size 20 MB'});
        return;
      }

      // Validasi type
      if (type !== 'image/jpeg' && type !== 'image/png') {
        this.setState({errMsg: 'Invalid file type. Only image files are allowed.'});
        return;
      }

      // Hitung selisih hari dari lastModified
      const date1 = moment(lastModified);
      const date2 = moment();
      const diffTime = Math.abs(date2 - date1);
      const day = 1000 * 60 * 60 * 24;
      const finDiff = Math.round(diffTime / day);
      console.log('Selisih hari:', finDiff);

      if (finDiff > 10) {
        this.setState({confirm: 'oldPict'});
        this.openConfirm();
        return;
      }

      // Upload (pakai FormData)
      const data = new FormData();
      data.append('document', {
        uri,
        type,
        name,
      });

      const {detailData} = this.state;
      const {dataUser, token} = this.props.auth;

      await this.props.uploadImage(token, detailData.id, data);
      await this.props.getDetailStock(token, detailData.no_stock);
      this.setState({confirm: 'update'});
      this.openConfirm();
      this.toggleModal();
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancel');
      } else {
        console.error(err);
      }
    }
  };

  cekSubmit = () => {
    const {detailStock} = this.props.stock;
      const cek = [];
      for (let i = 0; i < detailStock.length; i++) {
        if (detailStock[i].isreject === 1) {
          cek.push(detailStock[i]);
        }
      }
      if (cek.length > 0) {
        this.setState({confirm: 'falseRev'});
        this.openConfirm();
      } else {
        this.openSubmit();
      }
  }

  prosesOpenTracking = async (val) => {
    const {dataUser, token} = this.props.auth;
    const level = dataUser.user_level.toString();
    await this.props.getDetailStock(token, val.no_stock);
    await this.props.getApproveStock(token, val.id);
    this.openTracking();
  }

  openTracking = () => {
    this.setState({modalTrack: !this.state.modalTrack});
  }

  openModalScan = () => {
    this.setState({modalScan: !this.state.modalScan});
  }

  onSearch = async () => {
        const { filter } = this.state;
        this.changeFilter(filter);
    }

  onType = (val) => {
      this.setState({ search: val });
  }

  handleBarcodeScan = async (scanResult) => {
    const { data } = scanResult;
    this.setState({ barcode: data });  // Set barcode ke state
    // this.props.navigation.navigate('Stock')
  };

  openApprove = () => {
    this.setState({modalApprove: !this.state.modalApprove});
  }

  openSubmit = () => {
    this.setState({modalSubmit: !this.state.modalSubmit});
  }

  openReject = () => {
    this.setState({modalReject: !this.state.modalReject});
  }

  openDraftEmail = () => {
    this.setState({ openDraft: !this.state.openDraft });
  }

  openConfirm = () => {
    this.setState({modalConfirm: !this.state.modalConfirm});
  }

  openDokumen = () => {
    this.setState({ modalDokumen: !this.state.modalDokumen });
  }

  prepSendEmail = async (val) => {
    const {detailStock} = this.props.stock;
    const {dataUser, token} = this.props.auth;
    const tipe = 'revisi';
    const tempno = {
        no: detailStock[0].no_stock,
        kode: detailStock[0].kode_plant,
        jenis: 'stock',
        tipe: tipe,
        menu: 'Revisi (Stock Opname asset)',
    };
    this.setState({tipeEmail: val});
    await this.props.getDraftEmail(token, tempno);
    this.openDraftEmail();
  }

  prepReject = async (val) => {
    const {detailStock} = this.props.stock;
    const {listStat, listMut, typeReject, menuRev} = this.state;
    const {dataUser, token} = this.props.auth;
    const level = dataUser.user_level;
    if (typeReject === 'pembatalan' && listMut.length !== detailStock.length) {
      this.setState({confirm: 'falseCancel'});
      this.openConfirm();
    } else {
      const tipe = 'reject';
      const menu = 'Pengajuan Stock Opname (Stock Opname asset)';
      const tempno = {
        no: detailStock[0].no_stock,
        kode: detailStock[0].kode_plant,
        jenis: 'stock',
        tipe: tipe,
        typeReject: typeReject,
        menu: menu,
      };
      this.setState({tipeEmail: 'reject', dataRej: val});
      await this.props.getDraftEmail(token, tempno);
      this.openDraftEmail();
    }
  }

  approveStock = async () => {
    const { detailStock } = this.props.stock;
    const {dataUser, token} = this.props.auth;
    await this.props.approveStock(token, detailStock[0].no_stock);
    await this.props.getApproveStock(token, detailStock[0].id);
    // await this.props.notifStock(token, detailStock[0].no_stock, 'approve', 'HO', null, null)
    this.prosesSendEmail('approve');
    this.setState({confirm: 'approve'});
    this.openConfirm();
    this.openApprove();
    this.getDataStock();
    this.openDetail();
  }

  rejectStock = async (value) => {
    const {listStat, listMut, typeReject, menuRev} = this.state;
    const {dataUser, token} = this.props.auth;
    const level = dataUser.user_level;
    const { detailStock } = this.props.stock;
    let temp = '';
    for (let i = 0; i < listStat.length; i++) {
        temp += listStat[i] + '.';
    }
    const data = {
        alasan: temp + this.state.alasan,
        no: detailStock[0].no_stock,
        menu: typeReject === 'pembatalan' ? 'Stock asset' : menuRev,
        list: listMut,
        type: level === '2' ? 'verif' : 'form',
        type_reject: typeReject,
    };
    await this.props.rejectStock(token, data);
    this.prosesSendEmail(`reject ${typeReject}`);
    this.setState({confirm: 'reject'});
    this.openConfirm();
    this.openReject();
    this.getDataStock();
    this.openDetail();
    // await this.props.getDetailStock(token, detailStock[0].no_stock)
    // await this.props.getApproveStock(token, detailStock[0].id)
    // await this.props.notifStock(token, detailStock[0].no_stock, 'reject', null, null, null, data)
  }

  submitDataRevisi = async (val) => {
    const {dataUser, token} = this.props.auth;
    const {detailStock} = this.props.stock;
    await this.props.submitRevisi(token, detailStock[0].id);
    this.prosesSendEmail();
    this.openDetail();
    this.openSubmit();
    this.setState({confirm: 'submit'});
    this.openConfirm();
    this.getDataStock();
  }

  prosesSendEmail = async (val) => {
    const {dataUser, token} = this.props.auth;
    const { draftEmail } = this.props.tempmail;
    const { detailStock } = this.props.stock;
    const { message, subject } = this.state;
    const cc = draftEmail.cc;
    const tempcc = [];
    for (let i = 0; i < cc.length; i++) {
        tempcc.push(cc[i].email);
    }
    const sendMail = {
        draft: draftEmail,
        nameTo: draftEmail.to.fullname,
        to: draftEmail.to.email,
        cc: tempcc.toString(),
        message: message,
        subject: subject,
        no: detailStock[0].no_stock,
        tipe: 'stock',
        menu: 'stock opname asset',
        proses: 'submit',
        route: 'stock',
    };
    await this.props.sendEmail(token, sendMail);
    await this.props.addNewNotif(token, sendMail);
    this.openDraftEmail();
  }

  render() {
    const {time1, time2, showDateFrom, showDateTo, filter, newStock, detailData, loading, realApp, listMut, listStat, tipeEmail, dataRej, listStatus} = this.state;

    const loadingDepo = this.props.depo.isLoading;
    const loadingStock = this.props.stock.isLoading;
    const loadingUser = this.props.user.isLoading;
    const loadingTempmail = this.props.tempmail.isLoading;
    const loadingNewnotif = this.props.newnotif.isLoading;
    const loadingDokumen = this.props.dokumen.isLoading;
    const loadingAll = loadingDepo || loadingStock || loadingUser || loadingTempmail || loadingNewnotif || loadingDokumen || loading;

    const { dataStock, noStock, dataDoc, detailStock, statusList} = this.props.stock;

    const statusOptions = [
      {key: 'all', label: 'All'},
      {key: 'available', label: 'Available Approve'},
      {key: 'reject', label: 'Reject'},
      {key: 'finish', label: 'Finished'},
    ];

    const titleApprovals = [
      {
        display: 'Dibuat oleh',
        val: 'pembuat',
      },
      {
        display: 'Diterima oleh',
        val: 'penerima',
      },
      {
        display: 'Disetujui oleh',
        val: 'penyetuju',
      },
      {
        display: 'Diperiksa oleh',
        val: 'pemeriksa',
      },
    ];

    const dataReason = [
      {name: 'Kondisi, status fisik, dan keterangan tidak sesuai'},
      {name: 'Photo asset tidak sesuai'},
      {name: 'Tambahan asset tidak sesuai'},
    ];


    const {dataUser} = this.props.auth;
    const level = dataUser.user_level;

    return (
      <>
      <View style={{flex: 1}}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.bodyTitle}>
            <Text style={styles.title}>Revisi Stock Opname</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons onPress={() => this.onSearch({target: {value: this.state.search}, key: 'Enter'})} name="search" size={20} color="#999" />
            <TextInput
              placeholder="Cari no ajuan / area..."
              placeholderTextColor="#999"
              style={styles.searchInput}
              onChangeText={this.onType}
              onSubmitEditing={() => {
                this.onSearch();
              }}
              value={this.state.search}
            />
            <Ionicons name="options-outline" size={20} color="#999" />
          </View>

          {/* Date Picker Row */}
          <View style={styles.dateRow}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => this.setState({showDateFrom: true})}>
              <Text style={styles.dateButtonText}>
                From: {moment(time1).format('DD-MM-YYYY')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => this.setState({showDateTo: true})}>
              <Text style={styles.dateButtonText}>
                To: {moment(time2).format('DD-MM-YYYY')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnGo}
              onPress={this.getDataTime}
            >
              <Text style={{color: 'white'}} >Go</Text>
            </TouchableOpacity>
          </View>

          {/* Date Pickers */}
          {showDateFrom && (
            <DateTimePicker
              value={new Date(time1)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, date) => this.setDate(e, date, 'from')}
            />
          )}
          {showDateTo && (
            <DateTimePicker
              value={new Date(time2)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, date) => this.setDate(e, date, 'to')}
            />
          )}

        </View>

        {/* LIST CARD */}
        <ScrollView
          style={newStock.length === 0 ? styles.blankBg : styles.scrollArea}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={loadingAll}
              onRefresh={() => this.changeFilter(this.state.filter)}
            />
          }
        >

          {newStock.length > 0 && newStock.map((item, index) => (
            <View style={styles.card} key={index}>
              <LinearGradient
                colors={['#e53935', '#e35d5b']}
                style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>
                  {item.no_stock}
                </Text>
              </LinearGradient>

              <View style={
                [styles.cardContent,
                  item.status_reject === 0 ? styles.note
                  : item.status_form === 0 ? styles.fail
                  : item.status_reject === 1 ? styles.bad
                  : styles.normal,
                ]}
              >
                <View style={styles.row}>
                  <Ionicons name="location-outline" size={18} color="#555" />
                  <Text style={styles.cardText}>Area: {item.area}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                      {statusList.find(x => x.status_form === item.status_form)?.title || ''}
                    </Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <Ionicons name="location-outline" size={18} color="#555" />
                  <Text style={styles.cardText}>Kode Area: {item.kode_plant}</Text>
                </View>

                <View style={styles.row}>
                  <Ionicons name="calendar-outline" size={18} color="#555" />
                  <Text style={styles.cardText}>Tanggal Ajuan: {moment(item.tanggalStock).format('DD MMMM YYYY')}</Text>
                </View>

                <View style={styles.row}>
                  <Ionicons name="pricetag-outline" size={18} color="#555" />
                  <Text style={styles.cardText}>Status: {item.history !== null ? item.history.split(',').reverse()[0] : '-'}</Text>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.detailButton} onPress={() => this.prosesOpenDetail(item)}>
                    <Text style={styles.detailButtonText}>{filter === 'available' ? 'Proses' : 'Detail'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                  style={styles.trackingButton}
                  onPress={() => this.prosesOpenTracking(item)}
                  >
                    <Text style={styles.trackingButtonText}>Tracking</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          {newStock.length === 0 && (
            <View style={styles.blankBody}>
              <Image source={blankImg} style={styles.blankImg}/>
              {/* <Text>Data ajuan tidak ditemukan</Text> */}
            </View>
          )}
        </ScrollView>
      </View>
      <Modal
        style={{margin: 0}}
        isVisible={this.state.modalTrack}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        // backdropOpacity={0.4}
        onBackdropPress={this.openTracking}
        useNativeDriver={true}
        >
          <TrackingModal handleClose={this.openTracking}/>
      </Modal>
      {/* <Modal visible={openDetail} transparent animationType="fade"> */}
      <Modal
        style={{margin: 0}}
        isVisible={this.state.openDetail}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        // backdropOpacity={0.4}
        onBackdropPress={this.openDetail}
        useNativeDriver={true}
      >
        <View style={styles.overlayModal}>
          <View style={styles.popupContainerModal}>
            <ScrollView style={styles.scrollContentModal}>
              {/* Header */}
              <View style={styles.headerContainerModal}>
                <Text style={styles.headerTitleModal}>Detail Stock Asset</Text>
                <Text style={styles.headerSubModal}>{detailStock.length > 0 ? detailStock[0].no_stock : ''}</Text>
              </View>

              {/* Info Utama */}
              <View style={styles.infoCardModal}>
                <Text style={styles.infoTextModal}>Tanggal Form: {detailStock.length > 0 ? moment(detailStock[0].tanggalStock).format('DD MMMM YYYY') : '-'}</Text>
                <Text style={styles.infoTextModal}>Cabang/Depo: {detailStock.length > 0 ? detailStock[0].area : ''}</Text>
                <Text style={styles.infoTextModal}>Cost Center: {detailStock.length > 0 ? detailStock[0].depo.cost_center : ''}</Text>
              </View>

              {/* Daftar Asset */}
              <Text style={styles.sectionTitleModal}>Daftar Asset</Text>
              <View style={styles.rowCard}>
                {detailStock.length > 0 && detailStock.map((item, index) => (
                  <View
                    key={index}
                    style={[styles.assetCard, { width: cardWidthList }, item.status_app === 0 ? styles.note : listMut.find(element => element === item.id) !== undefined ? styles.note : styles.backgroundWhite]}
                  >
                    {/* <TouchableOpacity
                      disabled={item.status_app === 0 ? true : false}
                      onPress={listMut.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                    > */}
                      <Image
                        source={
                          item.pict === undefined || item.pict.length === 0 ?
                          placeholder :
                          { uri: `${API_URL}/${item.pict[item.pict.length - 1].path}` }
                        }
                        style={styles.imageCard}
                      />
                      {/* <TouchableOpacity style={styles.btnLabel}>
                        <Text style={styles.textLabel}>{item.kategori === null ? '-' : item.kategori}</Text>
                      </TouchableOpacity> */}
                      <View style={styles.nameContainerCard}>
                        <Text style={styles.nameTextCard} numberOfLines={2}>{item.deskripsi}</Text>
                      </View>
                      <Text style={styles.detailTextCard}>{item.no_asset}</Text>
                      <Text style={styles.detailTextCard}>Kondisi: {item.kondisi}</Text>
                      <Text style={styles.detailTextCard}>Status Fisik: {item.status_fisik}</Text>
                      <Text style={styles.detailTextCard}>Status Aset: {item.grouping}</Text>
                      <Text style={styles.detailTextCard}>Status Data: {(item.isreject === 1 || item.isreject === 0) ? (item.isreject === 1 ? 'Perlu Diperbaiki' : 'Telah diperbaiki') : '-'}</Text>
                    {/* </TouchableOpacity> */}
                    {(item.isreject === 1 || item.isreject === 0) && (
                      <View style={styles.footerModal}>
                        <TouchableOpacity style={[styles.buttonDoc, styles.btnColorApprove]} onPress={() => this.prosesOpenToggle(item)}>
                          <Text style={styles.buttonTextModal}>Update</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))}
              </View>

              {/* Matrix Otorisasi */}
              <View style={styles.sectionModal}>
                <Text style={styles.sectionTitleModal}>Matrix Otorisasi</Text>
              </View>

              <View style={styles.approvalContainer}>
                {realApp.length > 0 && realApp.map((section, index) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.iconContainer}>
                      <IconMateri
                        name={section !== undefined &&
                          (
                            section.find(x => x.status === 0) ? 'close'
                            : section.find(x => x.status === null) ? 'hourglass-top'
                            : 'check-circle'
                          )
                        }
                        size={24}
                        style={section !== undefined &&
                          (
                            section.find(x => x.status === 0) ? styles.approvalIconFalse
                            : section.find(x => x.status === null) ? styles.approvalIconWait
                            : styles.approvalIconTrue
                          )
                        }
                      />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.statusTitle}>{titleApprovals.find(x => x.val === section[0].sebagai)?.display}</Text>
                      <View
                        style={
                          [styles.detailBox,
                            section !== undefined &&
                            (
                              section.find(x => x.status === 0) ? styles.approvalCardFalse
                              : section.find(x => x.status === null) ? styles.approvalCardWait
                              : styles.approvalCardTrue
                            ),
                          ]
                        }
                      >
                        {section.map((item, i) => (
                          <View key={i} style={styles.detailRow}>
                            <Text style={styles.detailDate}>{item.status !== null ? moment(item.updatedAt).format('DD MMMM YYYY') : '-'}</Text>
                            <Text style={styles.detailName}>
                              {item.status !== null ? item.nama : '-'} {item.status === 0 ? '(Reject)' : item.status === 1 ? '(Approve)' : ''}
                            </Text>
                            <Text style={styles.detailRole}>{item.jabatan}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.sectionModal}>
                {/* <Text style={styles.smallTextModal}>
                  Area ke Area: Dibuat AOS, Diperiksa BM, ROM, GAAM, Disetujui Head Ops
                </Text>
                <Text style={styles.smallTextModal}>
                  HO ke Area: Dibuat GA SPV, Diperiksa BM, Disetujui Head Ops Excellence
                </Text> */}
              </View>

              <View style={styles.footerModal}>
                <TouchableOpacity
                  style={[styles.buttonModal, styles.btnColorApprove]}
                  onPress={() => this.cekSubmit()}
                >
                  <Text style={styles.buttonTextModal}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>

            </ScrollView>

            {/* Tombol */}
            <View style={styles.footerModal}>
              {/* {filter === 'available' && (
                <TouchableOpacity
                  style={[styles.buttonModal, styles.btnColorProses]}
                  onPress={() => this.openModalScan()}
                >
                  <Text style={styles.buttonTextModal}>Scan</Text>
                </TouchableOpacity>
              )} */}
              <TouchableOpacity
                style={[styles.buttonModal, styles.btnColorClose]}
                onPress={() => this.openDetail()}
              >
                <Text style={styles.buttonTextModal}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={this.state.modalScan}
        style={{ margin: 0 }}
      >
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <RNCamera
            style={{ flex: 1 }}
            type={RNCamera.Constants.Type.back}
            onBarCodeRead={this.handleBarcodeScan}
            captureAudio={false}
          />
          <Button color={'#e53935'} title="Close" onPress={() => this.openModalScan()} />
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
      <Modal
        style={{margin: 0}}
        isVisible={this.state.openDraft}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.4}
        onBackdropPress={this.openDraftEmail}
        useNativeDriver={true}
      >
        <EmailModal
          typeEmail={{type: 'submit'}}
          handleSubmit={this.submitDataRevisi}
          handleClose={this.openDraftEmail}
          handleData={this.getMessage}
        />
      </Modal>
      <Modal
        style={{margin: 0}}
        isVisible={this.state.modalDokumen}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        // backdropOpacity={0.4}
        onBackdropPress={this.openDokumen}
        useNativeDriver={true}
      >
        <View style={styles.overlayModal}>
          <View style={styles.popupContainerInfo}>
            <ScrollView style={styles.scrollContentModal}>
              <ModalDokumen
              parDoc={{
                arrDoc: dataDoc,
                proses: 'approval',
                tipe: 'pengadaan',
                noDoc: detailStock.length > 0 ? (detailStock[0].asset_token === null ? detailStock[0].id : detailStock[0].no_pengadaan) : '',
                noTrans: detailStock.length > 0 ? detailStock[0].no_pengadaan : '',
                detailForm: this.state.detailData,
              }}
              handleClose={this.openDokumen}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        style={{margin: 0}}
        isVisible={this.state.modalApprove}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        // backdropOpacity={0.4}
        onBackdropPress={this.openApprove}
        useNativeDriver={true}
      >
        <View style={styles.overlayModal}>
          <View style={styles.popupContainerInfo}>
            <ScrollView style={styles.scrollContentModal}>
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionTitleInfo}>Apakah anda yakin untuk approve?</Text>
                <View style={styles.sectionDelete}>
                  <TouchableOpacity style={[styles.buttonDelete, styles.btnColorClose]} onPress={() => this.prepSendEmail('approve')} >
                    <Text style={styles.buttonTextCard}>Ya</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.buttonDelete, styles.btnColorSec]} onPress={this.openApprove}>
                    <Text style={styles.buttonTextCard}>Tidak</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        style={{margin: 0}}
        isVisible={this.state.modalSubmit}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        // backdropOpacity={0.4}
        onBackdropPress={this.openSubmit}
        useNativeDriver={true}
      >
        <View style={styles.overlayModal}>
          <View style={styles.popupContainerInfo}>
            <ScrollView style={styles.scrollContentModal}>
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionTitleInfo}>Apakah anda yakin untuk submit?</Text>
                <View style={styles.sectionDelete}>
                  <TouchableOpacity style={[styles.buttonDelete, styles.btnColorClose]} onPress={() => this.prepSendEmail('submit')} >
                    <Text style={styles.buttonTextCard}>Ya</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.buttonDelete, styles.btnColorSec]} onPress={this.openSubmit}>
                    <Text style={styles.buttonTextCard}>Tidak</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        style={{margin: 0}}
        isVisible={this.state.modalReject}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        // backdropOpacity={0.4}
        onBackdropPress={this.openReject}
        useNativeDriver={true}
      >
        <View style={styles.overlayModal}>
          <View style={styles.popupContainerInfo}>
            <ScrollView style={styles.scrollContentModal}>
              <View style={styles.sectionReason}>
                <Text style={styles.titleReason}>Anda yakin untuk reject ?</Text>
                <Text style={[styles.subtitleReason]}>Pilih Reject :</Text>
                <View style={styles.radioView}>
                    <Radio
                    color={'#5E50A1'}
                    selectedColor={'#5E50A1'}
                    selected={this.state.typeReject === 'perbaikan' ? true : false}
                    onPress={this.state.typeReject === 'perbaikan' ? () => this.rejectRej('perbaikan') : () => this.rejectApp('perbaikan')}
                    />
                    <Label style={styles.labelRadio}>Perbaikan</Label>
                </View>
                <View style={styles.radioView}>
                    <Radio
                    color={'#5E50A1'}
                    selectedColor={'#5E50A1'}
                    selected={this.state.typeReject === 'pembatalan' ? true : false}
                    onPress={this.state.typeReject === 'pembatalan' ? () => this.rejectRej('pembatalan') : () => this.rejectApp('pembatalan')}
                    />
                    <Label style={styles.labelRadio}>Pembatalan</Label>
                </View>
                {this.state.typeReject === '' && (
                  <Text style={styles.errorTextDetail}>Must be filled</Text>
                )}
                {this.state.typeReject === 'perbaikan' && (
                  <>
                    <Text style={[styles.subtitleReason]}>Pilih Menu Revisi :</Text>
                    <View style={styles.radioView}>
                        <Radio
                        color={'#5E50A1'}
                        selectedColor={'#5E50A1'}
                        selected={this.state.menuRev === 'Revisi Area' ? true : false}
                        onPress={this.state.menuRev === 'Revisi Area' ? () => this.menuRej('Revisi Area') : () => this.menuApp('Revisi Area')}
                        />
                        <Label style={styles.labelRadio}>Revisi Area</Label>
                    </View>
                    {this.state.menuRev === '' && (
                      <Text style={styles.errorTextDetail}>Must be filled</Text>
                    )}
                  </>
                )}
                <Text style={[styles.subtitleReason]}>Pilih Alasan :</Text>
                {dataReason.map(x => {
                  return (
                      <View key={x.name} style={styles.radioView}>
                        <Radio
                        color={'#5E50A1'}
                        selectedColor={'#5E50A1'}
                        selected={listStat.find(element => element === x.name) !== undefined ? true : false}
                        onPress={listStat.find(element => element === x.name) === undefined ? () => this.statusApp(x.name) : () => this.statusRej(x.name)}
                        />
                        <Label style={styles.labelRadio}>{x.name}</Label>
                    </View>
                  );
                })}
                <Text style={[styles.subtitleReason]}>Alasan lainnya</Text>
                <TextInput
                  style={styles.inputReason}
                  placeholder="..........."
                  multiline={true}
                  onChangeText={(val) => this.setState({ alasan: val })}
                  value={this.state.alasan}
                />
                {((this.state.alasan === '.' || this.state.alasan === '') && listStat.length === 0) && (
                  <Text style={styles.errorTextDetail}>Pilih atau isi alasan terlebih dahulu</Text>
                )}
              </View>
            </ScrollView>
            <View style={styles.footerModal}>
              <TouchableOpacity
                style={[styles.buttonModal, styles.btnColorClose]}
                onPress={() => this.prepReject()}
                disabled={(((this.state.alasan === '.' || this.state.alasan === '') && listStat.length === 0) || this.state.typeReject === '' || (this.state.typeReject === 'perbaikan' && this.state.menuRev === '')) ? true : false}
              >
                <Text style={styles.buttonTextModal}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonModal, styles.btnColorSec]}
                onPress={() => this.openReject()}
              >
                <Text style={styles.buttonTextModal}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        style={{margin: 0}}
        isVisible={this.state.modalConfirm}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        // backdropOpacity={0.4}
        onBackdropPress={this.openConfirm}
        useNativeDriver={true}
      >
        <View style={styles.overlayModal}>
          <View style={styles.popupContainerInfo}>
            <ScrollView style={styles.scrollContentModal}>
              {/* Header */}
              {this.state.confirm === 'approve' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="check-circle" color={'green'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Berhasil Approve Stock</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : (this.state.confirm === 'falseCancel') ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Reject Stock</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Reject pembatalan hanya bisa dilakukan jika semua data ajuan terceklis</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : this.state.confirm === 'reject' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="check-circle" color={'green'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Berhasil Reject Stock</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : this.state.confirm === 'delete' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="check-circle" color={'green'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Berhasil Delete Item</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : this.state.confirm === 'upreason' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="check-circle" color={'green'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Berhasil Update Alasan</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : this.state.confirm === 'submit' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="check-circle" color={'green'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Berhasil Submit</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : (this.state.confirm === 'docFirst') ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Approve</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Mohon untuk upload dokumen terlebih dahulu</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : (this.state.confirm === 'falseAppDok' || this.state.confirm === 'falseSubmitDok') ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal {this.state.confirm === 'falseSubmitDok' ? 'Submit' : 'Approve'}</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Mohon approve dokumen terlebih dahulu</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : (this.state.confirm === 'falseItem') ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Submit</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Ajuan hanya bisa direject karena seluruh data teridentifikasi bukan aset</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : (this.state.confirm === 'falseSubmit') ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Submit</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Mohon identifikasi asset terlebih dahulu</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : (this.state.confirm === 'reason') ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Permintaan gagal</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Mohon isi alasan terlebih dahulu</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : (this.state.confirm === 'falseSubmit') ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Submit</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Mohon isi Nomor IO terlebih dahulu</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : this.state.confirm === 'update' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="check-circle" color={'green'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Berhasil Update</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : (this.state.confirm === 'falseRev') ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Submit</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Mohon perbaiki data ajuan terlebih dahulu</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : this.state.confirm === 'oldPict' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Upload</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Pastikan dokumentasi yang diupload tidak lebih dari 10 hari saat submit stock opname</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : this.state.confirm === 'failStatus' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Error</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Tidak ada opsi mohon pilih ulang kondisi atau status fisik</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  null
                )
              }
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={this.state.isModalVisible}
        onBackdropPress={this.toggleModal}
        style={styles.modalWrapperDetail}
      >
        <View style={styles.modalContainerDetail}>
          <ScrollView>
            {/* Header */}
            <Text style={styles.headerTextDetail}>Proses Stock Opname</Text>
            <Text style={styles.assetNameTextDetail}>{detailData.nama_asset}</Text>

            {/* Image */}
            <View style={styles.imageWrapperDetail}>
              <Image
                source={
                  detailData.pict === undefined || detailData.pict.length === 0 ?
                  placeholder :
                  { uri: `${API_URL}/${detailData.pict[detailData.pict.length - 1].path}` }
                }
                style={styles.imageDetail}
              />
              <View style={[styles.dateRow, { marginTop: 10 }]}>
                <TouchableOpacity
                  style={[styles.uploadButton, styles.btnColorProses]}
                  onPress={() => this.uploadPicture()}
                >
                  <IconAwe style={styles.iconBtn} name="camera" size={15} color={'white'} />
                  <Text style={styles.buttonTextModal}>Upload Picture</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Form */}
            <View style={styles.formGroupDetail}>
              <Text style={styles.labelDetail}>No Asset :</Text>
              <TextInput style={styles.inputDetail} editable={false} value={detailData.no_asset} />
            </View>

            <View style={styles.formGroupDetail}>
              <Text style={styles.labelDetail}>Merk / Type :</Text>
              <TextInput
                style={styles.inputDetailAct}
                value={detailData.merk}
                onChangeText={(val) => this.setState({detailData: { ...detailData, merk: val }})}
              />
              {!detailData.merk && (
                <Text style={styles.errorTextDetail}>Must be filled</Text>
              )}
            </View>

            <View style={styles.formGroupDetail}>
              <Text style={styles.labelDetail}>Satuan :</Text>
              <View style={styles.pickerWrapperDetail}>
                <Picker
                  selectedValue={`${detailData.satuan}`}
                  style={styles.pickerDetail}
                  onValueChange={(val) => this.setState({detailData: { ...detailData, satuan: val }})}
                >
                  <Picker.Item  value="Select" label="Select..."/>
                  <Picker.Item value={'Unit'} label={'UNIT'} />
                  <Picker.Item value={'Paket'} label={'PAKET'} />
                </Picker>
              </View>
              {!detailData.satuan && (
                <Text style={styles.errorTextDetail}>Must be filled</Text>
              )}
            </View>

            <View style={styles.formGroupDetail}>
              <Text style={styles.labelDetail}>Unit :</Text>
              <TextInput style={styles.inputDetail} editable={false} value={detailData.unit} />
            </View>

            <View style={styles.formGroupDetail}>
              <Text style={styles.labelDetail}>Lokasi :</Text>
              <TextInput
              style={styles.inputDetailAct}
              value={detailData.lokasi}
              onChangeText={(val) => this.setState({detailData: { ...detailData, lokasi: val }})}
              />
              {!detailData.lokasi && (
                <Text style={styles.errorTextDetail}>Must be filled</Text>
              )}
            </View>

            <View style={styles.formGroupDetail}>
              <Text style={styles.labelDetail}>Status Fisik :</Text>
              <View style={styles.pickerWrapperDetail}>
                <Picker
                  selectedValue={`${detailData.status_fisik}`}
                  style={styles.pickerDetail}
                  onValueChange={(itemValue) => this.fillStatus(itemValue, 'status_fisik')}
                >
                  <Picker.Item value="Select" label="Select..."/>
                  <Picker.Item value={'ada'} label={'Ada'}/>
                  <Picker.Item value={'tidak ada'} label={'Tidak Ada'}/>
                </Picker>
              </View>
              {!detailData.status_fisik && (
                <Text style={styles.errorTextDetail}>Must be filled</Text>
              )}
            </View>

            <View style={styles.formGroupDetail}>
              <Text style={styles.labelDetail}>Kondisi :</Text>
              <View style={styles.pickerWrapperDetail}>
                <Picker
                  selectedValue={`${detailData.kondisi}`}
                  style={styles.pickerDetail}
                  onValueChange={(itemValue) => this.fillStatus(itemValue, 'kondisi')}
                >
                  <Picker.Item value="Select" label="Select..." />
                  <Picker.Item value={'baik'} label={'Baik'}/>
                  <Picker.Item value={'rusak'} label={'Rusak'}/>
                  <Picker.Item value={''} label={'-'}/>
                </Picker>
              </View>
              {!detailData.kondisi && (
                <Text style={styles.errorTextDetail}>Must be filled</Text>
              )}
            </View>

            <View style={styles.formGroupDetail}>
              <Text style={styles.labelDetail}>Status Aset :</Text>
              <View style={[styles.pickerWrapperDetail]}>
                <CustomPicker
                  items={listStatus}
                  value={detailData.grouping}
                  onValueChange={this.onStatusChange}
                  onBeforeOpen={() => this.getDataStatus('true')}
                  placeholder={detailData.grouping ? detailData.grouping : 'Select status...'}
                  modalTitle="Pilih Status Aset"
                />
              </View>
              {!detailData.grouping && (
                <Text style={styles.errorTextDetail}>Must be filled</Text>
              )}
            </View>

            <View style={styles.formGroupDetail}>
              <Text style={styles.labelDetail}>Keterangan :</Text>
              <TextInput
                style={styles.inputDetailAct}
                value={detailData.keterangan}
                onChangeText={(val) => this.setState({detailData: { ...detailData, keterangan: val }})}
              />
            </View>

            {/* Buttons */}
            <View style={styles.buttonWrapperDetail}>
              <TouchableOpacity
                style={[
                  styles.addButtonDetail,
                  (!detailData.merk ||
                  !detailData.satuan ||
                  !detailData.lokasi ||
                  !detailData.status_fisik ||
                  !detailData.kondisi ||
                  !detailData.grouping) && { backgroundColor: '#9CA3AF' },
                ]}
                disabled={
                  !detailData.merk ||
                  !detailData.satuan ||
                  !detailData.lokasi ||
                  !detailData.status_fisik ||
                  !detailData.kondisi ||
                  !detailData.grouping
                }
                onPress={() => this.updateDataStock(detailData)}
              >
                <Text style={styles.addButtonTextDetail}>{'Save'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButtonDetail} onPress={this.toggleModal}>
                <Text style={styles.closeButtonTextDetail}>Close</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  blankBody: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 40,
  },
  iconBtn: {
    marginRight: 5,
  },
  blankBg: {
    backgroundColor: 'white',
    padding: 0,
    flex: 1,
  },
  blankImg: {
    width: '100%',
    height: 300,
    margin: 0,
    resizeMode: 'contain',
  },
  headerContainer: {
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 8,
    color: '#000',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  uploadButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dateButtonText: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 6,
  },
  badgeActive: {
    backgroundColor: '#2196F3',
  },
  badgeText: {
    color: '#555',
    fontSize: 12,
  },
  badgeTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollArea: {
    flex: 1,
    padding: 16,
    paddingTop: 10,
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 15,
  },
  cardHeader: {
    padding: 10,
  },
  cardHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardContent: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    marginLeft: 6,
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  detailButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  trackingButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  trackingButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bodyTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  note: {
    backgroundColor: '#ffffcc',
  },
  bad: {
    backgroundColor: '#ffccd0',
  },
  fail: {
    backgroundColor: '#686a74',
  },
  normal: {
    backgroundColor: '#fff',
  },
  btnGo: {
    padding: 8,
    backgroundColor: '#e53935',
    borderRadius: 8,
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
  btnColorSec: {
    backgroundColor: '#6B7280',
  },
  buttonTextModal: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  //approval
  approvalContainer: {
    padding: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
  },
  timelineContent: {
    flex: 1,
    marginLeft: 10,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailBox: {
    padding: 10,
    borderRadius: 8,
  },
  detailRow: {
    marginBottom: 10,
  },
  detailDate: {
    fontSize: 12,
    color: '#777',
  },
  detailName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailRole: {
    fontSize: 12,
    color: '#555',
  },
  approvalIconTrue: {
    color: '#4caf50',
  },
  approvalIconFalse: {
    color: '#e53935',
  },
  approvalIconWait: {
    color: '#fb8c00',
  },
  approvalCardTrue: {
    backgroundColor: '#e3f2fd',
  },
  approvalCardFalse: {
    backgroundColor: '#fce4ec',
  },
  approvalCardWait: {
    backgroundColor: '#fff3e0',
  },

  // Modal Detail
  containerDetail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButtonDetail: {
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
  },
  modalWrapperDetail: {
    justifyContent: 'center',
    margin: 0,
  },
  modalContainerDetail: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: screenWidth * 0.9,
    alignSelf: 'center',
  },
  headerTextDetail: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  assetNameTextDetail: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },
  imageWrapperDetail: {
    alignItems: 'center',
    marginBottom: 15,
  },
  imageDetail: {
    width: '100%',
    height: 260,
    resizeMode: 'contain',
    borderRadius: 8,
    // borderWidth: 1,
    // borderColor: '#E5E7EB',
  },
  formGroupDetail: {
    marginBottom: 15,
  },
  labelDetail: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 5,
  },
  inputDetail: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#9CA3AF',
    color: '#111827',
  },
  inputDetailAct: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fdfbfbff',
    color: '#111827',
  },
  checkboxWrapperDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxDetail: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    marginRight: 10,
  },
  checkboxActiveDetail: {
    backgroundColor: '#E5E7EB',
  },
  pickerWrapperDetail: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
  },
  pickerDetail: {
    height: 40,
  },
  errorTextDetail: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  buttonWrapperDetail: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  addButtonDetail: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  addButtonTextDetail: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButtonDetail: {
    backgroundColor: '#6B7280',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonTextDetail: {
    color: '#fff',
    fontWeight: 'bold',
  },

  //Modal info

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
  sectionDelete: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDelete: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 5,
  },
  buttonTextCard: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  radioView: {
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
  },
  labelRadio: {
    fontSize: 14,
    lineHeight: 15,
    color: '#46505C',
  },
  sectionReason: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  titleReason: {
    fontSize: 18,
    marginTop: 5,
    fontWeight: '600',
  },
  subtitleReason: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
    marginBottom: 5,
  },
  inputReason: {
    height: 100,
    // padding: 10,
    textAlignVertical: 'top',
    marginTop: 5,
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
    color: '#000',
  },
  sectioSubtitleInfo: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btnInfo: {
    backgroundColor: '#4caf50',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  textBtnInfo: {
    fontSize: 14,
    color: 'white',
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
  assetCard: {
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
});

const mapStateToProps = state => ({
    asset: state.asset,
    depo: state.depo,
    stock: state.stock,
    user: state.user,
    tempmail: state.tempmail,
    newnotif: state.newnotif,
    dokumen: state.dokumen,
    auth: state.auth,
});

const mapDispatchToProps = {
    getDetailUser: user.getDetailUser,
    getDetailDepo: depo.getDetailDepo,
    getDepo: depo.getDepo,
    submitStock: stock.submitStock,
    getStockAll: stock.getStockAll,
    getDetailStock: stock.getDetailStock,
    getApproveStock: stock.getApproveStock,
    deleteStock: stock.deleteStock,
    approveStock: stock.approveStock,
    rejectStock: stock.rejectStock,
    uploadPicture: stock.uploadPicture,
    getStatus: stock.getStatus,
    getStatusAll: stock.getStatusAll,
    resetStock: stock.resetStock,
    getDocument: stock.getDocumentStock,
    cekDokumen: stock.cekDocumentStock,
    updateStock: stock.updateStock,
    updateStockNew: stock.updateStockNew,
    getDetailItem: stock.getDetailItem,
    showDokumen: pengadaan.showDokumen,
    getStockArea: stock.getStockArea,
    addOpname: stock.addStock,
    uploadImage: stock.uploadImage,
    submitAsset: stock.submitAsset,
    exportStock: report.getExportStock,
    getRole: user.getRole,
    getDraftEmail: tempmail.getDraftEmail,
    sendEmail: tempmail.sendEmail,
    addNewNotif: newnotif.addNewNotif,
    searchStock: stock.searchStock,
    uploadDocument: stock.uploadDocument,
    submitRevisi: stock.submitRevisi,
    appRevisi: stock.appRevisi,
};

export default connect(mapStateToProps, mapDispatchToProps)(RevisiStock);
