/* eslint-disable */
import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { db } from '../helpers/firebase'; // Import Firestore
import { collection, addDoc } from "firebase/firestore";
import moment from 'moment';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barcode: null,
    };
  }

  // Fungsi untuk menangani hasil pemindaian barcode
  handleBarcodeScan = async (scanResult) => {
    const { data } = scanResult;
    this.setState({ barcode: data });
    const parse = JSON.parse(data)
    this.props.navigation.navigate('StockTab', {
      screen: 'CartStock',
      params: parse
    });
    // try {
    //   await addDoc(collection(db, 'barcodes'), {
    //     barcodeData: data,
    //     tgl_data: moment().format('DD/MM/YYYY')
    //   });
    //   Alert.alert('Barcode Detected', 'Data successfully added to Firebase!');
    // } catch (error) {
    //   Alert.alert('Error', 'Failed to add data to Firebase');
    // }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <RNCamera
          style={{ flex: 1 }}
          type={RNCamera.Constants.Type.back}
          onBarCodeRead={this.handleBarcodeScan}
          captureAudio={false}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <Text style={{ fontSize: 18, color: 'white' }}>
              Scan Qr code
            </Text>
          </View>
        </RNCamera>

        {this.state.barcode && (
          <View style={{ padding: 20 }}>
            <Text>Barcode Detected: {this.state.barcode}</Text>
          </View>
        )}
      </View>
    );
  }
}

export default App;