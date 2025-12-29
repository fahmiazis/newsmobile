// src/screens/ReleaseApk.js
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Platform,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import apk from '../redux/actions/apk';
import moment from 'moment';
import IconAwe from 'react-native-vector-icons/FontAwesome5';
import RNFetchBlob from 'react-native-blob-util';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import Modal from 'react-native-modal';

class ReleaseApk extends Component {
  state = {
    refreshing: false,
    downloadingId: null,
    showDownloadModal: false,
    downloadingFileName: '',
  };

  componentDidMount() {
    this.loadApkList();
  }

  loadApkList = async () => {
    const { token } = this.props.auth;
    await this.props.getApk(token, 100, '', 1, '');
  };

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.loadApkList();
    this.setState({ refreshing: false });
  };

  // ADD: Reset dismissed update (for testing)
  resetDismissedUpdate = async () => {
    Alert.alert(
      'Reset Update Notification',
      'Hapus history dismissed update? Popup update akan muncul lagi di Home.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset',
          onPress: async () => {
            await AsyncStorage.removeItem('@dismissed_update_version');
            Alert.alert('Success', 'Dismissed update cleared! Close app dan buka lagi.');
          },
        },
      ]
    );
  };

  checkInstallPermission = async () => {
    if (Platform.OS !== 'android') return false;

    try {
      if (Platform.Version >= 26) {
        // Untuk RN 0.63.4, mungkin method ini belum ada
        // Jadi kita assume user sudah enable
        return true;
      }
      return true;
    } catch (error) {
      console.log('Error checking permission:', error);
      return true;
    }
  };

  openSettings = () => {
    Alert.alert(
      'Enable Install Unknown Apps',
      'Untuk install APK, silakan aktifkan "Install Unknown Apps" di Settings → Apps → Asset Mobile → Install unknown apps',
      [
        { text: 'OK' }
      ]
    );
  };

  downloadApk = async (item) => {
    const hasPermission = await this.checkInstallPermission();

    if (!hasPermission) {
      this.openSettings();
      return;
    }

    this.setState({ downloadingId: item.id });

    const downloadUrl = `${API_URL}/${item.path}`;
    const fileName = `${item.name.replace(/\s/g, '_')}-v${item.versi}.apk`;

    try {
      const { dirs } = RNFetchBlob.fs;
      const downloadPath = Platform.OS === 'android' 
        ? `${dirs.DownloadDir}/${fileName}`
        : `${dirs.DocumentDir}/${fileName}`;

      console.log('Downloading from:', downloadUrl);
      console.log('Saving to:', downloadPath);

      const res = await RNFetchBlob.config({
        fileCache: false,
        appendExt: 'apk',
        path: downloadPath,
      }).fetch('GET', downloadUrl);

      const filePath = res.path();
      
      this.setState({ downloadingId: null });

      console.log('Download complete:', filePath);
      console.log('File exists:', await RNFetchBlob.fs.exists(filePath));

      Alert.alert(
        'Download Selesai',
        'APK berhasil diunduh. Install sekarang?',
        [
          { text: 'Nanti', style: 'cancel' },
          { text: 'Install', onPress: () => this.installAPK(res.path()) },
        ]
      );
    } catch (error) {
      this.setState({ downloadingId: null });
      Alert.alert('Download Failed', 'Gagal mengunduh APK. Silakan coba lagi.\n\nError: ' + error.message);
      console.log('Download error:', error);
    }
  };

  installAPK = (filePath) => {
    if (Platform.OS === 'android') {
      console.log('Installing APK from:', filePath);
      
      // Method 1: Try actionViewIntent
      RNFetchBlob.android.actionViewIntent(
        filePath, 
        'application/vnd.android.package-archive'
      )
      .then(() => {
        console.log('Install intent triggered');
      })
      .catch((error) => {
        console.log('Method 1 failed:', error);
        
        // Method 2: Try with file:// URI
        const fileUri = `file://${filePath}`;
        console.log('Trying Method 2 with URI:', fileUri);
        
        Linking.openURL(fileUri)
          .then(() => {
            console.log('Method 2 success');
          })
          .catch((error2) => {
            console.log('Method 2 failed:', error2);
            
            // Method 3: Show file location
            Alert.alert(
              'Info',
              'File APK sudah tersimpan di:\n' + filePath + '\n\nSilakan buka File Manager dan install manual.',
              [{ text: 'OK' }]
            );
          });
      });
    }
  };

  renderItem = ({ item, index }) => {
    const { downloadingId } = this.state;
    const currentVersion = DeviceInfo.getVersion();
    const isCurrentVersion = item.versi === currentVersion;
    const isDownloading = downloadingId === item.id;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            {isCurrentVersion && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Installed</Text>
              </View>
            )}
          </View>
          <Text style={styles.versionBadge}>v{item.versi}</Text>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <IconAwe name="calendar-alt" size={14} color="#666" />
            <Text style={styles.infoText}>
              {moment(item.date_release).format('DD MMMM YYYY')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <IconAwe name="mobile-alt" size={14} color="#666" />
            <Text style={styles.infoText}>{item.compatible || 'Android'}</Text>
          </View>

          {item.note_release && (
            <View style={styles.releaseNotes}>
              <Text style={styles.releaseNotesTitle}>Release Notes:</Text>
              <Text style={styles.releaseNotesText}>{item.note_release}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.downloadButton,
            isCurrentVersion && styles.downloadButtonDisabled,
            isDownloading && styles.downloadButtonDownloading,
          ]}
          onPress={() => this.downloadApk(item)}
          disabled={isDownloading || isCurrentVersion}
        >
          {isDownloading ? (
            <>
              <IconAwe name="spinner" size={16} color="#fff" />
              <Text style={styles.downloadButtonText}>Downloading...</Text>
            </>
          ) : isCurrentVersion ? (
            <>
              <IconAwe name="check-circle" size={16} color="#fff" />
              <Text style={styles.downloadButtonText}>Current Version</Text>
            </>
          ) : (
            <>
              <IconAwe name="download" size={16} color="#fff" />
              <Text style={styles.downloadButtonText}>Download & Install</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { dataApk, isLoading } = this.props.apk;
    const { refreshing, showDownloadModal, downloadingFileName } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Release APK</Text>
              <Text style={styles.headerSubtitle}>
                Current Version: {DeviceInfo.getVersion()}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={this.resetDismissedUpdate}
            >
              <IconAwe name="redo" size={16} color="#fff" />
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={dataApk || []}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `apk-${index}`}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconAwe name="inbox" size={50} color="#ccc" />
              <Text style={styles.emptyText}>
                {isLoading ? 'Loading...' : 'No APK available'}
              </Text>
            </View>
          }
        />

        {/* Download Modal */}
        <Modal
          isVisible={showDownloadModal}
          animationIn="fadeIn"
          animationOut="fadeOut"
          backdropOpacity={0.6}
          useNativeDriver={true}
        >
          <View style={styles.downloadModalContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.downloadModalTitle}>Mengunduh APK...</Text>
            <Text style={styles.downloadModalSubtitle}>{downloadingFileName}</Text>
            <Text style={styles.downloadModalText}>Mohon tunggu, jangan tutup aplikasi</Text>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#e35d5b',
    padding: 20,
    paddingTop: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
    opacity: 0.9,
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  currentBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  currentBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  versionBadge: {
    backgroundColor: '#e35d5b',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBody: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  releaseNotes: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  releaseNotesTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  releaseNotesText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  downloadButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  downloadButtonDisabled: {
    backgroundColor: '#9E9E9E',
  },
  downloadButtonDownloading: {
    backgroundColor: '#2196F3',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  downloadModalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
  },
  downloadModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  downloadModalSubtitle: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  downloadModalText: {
    fontSize: 13,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  apk: state.apk,
});

const mapDispatchToProps = {
  getApk: apk.getApk,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReleaseApk);
