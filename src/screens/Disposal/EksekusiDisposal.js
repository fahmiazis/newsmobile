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

import depo from '../../redux/actions/depo';
import disposal from '../../redux/actions/disposal';
import tempmail from '../../redux/actions/tempmail';
import newnotif from '../../redux/actions/newnotif';
import user from '../../redux/actions/user';
import approve from '../../redux/actions/approve';
import pengadaan from '../../redux/actions/pengadaan';
import setuju from '../../redux/actions/setuju';
import dokumen from '../../redux/actions/dokumen';

import blankImg from '../../assets/blank.png';
import placeholder from '../../assets/placeholder.png';

import EmailModal from '../../components/Disposal/Email';
import ModalDokumen from '../../components/ModalDokumen';
import TrackingModal from '../../components/Disposal/Tracking';

const screenWidth = Dimensions.get('window').width;
class EksekusiDisposal extends Component {
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
      newDis: [],
      listDis: [],
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
      typeModal: '',
      isModalVisible: false,
      modalRinci: false,
      date_ba: '',
      openEditDate: false
    };
  }

  setEditDate = (event, selectedDate, type) => {
    this.setState({openEditDate: false});
    if (selectedDate) {
      this.setState({date_ba: selectedDate});
    }
  };

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
      await this.props.getDepo(token, 1000, '');
      await this.props.getDetailUser(token, id);
      this.getDataDisposal();
  }

  getDataDisposal = async () => {
      // const { filter } = this.state;
      // const {dataUser, token} = this.props.auth;
      // const level = dataUser.user_level;
      // const finFilter = (level === 5 || level === 9) && filter !== 'finish' ? 'submit' : filter;
      this.changeFilter('available');
  }

  changeFilter = async (val) => {
    const {dataUser, token} = this.props.auth;
    const level = dataUser.user_level.toString();
    const { detailUser, dataRole } = this.props.user;
    const { dataDepo } = this.props.depo;

    const { time1, time2, search, limit } = this.state;
    const cekTime1 = time1 === '' ? 'undefined' : moment(time1).format('YYYY-MM-DD');
    const cekTime2 = time2 === '' ? 'undefined' : moment(time2).format('YYYY-MM-DD');
    const status = (val === 'available' && level === '2') ? 4 : (val === 'available' && (level === '5' || level === '9')) ? 15 : 'all';
    await this.props.getDisposal(token, limit, search, 1, status, undefined, cekTime1, cekTime2);

    const { dataDis, noDis } = this.props.disposal;
    if (val === 'available') {
        const newDis = [];
        for (let i = 0; i < dataDis.length; i++) {
            if (dataDis[i].status_form === 4 && level === '2' && dataDis[i].status_reject !== 1) {
                newDis.push(dataDis[i]);
            } else if (dataDis[i].status_form === 15 && (level === '5' || level === '9') && dataDis[i].status_reject !== 1) {
                newDis.push(dataDis[i]);
            }
        }
        this.setState({filter: val, newDis: newDis, baseData: newDis});
    } else if (val === 'reject') {
        const newDis = [];
        for (let i = 0; i < dataDis.length; i++) {
            if (dataDis[i].status_reject === 1) {
                newDis.push(dataDis[i]);
            }
        }
        this.setState({filter: val, newDis: newDis, baseData: newDis});
    } else if (val === 'finish') {
      const newDis = [];
      for (let i = 0; i < dataDis.length; i++) {
        if (dataDis[i].status_form === 8) {
          newDis.push(dataDis[i]);
        }
      }
      this.setState({filter: val, newDis: newDis, baseData: newDis});
    } else {
      this.setState({filter: val, newDis: dataDis, baseData: dataDis});
    }
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
    await this.props.getApproveDisposal(token, val.no_disposal, 'Disposal');
    await this.props.getDetailDisposal(token, val.no_disposal);
    const {disApp} = this.props.disposal;
    const realApp = disApp.pembuat !== undefined ? Object.values(disApp) : [];
    const finalApp = [];
    for (let i = 0; i < realApp.length; i++) {
      const tempApp = [];
      const item = realApp[i];
      for (let j = 0; j < item.length; j++) {
        const tempPush = item[item.length - (j + 1)];
        const cek = finalApp.find(x => x.length > 0 && x.find(y => y.id === tempPush.id));
        if (cek === undefined) {
            tempApp.push(tempPush);
        }
      }
      if (tempApp.length > 0) {
        finalApp.push(tempApp);
      }
    }
    this.setState({realApp: finalApp.reverse()});
    this.setState({loading: false});
    this.openDetail();
  }

  openDetail = () => {
    this.setState({openDetail: !this.state.openDetail});
  }

  updateDataDis = async () => {
    const {dataUser, token} = this.props.auth;
    const { detailData, date_ba } = this.state;
    const data = {
      date_ba: date_ba,
      doc_sap: detailData.doc_sap,
    };
    // const dataDoc = {
    //     doc_sap: val.doc_sap
    // }
    await this.props.updateDisposal(token, detailData.id, data);
    await this.props.getDetailDisposal(token, detailData.no_disposal, 'pengajuan');
    this.setState({confirm: 'update'});
    this.openConfirm();
  }

  prosesOpenRinci = (val) => {
    this.setState({detailData: val, date_ba: val.date_ba});
    this.openRinci();
  }

  openRinci = () => {
    this.setState({modalRinci: !this.state.modalRinci});
  }

  updateNpwp = async () => {
    const {dataUser, token} = this.props.auth;
    const { detailData } = this.state;
    const data = {
        npwp: detailData.npwp,
    };
    await this.props.updateDisposal(token, detailData.id, data);
    await this.props.getDetailDisposal(token, detailData.no_disposal, 'pengajuan');
    const { detailDis } = this.props.disposal;
    const cekId = detailDis.find(item => item.id === detailData.id);
    if (cekId !== undefined) {
      this.setState({detailData: cekId});
      this.setState({confirm: 'update'});
      this.openConfirm();
    }
  }

  prosesOpenTracking = async (val) => {
    const {dataUser, token} = this.props.auth;
    const level = dataUser.user_level.toString();
    const noSet = val.no_persetujuan === null || val.no_persetujuan === '' ? 'prepare' : val.no_persetujuan;
    await this.props.getApproveDisposal(token, val.no_disposal, 'Disposal');
    await this.props.getApproveSetDisposal(token, noSet, 'disposal persetujuan');
    await this.props.getDetailDisposal(token, val.no_disposal);
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
    // this.props.navigation.navigate('Disposal')
  };

  formatCurrency = (val) => {
    if (!val) {return '';}
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  openSubmit = () => {
    this.setState({modalSubmit: !this.state.modalSubmit});
  }

  openConfirm = () => {
    this.setState({modalConfirm: !this.state.modalConfirm});
  }

  openApprove = () => {
    this.setState({modalApprove: !this.state.modalApprove});
  }

  openReject = () => {
    this.setState({modalReject: !this.state.modalReject});
  }

  prosesOpenDokumen = async (val) => {
    const {dataUser, token} = this.props.auth;
    this.setState({detailData: val});
    const data = {
        noId: val.id,
        noAsset: val.no_asset,
    };
    await this.props.getDocumentDis(token, data, 'disposal', 'pengajuan');
    this.openDokumen();
  }

  openDocEksekusi = async (val) => {
    const {dataUser, token} = this.props.auth;
    this.setState({detailData: val})
    if (val.npwp !== 'ada' &&  val.npwp !== 'tidak' && val.nilai_jual !== '0') {
      this.setState({confirm: 'falseNpwp'});
      this.openConfirm();
    } else {
      const tipeDis = val.nilai_jual === '0' ? 'dispose' : 'sell';
      const data = {
        noId: val.id,
        noAsset: val.no_asset,
      };
      await this.props.getDocumentDis(token, data, 'disposal', tipeDis, val.npwp);
      this.openDokumen();
    }
  }

  openDokumen = () => {
    this.setState({ modalDokumen: !this.state.modalDokumen });
  }

  cekSubmit = async () => {
    const {dataUser, token} = this.props.auth;
    const level = dataUser.user_level.toString();
    const {detailDis} = this.props.disposal;
    const cekSap = [];
    const tempdoc = [];
    const arrDoc = [];
    const cekNo = [];
    for (let i = 0; i < detailDis.length; i++) {
      if (detailDis[i].nilai_jual === '0' && (detailDis[i].doc_sap === null || detailDis[i].doc_sap === '')) {
        cekNo.push(detailDis[i])
      } else if (detailDis[i].nilai_jual === '0' && (detailDis[i].date_ba === null || detailDis[i].date_ba === '')) {
        cekSap.push(detailDis[i]);
      } else {
        const tipeDis = detailDis[i].nilai_jual === '0' ? 'dispose' : 'sell';
        const data = {
          noId: detailDis[i].id,
          noAsset: detailDis[i].no_asset,
        };
        await this.props.getDocumentDis(token, data, 'disposal', tipeDis, detailDis[i].npwp);
        const {dataDoc} = this.props.disposal;
        for (let j = 0; j < dataDoc.length; j++) {
          if (dataDoc[j].path !== null) {
            const arr = dataDoc[j];
            const stat = arr.status_dokumen;
            const cekLevel = stat !== null && stat !== '1' ? stat.split(',').reverse()[0].split(';')[0] : '';
            const cekStat = stat !== null && stat !== '1' ? stat.split(',').reverse()[0].split(';')[1] : '';
            if (cekLevel === ` level ${level}` && cekStat === ' status approve') {
              tempdoc.push(arr);
              arrDoc.push(arr);
            } else {
              arrDoc.push(arr);
            }
          }
        }
      }
    }
    if (cekNo.length > 0) {
      this.setState({confirm: 'falseNodoc'});
      this.openConfirm();
    } else if (cekSap.length > 0) {
      this.setState({confirm: 'falseDateBa'});
      this.openConfirm();
    } else if (tempdoc.length !== arrDoc.length) {
      this.setState({ confirm: 'falseSubmitDok' });
      this.openConfirm();
    } else {
      this.openSubmit();
    }
  }

  cekApprove = async () => {
    const {dataUser, token} = this.props.auth;
    const level = dataUser.user_level.toString();
    const { detailDis } = this.props.disposal;
    const tempdoc = [];
    const arrDoc = [];
    console.log(detailDis);
    for (let i = 0; i < detailDis.length; i++) {
      const data = {
        noId: detailDis[i].id,
        noAsset: detailDis[i].no_asset,
      };
      console.log(`masuk perulangan ${i}`);
      await this.props.getDocumentDis(token, data, 'disposal', 'pengajuan');
      const {dataDoc} = this.props.disposal;
      for (let j = 0; j < dataDoc.length; j++) {
        if (dataDoc[j].path !== null) {
          const arr = dataDoc[j];
          const stat = arr.status_dokumen;
          const cekLevel = stat !== null && stat !== '1' ? stat.split(',').reverse()[0].split(';')[0] : '';
          const cekStat = stat !== null && stat !== '1' ? stat.split(',').reverse()[0].split(';')[1] : '';
          if (cekLevel === ` level ${level}` && cekStat === ' status approve') {
            tempdoc.push(arr);
            arrDoc.push(arr);
          } else {
            arrDoc.push(arr);
          }
        }
      }
    }
    if (tempdoc.length === arrDoc.length) {
      this.openApprove();
    } else {
      this.setState({ confirm: 'falseAppDok' });
      this.openConfirm();
    }
  }

  prepSendEmail = async () => {
    const {dataUser, token} = this.props.auth;
    const { detailDis } = this.props.disposal;

    const tipe = 'submit';

    const tempno = {
      no: detailDis[0].no_disposal,
      kode: detailDis[0].kode_plant,
      jenis: 'disposal',
      tipe: tipe,
      menu: 'Eksekusi Disposal Asset (Disposal asset)',
    };
    this.setState({ tipeEmail: 'submit' });
    await this.props.getDetailDisposal(token, detailDis[0].no_disposal);
    await this.props.getApproveDisposal(token, detailDis[0].no_disposal, 'Disposal');
    await this.props.getDraftEmail(token, tempno);
    this.openDraftEmail();
  }

  prepReject = async (val) => {
    const { detailDis } = this.props.disposal;
    const { listStat, listMut, typeReject, menuRev } = this.state;
    const {dataUser, token} = this.props.auth;
    if (typeReject === 'pembatalan' && listMut.length !== detailDis.length) {
      this.setState({ confirm: 'falseCancel' });
      this.openConfirm();
    } else {
      const tipe = 'reject';
      const menu = 'Pengajuan Disposal Asset (Disposal asset)';
      const tempno = {
        no: detailDis[0].no_disposal,
        kode: detailDis[0].kode_plant,
        jenis: 'disposal',
        tipe: tipe,
        typeReject: typeReject,
        menu: menu,
      };
      this.setState({ tipeEmail: 'reject', dataRej: val });
      await this.props.getDraftEmail(token, tempno);
      this.openDraftEmail();
    }
  }

  openDraftEmail = () => {
    this.setState({ openDraft: !this.state.openDraft });
  }

  approveDisposal = async () => {
    const {dataUser, token} = this.props.auth;
    const level = dataUser.user_level.toString();
    const {detailDis} = this.props.disposal;
    const { arrApp } = this.state;
    const cekApp = arrApp.find(item => item.noDis === detailDis[0].no_disposal);
    const data = {
        no: detailDis[0].no_disposal,
        indexApp: cekApp.index,
    };
    await this.props.approveDisposal(token, data);
    this.prosesSendEmail('approve');
    this.openDraftEmail();
    this.getDataDisposal();
    this.openApprove();
    this.openConfirm(this.setState({confirm: 'approve'}));
    this.openDetail();
  }


  prosesSubmit = async (val) => {
    const {dataUser, token} = this.props.auth;
    const {detailDis} = this.props.disposal;
    // if (value.nilai_jual === '0' && level === '2') {
    //     if (value.doc_sap === null || value.doc_sap === '') {
    //         this.setState({alertSubmit: true})

    //         setTimeout(() => {
    //            this.setState({
    //                alertSubmit: false
    //            })
    //         }, 5000)
    //     } else {
    //         await this.props.submitEksDisposal(token, value.no_asset)
    //     }
    // } else if (value.nilai_jual !== '0' && level === '5' ) {
    //     if (value.npwp === null || value.npwp === '') {
    //         this.setState({alertSubmit2: true})

    //         setTimeout(() => {
    //            this.setState({
    //                 alertSubmit2: false
    //            })
    //         }, 5000)
    //     } else {
    //         await this.props.submitEksDisposal(token, value.no_asset)
    //     }
    // } else {
    //     await this.props.submitEksDisposal(token, value.no_asset)
    // }
    const data = {
        no: detailDis[0].no_disposal,
    };
    await this.props.submitEksDisposal(token, data);
    this.prosesSendEmail('submit');
    this.openSubmit();
    this.openDetail();
    this.openDraftEmail();
    this.setState({confirm: 'submit'});
    this.openConfirm();
    this.getDataDisposal();
  }

  rejectDisposal = async (val) => {
    const { detailDis } = this.props.disposal;
    const { listStat, listMut, typeReject, menuRev } = this.state;
    const {dataUser, token} = this.props.auth;
    let temp = '';
    for (let i = 0; i < listStat.length; i++) {
      temp += listStat[i] + '.';
    }
    const data = {
      alasan: temp + this.state.alasan,
      no: detailDis[0].no_disposal,
      menu: typeReject === 'pembatalan' ? 'Disposal asset' : menuRev,
      list: listMut,
      type: 'verif',
      type_reject: typeReject,
      user_rev: detailDis[0].kode_plant,
    };
    await this.props.rejectDisposal(token, data);
    this.prosesSendEmail(`reject ${typeReject}`);
    this.openDraftEmail();
    this.getDataDisposal();
    this.openReject();
    this.openDetail();
    this.setState({confirm: 'reject'});
    this.openConfirm();
  }

  prosesSendEmail = async (val) => {
    const {dataUser, token} = this.props.auth;
    const { draftEmail } = this.props.tempmail;
    const { detailDis } = this.props.disposal;
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
      no: detailDis[0].no_disposal,
      tipe: 'disposal',
      menu: 'disposal asset',
      proses: val,
      route: val === 'reject perbaikan' ? 'rev-disposal' : 'taxfin-disposal',
    };
    await this.props.sendEmail(token, sendMail);
    await this.props.addNewNotif(token, sendMail);
  }


  render() {
    const {time1, time2, showDateFrom, showDateTo, filter, newDis, detailData, loading, realApp, listMut, listStat, tipeEmail, dataRej, total} = this.state;

    const loadingDepo = this.props.depo.isLoading;
    const loadingDisposal = this.props.disposal.isLoading;
    const loadingUser = this.props.user.isLoading;
    const loadingTempmail = this.props.tempmail.isLoading;
    const loadingNewnotif = this.props.newnotif.isLoading;
    const loadingDokumen = this.props.dokumen.isLoading;
    const loadingSetuju = this.props.setuju.isLoading;
    const loadingAll = loadingDepo || loadingSetuju || loadingDisposal || loadingUser || loadingTempmail || loadingNewnotif || loadingDokumen || loading;

    const { dataDis, noDis, dataDoc, detailDis, statusList, dataReason} = this.props.disposal;

    const statusOptions = [
      {key: 'all', label: 'All'},
      {key: 'available', label: 'Available Approve'},
      {key: 'submit', label: 'Eksekusi Disposal'},
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

    const {dataUser} = this.props.auth;
    const level = dataUser.user_level;

    return (
      <>
      <View style={{flex: 1}}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.bodyTitle}>
            <Text style={styles.title}>Eksekusi Disposal Asset</Text>
            {(level === 5 || level === 9) && (
              <TouchableOpacity
                // onPress={() => this.props.navigation.navigate('DisposalTab', {screen: 'CartDisposal'})}
                onPress={() => this.props.navigation.navigate('CartDisposal')}
              >
                <IconAwe name="plus" size={20} color={'green'} />
              </TouchableOpacity>
            )}
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

          {/* Badge Status */}
          <View style={styles.badgeRow}>
            {statusOptions.filter(x => (level === 5 || level === 9) ? x.key !== 'available' : x.key !== 'submit').map(item => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.badge,
                  filter === item.key && styles.badgeActive,
                ]}
                onPress={() => this.changeFilter(item.key)}>
                <Text
                  style={[
                    styles.badgeText,
                    filter === item.key && styles.badgeTextActive,
                  ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* LIST CARD */}
        <ScrollView
          style={[newDis.length === 0 ? styles.blankBg : styles.scrollArea]}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={loadingAll}
              onRefresh={() => this.changeFilter(this.state.filter)}
            />
          }
        >

          {newDis.length > 0 && newDis.map((item, index) => (
            <View style={styles.card} key={index}>
              <LinearGradient
                colors={['#e53935', '#e35d5b']}
                style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>
                  {item.no_disposal}
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
                  <Text style={styles.cardText}>Tanggal Ajuan: {moment(item.tanggalDis).format('DD MMMM YYYY')}</Text>
                </View>

                <View style={styles.row}>
                  <Ionicons name="pricetag-outline" size={18} color="#555" />
                  <Text style={styles.cardText}>Status: {item.history !== null ? item.history.split(',').reverse()[0] : '-'}</Text>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.detailButton} onPress={() => this.prosesOpenDetail(item)}>
                    <Text style={styles.detailButtonText}>{filter === 'available' || filter === 'submit' ? 'Proses' : 'Detail'}</Text>
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
          {newDis.length === 0 && (
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
                <Text style={styles.headerTitleModal}>Detail Disposal Asset</Text>
                <Text style={styles.headerSubModal}>{detailDis.length > 0 ? detailDis[0].no_disposal : ''}</Text>
              </View>

              {/* Info Utama */}
              <View style={styles.infoCardModal}>
                <Text style={styles.infoTextModal}>Tanggal Form: {detailDis.length > 0 ? moment(detailDis[0].tanggalDis).format('DD MMMM YYYY') : '-'}</Text>
                <Text style={styles.infoTextModal}>Cabang/Depo: {detailDis.length > 0 ? detailDis[0].area : ''}</Text>
                <Text style={styles.infoTextModal}>Cost Center: {detailDis.length > 0 ? detailDis[0].cost_center : ''}</Text>
              </View>

              {/* Daftar Asset */}
              <Text style={styles.sectionTitleModal}>Daftar Asset</Text>
              {detailDis.length > 0 && detailDis.map((item, index) => (
                <View key={index} style={[styles.assetCardModal, item.status_app === 0 ? styles.note : listMut.find(element => element === item.id) !== undefined ? styles.note : styles.backgroundWhite]}>
                  <TouchableOpacity
                    disabled={item.status_app === 0 ? true : false}
                    onPress={listMut.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                  >
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
                  </TouchableOpacity>
                  {(filter === 'available' && item.nilai_jual === '0') && (
                  <TouchableOpacity
                    style={[styles.buttonDoc, styles.btnColorApprove, { marginBottom: 10 }]}
                    onPress={() => this.prosesOpenRinci(item)}
                  >
                    <Text style={styles.buttonTextModal}>
                      Proses
                    </Text>
                  </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.buttonDoc, styles.btnColorProses]}
                    onPress={() => this.openDocEksekusi(item)}
                  >
                    <Text style={styles.buttonTextModal}>
                      Dokumen
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}

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
                {filter === 'available' && (
                  <>
                    <TouchableOpacity
                      style={[styles.buttonModal, styles.btnColorApprove]}
                      onPress={() => this.cekSubmit()}
                    >
                      <Text style={styles.buttonTextModal}>
                        Submit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.buttonModal, this.state.listMut.length === 0 ? styles.btnColorSec : styles.btnColorReject]}
                      onPress={() => this.openReject()}
                      disabled={this.state.listMut.length === 0}
                    >
                      <Text style={styles.buttonTextModal}>Reject</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>

            </ScrollView>

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
                    <Text style={styles.sectionTitleInfo}>Berhasil Approve Disposal</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : (this.state.confirm === 'falseCancel') ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Reject Disposal</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Reject pembatalan hanya bisa dilakukan jika semua data ajuan terceklis</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : this.state.confirm === 'reject' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="check-circle" color={'green'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Berhasil Reject Disposal</Text>
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
                ) : this.state.confirm === 'update' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="check-circle" color={'green'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Berhasil Update</Text>
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
                ) : (this.state.confirm === 'falseVal') ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Submit</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Mohon untuk isi nilai jual terlebih dulu</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : (this.state.confirm === 'falseDoc') ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Submit</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Mohon untuk upload dokumen terlebih dulu</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : (this.state.confirm === 'falseNpwp') ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Mohon isi status NPWP terlebih dahulu</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : (this.state.confirm === 'falseDateBa') ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Submit</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Pastikan Tanggal BA telah diinput</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : (this.state.confirm === 'falseNodoc') ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Submit</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Pastikan nomor document SAP telah diinput</Text>
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
          typeEmail={{type: tipeEmail === 'reject' ? 'reject' : tipeEmail === 'submit' ? 'submit' : 'approve'}}
          handleSubmit={
            tipeEmail === 'reject' ? this.rejectDisposal
            : tipeEmail === 'submit' && this.prosesSubmit
          }
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
                proses: filter === 'available' ? 'approval' : filter === 'submit' ? 'upload' : 'show',
                tipe: filter === 'available' ? 'eksekusi disposal' : 'disposal',
                noDoc:  detailDis.length > 0 ? detailDis[0].id : '',
                noTrans: detailDis.length > 0 ? detailDis[0].no_disposal : '',
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
        isVisible={this.state.modalRinci}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        // backdropOpacity={0.4}
        onBackdropPress={this.openRinci}
        useNativeDriver={true}
      >
        <View style={styles.modalContainerDetail}>
        <ScrollView>
          {/* Header */}
          <Text style={styles.headerTextDetail}>Proses Disposal</Text>
          <Text style={styles.assetNameTextDetail}>{detailData.nama_asset}</Text>

          {/* Image */}
          <View style={styles.imageWrapperDetail}>
            <Image
              source={placeholder}
              style={styles.imageDetail}
            />
          </View>

          {/* Form */}
          <View style={styles.formGroupDetail}>
            <Text style={styles.labelDetail}>No Asset :</Text>
            <TextInput style={styles.inputDetail} editable={false} value={detailData.no_asset} />
          </View>

          <View style={styles.formGroupDetail}>
            <Text style={styles.labelDetail}>Merk / Type :</Text>
            <TextInput style={styles.inputDetail} editable={false} value={detailData.merk} />
          </View>

          <View style={styles.formGroupDetail}>
            <Text style={styles.labelDetail}>Kategori :</Text>
            <View style={styles.checkboxWrapperDetail}>
              <TouchableOpacity
                  // style={[
                  //   styles.checkboxDetail,
                  //   this.state.selectedKategori === item && styles.checkboxActiveDetail,
                  // ]}
                  style={[
                    styles.checkboxDetail,
                    styles.checkboxActiveDetail,
                  ]}
                >
                  <Text>{detailData.kategori === null || detailData.kategori === undefined ? '-' : detailData.kategori}</Text>
                </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroupDetail}>
            <Text style={styles.labelDetail}>Cost Center :</Text>
            <TextInput style={styles.inputDetail} editable={false} value={detailData.cost_center} />
          </View>

          <View style={styles.formGroupDetail}>
            <Text style={styles.labelDetail}>Nilai Buku :</Text>
            <TextInput style={styles.inputDetail} editable={false} value={detailData.nilai_buku} />
          </View>

          <View style={styles.formGroupDetail}>
            <Text style={styles.labelDetail}>Keterangan :</Text>
            <TextInput style={styles.inputDetail} editable={false} value={detailData.keterangan} />
          </View>

          {detailData.nilai_jual !== '0' && (
            <View style={styles.formGroupDetail}>
              <Text style={styles.labelDetail}>Status NPWP :</Text>
              <View style={styles.pickerWrapperDetail}>
                <Picker
                  selectedValue={`${detailData.npwp}`}
                  style={styles.pickerDetail}
                >
                  <Picker.Item label="Select..." value="" />
                  <Picker.Item label="Ada" value="ada" />
                  <Picker.Item label="Tidak ada" value="tidak" />
                </Picker>
              </View>
              {(detailData.npwp === '' || !detailData.npwp) && (
                <Text style={styles.errorTextDetail}>Must be filled</Text>
              )}
            </View>
          )}

          {(level === 2 && detailData.nilai_jual === '0') && (
            <>
              <View style={styles.formGroupDetail}>
                <Text style={styles.labelDetail}>Tgl BA Pemusnahan Asset :</Text>
                <TouchableOpacity style={styles.inputDetail} onPress={() => this.setState({openEditDate: true})}>
                  <Text style={styles.textColor}>{moment(this.state.date_ba).format('DD MMMM YYYY')}</Text>
                </TouchableOpacity>
                {(this.state.date_ba === '' || !this.state.date_ba) && (
                  <Text style={styles.errorTextDetail}>Must be filled</Text>
                )}
              </View>
              {this.state.openEditDate && (
                <DateTimePicker
                  value={new Date(time1)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(e, date) => this.setEditDate(e, date)}
                />
              )}

              <View style={styles.formGroupDetail}>
                <Text style={styles.labelDetail}>Nomor Doc SAP  :</Text>
                <TextInput 
                  style={[styles.inputDetail, styles.backgroundWhite]} 
                  value={detailData.doc_sap} 
                  onChangeText={(val) => this.setState({detailData: { ...detailData, doc_sap: val }})}
                />
                {(detailData.doc_sap === null || detailData.doc_sap === '') && (
                  <Text style={styles.errorTextDetail}>Must be filled</Text>
                )}
              </View>
            </>
          )}
          {/* Buttons */}
          <View style={styles.buttonWrapperDetail}>
            {(level === 2 && detailData.nilai_jual === '0') && (
              <TouchableOpacity
                style={[
                  styles.addButtonDetail,
                  (detailData.doc_sap === '' || !detailData.doc_sap || this.state.date_ba === '') && { backgroundColor: '#9CA3AF' },
                ]}
                disabled={(detailData.doc_sap === '' || !detailData.doc_sap || this.state.date_ba === '')}
                onPress={() => this.updateDataDis()}
              >
                <Text style={styles.addButtonTextDetail}>Save</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.closeButtonDetail} onPress={this.openRinci}>
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
    margin:0,
    padding: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 40,
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
  errorTextDetail: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
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
    width: 180,
    height: 180,
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
    backgroundColor: '#F9FAFB',
    color: '#111827',
  },
  textColor: {
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
});

const mapStateToProps = state => ({
    asset: state.asset,
    depo: state.depo,
    disposal: state.disposal,
    setuju: state.setuju,
    user: state.user,
    tempmail: state.tempmail,
    newnotif: state.newnotif,
    dokumen: state.dokumen,
    auth: state.auth,
});

const mapDispatchToProps = {
    getDetailDepo: depo.getDetailDepo,
    getDepo: depo.getDepo,
    getDisposal: disposal.getDisposal,
    addDisposal: disposal.addDisposal,
    deleteDisposal: disposal.deleteDisposal,
    resetDis: disposal.reset,
    getNameApprove: approve.getNameApprove,
    getApproveDisposal: disposal.getApproveDisposal,
    approveDisposal: disposal.approveDisposal,
    rejectDisposal: disposal.rejectDisposal,
    getDocumentDis: disposal.getDocumentDis,
    approveDocDis: disposal.approveDocDis,
    rejectDocDis: disposal.rejectDocDis,
    showDokumen: pengadaan.showDokumen,
    submitSetDisposal: setuju.submitSetDisposal,
    addSell: disposal.addSell,
    resAppRej: disposal.resAppRej,
    getSubmitDisposal: disposal.getSubmitDisposal,
    getRole: user.getRole,
    getDetailDisposal: disposal.getDetailDisposal,
    getDraftEmail: tempmail.getDraftEmail,
    sendEmail: tempmail.sendEmail,
    addNewNotif: newnotif.addNewNotif,
    getDetailUser: user.getDetailUser,
    getApproveSetDisposal: setuju.getApproveSetDisposal,
    getUser: user.getUser,
    genNoSetDisposal: setuju.genNoSetDisposal,
    updateDisposal: disposal.updateDisposal,
    uploadDocumentDis: disposal.uploadDocumentDis,
    submitEksDisposal: setuju.submitEksDisposal,
    searchDisposal: disposal.searchDisposal,
};

export default connect(mapStateToProps, mapDispatchToProps)(EksekusiDisposal);
