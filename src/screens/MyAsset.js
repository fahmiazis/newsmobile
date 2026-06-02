/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconAwe from 'react-native-vector-icons/FontAwesome';
import IconMateri from 'react-native-vector-icons/MaterialIcons';
import QRCode from 'react-native-qrcode-svg';
import { connect } from 'react-redux';
import moment from 'moment';

import asset from '../redux/actions/asset';
import AuthImage from '../helpers/AuthImage';
import placeholder from '../assets/placeholder.png';

import { API_URL } from '@env';

const { width: screenWidth } = Dimensions.get('window');

const STATUS_OPTIONS = [
  { value: 'available', label: 'Available',         color: '#22c55e' },
  { value: '100',       label: 'Belum di GR',       color: '#f59e0b' },
  { value: '0',         label: 'Disposal',           color: '#111827' },
  { value: '1',         label: 'Proses Disposal',   color: '#374151' },
  { value: '11',        label: 'Proses Mutasi',     color: '#3b82f6' },
];

const LIMIT = 50;

class MyAsset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      onSearch: false,
      showQr: false,
      filterVisible: false,
      selectedStatuses: [],
      page: 1,
      loadingMore: false,
      refreshing: false,
      hasMore: true,
      localData: [],
    };
  }

  componentDidMount() {
    this.fetchData(1, true);
  }

  // ─── Data fetching ──────────────────────────────────────────────────

  fetchData = async (page = 1, reset = false) => {
    const { token } = this.props.auth;
    const { search, selectedStatuses } = this.state;

    if (reset) {
      this.setState({ refreshing: true, hasMore: true });
    } else {
      this.setState({ loadingMore: true });
    }

    try {
      await this.props.getAsset(
        token,
        LIMIT,
        search,
        page,
        // 'master',
        { status: selectedStatuses },
      );

      const newData = this.props.asset.dataAsset || [];

      this.setState((prev) => ({
        localData: reset ? newData : [...prev.localData, ...newData],
        page,
        hasMore: newData.length === LIMIT,
      }));
    } finally {
      this.setState({ refreshing: false, loadingMore: false });
    }
  };

  onRefresh = () => {
    this.fetchData(1, true);
  };

  loadMore = () => {
    const { loadingMore, hasMore, refreshing } = this.state;
    if (loadingMore || !hasMore || refreshing) { return; }
    this.fetchData(this.state.page + 1, false);
  };

  // ─── Search ────────────────────────────────────────────────────────

  onType = (val) => {
    this.setState({ search: val });
  };

  onSubmitSearch = () => {
    this.fetchData(1, true);
  };

  // ─── Filter ────────────────────────────────────────────────────────

  toggleFilter = () => {
    this.setState((prev) => ({ filterVisible: !prev.filterVisible }));
  };

  toggleStatus = (val) => {
    this.setState((prev) => {
      const exists = prev.selectedStatuses.includes(val);
      return {
        selectedStatuses: exists
          ? prev.selectedStatuses.filter((s) => s !== val)
          : [...prev.selectedStatuses, val],
      };
    });
  };

  resetFilter = () => {
    this.setState({ selectedStatuses: [] });
  };

  applyFilter = () => {
    this.setState({ filterVisible: false }, () => {
      this.fetchData(1, true);
    });
  };

  // ─── QR toggle ─────────────────────────────────────────────────────

  toggleQr = () => {
    this.setState((prev) => ({ showQr: !prev.showQr }));
  };

  // ─── Status helpers ────────────────────────────────────────────────

  getStatusLabel = (item) => {
    if (item.status === '100') { return 'Belum di GR'; }
    if (item.status === '0')   { return 'Disposal'; }
    if (item.status === '1') { return 'Proses Disposal'; }
    if (item.status === '11') { return 'Proses Mutasi'; }
    return 'Available';
  };

  getStatusColor = (item) => {
    if (item.status === '100') { return '#f59e0b'; }
    if (item.status === '0')   { return '#111827'; }
    if (item.status === '1')   { return '#374151'; }
    if (item.status === '11')  { return '#3b82f6'; }
    return '#22c55e';
  };

  getRowBg = (item) => {
    if (item.status === '100') { return '#fefce8'; }
    if (item.status === '0')   { return '#f3f4f6'; }
    return '#ffffff';
  };

  // ─── Depreciation helpers ──────────────────────────────────────────

  calcDepre = (item) => {
    const diffVal = parseInt(item.accum_dep, 10) || 0;
    const now  = moment();
    const past = parseInt(moment(item.tanggal).format('DD'), 10) > 15
      ? moment(item.tanggal).add(1, 'month')
      : moment(item.tanggal);

    const diffMonth =
      (now.year() - past.year()) * 12 + (now.month() - past.month());
    const valMonth   = diffVal === 0 || diffMonth === 0 ? 0 : diffVal / diffMonth;
    const monthRemain =
      valMonth === 0
        ? 0
        : (parseInt(item.nilai_acquis, 10) / Math.abs(valMonth)) - diffMonth;

    return { diffMonth, valMonth: Math.round(valMonth), monthRemain: Math.round(monthRemain) };
  };

  formatNum = (n) =>
    (n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // ─── Render helpers ────────────────────────────────────────────────

  renderFooter = () => {
    const { loadingMore, hasMore } = this.state;
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#e53935" />
          <Text style={styles.footerLoaderText}>Memuat data...</Text>
        </View>
      );
    }
    if (!hasMore) {
      return (
        <View style={styles.footerLoader}>
          <Text style={styles.footerEndText}>Semua data telah dimuat</Text>
        </View>
      );
    }
    return null;
  };

  renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube-outline" size={64} color="#d1d5db" />
      <Text style={styles.emptyText}>Tidak ada data asset</Text>
    </View>
  );

  renderItem = ({ item, index }) => {
    const { showQr } = this.state;
    const { diffMonth, valMonth, monthRemain } = this.calcDepre(item);
    const statusLabel = this.getStatusLabel(item);
    const statusColor = this.getStatusColor(item);
    const rowBg       = this.getRowBg(item);

    const qrValue = JSON.stringify({ no: item.no_asset, cost: item.cost_center });

    return (
      <View style={[styles.card, { backgroundColor: rowBg }]}>
        {/* ── Header row ── */}
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.cardNo}>{item.no_asset}</Text>
            <Text style={styles.cardName} numberOfLines={2}>{item.nama_asset}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusBadgeText}>{statusLabel}</Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        {/* ── Body ── */}
        <View style={styles.cardBody}>
          {/* Left: image + QR */}
          <View style={styles.cardImageCol}>
            <AuthImage
              source={
                !item.pict || item.pict.length === 0
                  ? placeholder
                  : { uri: `${API_URL}/${item.pict[item.pict.length - 1].path}` }
              }
              style={styles.cardImage}
            />
            {showQr && (
              <View style={styles.qrWrapper}>
                <QRCode
                  value={qrValue}
                  size={90}
                />
                <Text style={styles.qrLabel} numberOfLines={1}>{item.no_asset}</Text>
              </View>
            )}
          </View>

          {/* Right: info */}
          <View style={styles.cardInfoCol}>
            <InfoRow label="SNo."        value={item.no_doc || '-'} />
            <InfoRow label="Cap. Date"   value={moment(item.tanggal).format('DD/MM/YYYY')} />
            <InfoRow label="Plant"       value={item.kode_plant || '-'} />
            <InfoRow label="Cost Ctr"    value={item.cost_center || '-'} />
            <InfoRow label="Area"        value={item.area || '-'} />
            <InfoRow label="Merk"        value={item.merk || '-'} />
            <InfoRow label="Satuan"      value={item.satuan || '-'} />
            <InfoRow label="Jumlah"      value={String(item.unit || 0)} />
            <InfoRow label="Lokasi"      value={item.lokasi || '-'} />
            <InfoRow label="Kategori"    value={item.kategori || '-'} />
          </View>
        </View>

        {/* ── Financial info ── */}
        <View style={styles.financeRow}>
          <FinCard label="Acquis Val"  value={`Rp ${this.formatNum(item.nilai_acquis)}`} color="#1d4ed8" />
          <FinCard label="Accum Dep"   value={`Rp ${this.formatNum(item.accum_dep)}`}   color="#dc2626" />
          <FinCard label="Book Val"    value={`Rp ${this.formatNum(item.nilai_buku)}`}   color="#15803d" />
        </View>

        {/* ── Depreciation row ── */}
        <View style={styles.depreRow}>
          <DepreChip label="Umur Aset"   value={`${diffMonth} bln`} />
          <DepreChip label="Depre/bln"   value={item.nilai_buku == 0 ? '0' : `${this.formatNum(valMonth)}`} />
          <DepreChip label="Sisa Umur"   value={diffMonth === 0 ? 'Tdk Terdefinisi' : item.nilai_buku == 0 ? '0' : `${monthRemain} bln`} />
          <DepreChip label="Record"      value={item.record_type || 'SAP'} />
        </View>
      </View>
    );
  };

  render() {
    const {
      search, showQr, filterVisible, selectedStatuses,
      refreshing, loadingMore, localData,
    } = this.state;

    const isLoading = this.props.asset.isLoading;
    const activeCount = selectedStatuses.length;

    return (
      <View style={styles.container}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Asset</Text>

          {/* Search bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#9ca3af" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari no asset / nama asset..."
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={this.onType}
              onSubmitEditing={this.onSubmitSearch}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => this.setState({ search: '' }, this.onSubmitSearch)}>
                <Ionicons name="close-circle" size={18} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>

          {/* Action row */}
          <View style={styles.actionRow}>
            {/* Filter button */}
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnFilter, activeCount > 0 && styles.actionBtnFilterActive]}
              onPress={this.toggleFilter}
            >
              <Ionicons name="options" size={16} color={activeCount > 0 ? '#fff' : '#374151'} />
              <Text style={[styles.actionBtnText, activeCount > 0 && { color: '#fff' }]}>
                Filter{activeCount > 0 ? ` (${activeCount})` : ''}
              </Text>
            </TouchableOpacity>

            {/* QR toggle */}
            <TouchableOpacity
              style={[styles.actionBtn, showQr ? styles.actionBtnQrOn : styles.actionBtnQrOff]}
              onPress={this.toggleQr}
            >
              <Ionicons name="qr-code" size={16} color={showQr ? '#fff' : '#374151'} />
              <Text style={[styles.actionBtnText, showQr && { color: '#fff' }]}>
                QR {showQr ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── List ── */}
        <FlatList
          data={localData}
          keyExtractor={(item) => String(item.id)}
          renderItem={this.renderItem}
          onEndReached={this.loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={this.renderFooter}
          ListEmptyComponent={!isLoading ? this.renderEmpty : null}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
              colors={['#e53935']}
              tintColor="#e53935"
            />
          }
          showsVerticalScrollIndicator={false}
        />

        {/* ── Initial loading overlay ── */}
        {isLoading && localData.length === 0 && (
          <View style={styles.initialLoader}>
            <ActivityIndicator size="large" color="#e53935" />
            <Text style={styles.initialLoaderText}>Memuat data asset...</Text>
          </View>
        )}

        {/* ── Filter Modal ── */}
        <Modal
          visible={filterVisible}
          animationType="slide"
          transparent
          onRequestClose={this.toggleFilter}
        >
          <TouchableOpacity
            style={styles.filterBackdrop}
            activeOpacity={1}
            onPress={this.toggleFilter}
          />
          <View style={styles.filterSheet}>
            <View style={styles.filterHandle} />
            <Text style={styles.filterTitle}>Filter Status Asset</Text>

            <ScrollView style={styles.filterScroll} showsVerticalScrollIndicator={false}>
              {STATUS_OPTIONS.map((opt) => {
                const active = selectedStatuses.includes(opt.value);
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.filterChip,
                      active && { backgroundColor: opt.color, borderColor: opt.color },
                    ]}
                    onPress={() => this.toggleStatus(opt.value)}
                  >
                    <View style={[styles.filterDot, { backgroundColor: opt.color }]} />
                    <Text style={[styles.filterChipText, active && { color: '#fff' }]}>
                      {opt.label}
                    </Text>
                    {active && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.filterFooter}>
              <TouchableOpacity style={styles.filterResetBtn} onPress={this.resetFilter}>
                <Text style={styles.filterResetText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterApplyBtn} onPress={this.applyFilter}>
                <Text style={styles.filterApplyText}>Terapkan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

// ─── Small presentational components ──────────────────────────────────────────

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue} numberOfLines={2}>: {value}</Text>
  </View>
);

const FinCard = ({ label, value, color }) => (
  <View style={[styles.finCard, { borderTopColor: color }]}>
    <Text style={styles.finCardLabel}>{label}</Text>
    <Text style={[styles.finCardValue, { color }]} numberOfLines={1}>{value}</Text>
  </View>
);

const DepreChip = ({ label, value }) => (
  <View style={styles.depreChip}>
    <Text style={styles.depreChipLabel}>{label}</Text>
    <Text style={styles.depreChipValue} numberOfLines={2}>{value}</Text>
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },

  // Header
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    padding: 0,
    marginHorizontal: 8,
  },
  actionRow: {
    flexDirection: 'row',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  actionBtnFilter: {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
  },
  actionBtnFilterActive: {
    backgroundColor: '#e53935',
    borderColor: '#e53935',
  },
  actionBtnQrOff: {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
  },
  actionBtnQrOn: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },

  // List
  listContent: {
    padding: 12,
    paddingBottom: 40,
  },

  // Card
  card: {
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
    paddingBottom: 8,
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 8,
  },
  cardNo: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 20,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 12,
  },
  cardBody: {
    flexDirection: 'row',
    padding: 12,
  },
  cardImageCol: {
    width: 100,
    alignItems: 'center',
    marginRight: 12,
  },
  cardImage: {
    width: 96,
    height: 72,
    borderRadius: 8,
    resizeMode: 'cover',
    backgroundColor: '#f3f4f6',
  },
  qrWrapper: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 8,
  },
  qrLabel: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  cardInfoCol: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  infoLabel: {
    fontSize: 11,
    color: '#9ca3af',
    width: 64,
    flexShrink: 0,
  },
  infoValue: {
    fontSize: 11,
    color: '#374151',
    flex: 1,
    fontWeight: '500',
  },

  // Finance cards
  financeRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 10,
  },
  finCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 8,
    borderTopWidth: 3,
    marginRight: 6,
  },
  finCardLabel: {
    fontSize: 9,
    color: '#9ca3af',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  finCardValue: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Depreciation chips
  depreRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 12,
  },
  depreChip: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    padding: 6,
    alignItems: 'center',
    marginRight: 4,
  },
  depreChipLabel: {
    fontSize: 8,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
    textAlign: 'center',
  },
  depreChipValue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },

  // Footer loader
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerLoaderText: {
    fontSize: 13,
    color: '#9ca3af',
    marginLeft: 8,
  },
  footerEndText: {
    fontSize: 12,
    color: '#d1d5db',
    fontStyle: 'italic',
  },

  // Empty
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 15,
    color: '#9ca3af',
    marginTop: 12,
  },

  // Initial loader
  initialLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialLoaderText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 12,
  },

  // Filter modal
  filterBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  filterSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    maxHeight: '70%',
  },
  filterHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    backgroundColor: '#f9fafb',
  },
  filterDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  filterFooter: {
    flexDirection: 'row',
    marginTop: 16,
  },
  filterResetBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    alignItems: 'center',
    marginRight: 10,
  },
  filterResetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterApplyBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#e53935',
    alignItems: 'center',
  },
  filterApplyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});

// ─── Redux ────────────────────────────────────────────────────────────────────

const mapStateToProps = (state) => ({
  asset: state.asset,
  auth:  state.auth,
});

const mapDispatchToProps = {
  getAsset: asset.getAsset,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyAsset);