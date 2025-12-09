/* eslint-disable prettier/prettier */
/* eslint-disable radix */
import React, {Component} from 'react';
import {
  View, Text, ScrollView,
  TextInput, TouchableOpacity, RefreshControl,
  StyleSheet, Platform, Image, FlatList,
  Button, Dimensions, Picker,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconAwe from 'react-native-vector-icons/FontAwesome';
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
import asset from '../../redux/actions/asset';

import blankImg from '../../assets/blank.png';
import placeholder from '../../assets/placeholder.png';

import EmailModal from '../../components/Mutasi/Email';

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth / numColumns) - 20;
const cardWidthList = (screenWidth / numColumns) - 40;

class CartMutasi extends Component {
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
      newMut: [],
      listMut: [],
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
      openArea: false,
      dataArea: [],
      searchArea: '',
      assetState: [],
      searchAsset: '',
      onSearch: false,
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

  chooseDepo = (val) => {
    const data = val.split('-')[0];
    this.setState({kode: data, area: val});
    this.openArea()
  }

  async componentDidMount() {
      const {dataUser, token} = this.props.auth;
      const level = dataUser.user_level;
      this.getDataAsset();
  }

  getDataMutasi = async () => {
      const { filter } = this.state;
      this.changeFilter(filter);
  }

  getDataAsset = async (value) => {
    const {dataUser, token} = this.props.auth;
    const { page } = this.props.asset;
    const search = value === undefined ? '' : this.state.search;
    const limit = value === undefined ? this.state.limit : value.limit;
    await this.props.getAsset(token, limit, search, page.currentPage, 'mutasi');
    await this.props.getCart(token);
    await this.props.getDetailDepo(token, 1);
    const { dataAsset } = this.props.asset
    this.setState({assetState: dataAsset});
    this.prepareSelect();
    this.setState({limit: 1000});
  }

  prepareSelect = async () => {
    const {dataUser, token} = this.props.auth;
    const kode = dataUser.kode_plant;
    await this.props.getDepo(token, 1000, '');
    const { dataDepo } = this.props.depo;
    const dataArea = [];
    if (dataDepo.length !== 0) {
      this.setState({dataArea: dataDepo.filter(item => item.kode_plant !== kode)});
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
    await this.props.getApproveMut(token, val.no_mutasi, val.kode_plant.split('').length === 4 ? 'Mutasi' : 'Mutasi HO');
    await this.props.getDetailMutasi(token, val.no_mutasi);
    const {mutApp} = this.props.mutasi;
    const realApp = mutApp.pembuat !== undefined ? Object.values(mutApp) : [];
    if (filter === 'available') {
        const {detailMut} = this.props.mutasi;
        const { arrApp } = this.state;
        const cekApp = arrApp.find(item => item.noMut === detailMut[0].no_mutasi);
        this.setState({selApp: cekApp});
        if ((level === '5' || level === '9') && (detailMut[0].tgl_mutasifisik === null || detailMut[0].tgl_mutasifisik === 'null' || detailMut[0].tgl_mutasifisik === '')) {
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
    const statSearch = this.state.search !== undefined && this.state.search.length > 0 ? true : false;
    this.setState({onSearch: statSearch});
  }

  onType = (val) => {
    this.setState({ search: val });
  }

  onTypeArea = (val) => {
    this.setState({ searchArea: val });
  }

  onTypeAsset = (val) => {
      this.setState({ searchAsset: val });
  }

  onSearchArea = async () => {
    const { searchArea, dataArea } = this.state;
    const { dataDepo } = this.props.depo;
    const {dataUser, token} = this.props.auth;
    const kode = dataUser.kode_plant;
    const depoFinal = dataDepo.filter(x => x.kode_plant.toLowerCase() !== kode.toLowerCase())
    const cekFilter = depoFinal.filter(x =>
      (x.nama_area.toLowerCase().includes(searchArea.toLowerCase())) ||
      (x.kode_plant.toLowerCase().includes(searchArea.toLowerCase())) ||
      (x.cost_center.toLowerCase().includes(searchArea.toLowerCase()))
    );
    this.setState({dataArea: searchArea === '' ? depoFinal : cekFilter});
  }

  onSearchAsset = () => {
    const {searchAsset} = this.state
    const { dataAsset } = this.props.asset;
    const {dataUser, token} = this.props.auth;
    const cekFilter = dataAsset.filter(x =>
      (x.nama_asset.toLowerCase().includes(searchAsset.toLowerCase())) ||
      (x.no_asset.toLowerCase().includes(searchAsset.toLowerCase()))
    );
    this.setState({assetState: searchAsset === '' ? dataAsset : cekFilter});
  }

  handleBarcodeScan = async (scanResult) => {
    const { data } = scanResult;
    this.setState({ barcode: data });  // Set barcode ke state
    // this.props.navigation.navigate('Mutasi')
  };

  goCart = () => {
    this.props.navigation.navigate('CartMutasi');
  }

  openList = () => {
    this.setState({openList: !this.state.openList});
  }

  renderData = ({ item }) => (
    <View style={[styles.assetCard, { width: this.state.openList ? cardWidthList : cardWidth }]}>
      <Image source={placeholder} style={styles.imageCard} />
      <TouchableOpacity style={styles.btnLabel}>
        <Text style={styles.textLabel}>{item.kategori === null ? '-' : item.kategori}</Text>
      </TouchableOpacity>
      <View style={styles.nameContainerCard}>
        <Text style={styles.nameTextCard} numberOfLines={2}>{item.nama_asset}</Text>
      </View>
      <Text style={styles.detailTextCard}>{item.no_asset}</Text>
      <Text style={styles.detailTextCard}>Nilai Buku: {item.nilai_buku}</Text>
      {this.state.openList ? (
        <Text style={styles.detailTextCard}>
          Status: {parseInt(item.status) === 1 ? 'On Proses Disposal' : parseInt(item.status) === 11 ? 'On Proses Mutasi' : 'available'}
        </Text>
      ) : (
        <Text style={styles.detailTextCard}>
          Tujuan: {item.area_rec} - ({item.kode_plant_rec})
        </Text>
      )}
      {this.state.openList ? (
        parseInt(item.status) === 1 || parseInt(item.status) === 11 ? (
          <View style={styles.footerModal}></View>
        ) : (
          <TouchableOpacity style={styles.buttonCard} onPress={() => this.prosesOpenDetail({val: item, type: 'add'})}>
            <Text style={styles.buttonTextCard}>Mutasi</Text>
          </TouchableOpacity>
        )
      ) : (
        <View style={styles.footerModal}>
          <TouchableOpacity style={[styles.buttonModal, styles.btnColorTrack]} onPress={() => this.prosesOpenDetail({val: item, type: 'edit'})}>
            <Text style={styles.buttonTextModal}>Detail</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttonModal, styles.btnColorReject]} onPress={() => this.prosesOpenDelete(item)}>
            <Text style={styles.buttonTextModal}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );

  openArea = () => {
    this.setState({openArea: !this.state.openArea});
  }

  renderArea = ({ item }) => (
    <TouchableOpacity style={[styles.areaCard]} onPress={() => this.chooseDepo(`${item.kode_plant}-${item.nama_area}`)}>
      <Text>{item.kode_plant}-{item.nama_area}</Text>
    </TouchableOpacity>
  );

  prosesOpenDelete = (val) => {
    this.setState({detailData: val});
    this.openDelete();
  }

  openDelete = () => {
    this.setState({modalDelete: !this.state.modalDelete});
  }

  prosesOpenDetail = (val) => {
    const detail = val.val;
    const area = val.type === 'edit' ? `${detail.kode_plant_rec}-${detail.area_rec}` : '';
    const kode = val.type === 'edit' ? detail.kode_plant_rec : '';
    this.setState({detailData: detail, typeModal: val.type, area: area, kode: kode});
    this.toggleModal();
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  prosesAddMutasi = async () => {
    const {dataUser, token} = this.props.auth;
    const level = dataUser.user_level.toString();
    const { page } = this.props.asset;
    const search =  '';
    const limit = this.state.limit;
    const {kode, detailData} = this.state;
    if (kode === '') {
        console.log('pilih tujuan depo');
    } else {
      const { dataCart } = this.props.mutasi;
      if (dataCart.length > 0) {
        if (dataCart.find(item => item.kode_plant_rec === kode)) {
            if (dataCart.find(item => item.kategori === detailData.kategori)) {
                await this.props.addMutasi(token, detailData.no_asset, kode);
                await this.props.getAsset(token, limit, search, page.currentPage, 'mutasi');
                await this.props.getCart(token);
                const { dataAsset } = this.props.asset
                this.setState({assetState: dataAsset});
                this.toggleModal();
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
          await this.props.addMutasi(token, detailData.no_asset, kode);
          await this.props.getAsset(token, limit, search, page.currentPage, 'mutasi');
          await this.props.getCart(token);
          const { dataAsset } = this.props.asset
          this.setState({assetState: dataAsset});
          this.toggleModal();
          this.setState({confirm: 'add'});
          this.openConfirm();
      }
    }
  }

  prosesUpdateMutasi = async (val) => {
    const {dataUser, token} = this.props.auth;
    const { kode } = this.state;
    const data = {
        id: val.id,
        kodeRec: kode,
    };
    const { dataCart } = this.props.mutasi;
    if (dataCart.length > 1 && dataCart.find(item => item.kode_plant_rec !== kode && val.id !== item.id)) {
        this.setState({confirm: 'falseUpdate'});
        this.openConfirm();
    } else {
      await this.props.updateMutasi(token, data);
      await this.props.getCart(token);
      this.toggleModal();
      this.setState({confirm: 'update'});
      this.openConfirm();
    }
  }

  prosesDeleteMutasi = async (val) => {
    const {dataUser, token} = this.props.auth;
    const { page } = this.props.asset;
    const search =  '';
    const limit = this.state.limit;
    await this.props.deleteMutasi(token, val.id);
    await this.props.getCart(token);
    await this.props.getAsset(token, limit, search, page.currentPage, 'mutasi');
    const { dataAsset } = this.props.asset
    this.setState({assetState: dataAsset});
    this.openDelete();
    this.setState({confirm: 'delete'});
    this.openConfirm();
  }

  openSubmit = () => {
    this.setState({modalSubmit: !this.state.modalSubmit});
  }

  openReason = () => {
    this.setState({modalReason: !this.state.modalReason});
  }

  prepSubmit = async () => {
    const {dataUser, token} = this.props.auth;
    const data = {
        alasan: this.state.alasan,
    };
    await this.props.submitMutasi(token, data);
    this.prepSendEmail();
  }

  prepSendEmail = async () => {
        const {dataCart, nomor_mutasi} = this.props.mutasi;
        const {dataUser, token} = this.props.auth;
        const tipe = 'approve';
        const tempno = {
            no: nomor_mutasi,
            kode: dataCart[0].kode_plant,
            jenis: 'mutasi',
            tipe: tipe,
            menu: 'Pengajuan Mutasi Asset (Mutasi asset)',
            indexApp: 'first',
        };
        await this.props.getDetailMutasi(token, nomor_mutasi);
        await this.props.getApproveMut(token, nomor_mutasi, 'Mutasi');
        await this.props.getDraftEmail(token, tempno);
        this.openDraftEmail();
    }

    openDraftEmail = () => {
        this.setState({openDraft: !this.state.openDraft});
    }

    submitFinal = async () => {
      const {dataUser, token} = this.props.auth;
      const { nomor_mutasi } = this.props.mutasi;
      const { draftEmail } = this.props.tempmail;
      const { message, subject } = this.state;
      const data = {
          no: nomor_mutasi,
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
          no: nomor_mutasi,
          tipe: 'mutasi',
          menu: 'mutasi asset',
          proses: 'approve',
          route: 'mutasi',
      };
      await this.props.submitMutasiFinal(token, data);
      await this.props.sendEmail(token, sendMail);
      await this.props.addNewNotif(token, sendMail);
      await this.props.getCart(token);
      this.openReason();
      this.openSubmit();
      this.openDraftEmail();
      this.setState({confirm: 'submit'});
      this.openConfirm();
    }

  render() {
    const {time1, time2, showDateFrom, showDateTo, filter, newMut, openDetail, loading, realApp, detailData} = this.state;

    const loadingDepo = this.props.depo.isLoading;
    const loadingMutasi = this.props.mutasi.isLoading;
    const loadingTempmail = this.props.tempmail.isLoading;
    const loadingNewnotif = this.props.newnotif.isLoading;
    const loadingDokumen = this.props.dokumen.isLoading;
    const loadingAll = loadingDepo || loadingMutasi || loadingTempmail || loadingNewnotif || loadingDokumen || loading;

    const { dataMut, noMut, dataDoc, detailMut, statusList, dataCart} = this.props.mutasi;
    const {dataAsset} = this.props.asset;
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
      <View style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.bodyTitle}>
            <Text style={styles.title}>Draft Mutasi Asset</Text>
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
            <TouchableOpacity
              style={[styles.dateButton, styles.btnColorApprove]}
              onPress={() => this.openList()}>
              <IconAwe style={styles.iconBtn} name="plus" size={15} color={'white'} />
              <Text style={styles.buttonTextModal}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dateButton, styles.btnColorProses]}
              onPress={() => this.openSubmit()}
              disabled={dataCart.length === 0}
              >
              <IconAwe style={styles.iconBtn} name="send" size={15} color={'white'} />
              <Text style={styles.buttonTextModal}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LIST */}
        {dataCart.length > 0 ? (
          <FlatList
            // data={dataCart}
            data={this.state.onSearch ? dataCart.filter(x =>
              (x.nama_asset.toLowerCase().includes(this.state.search.toLowerCase())) ||
              (x.no_asset.toLowerCase().includes(this.state.search.toLowerCase())))
              : dataCart
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
              <Text style={styles.headerTitleModal}>List Asset</Text>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
              <Ionicons
                onPress={() => this.onSearchAsset({ target: { value: this.state.searchAsset }, key: 'Enter' })}
                name="search"
                size={20}
                color="#999"
              />
              <TextInput
                placeholder="Cari no aset / nama aset..."
                placeholderTextColor="#999"
                style={styles.searchInput}
                onChangeText={this.onTypeAsset}
                onSubmitEditing={() => this.onSearchAsset()}
                value={this.state.searchAsset}
              />
              <Ionicons name="options-outline" size={20} color="#999" />
            </View>

            {/* FlatList langsung */}
            <FlatList
              data={this.state.assetState}
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

              {/* Alasan Mutasi */}
              <View style={styles.sectionModal}>
                <Text style={styles.sectionTitleModal}>Alasan Mutasi</Text>
                <View style={styles.assetCardModal}>
                    <Text style={styles.infoTextModal}>{detailMut.length > 0 ? detailMut[0].alasan : ''}</Text>
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
                  Area ke Area: Dibuat AOS, Diperiksa BM, ROM, GAAM, Disetujui Head Ops
                </Text>
                <Text style={styles.smallTextModal}>
                  HO ke Area: Dibuat GA SPV, Diperiksa BM, Disetujui Head Ops Excellence
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
          onBackdropPress={this.toggleModal}
          style={styles.modalWrapperDetail}
        >
          <View style={styles.modalContainerDetail}>
            <ScrollView>
              {/* Header */}
              <Text style={styles.headerTextDetail}>Proses Mutasi</Text>
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
                <TextInput style={styles.inputDetail} editable={false} value="-" />
              </View>

              <View style={styles.formGroupDetail}>
                <Text style={styles.labelDetail}>Area Tujuan :</Text>
                {/* <View style={styles.pickerWrapperDetail}>
                  <Picker
                    selectedValue={`${this.state.area}`}
                    style={styles.pickerDetail}
                    onValueChange={(itemValue) => this.chooseDepo(itemValue)}
                  >
                    <Picker.Item label="Select..." value="Select" />
                    {dataDepo.length > 0 && dataDepo.map(item => {
                      return (
                        <Picker.Item label={`${item.kode_plant}-${item.nama_area}`} value={`${item.kode_plant}-${item.nama_area}`} />
                      );
                    })}
                  </Picker>
                </View> */}
                <TouchableOpacity style={styles.inputDetail} onPress={this.openArea}>
                  <Text>{this.state.area === '' ? 'Select...' : this.state.area}</Text>
                </TouchableOpacity>
                {this.state.kode === '' && (
                  <Text style={styles.errorTextDetail}>Must be filled</Text>
                )}
              </View>

              {/* Buttons */}
              <View style={styles.buttonWrapperDetail}>
                <TouchableOpacity
                  style={[
                    styles.addButtonDetail,
                    this.state.kode === '' && { backgroundColor: '#9CA3AF' },
                  ]}
                  disabled={this.state.kode === ''}
                  onPress={this.state.typeModal === 'add' ? this.prosesAddMutasi : () => this.prosesUpdateMutasi(detailData)}
                >
                  <Text style={styles.addButtonTextDetail}>{this.state.typeModal === 'add' ? 'Add' : 'Save'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButtonDetail} onPress={this.toggleModal}>
                  <Text style={styles.closeButtonTextDetail}>Close</Text>
                </TouchableOpacity>
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
                      <Text style={[styles.sectioSubtitleInfo]}>Pastikan tujuan mutasi sama dengan item yang lain</Text>
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
                      <Text style={styles.sectionTitleInfo}>Berhasil Delete Item</Text>
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
                    <TouchableOpacity style={[styles.buttonDelete, styles.btnColorClose]} onPress={() => this.prosesDeleteMutasi(detailData)}>
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
                    <TouchableOpacity style={[styles.buttonDelete, styles.btnColorClose]} onPress={() => this.openReason()}>
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
                  <Text style={styles.titleReason}>Alasan Mutasi : </Text>
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
        style={{ margin: 0 }}
        isVisible={this.state.openArea}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onBackdropPress={this.openArea}
        useNativeDriver={true}
      >
        <View style={styles.overlayModal}>
          <View style={styles.popupContainerModalList}>

            {/* Header */}
            <View style={styles.headerContainerModal}>
              <Text style={styles.headerTitleModal}>List Area</Text>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
              <Ionicons
                onPress={() => this.onSearchArea({ target: { value: this.state.searchArea }, key: 'Enter' })}
                name="search"
                size={20}
                color="#999"
              />
              <TextInput
                placeholder="Cari kode plant / cost center..."
                placeholderTextColor="#999"
                style={styles.searchInput}
                onChangeText={this.onTypeArea}
                onSubmitEditing={() => this.onSearchArea()}
                value={this.state.searchArea}
              />
              <Ionicons name="options-outline" size={20} color="#999" />
            </View>

            {/* FlatList langsung */}
            <FlatList
              data={this.state.dataArea}
              renderItem={this.renderArea}
              keyExtractor={(item) => item.id.toString()}
              numColumns={1}
              contentContainerStyle={{ padding: 5 }}
              showsVerticalScrollIndicator={false}
            />

            {/* Footer */}
            <View style={styles.footerModal}>
              <TouchableOpacity
                style={[styles.buttonModal, styles.btnColorClose]}
                onPress={() => this.openArea()}
              >
                <Text style={styles.buttonTextModal}>Close</Text>
              </TouchableOpacity>
            </View>
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
    width: 80,
    height: 80,
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

  // Area
  areaCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 10,
  },
});

const mapStateToProps = state => ({
    mutasi: state.mutasi,
    asset: state.asset,
    depo: state.depo,
    tempmail: state.tempmail,
    auth: state.auth,
    newnotif: state.newnotif,
    dokumen: state.dokumen,
});

const mapDispatchToProps = {
    getCart: mutasi.getCart,
    deleteMutasi: mutasi.deleteMutasi,
    submitMutasi: mutasi.submitMutasi,
    getApproveMut: mutasi.getApproveMutasi,
    getAsset: asset.getAsset,
    getDetailDepo: depo.getDetailDepo,
    getDocumentMut: mutasi.getDocumentMut,
    resetAddMut: mutasi.resetAddMut,
    getDepo: depo.getDepo,
    addMutasi: mutasi.addMutasi,
    updateMutasi: mutasi.updateMutasi,
    getDetailMutasi: mutasi.getDetailMutasi,
    getDraftEmail: tempmail.getDraftEmail,
    sendEmail: tempmail.sendEmail,
    addNewNotif: newnotif.addNewNotif,
    submitMutasiFinal: mutasi.submitMutasiFinal,
};

export default connect(mapStateToProps, mapDispatchToProps)(CartMutasi);
