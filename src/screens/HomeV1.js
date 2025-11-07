/* eslint-disable */
import React, { Component } from "react";
import { View, TouchableOpacity, RefreshControl, TextInput, Dimensions,
  Text, StyleSheet, ImageBackground, Image, ScrollView, } from "react-native";
import { db } from "../helpers/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import imgBackground from '../assets/bckHome.jpg'
import io from '../assets/io.png'
import disposal from '../assets/dis.png'
import mutasi from '../assets/mutasis.png'
import stock from '../assets/opname.png'

import {connect} from 'react-redux';
import user from '../redux/actions/user'
import newnotif from '../redux/actions/newnotif'
import auth from '../redux/actions/auth'
import dashboard from '../redux/actions/dashboard'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'

const { width } = Dimensions.get("window");

class Home extends Component {
  state = {
    items: [],
    onRefresh: false,
    selectedYear: moment().startOf('month'),
    showDate: false
  };

  componentDidMount() {
    this.getDataDashboard()
  }

  getDataDashboard = async () => {
    const token = this.props.auth.token
    const {selectedYear} = this.state
    await this.props.getDashboard(token, moment(selectedYear).format('YYYY'))
  } 
  // componentWillUnmount() {
  //   this.getData()
  // }

  refreshPage = async () => {
    this.setState({onRefresh: true});
    const token = this.props.auth.token
    await this.props.getAllNewNotif(token)
    this.setState({onRefresh: false})
  }

  getData = async () => {
      const token = this.props.auth.token
      await this.props.getAllNewNotif(token)
  }

  goRoute = (val) => {
    this.props.navigation.navigate(`${val}`)
  }

  setDate = (event, selectedDate, type) => {
    this.setState({showDate: false});
    if (selectedDate) {
      this.setState({selectedYear: selectedDate});
      this.getDataDashboard()
    }
  };

  render() {
    const { items, selectedYear, showDate } = this.state;
    const { dataDashboard } = this.props.dashboard

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
                )
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
                )
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
                )
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
                )
              })}
              <TouchableOpacity style={styles.btnDetail} onPress={() => this.goRoute('MutasiTab')}>
                <Text style={styles.txtBtn}>Detail</Text>
              </TouchableOpacity>
              {/* <Image source={mutasi} style={styles.imgCard} />
              <Text>Mutasi Aset</Text> */}
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
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
});

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.user,
    newnotif: state.newnotif,
    dashboard: state.dashboard
})

const mapDispatchToProps = {
    updateUser: user.updateUser,
    reset: user.resetError,
    logout: auth.logout,
    changePassword: user.changePassword,
    getAllNewNotif: newnotif.getAllNewNotif,
    getDashboard: dashboard.getDashboard
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)