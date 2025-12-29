// src/components/UpdateChecker.js
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking, Platform } from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import RNFetchBlob from 'react-native-blob-util';
import { connect } from 'react-redux';
import apk from '../redux/actions/apk';
import IconAwe from 'react-native-vector-icons/FontAwesome5';
import {API_URL} from '@env';

const DISMISSED_VERSION_KEY = '@dismissed_update_version';

class UpdateChecker extends Component {
  state = {
    showUpdateModal: false,
    isDownloading: false,
    latestVersion: null,
    currentVersion: '',
    updateInfo: null,
  };

  async componentDidMount() {
    // Delay check 1 detik biar gak langsung popup pas buka app
    setTimeout(() => {
      this.checkForUpdate();
    }, 1000);

    // TEMPORARY: Force show popup untuk testing
    // HAPUS INI SETELAH TESTING!
    // setTimeout(() => {
    //   this.setState({
    //     showUpdateModal: true,
    //     latestVersion: '999.0.0',
    //     currentVersion: '0.0.1',
    //     updateInfo: {
    //       name: 'Test App',
    //       versi: '999.0.0',
    //       note_release: 'Test update',
    //       path: 'test.apk'
    //     }
    //   });
    // }, 2000);
  }

  checkForUpdate = async () => {
    try {
      const { token } = this.props.auth;
      const currentVersion = DeviceInfo.getVersion();
      
      this.setState({ currentVersion });

      // Fetch latest APK info
      await this.props.getApk(token, 1, '', 1, '');
      
      const { dataApk } = this.props.apk;
      
      console.log('DataApk from API:', dataApk);
      
      if (dataApk && dataApk.length > 0) {
        const latestApk = dataApk[0]; // Array pertama = versi terbaru
        const latestVersion = latestApk.versi;

        console.log('Current version:', currentVersion);
        console.log('Latest version:', latestVersion);

        // Check if version is newer
        if (this.isNewerVersion(latestVersion, currentVersion)) {
          // Check if user already dismissed this version
          const dismissedVersion = await AsyncStorage.getItem(DISMISSED_VERSION_KEY);
          
          console.log('Dismissed version:', dismissedVersion);

          if (dismissedVersion !== latestVersion) {
            this.setState({
              showUpdateModal: true,
              latestVersion,
              updateInfo: latestApk,
            });
          }
        }
      }
    } catch (error) {
      console.log('Error checking update:', error);
    }
  };

  isNewerVersion = (latest, current) => {
    const latestParts = latest.split('.').map(Number);
    const currentParts = current.split('.').map(Number);

    for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
      const l = latestParts[i] || 0;
      const c = currentParts[i] || 0;
      if (l > c) return true;
      if (l < c) return false;
    }
    return false;
  };

  handleDismiss = async () => {
    const { latestVersion } = this.state;
    await AsyncStorage.setItem(DISMISSED_VERSION_KEY, latestVersion);
    this.setState({ showUpdateModal: false });
  };

  handleUpdate = async () => {
    // Langsung download, gak perlu check permission dulu
    // Karena permission check kadang error di RN 0.63.4
    this.downloadAndInstall();
  };

  downloadAndInstall = async () => {
    const { updateInfo } = this.state;

    this.setState({ isDownloading: true });

    const downloadUrl = `${API_URL}/${updateInfo.path}`;
    const fileName = `${updateInfo.name.replace(/\s/g, '_')}-v${updateInfo.versi}.apk`;
    
    try {
      const { dirs } = RNFetchBlob.fs;
      // PENTING: Gunakan external storage, bukan internal cache
      const downloadPath = Platform.OS === 'android' 
        ? `${dirs.DownloadDir}/${fileName}`
        : `${dirs.DocumentDir}/${fileName}`;

      console.log('Downloading from:', downloadUrl);
      console.log('Saving to:', downloadPath);

      const res = await RNFetchBlob.config({
        fileCache: false,  // IMPORTANT: Set false biar langsung save ke path
        appendExt: 'apk',
        path: downloadPath,
      }).fetch('GET', downloadUrl);

      this.setState({ isDownloading: false, showUpdateModal: false });

      console.log('Download complete:', res.path());

      // Trigger install
      this.installAPK(res.path());
      
    } catch (error) {
      this.setState({ isDownloading: false });
      Alert.alert(
        'Download Failed', 
        'Gagal mengunduh update. Silakan coba lagi.\n\nError: ' + error.message
      );
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
        console.log('Install intent triggered successfully');
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
            
            // Method 3: Manual instruction
            Alert.alert(
              'Install APK',
              'Silakan install manual:\n\n1. Buka File Manager\n2. Masuk folder Download\n3. Tap file: ' + filePath.split('/').pop() + '\n4. Klik Install\n\nFile Location:\n' + filePath,
              [
                { 
                  text: 'Buka Download',
                  onPress: () => {
                    // Try to open file manager
                    Linking.openURL('content://com.android.externalstorage.documents/document/primary:Download')
                      .catch(() => {
                        console.log('Cannot open file manager');
                      });
                  }
                },
                { text: 'OK' }
              ]
            );
          });
      });
    }
  };

  render() {
    const { showUpdateModal, isDownloading, latestVersion, currentVersion, updateInfo } = this.state;

    if (!showUpdateModal) return null;

    return (
      <Modal
        isVisible={showUpdateModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.6}
        onBackdropPress={!isDownloading ? this.handleDismiss : null}
        useNativeDriver={true}
      >
        <View style={styles.modalContainer}>
          {isDownloading ? (
            <View style={styles.downloadingContainer}>
              <IconAwe name="spinner" size={50} color="#4CAF50" />
              <Text style={styles.downloadingText}>Mengunduh Update...</Text>
              <Text style={styles.downloadingSubtext}>Mohon tunggu...</Text>
            </View>
          ) : (
            <>
              <View style={styles.header}>
                <IconAwe name="rocket" size={40} color="#4CAF50" />
                <Text style={styles.title}>🎉 Update Tersedia!</Text>
              </View>

              <View style={styles.versionContainer}>
                <View style={styles.versionRow}>
                  <Text style={styles.versionLabel}>Versi Saat Ini:</Text>
                  <Text style={styles.versionValue}>{currentVersion}</Text>
                </View>
                <View style={styles.versionRow}>
                  <Text style={styles.versionLabel}>Versi Terbaru:</Text>
                  <Text style={[styles.versionValue, styles.highlight]}>{latestVersion}</Text>
                </View>
              </View>

              {updateInfo && updateInfo.note_release && (
                <View style={styles.releaseNotesContainer}>
                  <Text style={styles.releaseNotesTitle}>Release Notes:</Text>
                  <Text style={styles.releaseNotesText}>{updateInfo.note_release}</Text>
                </View>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.laterButton]}
                  onPress={this.handleDismiss}
                >
                  <Text style={styles.buttonText}>Later</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.updateButton]}
                  onPress={this.handleUpdate}
                >
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  versionContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  versionLabel: {
    fontSize: 14,
    color: '#666',
  },
  versionValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  highlight: {
    color: '#4CAF50',
  },
  releaseNotesContainer: {
    backgroundColor: '#fff8e1',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  releaseNotesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f57c00',
    marginBottom: 8,
  },
  releaseNotesText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  laterButton: {
    backgroundColor: '#9E9E9E',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  downloadingContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  downloadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  downloadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  apk: state.apk,
});

const mapDispatchToProps = {
  getApk: apk.getApk,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateChecker);