/* eslint-disable prettier/prettier */
/* eslint-disable radix */
import React, {Component} from 'react';
import {
  View, Text, ScrollView,
  TextInput, TouchableOpacity, RefreshControl,
  StyleSheet, Platform, Image, FlatList,
  Button, Dimensions, Picker, Alert,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { RNCamera } from 'react-native-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconAwe from 'react-native-vector-icons/FontAwesome';
import IconMateri from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import moment from 'moment';

import depo from '../../redux/actions/depo';
import stock from '../../redux/actions/stock';
import tempmail from '../../redux/actions/tempmail';
import newnotif from '../../redux/actions/newnotif';
import asset from '../../redux/actions/asset';

import blankImg from '../../assets/blank.png';
import placeholder from '../../assets/placeholder.png';

import EmailModal from '../../components/Stock/Email';
import ModalDokumen from '../../components/ModalDokumen';
import CustomPicker from '../../components/CustomPicker';

import {API_URL} from '@env';

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth / numColumns) - 20;
const cardWidthList = (screenWidth / numColumns) - 40;

class CartStock extends Component {
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
      newStock: [],
      listStock: [],
      filter: 'available',
      openDetail: false,
      realApp: [],
      barcode: null,
      modalScan: false,
      modalTrack: false,
      limit: 1000,
      openList: false,
      isModalVisible: false,
      selectedKategori: '',
      selectedArea: '',
      detailData: {},
      kode: '',
      area: '',
      modalConfirm: false,
      confirm: '',
      typeModal: '',
      modalDelete: false,
      modalSubmit: false,
      modalReason: false,
      alasan: '',
      openDraft: false,
      subject: '',
      message: '',
      modalDokumen: false,
      keterangan: '',
      open: false,
      value: null,
      listStatus: [],
      fileUpload: null,
      errMsg: '',
      oldPict: [],
      upPict: [],
      crashAsset: [],
      openCrash: false,
      asetPart: 'all',
      onSearch: false,
      noRoute: null,
      isModalOpen: false,
      isProcessingDetail: false,
      stat: '',
      openAddList: false,
      modalChoose: false,
      isModalAdditional: false,
      openUpload: false,
      dataId: {},
      typeAdditional: ''
    };
  }

  getMessage = (val) => {
    this.setState({ message: val.message, subject: val.subject });
    console.log(val);
  }

  openConfirm = () => {
    this.setState({modalConfirm: !this.state.modalConfirm});
  }

  testConfirm = () => {
    this.setState({confirm: 'add'});
    this.openConfirm();
  }

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

  // async componentDidMount() {
  //   const {dataUser, token} = this.props.auth;
  //   const kode = dataUser.kode_plant;
  //   const level = dataUser.user_level;
  //   const { route, navigation } = this.props;
  //   this.unsubscribe = this.props.navigation.addListener('focus', async () => {
  //     if (level === 5 || level === 9) {
  //       if (route.params?.no && route.params.no) {
  //         this.setState({asetPart: kode, noRoute: route.params.no});
  //         await navigation.setParams({ no: undefined });
  //         this.getDataAsset({asetPart: kode});
  //       } else {
  //         await navigation.setParams({ no: undefined });
  //         this.getDataAsset({asetPart: kode});
  //       }
  //     } else {
  //       await navigation.setParams({ no: undefined });
  //       this.getDataStock();
  //     }

  //     // if (level === 5 || level === 9) {
  //     //   this.setState({asetPart: kode, noRoute: route.params.no});
  //     //   this.getDataAsset({asetPart: kode});
  //     // } else {
  //     //   this.getDataStock();
  //     // }
  //   });
  // }

  // componentWillUnmount() {
  //   if (this.unsubscribe) {this.unsubscribe();}
  // }

  async componentDidUpdate(prevProps) {
    const {isUpload, isError, isApprove, isReject, rejReject, rejApprove, isImage, isSubmit, isSubaset, isUpdateStock, isDocStock} = this.props.stock;
    const {detailData, dataId, dataItem} = this.state;
    const { isUpdateNew, detailAsset } = this.props.asset;
    const {dataUser, token} = this.props.auth;
    const { route, navigation } = this.props;

    // Deteksi ada params baru dari Scanner
    if (this.props.route.params?.no !== prevProps.route.params?.no) {
      console.log('hadle parammm di panggil dri did update kinggg');
      this.handleParams();
    }
    // else if (isUpload) {
    //     this.props.resetStock();
    //       setTimeout(() => {
    //         this.props.getDetailAsset(token, detailData.id);
    //         this.getDataAsset();
    //       }, 100);
    // }
    else if (isDocStock === false) {
        this.props.resetStock();
        this.cekStatus('DIPINJAM SEMENTARA');
    } else if (isDocStock === true) {
        this.props.resetStock();
        await this.props.getDocument(token, detailAsset.no_asset);
    } else if (isUpdateNew) {
        this.openConfirm(this.setState({confirm: 'approve'}));
        this.props.resetError();
        this.props.getDetailAsset(token, detailData.id);
        this.getDataAsset();
    } else if (isSubmit === false) {
        this.props.resetStock();
        this.setState({confirm: 'subReject'});
        this.openConfirm();
    } else if (isReject) {
        this.setState({listMut: []});
        this.openModalReject();
        this.openConfirm(this.setState({confirm: 'reject'}));
        this.props.resetStock();
        this.getDataStock();
        this.openModalRinci();
    }
    // else if (isSubaset) {
    //     this.openConfirm(this.setState({confirm: 'submit'}))
    //     this.props.resetStock()
    //     this.openModalSub()
    //     this.getDataStock()
    //     this.openModalRinci()
    // }
    // else if (isImage) {
    //     this.props.getDetailItem(token, dataId);
    //     this.props.resetStock();
    // } 
    else if (isApprove) {
        this.openConfirm(this.setState({confirm: 'isApprove'}));
        this.openModalApprove();
        this.props.resetStock();
        this.getDataStock();
        this.openModalRinci();
    } else if (rejReject) {
        this.openModalReject();
        this.openConfirm(this.setState({confirm: 'rejReject'}));
        this.props.resetStock();
    } else if (rejApprove) {
        this.openConfirm(this.setState({confirm: 'rejApprove'}));
        this.openModalApprove();
        this.props.resetStock();
    } else if (isError) {
        this.props.resetStock();
        this.showAlert();
    }
  }

  componentDidMount() {
    console.log('hadle parammm di panggil dri did mount kinggg');
    this.unsubscribeFocus = this.props.navigation.addListener('focus', () => {
      this.handleParams('mount');
    });

    // cek param saat pertama mount
    // this.handleParams();
  }

  componentWillUnmount() {
    if (this.unsubscribeFocus) {this.unsubscribeFocus();}
  }

  handleParams = async (val) => {
    console.log('handle param di eksekusi kingggg');
    const { route, navigation } = this.props;
    const { no } = route.params || {};
    const { dataUser } = this.props.auth;
    const kode = dataUser.kode_plant;
    const level = dataUser.user_level;
    if (!no && val === 'mount') {
      if (level === 5 || level === 9) {
        this.setState({ asetPart: kode });
        await this.getDataAsset({ asetPart: kode });
      } else {
        await this.getDataStock();
      }
    } else {
      // Clear param supaya tidak retrigger
      navigation.dispatch(
        CommonActions.setParams({
          params: {},
          key: route.key,
        })
      );

      if (level === 5 || level === 9) {
        this.setState({ asetPart: kode, noRoute: no });
        if (val === 'mount') {
          const dataAsset = await this.getDataAsset({ asetPart: kode });
          this.checkAndOpenDetail(no, dataAsset);
        } else {
          const dataAsset = this.props.asset.assetAll;
          this.checkAndOpenDetail(no, dataAsset);
        }
      } else {
        this.setState({ noRoute: no });
        const dataStock = await this.getDataStock();
        this.checkAndOpenDetail(no, dataStock);
      }
    }
  }

  getDataStock = async () => {
      const { filter } = this.state;
      this.changeFilter(filter);
  }

  getDataStatus = async (type) => {
    const {dataUser, token} = this.props.auth;
    const { detailData } = this.state;
    const { dataAll } = this.props.stock;
    if (detailData !== undefined) {
      this.setState({stat: detailData.grouping});
      if (detailData.kondisi === null && detailData.status_fisik === null) {
        console.log('masuk double nulls');
        this.setState({confirm: 'failStatus'});
        this.openConfirm();
        return false;
      } else {
        const statKondisi = detailData.kondisi === '-' ? null : detailData.kondisi;
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

  onStatusChange = (val) => {
    if (val === 'DIPINJAM SEMENTARA') {
      this.openProsesModalDoc();
    } else {
      this.setState({ detailData: { ...this.state.detailData, grouping: val } });
    }
  };

  saveStatus = () => {
    const {stat} = this.state;
    this.setState({ detailData: { ...this.state.detailData, grouping: 'DIPINJAM SEMENTARA' } });
    this.openDokumen();
  }

  openProsesModalDoc = async () => {
    const { dataUser, token } = this.props.auth;
    const { detailData } = this.state;
    await this.props.getDocument(token, detailData.no_asset);
    this.openDokumen();
  }

  cekStatus = async (val) => {
    const { dataUser, token } = this.props.auth;
    const { detailData } = this.state;
    if (val === 'DIPINJAM SEMENTARA') {
      await this.props.cekDokumen(token, detailData.no_asset);
    }
  }

  openDokumen = () => {
    this.setState({ modalDokumen: !this.state.modalDokumen });
  }

  getDataAsset = async (value) => {
    const { dataUser, token } = this.props.auth;
    const { page } = this.props.asset;
    const { asetPart, search } = this.state;

    const area = value?.asetPart || asetPart;
    const limit = this.state.limit || 100; // default limit

    await this.props.getStatusAll(token);
    await this.props.getDepo(token, 1000, '');
    await this.props.getAssetAll(token, limit, search, page.currentPage, 'asset', area);
    await this.props.getDetailDepo(token, 1);

    return this.props.asset.assetAll; // return data supaya bisa langsung dipakai
  }

  checkAndOpenDetail = (no, data) => {
    if (!data) {return;}

    const item = data.find(d => d.no_asset === no);
    if (item) {
      this.prosesOpenDetail({ val: item, type: 'edit' });
    } else {
      this.setState({ confirm: 'falseBarcode' });
      this.openConfirm();
    }
  }

  prosesUpdateAsset = async () => {
    const {dataUser, token} = this.props.auth;
    const { detailData } = this.state;
    const data = {
      merk: detailData.merk,
      satuan: detailData.satuan,
      lokasi: detailData.lokasi,
      kategori: detailData.kategori,
      status_fisik: detailData.status_fisik,
      kondisi: detailData.kondisi === '-' ? '' : detailData.kondisi,
      grouping: detailData.grouping,
      keterangan: detailData.keterangan,
    };
    await this.props.updateAsset(token, detailData.id, data);
    this.setState({confirm: 'update'});
    this.openConfirm();
    this.closeModal();
    const { page } = this.props.asset;
    const { asetPart, search } = this.state;

    const area = asetPart;
    const limit = this.state.limit || 100;
    await this.props.getAssetAll(token, limit, search, page.currentPage, 'asset', area);
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

      await this.props.uploadPicture(token, detailData.no_asset, data);
      await this.props.getDetailAsset(token, detailData.id);
      const { detailAsset } = this.props.asset;
      this.setState({detailData: detailAsset});
      const { page } = this.props.asset;
      const { asetPart, search } = this.state;

      const area = asetPart;
      const limit = this.state.limit || 100;
      await this.props.getAssetAll(token, limit, search, page.currentPage, 'asset', area);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancel');
      } else {
        console.error(err);
      }
    }
  };

  uploadImage = async () => {
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

      const {detailData, dataId, typeAdditional} = this.state;
      const {dataUser, token} = this.props.auth;
      const finalData = typeAdditional === 'edit' ? detailData : dataId

      await this.props.uploadImage(token, finalData.id, data);
      await this.props.getDetailItem(token, finalData.id)
      const { detailAsset } = this.props.stock;
      this.setState({detailData: detailAsset});
      if (typeAdditional !== 'edit') {
        this.setState({confirm: 'add'});
        this.openConfirm();
      }

      await this.props.getStockArea(token, '', 1000, 1, 'draft');
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancel');
      } else {
        console.error(err);
      }
    }
  };

  prepareSelect = async () => {
    const {dataUser, token} = this.props.auth;
    const kode = dataUser.kode_plant;
    await this.props.getDepo(token, 1000, '');
    const { dataDepo } = this.props.depo;
    const temp = [
        {value: '', label: '-Pilih Area-'},
    ];
    if (dataDepo.length !== 0) {
        for (let i = 0; i < dataDepo.length; i++) {
            if (dataDepo[i].kode_plant !== kode) {
                const data = `${dataDepo[i].kode_plant}-${dataDepo[i].nama_area}`;
                temp.push({value: data, label: data});
            }
        }
        this.setState({options: temp});
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

  prosesOpenData = async (val) => {
    const {dataUser, token} = this.props.auth;
    const level = dataUser.user_level.toString();
    this.setState({loading: true});
    const { filter } = this.state;
    await this.props.getApproveStock(token, val.no_stock, val.kode_plant.split('').length === 4 ? 'Stock' : 'Stock HO');
    await this.props.getDetailStock(token, val.no_stock);
    const {mutApp} = this.props.stock;
    const realApp = mutApp.pembuat !== undefined ? Object.values(mutApp) : [];
    if (filter === 'available') {
        const {detailStock} = this.props.stock;
        const { arrApp } = this.state;
        const cekApp = arrApp.find(item => item.noStock === detailStock[0].no_stock);
        this.setState({selApp: cekApp});
        if ((level === '5' || level === '9') && (detailStock[0].tgl_stockfisik === null || detailStock[0].tgl_stockfisik === 'null' || detailStock[0].tgl_stockfisik === '')) {
            this.openDetail();
            // this.openModalDate();
        } else {
            this.openDetail();
        }
    } else {
        this.openDetail();
    }
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
  }

  openDetail = () => {
    this.setState({openDetail: !this.state.openDetail});
  }

  prosesOpenTracking = async (val) => {
    const {dataUser, token} = this.props.auth;
    const level = dataUser.user_level.toString();
    await this.props.getApproveStock(token, val.no_stock, val.kode_plant.split('').length === 4 ? 'Stock' : 'Stock HO');
    await this.props.getDetailStock(token, val.no_stock);
    this.openTracking();
  }

  openTracking = () => {
    this.setState({modalTrack: !this.state.modalTrack});
  }

  openModalScan = () => {
    this.setState({modalScan: !this.state.modalScan});
  }

  onSearch = async () => {
    const statSearch = this.state.search !== undefined && this.state.search.length > 0 ? true : false;
    this.setState({onSearch: statSearch});
  }

  onType = (val) => {
      this.setState({ search: val });
  }

  handleBarcodeScan = async (scanResult) => {
    const { data } = scanResult;
    this.setState({ barcode: data });  // Set barcode ke state
    // this.props.navigation.navigate('Stock')
  };

  goCart = () => {
    this.props.navigation.navigate('CartStock');
  }

  openList = () => {
    this.setState({openList: !this.state.openList});
  }

  prosesOpenAddList = async () => {
    const {dataUser, token} = this.props.auth;
    await this.props.getStockArea(token, '', 1000, 1, 'draft');
    this.openAddList();
  }

  openAddList = () => {
    this.setState({openAddList: !this.state.openAddList});
  }

  prosesOpenAdditional = (val) => {
      this.setState({
        detailData: val.type === 'edit' ? val.val : {},
        typeAdditional: val.type
      })
      this.openAdditional()
  }

  openAdditional = () => {
    this.setState({isModalAdditional: !this.state.isModalAdditional});
  }

  renderData = ({ item }) => (
    <View style={[styles.assetCard, { width: this.state.openList ? cardWidthList : cardWidth }]}>
      <Image
        source={
          item.pict === undefined || item.pict.length === 0 ?
          placeholder :
          { uri: `${API_URL}/${item.pict[item.pict.length - 1].path}` }
        }
        style={styles.imageCard}
      />
      <TouchableOpacity style={styles.btnLabel}>
        <Text style={styles.textLabel}>{item.kategori === null ? '-' : item.kategori}</Text>
      </TouchableOpacity>
      <View style={styles.nameContainerCard}>
        <Text style={styles.nameTextCard} numberOfLines={2}>{item.nama_asset}</Text>
      </View>
      <Text style={styles.detailTextCard}>{item.no_asset}</Text>
      <Text style={styles.detailTextCard}>Kondisi: {item.kondisi}</Text>
      <Text style={styles.detailTextCard}>Status Fisik: {item.status_fisik}</Text>
      <Text style={styles.detailTextCard}>Status Aset: {item.grouping}</Text>
      <View style={styles.footerModal}>
        {!this.state.openList && (
          <TouchableOpacity style={[styles.dateButton, styles.btnColorTrack]} onPress={() => this.prosesOpenDetail({val: item, type: 'edit'})}>
            <IconAwe style={styles.iconBtn} name="edit" size={20} color={'white'} />
            <Text style={styles.buttonTextModal}>Update</Text>
          </TouchableOpacity>
        )}
        {/* <TouchableOpacity style={[styles.buttonModal, styles.btnColorApprove]} onPress={() => this.prosesOpenDokumen(item)}>
          <IconAwe name="upload" size={20} color={'white'} />
        </TouchableOpacity> */}
        {/* <TouchableOpacity style={[styles.buttonModal, styles.btnColorReject]} onPress={() => this.prosesOpenDelete(item)} >
          <IconMateri name="delete" size={20} color={'white'} />
        </TouchableOpacity> */}
      </View>
    </View>
  );

  renderAdd = ({ item }) => (
    <View style={[styles.assetCard, { width: cardWidthList }]}>
      <Image
        source={
          !item.image ?
          placeholder :
          { uri: `${API_URL}/${item.image}` }
        }
        style={styles.imageCard}
      />
      <TouchableOpacity style={styles.btnLabel}>
        <Text style={styles.textLabel}>{item.kategori === null ? '-' : item.kategori}</Text>
      </TouchableOpacity>
      <View style={styles.nameContainerCard}>
        <Text style={styles.nameTextCard} numberOfLines={2}>{item.deskripsi}</Text>
      </View>
      <Text style={styles.detailTextCard}>{item.no_asset}</Text>
      <Text style={styles.detailTextCard}>Kondisi: {item.kondisi}</Text>
      <Text style={styles.detailTextCard}>Status Fisik: {item.status_fisik}</Text>
      <Text style={styles.detailTextCard}>Status Aset: {item.grouping}</Text>
      <View style={styles.footerModal}>
          <TouchableOpacity style={[styles.buttonModal, styles.btnColorTrack]} onPress={() => this.prosesOpenAdditional({val: item, type: 'edit'})}>
            <IconAwe  name="edit" size={20} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttonModal, styles.btnColorReject]} onPress={() => this.prosesOpenDelete(item)} >
            <IconMateri name="delete" size={20} color={'white'} />
          </TouchableOpacity>
        {/* <TouchableOpacity style={[styles.buttonModal, styles.btnColorApprove]} onPress={() => this.prosesOpenDokumen(item)}>
          <IconAwe name="upload" size={20} color={'white'} />
        </TouchableOpacity> */}
      </View>
    </View>
  );

  prosesOpenDelete = (val) => {
    this.setState({detailData: val});
    this.openDelete();
  }

  openDelete = () => {
    this.setState({modalDelete: !this.state.modalDelete});
  }

  // prosesOpenDetail = async (val) => {
  //   const {dataUser, token} = this.props.auth;
  //   const detail = val.val;
  //   const keterangan = detail.keterangan;
  //   console.log(detail);
  //   await this.props.getStatusAll(token);
  //   // await this.props.getKeterangan(token, detail.nilai_jual === '' ? null : detail.nilai_jual);
  //   this.setState({detailData: detail, typeModal: val.type, keterangan: keterangan, noRoute: null});
  //   this.closeModal();
  // }

  prosesOpenDetail = async (val) => {
    if (this.state.isProcessingDetail) {return;} // prevent double trigger

    this.setState({ isProcessingDetail: true });

    const detail = val.val;
    const keterangan = detail.keterangan;
    const { token } = this.props.auth;

    this.setState({
      detailData: detail,
      typeModal: val.type,
      keterangan,
      noRoute: null,
      isModalVisible: true, // kontrol render modal
    });
  };

  closeModal = () => {
    this.setState({
      isModalVisible: false,
      isProcessingDetail: false, // reset flag supaya scan berikutnya bisa buka modal
    });
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  prosesAddStock = async (val) => {
    const {dataUser, token} = this.props.auth;
    const level = dataUser.user_level.toString();
    const { page } = this.props.asset;
    const search =  '';
    const limit = this.state.limit;
    const {kode, detailData} = this.state;
    if (kode === '') {
        console.log('pilih tujuan depo');
    } else {
      const { detailStock } = this.props.stock;
      if (detailStock.length > 0) {
        if (detailStock.find(item => item.kode_plant_rec === kode)) {
            if (detailStock.find(item => item.kategori === detailData.kategori)) {
                await this.props.addStock(token, detailData.no_asset, kode);
                await this.props.getAsset(token, limit, search, page.currentPage, 'stock');
                await this.props.getCartStock(token);
                this.closeModal();
                this.setState({confirm: 'add'});
                this.openConfirm();
            } else {
                this.setState({confirm: 'falseKat'});
                this.openConfirm();
            }
        } else {
            this.setState({confirm: 'falseAdd'});
            this.openConfirm();
        }
      } else {
          await this.props.addStock(token, detailData.no_asset, kode);
          await this.props.getAsset(token, limit, search, page.currentPage, 'stock');
          await this.props.getCartStock(token);
          this.closeModal();
          this.setState({confirm: 'add'});
          this.openConfirm();
      }
    }
  }

  addSell = async (val) => {
    const {dataUser, token} = this.props.auth;
    const {detailStock} = this.props.stock;
    const cek = detailStock.find(item => item.nilai_jual === '0' || item.nilai_jual === 0);
    if (cek !== undefined) {
        this.setState({confirm: 'falseAdd'});
        this.openConfirm();
    } else {
        const data = {
            no: val,
        };
        await this.props.addSell(token, data);
        this.setState({confirm: 'add'});
        this.openConfirm();
        // this.openModalNpwp()
        this.getDataAsset();
    }
  }

  addStock = async (val) => {
    const {dataUser, token} = this.props.auth;
    const dataAsset = this.props.asset.assetAll;
    const { detailDepo } = this.props.depo;
    const data = {
        area: detailDepo.nama_area,
        kode_plant: dataAsset[0].kode_plant,
        deskripsi: val.deskripsi,
        merk: val.merk,
        satuan: val.satuan,
        unit: 1,
        lokasi: val.lokasi,
        kondisi: val.kondisi,
        status_fisik: val.status_fisik,
        grouping: val.grouping,
        keterangan: val.keterangan,
    };
    await this.props.addOpname(token, data);
    await this.props.getStockArea(token, '', 1000, 1, 'draft');
    const { dataAdd } = this.props.stock;
    this.setState({dataId: dataAdd, isModalAdditional: false});
    this.openModalUpload();
  }

  updateStock = async (val) => {
    const {dataUser, token} = this.props.auth;
    const dataAsset = this.props.asset.assetAll;
    const { detailDepo } = this.props.depo;
    const data = {
        deskripsi: val.deskripsi,
        merk: val.merk,
        satuan: val.satuan,
        unit: 1,
        lokasi: val.lokasi,
        kondisi: val.kondisi,
        status_fisik: val.status_fisik,
        grouping: val.grouping,
        keterangan: val.keterangan,
    };
    await this.props.updateStock(token, val.id, data);
    await this.props.getStockArea(token, '', 1000, 1, 'draft');
    this.setState({confirm: 'update'});
    this.openConfirm();
  }

  openModalUpload = () => {
    this.setState({openUpload: !this.state.openUpload})
  }

  prosesUpdateStock = async (val) => {
    const {dataUser, token} = this.props.auth;
    const { kode } = this.state;
    const data = {
        keterangan: this.state.keterangan,
    };
    const { detailStock } = this.props.stock;
    await this.props.updateStock(token, val.id, data, 'stock');
    await this.props.getCartStock(token);
    this.closeModal();
    this.setState({confirm: 'update'});
    this.openConfirm();
  }

  prosesDeleteStock = async (val) => {
      const {dataUser, token} = this.props.auth;
      await this.props.deleteAdd(token, val.id);
      await this.props.getStockArea(token, '', 1000, 1, 'draft');
      this.openDelete();
      this.setState({confirm: 'delete'});
      this.openConfirm();
  }

  cekSubmit = async () => {
    const {dataUser, token} = this.props.auth;
    const {asetPart} = this.state;
    const area = asetPart;
    await this.props.getAssetAll(token, 1000, '', 1, 'asset', area);
    const dataAsset = this.props.asset.assetAll;
    const upPict = [];
    const oldPict = [];
    for (let i = 0; i < dataAsset.length; i++) {
      const item = dataAsset[i];
      if (item.pict !== undefined && item.pict !== null && item.pict.length > 0) {
        const dataImg = item.pict[item.pict.length - 1];
        const date1 = moment(dataImg.createdAt);
        const date2 = moment();
        const diffTime = Math.abs(date2 - date1);
        const day = 1000 * 60 * 60 * 24;
        const finDiff = Math.round(diffTime / day);
        if (finDiff > 10) {
          oldPict.push(item);
        }
      } else {
        upPict.push(item);
      }
    }
    if (upPict.length > 0 || oldPict.length > 0) {
      this.setState({confirm: 'failSubmit', oldPict: oldPict, upPict: upPict});
      this.openConfirm();
    } else {
      this.openList();
    }
  }

  cekStock = async () => {
    const {dataUser, token} = this.props.auth;
    const dataAsset = this.props.asset.assetAll;
    const cekRusak = dataAsset.filter(item => item.kondisi === 'rusak');
    const time1 = moment().subtract(2, 'month').startOf('month').format('YYYY-MM-DD');
    const time2 = moment().endOf('month').format('YYYY-MM-DD');

    if (cekRusak !== undefined && cekRusak.length > 0) {
      const temp = [...cekRusak];
      await this.props.getStockAll(token, '', 100, 1, '', 'all', time1, time2);
      const {dataStock} = this.props.stock;

      for (let i = 0; i < dataStock.length; i++) {
          await this.props.getDetailStock(token, dataStock[i].no_stock);
          for (let j = 0; j < cekRusak.length; j++) {
            const {detailStock} = this.props.stock;
            console.log('masuk for first');
            console.log(detailStock[0].no_asset);
            console.log(cekRusak);
            const cekData = detailStock.find(item => item.no_asset === cekRusak[j].no_asset && item.kondisi === cekRusak[j].kondisi && item.grouping === cekRusak[j].grouping);
            if (cekData !== undefined) {
              temp.push(cekData);
            }
          }
        }
        if (temp.length > cekRusak.length) {
          const finTemp = [];
          for (let i = 0; i < temp.length; i++) {
            const cekData = temp.filter(item => item.no_asset === temp[i].no_asset);
            if (cekData.length > 2) {
              const cekFin = finTemp.filter(item => item.no_asset === temp[i].no_asset);
              if (cekFin.length === 0) {
                finTemp.push(temp[i]);
              }
            }
          }
          if (finTemp.length > 0) {
            this.setState({crashAsset: finTemp});
            console.log('masuk crash asset');
            this.openChoose();
          } else {
            this.setState({crashAsset: []});
            this.openChoose();
          }
        } else {
            this.setState({crashAsset: []});
            console.log('nggak masuk crash asset2');
            this.openChoose();
        }
    } else {
        this.setState({crashAsset: []});
        console.log('nggak masuk crash asset3');
        this.openChoose();
    }
  }

  openSubmit = () => {
    this.setState({modalSubmit: !this.state.modalSubmit, modalChoose: false});
  }

  openChoose = () => {
    this.setState({modalChoose: !this.state.modalChoose});
  }

  openReason = () => {
    this.setState({modalReason: !this.state.modalReason});
  }

  prepSubmit = async () => {
    const {asetPart} = this.state;
    const {dataUser, token} = this.props.auth;
    const data = {
        asetPart: asetPart,
    };
    await this.props.submitStock(token, data);
    const { noStock } = this.props.stock;
    await this.props.getDetailStock(token, noStock);
    const { detailStock } = this.props.stock;
    await this.props.getApproveStock(token, detailStock[0].id);
    this.prepSendEmail();
  }

  prepSendEmail = async () => {
    const {detailStock, noStock} = this.props.stock;
    const {dataUser, token} = this.props.auth;
    const tipe = 'approve';
    const tempno = {
      no: noStock,
      kode: detailStock[0].kode_plant,
      jenis: 'stock',
      tipe: tipe,
      menu: 'Pengajuan Stock Opname (Stock Opname asset)',
    };
    await this.props.getDraftEmail(token, tempno);
    this.openDraftEmail();
  }

    openDraftEmail = () => {
      this.setState({openDraft: !this.state.openDraft});
    }

  submitFinal = async () => {
    const {dataUser, token} = this.props.auth;
    const { noStock } = this.props.stock;
    const { draftEmail } = this.props.tempmail;
    const { message, subject } = this.state;
    const data = {
        no: noStock,
    };
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
      no: noStock,
      tipe: 'stock',
      menu: 'Pengajuan Stock Opname (Stock Opname asset)',
      proses: 'approve',
      route: 'stock',
    };
    await this.props.submitStockFinal(token, data);
    await this.props.sendEmail(token, sendMail);
    await this.props.addNewNotif(token, sendMail);
    this.setState({openAddList: false})
    if (this.state.crashAsset.length > 0) {
      this.getDataAsset();
      this.openDraftEmail();
      this.openSubmit();
      this.openList();
      this.prepCrashEmail();
    } else {
      this.getDataAsset();
      this.openDraftEmail();
      this.openSubmit();
      this.openList();
      this.setState({confirm: 'submit'});
      this.openConfirm();
    }
  }

  prepCrashEmail = async () => {
    const {detailStock, noStock} = this.props.stock;
    const {dataUser, token} = this.props.auth;
    const tipe = 'reminder';
    const tempno = {
        no: noStock,
        kode: detailStock[0].kode_plant,
        jenis: 'stock',
        tipe: tipe,
        menu: 'Reminder Stock Opname (Stock Opname asset)',
    };
    await this.props.getDraftEmail(token, tempno);
    this.openCrashEmail();
  }

  openCrashEmail = () => {
    this.setState({openCrash: !this.state.openCrash});
  }

  sendCrashEmail = async () => {
    const {dataUser, token} = this.props.auth;
    const { noStock } = this.props.stock;
    const { draftEmail } = this.props.tempmail;
    const { message, subject, crashAsset } = this.state;
    const data = {
        no: noStock,
    };
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
        no: noStock,
        tipe: 'stock',
        menu: 'Stock Opname asset',
        proses: 'reminder',
        route: 'stock',
        listData: crashAsset,
    };
    await this.props.sendEmail(token, sendMail);
    this.openCrashEmail();
    this.setState({confirm: 'submit'});
    this.openConfirm();
  }

  render() {
    const {oldPict, upPict, filter, newStock, openDetail, loading, realApp, detailData, listStatus} = this.state;

    const loadingDepo = this.props.depo.isLoading;
    const loadingStock = this.props.stock.isLoading;
    const loadingTempmail = this.props.tempmail.isLoading;
    const loadingNewnotif = this.props.newnotif.isLoading;
    const loadingDokumen = this.props.dokumen.isLoading;
    const loadingAsset = this.props.asset.isLoading;
    const loadingAll = loadingAsset || loadingDepo || loadingStock || loadingTempmail || loadingNewnotif || loadingDokumen || loading;

    const { dataStock, noStock, dataDoc, detailStock, statusList, dataStatus, stockArea} = this.props.stock;
    const dataAsset = this.props.asset.assetAll;
    const { dataDepo } = this.props.depo;

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
        display: 'Stocketujui oleh',
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
      <View style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.bodyTitle}>
            <Text style={styles.title}>Draft Stock Opname Asset</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons
              onPress={() => this.onSearch({ target: { value: this.state.search }, key: 'Enter' })}
              name="search"
              size={20}
              color="#999"
            />
            <TextInput
              placeholder="Cari no aset / nama aset..."
              placeholderTextColor="#999"
              style={styles.searchInput}
              onChangeText={this.onType}
              onSubmitEditing={() => this.onSearch()}
              value={this.state.search}
            />
            <Ionicons name="options-outline" size={20} color="#999" />
          </View>

          {/* Date Picker Row */}
          <View style={styles.dateRow}>
            {/* <TouchableOpacity
              style={[styles.dateButton, styles.btnColorApprove]}
              onPress={() => this.openList()}>
              <IconAwe style={styles.iconBtn} name="plus" size={15} color={'white'} />
              <Text style={styles.buttonTextModal}>Add</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={[styles.dateButton, styles.btnColorProses]}
              onPress={() => this.cekSubmit()}
              >
              <IconAwe style={styles.iconBtn} name="send" size={15} color={'white'} />
              <Text style={styles.buttonTextModal}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LIST */}
        {dataAsset.length > 0 ? (
          <FlatList
            data={this.state.onSearch ? dataAsset.filter(x =>
              (x.nama_asset.toLowerCase().includes(this.state.search.toLowerCase())) ||
              (x.no_asset.toLowerCase().includes(this.state.search.toLowerCase())))
              : dataAsset
            }
            renderItem={this.renderData}
            keyExtractor={(item) => item.id.toString()}
            numColumns={numColumns}
            columnWrapperStyle={styles.rowCard}
            contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
            refreshControl={
              <RefreshControl
                refreshing={loadingAll}
                onRefresh={() => this.componentDidMount()}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={[styles.blankBody, styles.blankBg]}>
            <Image source={blankImg} style={styles.blankImg} />
          </View>
        )}
      </View>

      <Modal
        style={{ margin: 0 }}
        isVisible={this.state.openList}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onBackdropPress={this.openList}
        useNativeDriver={true}
      >
        <View style={styles.overlayModal}>
          <View style={styles.popupContainerModalList}>

            {/* Header */}
            <View style={styles.headerContainerModal}>
              <Text style={styles.headerTitleModal}>List Stock Opname</Text>
            </View>

            {/* FlatList langsung */}
            <FlatList
              data={dataAsset}
              renderItem={this.renderData}
              keyExtractor={(item) => item.id.toString()}
              numColumns={numColumns}
              columnWrapperStyle={styles.rowCard}
              contentContainerStyle={{ padding: 5 }}
              showsVerticalScrollIndicator={false}
            />

            {/* Footer */}
            <View style={styles.footerModal}>
              <TouchableOpacity
                style={[styles.buttonModal, styles.btnColorApprove]}
                onPress={() => this.cekStock()}
              >
                <Text style={styles.buttonTextModal}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonModal, styles.btnColorClose]}
                onPress={() => this.openList()}
              >
                <Text style={styles.buttonTextModal}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        style={{ margin: 0 }}
        isVisible={this.state.openAddList}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onBackdropPress={this.openAddList}
        useNativeDriver={true}
      >
        <View style={styles.overlayModal}>
          <View style={styles.popupContainerModalList}>

            {/* Header */}
            <View style={styles.headerContainerModal}>
              <Text style={styles.headerTitleModal}>Asset Tambahan</Text>
            </View>

            <View style={styles.dateRow}>
              <TouchableOpacity
                style={[styles.dateButton, styles.btnColorApprove]}
                onPress={() => this.prosesOpenAdditional({type: 'add'})}>
                <IconAwe style={styles.iconBtn} name="plus" size={15} color={'white'} />
                <Text style={styles.buttonTextModal}>Add</Text>
              </TouchableOpacity>
            </View>

            {/* FlatList langsung */}
            <FlatList
              data={stockArea}
              renderItem={this.renderAdd}
              keyExtractor={(item) => item.id.toString()}
              numColumns={numColumns}
              columnWrapperStyle={styles.rowCard}
              contentContainerStyle={{ padding: 5 }}
              showsVerticalScrollIndicator={false}
            />

            {/* Footer */}
            <View style={styles.footerModal}>
              <TouchableOpacity
                style={[styles.buttonModal, styles.btnColorApprove]}
                onPress={() => this.openSubmit()}
              >
                <Text style={styles.buttonTextModal}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonModal, styles.btnColorClose]}
                onPress={() => this.openAddList()}
              >
                <Text style={styles.buttonTextModal}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
                <Text style={styles.infoTextModal}>Tanggal Stock Fisik: {detailStock.length > 0 ? (detailStock[0].tgl_stockfisik === null ? '-' : moment(detailStock[0].tgl_stockfisik).format('DD MMMM YYYY')) : '-'}</Text>
                <Text>{''}</Text>
                <Text style={styles.infoTextModal}>Cabang/Depo Asal: {detailStock.length > 0 ? detailStock[0].area : ''}</Text>
                <Text style={styles.infoTextModal}>Cost Center Asal: {detailStock.length > 0 ? detailStock[0].cost_center : ''}</Text>
                <Text>{''}</Text>
                <Text style={styles.infoTextModal}>Cabang/Depo Tujuan: {detailStock.length > 0 ? detailStock[0].area_rec : ''}</Text>
                <Text style={styles.infoTextModal}>Cost Center Tujuan: {detailStock.length > 0 ? detailStock[0].cost_center_rec : ''}</Text>
              </View>

              {/* Daftar Asset */}
              <Text style={styles.sectionTitleModal}>Daftar Asset</Text>
              {detailStock.length > 0 && detailStock.map((item, index) => (
                <View key={index} style={styles.assetCardModal}>
                  <Text style={styles.assetTitleModal}>{item.nama_asset}</Text>
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
                </View>
              ))}

              {/* Alasan Stock */}
              <View style={styles.sectionModal}>
                <Text style={styles.sectionTitleModal}>Alasan Stock</Text>
                <View style={styles.assetCardModal}>
                    <Text style={styles.infoTextModal}>{detailStock.length > 0 ? detailStock[0].alasan : ''}</Text>
                </View>
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
                <Text style={styles.smallTextModal}>
                  Area ke Area: Dibuat AOS, Diperiksa BM, ROM, GAAM, Stocketujui Head Ops
                </Text>
                <Text style={styles.smallTextModal}>
                  HO ke Area: Dibuat GA SPV, Diperiksa BM, Stocketujui Head Ops Excellence
                </Text>
              </View>

              <View style={styles.footerModal}>
              {filter === 'available' && (
                <>
                  <TouchableOpacity
                    style={[styles.buttonModal, styles.btnColorApprove]}
                    onPress={() => this.openConfirm()}
                  >
                    <Text style={styles.buttonTextModal}>
                      {/* {level === 5 || level === 9 ? 'Scan' : 'Approve'} */}
                      Approve
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.buttonModal, styles.btnColorReject]}
                    onPress={() => this.openDetail()}
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
        isVisible={this.state.isModalVisible}
        onBackdropPress={this.closeModal}
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
                  style={[styles.dateButton, styles.btnColorProses]}
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
              <Text style={styles.labelDetail}>Kategori :</Text>
              <View style={styles.pickerWrapperDetail}>
                <Picker
                  selectedValue={`${detailData.kategori}`}
                  style={styles.pickerDetail}
                  onValueChange={(val) => this.setState({detailData: { ...detailData, kategori: val }})}
                >
                  <Picker.Item  value="Select" label="Select..."/>
                  <Picker.Item value={'IT'} label={'IT'} />
                  <Picker.Item value={'NON IT'} label={'NON IT'} />
                </Picker>
              </View>
              {!detailData.kategori && (
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
                  selectedValue={`${detailData.kondisi === '' ? '-' : detailData.kondisi}`}
                  style={styles.pickerDetail}
                  onValueChange={(itemValue) => this.fillStatus(itemValue, 'kondisi')}
                >
                  <Picker.Item value="Select" label="Select..." />
                  <Picker.Item value={'baik'} label={'Baik'}/>
                  <Picker.Item value={'rusak'} label={'Rusak'}/>
                  <Picker.Item value={'-'} label={'-'}/>
                </Picker>
              </View>
              {detailData.kondisi !== '' && detailData.kondisi === null && (
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
            <View style={styles.footerModal}>
              {detailData.grouping === 'DIPINJAM SEMENTARA' ? (
                <TouchableOpacity style={[styles.closeButtonDetail, styles.btnColorProses]} onPress={this.openProsesModalDoc}>
                  <Text style={styles.closeButtonTextDetail}>Dokumen</Text>
                </TouchableOpacity>
              ) : (
                <View>
                  <Text>{''}</Text>
                </View>
              )}
              <View style={styles.rowGeneral}>
                <TouchableOpacity
                  style={[
                    styles.addButtonDetail,
                    (!detailData.merk ||
                    !detailData.satuan ||
                    !detailData.lokasi ||
                    !detailData.status_fisik ||
                    (detailData.kondisi !== '' && detailData.kondisi === null) ||
                    !detailData.grouping) && { backgroundColor: '#9CA3AF' },
                  ]}
                  disabled={
                    !detailData.merk ||
                    !detailData.satuan ||
                    !detailData.lokasi ||
                    !detailData.status_fisik ||
                    (detailData.kondisi !== '' && detailData.kondisi === null) ||
                    !detailData.grouping
                  }
                  onPress={() => this.prosesUpdateAsset(detailData)}
                >
                  <Text style={styles.addButtonTextDetail}>{'Save'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButtonDetail} onPress={this.closeModal}>
                  <Text style={styles.closeButtonTextDetail}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        isVisible={this.state.isModalAdditional}
        onBackdropPress={this.openAdditional}
        style={styles.modalWrapperDetail}
      >
        <View style={styles.modalContainerDetail}>
          <ScrollView>
            {/* Header */}
            <Text style={styles.headerTextDetail}>{this.state.typeAdditional === 'edit' ? "Update Data Asset" : 'Tambah Data Asset'}</Text>

            {this.state.typeAdditional === 'edit' && (
              <View style={styles.imageWrapperDetail}>
                <Image
                  source={
                    detailData.image === undefined ?
                    placeholder :
                    { uri: `${API_URL}/${detailData.image}` }
                  }
                  style={styles.imageDetail}
                />
                <View style={[styles.dateRow, { marginTop: 10 }]}>
                  <TouchableOpacity
                    style={[styles.dateButton, styles.btnColorProses]}
                    onPress={() => this.uploadImage()}
                    >
                    <IconAwe style={styles.iconBtn} name="camera" size={15} color={'white'} />
                    <Text style={styles.buttonTextModal}>Upload Picture</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {/* Form */}
            <View style={styles.formGroupDetail}>
              <Text style={styles.labelDetail}>Deskripsi :</Text>
              <TextInput
                style={styles.inputDetailAct}
                value={detailData.deskripsi}
                onChangeText={(val) => this.setState({detailData: { ...detailData, deskripsi: val }})}
              />
              {!detailData.deskripsi && (
                <Text style={styles.errorTextDetail}>Must be filled</Text>
              )}
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
              <TextInput style={styles.inputDetail} editable={false} value='1' />
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
                  {/* <Picker.Item value={'tidak ada'} label={'Tidak Ada'}/> */}
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
                  selectedValue={`${detailData.kondisi === '' ? '-' : detailData.kondisi}`}
                  style={styles.pickerDetail}
                  onValueChange={(itemValue) => this.fillStatus(itemValue, 'kondisi')}
                >
                  <Picker.Item value="Select" label="Select..." />
                  <Picker.Item value={'baik'} label={'Baik'}/>
                  {/* <Picker.Item value={'rusak'} label={'Rusak'}/>
                  <Picker.Item value={'-'} label={'-'}/> */}
                </Picker>
              </View>
              {detailData.kondisi !== '' && detailData.kondisi === null && (
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
            <View style={styles.footerModal}>
              {detailData.grouping === 'DIPINJAM SEMENTARA' ? (
                <TouchableOpacity style={[styles.closeButtonDetail, styles.btnColorProses]} onPress={this.openProsesModalDoc}>
                  <Text style={styles.closeButtonTextDetail}>Dokumen</Text>
                </TouchableOpacity>
              ) : (
                <View>
                  <Text>{''}</Text>
                </View>
              )}
              <View style={styles.rowGeneral}>
                <TouchableOpacity
                  style={[
                    styles.addButtonDetail,
                    (!detailData.merk ||
                    !detailData.deskripsi ||
                    !detailData.satuan ||
                    !detailData.lokasi ||
                    !detailData.status_fisik ||
                    (detailData.kondisi !== '' && detailData.kondisi === null) ||
                    !detailData.grouping) && { backgroundColor: '#9CA3AF' },
                  ]}
                  disabled={
                    !detailData.merk ||
                    !detailData.deskripsi ||
                    !detailData.satuan ||
                    !detailData.lokasi ||
                    !detailData.status_fisik ||
                    (detailData.kondisi !== '' && detailData.kondisi === null) ||
                    !detailData.grouping
                  }
                  onPress={
                    () => this.state.typeAdditional === 'edit' ? 
                    this.updateStock(detailData) : 
                    this.addStock(detailData)
                  }
                >
                  <Text style={styles.addButtonTextDetail}>{'Save'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButtonDetail} onPress={this.openAdditional}>
                  <Text style={styles.closeButtonTextDetail}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        isVisible={this.state.openUpload}
        onBackdropPress={this.openModalUpload}
        style={styles.modalWrapperDetail}
      >
        <View style={styles.modalContainerDetail}>
          <ScrollView>
            {/* Header */}
            <Text style={styles.headerTextDetail}>Dokumentasi Tambahan Asset</Text>
            <Text style={styles.assetNameTextDetail}>{detailData.deskripsi}</Text>

            {/* Image */}
            <View style={styles.imageWrapperDetail}>
              <Image
                source={
                  detailData.img === undefined || detailData.img.length === 0 ?
                  placeholder :
                  { uri: `${API_URL}/${detailData.img[detailData.img.length - 1].path}` }
                }
                style={styles.imageDetail}
              />
              <View style={[styles.dateRow, { marginTop: 10 }]}>
                <TouchableOpacity
                  style={[styles.dateButton, styles.btnColorProses]}
                  onPress={() => this.uploadImage()}
                  >
                  <IconAwe style={styles.iconBtn} name="camera" size={15} color={'white'} />
                  <Text style={styles.buttonTextModal}>Upload Picture</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.footerModal}>
              <View>
                <Text>{''}</Text>
              </View>
              <View style={styles.rowGeneral}>
                <TouchableOpacity
                  style={[styles.addButtonDetail]}
                  onPress={() => this.openModalUpload()}
                >
                  <Text style={styles.addButtonTextDetail}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButtonDetail} onPress={this.openModalUpload}>
                  <Text style={styles.closeButtonTextDetail}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
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
              {this.state.confirm === 'add' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="check-circle" color={'green'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Berhasil Menambahkan Item</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : this.state.confirm === 'falseKat' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Menambahkan Item</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Pastikan kategori it atau non-it sama dengan item yang lain</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : (this.state.confirm === 'falseAdd' || this.state.confirm === 'falseUpdate') ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Menambahkan Item</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Pastikan data yang ditambahkan memiliki tipe yang sama</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : this.state.confirm === 'failSubmit' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Submit</Text>
                    {upPict.length > 0 && upPict.map(item => {
                      return (
                        <Text style={[styles.sectioSubtitleInfo]}>Mohon untuk upload dokumentasi no asset {item.no_asset}</Text>
                      );
                    })}
                    {oldPict.length > 0 && oldPict.map(item => {
                      return (
                        <Text style={[styles.sectioSubtitleInfo]}>Mohon untuk upload dokumentasi terbaru dari no asset {item.no_asset}</Text>
                      );
                    })}
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : this.state.confirm === 'falseDoc' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Submit</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Mohon upload dokumen terlebih dahulu</Text>
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
                ) : this.state.confirm === 'delete' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="check-circle" color={'green'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Berhasil Delete</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : this.state.confirm === 'submit' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="check-circle" color={'green'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Berhasil Submit Stock</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : this.state.confirm === 'falseBarcode' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Qrcode Tidak Valid</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Mohon gunakan qrcode yang telah disediakan</Text>
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
                ) : this.state.confirm === 'oldPict' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Upload</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>Pastikan dokumentasi yang diupload tidak lebih dari 10 hari saat submit stock opname</Text>
                    <TouchableOpacity style={styles.btnInfo} onPress={this.openConfirm}>
                      <Text style={styles.textBtnInfo}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : this.state.confirm === 'subReject' ? (
                  <View style={styles.sectionInfo}>
                    <IconMateri name="close" color={'red'} size={50}/>
                    <Text style={styles.sectionTitleInfo}>Gagal Submit</Text>
                    <Text style={[styles.sectioSubtitleInfo]}>{this.props.stock.alertM}</Text>
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
        isVisible={loadingAll}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        // backdropOpacity={0.4}
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
        isVisible={this.state.modalDelete}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        // backdropOpacity={0.4}
        onBackdropPress={this.openDelete}
        useNativeDriver={true}
      >
        <View style={styles.overlayModal}>
          <View style={styles.popupContainerInfo}>
            <ScrollView style={styles.scrollContentModal}>
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionTitleInfo}>Apakah anda yakin untuk delete item?</Text>
                <View style={styles.sectionDelete}>
                  <TouchableOpacity style={[styles.buttonDelete, styles.btnColorClose]} onPress={() => this.prosesDeleteStock(detailData)}>
                    <Text style={styles.buttonTextCard}>Ya</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.buttonDelete, styles.btnColorSec]} onPress={this.openDelete}>
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
        isVisible={this.state.modalChoose}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        // backdropOpacity={0.4}
        onBackdropPress={this.openChoose}
        useNativeDriver={true}
      >
        <View style={styles.overlayModal}>
          <View style={styles.popupContainerInfo}>
            <ScrollView style={styles.scrollContentModal}>
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionTitleInfo}>Apakah anda ingin menambah data asset yang lain?</Text>
                <View style={styles.sectionDelete}>
                  <TouchableOpacity style={[styles.buttonDelete, styles.btnColorClose]} onPress={() => this.prosesOpenAddList()}>
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
                  <TouchableOpacity style={[styles.buttonDelete, styles.btnColorClose]} onPress={() => this.prepSubmit()}>
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
        isVisible={this.state.modalReason}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        // backdropOpacity={0.4}
        onBackdropPress={this.openReason}
        useNativeDriver={true}
      >
        <View style={styles.overlayModal}>
          <View style={styles.popupContainerInfo}>
            <ScrollView style={styles.scrollContentModal}>
              <View style={styles.sectionReason}>
                <Text style={styles.titleReason}>Alasan Stock : </Text>
                <TextInput
                  style={styles.inputReason}
                  placeholder="..........."
                  multiline={true}
                  onChangeText={(val) => this.setState({ alasan: val })}
                  value={this.state.alasan}
                />
                {this.state.alasan === '' && (
                  <Text style={styles.errorTextDetail}>Must be filled</Text>
                )}
                <View style={styles.footerModal}>
                  <TouchableOpacity
                    style={[styles.buttonModal, styles.btnColorClose]}
                    onPress={() => this.prepSubmit()}
                    disabled={this.state.alasan === ''}
                  >
                    <Text style={styles.buttonTextModal}>Submit</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.footerModal}>
                  <TouchableOpacity
                    style={[styles.buttonModal, styles.btnColorSec]}
                    onPress={() => this.openReason()}
                  >
                    <Text style={styles.buttonTextModal}>Close</Text>
                  </TouchableOpacity>
                </View>
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
        // backdropOpacity={0.4}
        onBackdropPress={this.openDraftEmail}
        useNativeDriver={true}
      >
        <EmailModal
          typeEmail={{type: 'submit'}}
          handleSubmit={this.submitFinal}
          handleClose={this.openDraftEmail}
          handleData={this.getMessage}
        />
      </Modal>
      <Modal
        style={{margin: 0}}
        isVisible={this.state.openCrash}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        // backdropOpacity={0.4}
        onBackdropPress={this.openCrashEmail}
        useNativeDriver={true}
      >
        <EmailModal
          typeEmail={{type: 'submit'}}
          handleSubmit={this.sendCrashEmail}
          handleClose={this.openCrashEmail}
          handleData={this.getMessage}
          data={this.state.crashAsset}
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
                proses: 'upload',
                detailForm: detailData,
                noDoc: detailData.no_asset,
                noTrans: null,
                tipe: 'stock'}}
              handleClose={dataDoc.find(x => x.path === null) !== undefined ? this.openDokumen : this.saveStatus} />
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
    paddingTop: 0,
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
  rowGeneral: {
    flexDirection: 'row',
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

  // body card
  containerCard: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  rowCard: {
    justifyContent: 'space-between',
    marginBottom: 15,
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
  },
  imageCard: {
    width: 150,
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
  buttonTextCard: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  //Item
  buttonTextItem: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonItem: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },


  // modal list
  popupContainerModalList: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 5,
    elevation: 10,
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
  textLabel: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    alignSelf: 'center',
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

  // Modal info
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
  botDraftCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  //modal delete
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

  // modal reason
  sectionReason: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  titleReason: {
    fontSize: 18,
    marginTop: 5,
    fontWeight: '600',
  },
  inputReason: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    textAlignVertical: 'top',
    marginTop: 5,
  },
});

const mapStateToProps = state => ({
    stock: state.stock,
    asset: state.asset,
    depo: state.depo,
    tempmail: state.tempmail,
    auth: state.auth,
    newnotif: state.newnotif,
    dokumen: state.dokumen,
});

const mapStockpatchToProps = {
    getAsset: asset.getAsset,
    getAssetAll: asset.getAssetAll,
    updateAsset: asset.updateAsset,
    updateAssetNew: asset.updateAssetNew,
    resetError: asset.resetError,
    nextPage: asset.nextPage,
    uploadDocument: stock.uploadDocument,
    getDetailDepo: depo.getDetailDepo,
    getDepo: depo.getDepo,
    submitStock: stock.submitStock,
    submitStockFinal: stock.submitStockFinal,
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
    getDetailAsset: asset.getDetailAsset,
    getDocument: stock.getDocumentStock,
    cekDokumen: stock.cekDocumentStock,
    resetData: asset.resetData,
    updateStock: stock.updateStock,
    updateStockNew: stock.updateStockNew,
    getDetailItem: stock.getDetailItem,
    getStockArea: stock.getStockArea,
    addOpname: stock.addStock,
    uploadImage: stock.uploadImage,
    submitAsset: stock.submitAsset,
    deleteAdd: stock.deleteAdd,
    addNewNotif: newnotif.addNewNotif,
    getDraftEmail: tempmail.getDraftEmail,
    sendEmail: tempmail.sendEmail,
};

export default connect(mapStateToProps, mapStockpatchToProps)(CartStock);
