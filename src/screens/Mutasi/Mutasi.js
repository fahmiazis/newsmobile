/* eslint-disable prettier/prettier */
/* eslint-disable no-return-assign */
/* eslint-disable radix */
import React, {Component} from 'react';
import {
  View, Text, ScrollView,
  TextInput, TouchableOpacity, RefreshControl,
  StyleSheet, Platform, Image,
  Button,
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
import mutasi from '../../redux/actions/mutasi';
import tempmail from '../../redux/actions/tempmail';
import newnotif from '../../redux/actions/newnotif';
import user from '../../redux/actions/user';
import dokumen from '../../redux/actions/dokumen';

import blankImg from '../../assets/blank.png';

import TrackingModal from '../../components/Mutasi/Tracking';
import EmailModal from '../../components/Mutasi/Email';
import ModalDokumen from '../../components/ModalDokumen';

class Mutasi extends Component {
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
      newMut: [],
      listMut: [],
      filter: 'available',
      openDetail: false,
      realApp: [],
      barcode: null,
      modalScan: false,
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
      openEditDate: false,
      tgl_mutasifisik: null,
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
      await this.props.getDepo(token, 1000, '');
      await this.props.getDetailUser(token, id);
      this.getDataMutasi();
  }

  getDataMutasi = async () => {
      const { filter } = this.state;
      this.changeFilter(filter);
  }

  changeFilter = async (val) => {
      const {dataUser, token} = this.props.auth;
      const level = dataUser.user_level;
      const kode = dataUser.kode_plant;
      const { dataDepo } = this.props.depo;
      const { detailUser, dataRole } = this.props.user;
      const { time1, time2, search, limit } = this.state;
      const cekTime1 = time1 === '' ? 'undefined' : moment(time1).format('YYYY-MM-DD');
      const cekTime2 = time2 === '' ? 'undefined' : moment(time2).format('YYYY-MM-DD');
      const status = val === 'finish' ? '8' : 'all';
      console.log(search);
      await this.props.getMutasi(token, status, cekTime1, cekTime2, search, 100);

      const { dataMut, noMut } = this.props.mutasi;
      const role = dataUser.role;
      // const divisi = level === '16' || level === '13' ? dataRole.find(({ nomor }) => nomor === '27').name : localStorage.getItem('role')
      const arrRole = detailUser.detail_role;
      const listRole = [];
      for (let i = 0; i < arrRole.length + 1; i++) {
          if (detailUser.user_level === 1) {
              const data = {fullname: 'admin', name: 'admin', nomor: '1', type: 'all'};
              listRole.push(data);
          } else if (i === arrRole.length) {
              const cek = dataRole.find(item => parseInt(item.nomor) === detailUser.user_level);
              if (cek !== undefined) {
                  listRole.push(cek);
              }
          } else {
              const cek = dataRole.find(item => parseInt(item.nomor) === arrRole[i].id_role);
              if (cek !== undefined) {
                  listRole.push(cek);
              }
          }
      }
      console.log(dataMut);
      if (val === 'available') {
          const newMut = [];
          const arrApp = [];
          for (let i = 0; i < dataMut.length; i++) {
              const depoFrm = dataDepo.find(item => item.kode_plant === dataMut[i].kode_plant);
              const depoTo = dataDepo.find(item => item.kode_plant === dataMut[i].kode_plant_rec);
              for (let x = 0; x < listRole.length; x++) {
                  console.log(listRole);
                  const app = dataMut[i].appForm === undefined ? [] : dataMut[i].appForm;
                  const cekFrm = listRole[x].type === 'area' && depoFrm !== undefined ? (depoFrm.nama_bm === detailUser.fullname || depoFrm.nama_om === detailUser.fullname || depoFrm.nama_aos === detailUser.fullname ? 'pengirim' : 'not found') : 'all';
                  const cekTo = listRole[x].type === 'area' && depoTo !== undefined ? (depoTo.nama_bm === detailUser.fullname || depoTo.nama_om === detailUser.fullname || depoTo.nama_aos === detailUser.fullname ? 'penerima' : 'not found') : 'all';
                  const cekFin = cekFrm === 'pengirim' ? 'pengirim' : cekTo === 'penerima' ? 'penerima' : 'all';
                  const cekApp = app.find(item => (item.jabatan === listRole[x].name) && (cekFin === 'all' ? (item.struktur === null || item.struktur === 'all') : (item.struktur === cekFin)));
                  const find = app.indexOf(cekApp);
                  // console.log(listRole[x])
                  // console.log(cekApp)
                  // console.log(cekFrm)
                  // console.log(cekTo)
                  // console.log(cekFin)
                  if (level === 5 || level === 9) {
                      console.log('at available 2');
                      if (find === 0 || find === '0') {
                          console.log('at available 3');
                          if (dataMut[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1 && dataMut[i].kode_plant_rec === kode) {
                              if (newMut.find(item => item.no_mutasi === dataMut[i].no_mutasi) === undefined) {
                                  newMut.push(dataMut[i]);
                                  arrApp.push({index: find, noMut: dataMut[i].no_mutasi});
                              }
                          }
                      } else {
                          console.log('at available 4');
                          if (find !== app.length - 1) {
                              if (dataMut[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1 && dataMut[i].kode_plant_rec === kode) {
                                  if (newMut.find(item => item.no_mutasi === dataMut[i].no_mutasi) === undefined) {
                                      newMut.push(dataMut[i]);
                                      arrApp.push({index: find, noMut: dataMut[i].no_mutasi});
                                  }
                              }
                          }
                      }
                  } else if (find === 0 || find === '0') {
                      console.log('at available 8');
                      if (dataMut[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1) {
                          if (newMut.find(item => item.no_mutasi === dataMut[i].no_mutasi) === undefined) {
                              newMut.push(dataMut[i]);
                              arrApp.push({index: find, noMut: dataMut[i].no_mutasi});
                          }
                      }
                  } else {
                      console.log('at available 5');
                      if (dataMut[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
                          if (newMut.find(item => item.no_mutasi === dataMut[i].no_mutasi) === undefined) {
                              newMut.push(dataMut[i]);
                              arrApp.push({index: find, noMut: dataMut[i].no_mutasi});
                          }
                      }
                  }
              }
          }
          this.setState({ filter: val, newMut: newMut, arrApp: arrApp });
      } else if (val === 'reject' && dataMut.length > 0) {
          const newMut = [];
          for (let i = 0; i < dataMut.length; i++) {
              if (dataMut[i].status_reject === 1) {
                  newMut.push(dataMut[i]);
              }
          }
          this.setState({ filter: val, newMut: newMut });
      } else if (val === 'finish' && dataMut.length > 0) {
          const newMut = [];
          for (let i = 0; i < dataMut.length; i++) {
              if (dataMut[i].status_form === 8) {
                  newMut.push(dataMut[i]);
              }
          }
          this.setState({ filter: val, newMut: newMut });
      } else {
          const newMut = [];
          for (let i = 0; i < dataMut.length; i++) {
              newMut.push(dataMut[i]);
          }
          this.setState({ filter: val, newMut: newMut });
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
    await this.props.getApproveMut(token, val.no_mutasi, val.kode_plant.split('').length === 4 ? 'Mutasi' : 'Mutasi HO');
    await this.props.getDetailMutasi(token, val.no_mutasi);
    const {mutApp} = this.props.mutasi;
    const realApp = mutApp.pembuat !== undefined ? Object.values(mutApp) : [];
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
    if (filter === 'available') {
        const {detailMut} = this.props.mutasi;
        const { arrApp } = this.state;
        const cekApp = arrApp.find(item => item.noMut === detailMut[0].no_mutasi);
        this.setState({selApp: cekApp, tgl_mutasifisik: detailMut[0].tgl_mutasifisik});
        this.openDetail();
    } else {
        this.openDetail();
    }
  }

  openDetail = () => {
    this.setState({openDetail: !this.state.openDetail});
  }

  openReject = () => {
    this.setState({modalReject: !this.state.modalReject});
  }

  prosesOpenTracking = async (val) => {
    const {dataUser, token} = this.props.auth;
    const level = dataUser.user_level.toString();
    await this.props.getApproveMut(token, val.no_mutasi, val.kode_plant.split('').length === 4 ? 'Mutasi' : 'Mutasi HO');
    await this.props.getDetailMutasi(token, val.no_mutasi);
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
    // this.props.navigation.navigate('Mutasi')
  };

  goCart = () => {
    this.props.navigation.navigate('CartMutasi');
  }

  setEditDate = (event, selectedDate, type) => {
    this.setState({openEditDate: false});
    if (selectedDate) {
      this.setState({tgl_mutasifisik: selectedDate});
    }
  };

  editDate = async () => {
    const {dataUser, token} = this.props.auth;
    const { detailMut } = this.props.mutasi;
    const data = {
      tgl_mutasifisik: this.state.tgl_mutasifisik,
    };
    await this.props.changeDate(token, detailMut[0].no_mutasi, data);
    await this.props.getDetailMutasi(token, detailMut[0].no_mutasi);
    this.setState({confirm: 'update'});
    this.openConfirm();
    // this.reOpenDetailMut()
  }

  cekApprove = () => {
    const {dataUser, token} = this.props.auth;
    const level = dataUser.user_level;
    const { detailMut } = this.props.mutasi;
    const totalDoc = [];
    const uploadDoc = [];
    for (let i = 0; i < detailMut.length; i++) {
      const docMutasi = detailMut[i].docAsset;
      for (let j = 0; j < docMutasi.length; j++) {
        const dokumen = docMutasi[j];
        totalDoc.push(dokumen);
        if (dokumen.path !== null) {
          uploadDoc.push(dokumen);
        }
      }
    }
    if ((level === 5 || level === 9) && (totalDoc.length !== uploadDoc.length || detailMut[0].docAsset.length === 0)) {
      this.setState({confirm: 'docFirst'});
      this.openConfirm();
    } else if ((level === 5 || level === 9) && (detailMut[0].tgl_mutasifisik === null || detailMut[0].tgl_mutasifisik === 'null' || detailMut[0].tgl_mutasifisik === '')) {
      this.setState({confirm: 'dateFirst'});
      this.openConfirm();
    } else {
      this.openApprove();
    }
  }

  openApprove = () => {
    this.setState({modalApprove: !this.state.modalApprove});
  }


  prepSendEmail = async () => {
      const {dataUser, token} = this.props.auth;
      const { detailMut } = this.props.mutasi;
      const { selApp } = this.state;

      const app = detailMut[0].appForm;
      const tempApp = [];
      for (let i = 0; i < app.length; i++) {
          if (app[i].status === 1) {
              tempApp.push(app[i]);
          }
      }
      const tipe = tempApp.length === app.length - 1 ? 'full approve' : 'approve';

      const tempno = {
          no: detailMut[0].no_mutasi,
          kode: detailMut[0].kode_plant,
          jenis: 'mutasi',
          tipe: tipe,
          menu: 'Pengajuan Mutasi Asset (Mutasi asset)',
          indexApp: selApp.index,
      };
      this.setState({ tipeEmail: 'approve' });
      await this.props.getDetailMutasi(token, detailMut[0].no_mutasi);
      await this.props.getApproveMut(token, detailMut[0].no_mutasi, 'Mutasi');
      await this.props.getDraftEmail(token, tempno);
      this.openDraftEmail();
    }

    openDraftEmail = () => {
        this.setState({ openDraft: !this.state.openDraft });
    }

    openConfirm = () => {
      this.setState({modalConfirm: !this.state.modalConfirm});
    }

    prepReject = async (val) => {
      const { detailMut } = this.props.mutasi;
      const { listStat, listMut, typeReject, menuRev } = this.state;
      const {dataUser, token} = this.props.auth;
      if (typeReject === 'pembatalan' && listMut.length !== detailMut.length) {
          this.setState({ confirm: 'falseCancel' });
          this.openConfirm();
      } else {
          const tipe = 'reject';
          const menu = 'Pengajuan Mutasi Asset (Mutasi asset)';
          const tempno = {
              no: detailMut[0].no_mutasi,
              kode: detailMut[0].kode_plant,
              jenis: 'mutasi',
              tipe: tipe,
              typeReject: typeReject,
              menu: menu,
          };
          this.setState({ tipeEmail: 'reject', dataRej: val });
          await this.props.getDraftEmail(token, tempno);
          this.openDraftEmail();
      }
    }

    rejectMutasi = async (val) => {
        const { listStat, listMut, typeReject, menuRev, selApp, alasan } = this.state;
        const { detailMut } = this.props.mutasi;
        const {dataUser, token} = this.props.auth;
        const level = dataUser.user_level;
        let temp = '';
        for (let i = 0; i < listStat.length; i++) {
            temp += listStat[i] + '.';
        }
        const data = {
            alasan: temp + alasan,
            no: detailMut[0].no_mutasi,
            menu: typeReject === 'pembatalan' ? 'Mutasi asset' : menuRev,
            list: listMut,
            type: level === 2 || level === 8 ? 'verif' : 'form',
            type_reject: typeReject,
            user_rev: detailMut[0].kode_plant,
            indexApp: `${selApp.index}`,
        };
        console.log(data);
        await this.props.rejectMut(token, data);
        this.prosesSendEmail(`reject ${typeReject}`);
        this.setState({ confirm: 'reject' });
        this.openConfirm();
        this.openReject();
        this.openDetail();
        this.getDataMutasi();
        this.openDraftEmail();
    }

    approveMutasi = async () => {
        const { detailMut } = this.props.mutasi;
        const { selApp } = this.state;
        const {dataUser, token} = this.props.auth;
        await this.props.approveMutasi(token, detailMut[0].no_mutasi, selApp.index);
        this.prosesSendEmail('approve');
        this.setState({ confirm: 'approve' });
        this.openConfirm();
        this.openApprove();
        this.openDetail();
        this.getDataMutasi();
        this.openDraftEmail();
    }

    prosesSendEmail = async (val) => {
        const {dataUser, token} = this.props.auth;
        const { draftEmail } = this.props.tempmail;
        const { detailMut } = this.props.mutasi;
        const { message, subject } = this.state;
        const cc = draftEmail.cc;
        const tempcc = [];
        for (let i = 0; i < cc.length; i++) {
            tempcc.push(cc[i].email);
        }

        const app = detailMut[0].appForm;
        const tempApp = [];
        for (let i = 0; i < app.length; i++) {
            if (app[i].status === 1) {
                tempApp.push(app[i]);
            }
        }

        const tipe = (tempApp.length === app.length - 1 || tempApp.length === app.length) ? 'full approve' : 'approve';
        const cekBudget = detailMut.find(item => item.isbudget === 'ya') !== undefined;

        const sendMail = {
            draft: draftEmail,
            nameTo: draftEmail.to.fullname,
            to: draftEmail.to.email,
            cc: tempcc.toString(),
            message: message,
            subject: subject,
            no: detailMut[0].no_mutasi,
            tipe: 'mutasi',
            menu: 'mutasi asset',
            proses: val,
            route: val === 'reject perbaikan' ? 'rev-mutasi' : (tipe === 'full approve' && val === 'approve' && !cekBudget) ? 'eks-mutasi' : (tipe === 'full approve' && val === 'approve' && cekBudget) ? 'budget-mutasi' : 'mutasi',
        };
        await this.props.sendEmail(token, sendMail);
        await this.props.addNewNotif(token, sendMail);
    }

  prosesOpenDokumen = async () => {
    const {dataUser, token} = this.props.auth;
    const { detailMut } = this.props.mutasi;
    await this.props.getDocumentMut(token, detailMut[0].no_mutasi, detailMut[0].no_mutasi);
    this.openDokumen();
  }

  openDokumen = () => {
    this.setState({ modalDokumen: !this.state.modalDokumen });
  }

  render() {
    const {time1, time2, showDateFrom, showDateTo, filter, newMut, openDetail, loading, realApp, listMut, listStat, tipeEmail, dataRej} = this.state;

    const loadingDepo = this.props.depo.isLoading;
    const loadingMutasi = this.props.mutasi.isLoading;
    const loadingUser = this.props.user.isLoading;
    const loadingTempmail = this.props.tempmail.isLoading;
    const loadingNewnotif = this.props.newnotif.isLoading;
    const loadingDokumen = this.props.dokumen.isLoading;
    const loadingAll = loadingDepo || loadingMutasi || loadingUser || loadingTempmail || loadingNewnotif || loadingDokumen || loading;

    const { dataMut, noMut, dataDoc, detailMut, statusList} = this.props.mutasi;

    const statusOptions = [
      {key: 'all', label: 'All'},
      {key: 'available', label: 'Available Approve'},
      {key: 'reject', label: 'Reject'},
      {key: 'finish', label: 'Finished'},
    ];

    const dataReason = [
      {name: 'Asset mutasi tidak sesuai'},
      {name: 'Penerima mutasi tidak sesuai'},
      {name: 'Alasan mutasi tidak sesuai'},
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
            <Text style={styles.title}>Mutasi Asset</Text>
            {(level === 5 || level === 9) && (
              <TouchableOpacity
              // onPress={() => this.props.navigation.navigate('MutasiTab', {screen: 'CartMutasi'})}
              onPress={() => this.props.navigation.navigate('CartMutasi')}
              >
                <IconAwe name="plus" size={20} color={'green'}/>
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
            {statusOptions.map(item => (
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
          style={newMut.length === 0 ? styles.blankBg : styles.scrollArea}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={loadingAll}
              onRefresh={() => this.changeFilter(this.state.filter)}
            />
          }
        >

          {newMut.length > 0 && newMut.map((item, index) => (
            <View style={styles.card} key={index}>
              <LinearGradient
                colors={['#e53935', '#e35d5b']}
                style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>
                  {item.no_mutasi}
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
                  <Text style={styles.cardText}>Area Asal: {item.area}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                      {statusList.find(x => x.status_form === item.status_form)?.title || ''}
                    </Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <Ionicons name="location-outline" size={18} color="#555" />
                  <Text style={styles.cardText}>Area Tujuan: {item.area_rec}</Text>
                </View>

                <View style={styles.row}>
                  <Ionicons name="calendar-outline" size={18} color="#555" />
                  <Text style={styles.cardText}>Tanggal Ajuan: {moment(item.tanggalMut).format('DD MMMM YYYY')}</Text>
                </View>

                <View style={styles.row}>
                  <Ionicons name="pricetag-outline" size={18} color="#555" />
                  <Text style={styles.cardText}>Status: {item.history !== null ? item.history.split(',').reverse()[0] : '-'}</Text>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.detailButton} onPress={() => this.prosesOpenDetail(item)}>
                    <Text style={styles.detailButtonText}>{filter === 'available' ? 'Proses' : 'Detail'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.trackingButton} onPress={() => this.prosesOpenTracking(item)}>
                    <Text style={styles.trackingButtonText}>Tracking</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          {newMut.length === 0 && (
            <View style={styles.blankBody}>
              <Image source={blankImg} style={styles.blankImg}/>
              {/* <Text>Data ajuan tidak ditemukan</Text> */}
            </View>
          )}
        </ScrollView>
      </View>
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
                <Text style={styles.headerTitleModal}>Detail Mutasi Asset</Text>
                <Text style={styles.headerSubModal}>{detailMut.length > 0 ? detailMut[0].no_mutasi : ''}</Text>
              </View>

              {/* Info Utama */}
              <View style={styles.infoCardModal}>
                <Text style={styles.infoTextModal}>Tanggal Form: {detailMut.length > 0 ? moment(detailMut[0].tanggalMut).format('DD MMMM YYYY') : '-'}</Text>
                <Text style={styles.infoTextModal}>Tanggal Mutasi Fisik: {detailMut.length > 0 ? (detailMut[0].tgl_mutasifisik === null ? '-' : moment(detailMut[0].tgl_mutasifisik).format('DD MMMM YYYY')) : '-'}</Text>
                <Text>{''}</Text>
                <Text style={styles.infoTextModal}>Cabang/Depo Asal: {detailMut.length > 0 ? detailMut[0].area : ''}</Text>
                <Text style={styles.infoTextModal}>Cost Center Asal: {detailMut.length > 0 ? detailMut[0].cost_center : ''}</Text>
                <Text>{''}</Text>
                <Text style={styles.infoTextModal}>Cabang/Depo Tujuan: {detailMut.length > 0 ? detailMut[0].area_rec : ''}</Text>
                <Text style={styles.infoTextModal}>Cost Center Tujuan: {detailMut.length > 0 ? detailMut[0].cost_center_rec : ''}</Text>
              </View>

              {/* Daftar Asset */}
              <Text style={styles.sectionTitleModal}>Daftar Asset</Text>
              {detailMut.length > 0 && detailMut.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  disabled={item.status_app === 0 ? true : false}
                  style={[styles.assetCardModal, item.status_app === 0 ? styles.note : listMut.find(element => element === item.id) !== undefined ? styles.note : styles.backgroundWhite]}
                  onPress={listMut.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                >
                  <View style={styles.bodyCheck}>
                    <Text style={styles.assetTitleModal}>{item.nama_asset}</Text>
                    {item.status_app === 0 ? (
                      <IconAwe name="check" size={15} color={'#e53935'}/>
                    ) : listMut.find(element => element === item.id) !== undefined ? (
                      <IconAwe name="check" size={15} color={'#e53935'}/>
                    ) : <Text>{''}</Text>}
                  </View>
                  <View style={styles.assetRowModal}>
                    <Text style={styles.assetLabelModal}>No Asset:</Text>
                    <Text style={styles.assetValueModal}>{item.no_asset}</Text>
                  </View>
                  <View style={styles.assetRowModal}>
                    <Text style={styles.assetLabelModal}>Type/Merk:</Text>
                    <Text style={styles.assetValueModal}>{item.merk}</Text>
                  </View>
                  <View style={styles.assetRowModal}>
                    <Text style={styles.assetLabelModal}>Kategori:</Text>
                    <Text style={styles.assetValueModal}>{item.kategori}</Text>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Alasan Mutasi */}
              <View style={styles.sectionModal}>
                <Text style={styles.sectionTitleModal}>Alasan Mutasi</Text>
                <View style={[styles.assetCardModal, styles.backgroundWhite]}>
                    <Text style={styles.infoTextModal}>{detailMut.length > 0 ? detailMut[0].alasan : ''}</Text>
                </View>
              </View>

              {/* Tgl Mutasi Fisik */}
              {(level === 5 || level === 9) && filter === 'available' && (
                <View style={styles.sectionModal}>
                  <Text style={styles.sectionTitleModal}>Tgl Mutasi Fisik</Text>
                  <TouchableOpacity
                    style={[styles.assetCardModal, styles.backgroundWhite]}
                    onPress={() => this.setState({openEditDate: true})}
                  >
                    <Text style={styles.infoTextModal}>{this.state.tgl_mutasifisik !== null ? moment(this.state.tgl_mutasifisik).format('DD MMMM YYYY') : '-'}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.buttonDoc, styles.btnColorApprove]}
                    onPress={() => this.editDate()}

                  >
                    <Text style={styles.buttonTextModal}>
                      Update
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {this.state.openEditDate && (
                <DateTimePicker
                  value={new Date(time1)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(e, date) => this.setEditDate(e, date)}
                />
              )}

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
                <Text style={styles.smallTextModal}>
                  Area ke Area: Dibuat AOS, Diperiksa BM, ROM, GAAM, Disetujui Head Ops
                </Text>
                <Text style={styles.smallTextModal}>
                  HO ke Area: Dibuat GA SPV, Diperiksa BM, Disetujui Head Ops Excellence
                </Text>
              </View>

              <View style={styles.footerModal}>
                {(level === 5 || level === 9) && (
                  <TouchableOpacity
                    style={[styles.buttonModal, styles.btnColorProses]}
                    onPress={() => this.prosesOpenDokumen()}
                    // onPress={() => this.openDokumen()}
                  >
                    <Text style={styles.buttonTextModal}>
                      Dokumen
                    </Text>
                  </TouchableOpacity>
                )}
                {filter === 'available' && (
                  <>
                    <TouchableOpacity
                      style={[styles.buttonModal, styles.btnColorApprove]}
                      onPress={() => this.cekApprove()}
                    >
                      <Text style={styles.buttonTextModal}>
                        {/* {level === 5 || level === 9 ? 'Scan' : 'Approve'} */}
                        Approve
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
      isVisible={this.state.modalTrack}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      // backdropOpacity={0.4}
      onBackdropPress={this.openTracking}
      useNativeDriver={true}
      >
        <TrackingModal handleClose={this.openTracking}/>
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
                  <TouchableOpacity style={[styles.buttonDelete, styles.btnColorClose]} onPress={() => this.prepSendEmail()}>
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
        isVisible={this.state.openDraft}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.4}
        onBackdropPress={this.openDraftEmail}
        useNativeDriver={true}
      >
        <EmailModal
          typeEmail={{type: tipeEmail === 'reject' ? 'reject' : 'approve'}}
          handleSubmit={tipeEmail === 'reject' ? () => this.rejectMutasi(dataRej) : this.approveMutasi}
          handleClose={this.openDraftEmail}
          handleData={this.getMessage}
        />
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
                    <Text style={styles.sectionTitleInfo}>Berhasil Approve Mutasi</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : this.state.confirm === 'falseKat' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Approve Mutasi</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Pastikan kategori it atau non-it sama dengan item yang lain</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : (this.state.confirm === 'falseAdd' || this.state.confirm === 'falseUpdate') ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Reject Mutasi</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Pastikan tujuan mutasi sama dengan item yang lain</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : (this.state.confirm === 'falseCancel') ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Reject Mutasi</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Reject pembatalan hanya bisa dilakukan jika semua data ajuan terceklis</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : this.state.confirm === 'reject' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="check-circle" color={'green'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Berhasil Reject Mutasi</Text>
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
                ) : this.state.confirm === 'update' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="check-circle" color={'green'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Berhasil Update</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : this.state.confirm === 'submit' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="check-circle" color={'green'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Berhasil Submit Mutasi</Text>
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
                ) : (this.state.confirm === 'dateFirst') ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Approve</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Mohon untuk isi tanggal mutasi fisik terlebih dahulu</Text>
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
                  proses: filter === 'available' && (level === 5 || level === 9) ? 'upload' : 'show',
                  tipe: 'mutasi',
                  noDoc:  detailMut.length > 0 ? detailMut[0].no_mutasi : '',
                  noTrans: detailMut.length > 0 ? detailMut[0].id : '',
                  detailForm: detailMut.length > 0 ? detailMut[0] : {},
                }}
                handleClose={this.openDokumen}
              />
            </ScrollView>
          </View>
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
  backgroundWhite: {
    backgroundColor: '#fff',
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
    paddingVertical: 10,
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
  buttonTextModal: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bodyCheck: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  btnColorSec: {
    backgroundColor: '#6B7280',
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
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    textAlignVertical: 'top',
    marginTop: 5,
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
});

const mapStateToProps = state => ({
    asset: state.asset,
    depo: state.depo,
    mutasi: state.mutasi,
    user: state.user,
    tempmail: state.tempmail,
    newnotif: state.newnotif,
    dokumen: state.dokumen,
    auth: state.auth,
});

const mapDispatchToProps = {
    getDetailDepo: depo.getDetailDepo,
    getDepo: depo.getDepo,
    addMutasi: mutasi.addMutasi,
    getMutasi: mutasi.getMutasi,
    approveMutasi: mutasi.approveMutasi,
    rejectMut: mutasi.rejectMutasi,
    getApproveMut: mutasi.getApproveMutasi,
    getMutasiRec: mutasi.getMutasiRec,
    getDocumentMut: mutasi.getDocumentMut,
    resetAddMut: mutasi.resetAddMut,
    resetMutasi: mutasi.resetMutasi,
    getDetailMutasi: mutasi.getDetailMutasi,
    getRole: user.getRole,
    addNewNotif: newnotif.addNewNotif,
    getDraftEmail: tempmail.getDraftEmail,
    sendEmail: tempmail.sendEmail,
    uploadDocument: mutasi.uploadDocument,
    showDokumen: dokumen.showDokumen,
    changeDate: mutasi.changeDate,
    getDetailUser: user.getDetailUser,
    searchMutasi: mutasi.searchMutasi,
};

export default connect(mapStateToProps, mapDispatchToProps)(Mutasi);
