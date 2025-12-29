/* eslint-disable */
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconAwe from 'react-native-vector-icons/FontAwesome'
import logo from '../assets/logo.png';
import { connect } from 'react-redux';
import { navigate } from '../helpers/navigation'

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.7; // dipersempit dikit

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slideAnim: new Animated.Value(-SIDEBAR_WIDTH),
      overlayOpacity: new Animated.Value(0),
      expandedMenus: {}, // untuk track dropdown mana yang terbuka
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.openSidebar();
      } else {
        this.closeSidebar();
      }
    }
  }

  openSidebar = () => {
    Animated.parallel([
      Animated.timing(this.state.slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.overlayOpacity, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  closeSidebar = () => {
    Animated.parallel([
      Animated.timing(this.state.slideAnim, {
        toValue: -SIDEBAR_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (this.props.onClose) {
        this.props.onClose();
      }
    });
  };

  toggleExpand = (menuKey) => {
    this.setState((prev) => ({
      expandedMenus: {
        ...prev.expandedMenus,
        [menuKey]: !prev.expandedMenus[menuKey],
      },
    }));
  };

  renderMenuItem = (label, icon, onPress, isSub = false) => (
    <TouchableOpacity style={[styles.menuItem, isSub && styles.subMenu]} onPress={onPress}>
      <Icon name={icon} size={18} color="#fff" />
      <Text style={styles.menuText}>{label}</Text>
    </TouchableOpacity>
  );

  goRoute = (val) => {
    const {navigation} = this.props
    this.setState({expandedMenus: {}})
    this.props.onClose()
    setTimeout(() => {
      navigation(val.menu, val.screen)
    }, 100)
  }

  render() {
    const { slideAnim, overlayOpacity, expandedMenus } = this.state;
    const { visible, navigation } = this.props;
    const {dataUser, token} = this.props.auth;
    const level = dataUser.user_level;
    const allowSet = [1,17,20, 21, 22, 23, 24, 25, 32]

    if (!visible && this.state.overlayOpacity._value === 0) {
      return null;
    }

    return (
      <View style={StyleSheet.absoluteFill}>
        {/* Overlay */}
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={this.closeSidebar}
          />
        </Animated.View>

        {/* Sidebar */}
        <Animated.View
          style={[
            styles.sidebar,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>

          {/* Menu */}
          <ScrollView style={styles.menuContainer}>
            <TouchableOpacity style={[styles.menuItem]} onPress={() => this.goRoute({menu: 'Home', screen: 'Home'})}>
              <Icon name='home' size={18} color="#fff" />
              <Text style={styles.menuText}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => this.toggleExpand('Pengadaan Aset')}
            >
              <Icon name="cart" size={18} color="#fff" />
              <Text style={styles.menuText}>Pengadaan Aset</Text>
              <Icon
                name={expandedMenus['Pengadaan Aset'] ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#fff"
                style={{ marginLeft: 'auto' }}
              />
            </TouchableOpacity>
            {expandedMenus['Pengadaan Aset'] && (
              <View>
                {(level !== 2 && level !== 8) && (
                  <TouchableOpacity style={[styles.menuItem, styles.subMenu]} onPress={() => this.goRoute({menu: 'PengadaanTab', screen: 'Pengadaan'})}>
                    <IconAwe name='send' size={12} color="#fff" />
                    <Text style={styles.menuText}>Pengajuan Pengadaan Aset</Text>
                  </TouchableOpacity>
                )}

                {level === 2 && (
                  <TouchableOpacity style={[styles.menuItem, styles.subMenu]} onPress={() => this.goRoute({menu: 'PengadaanTab', screen: 'Pengadaan'})}>
                    <IconAwe name='calendar-check-o' size={12} color="#fff" />
                    <Text style={styles.menuText}>Verifikasi Pengadaan Aset</Text>
                  </TouchableOpacity>
                )}

                {level === 8 && (
                  <TouchableOpacity style={[styles.menuItem, styles.subMenu]} onPress={() => this.goRoute({menu: 'PengadaanTab', screen: 'Pengadaan'})}>
                    <IconAwe name='gear' size={12} color="#fff" />
                    <Text style={styles.menuText}>Verifikasi Budget Pengadaan</Text>
                  </TouchableOpacity>
                )}
                
                {level === 2 && (
                  <TouchableOpacity style={[styles.menuItem, styles.subMenu]} onPress={() => this.goRoute({menu: 'PengadaanTab', screen: 'EksekusiPengadaan'})}>
                    <IconAwe name='truck' size={12} color="#fff" />
                    <Text style={styles.menuText}>Eksekusi Pengadaan Aset</Text>
                  </TouchableOpacity>
                )}
                
                {(level === 5 || level === 9) && (
                  <TouchableOpacity style={[styles.menuItem, styles.subMenu]} onPress={() => this.goRoute({menu: 'PengadaanTab', screen: 'RevisiPengadaan'})}>
                    <IconAwe name='repeat' size={12} color="#fff" />
                    <Text style={styles.menuText}>Revisi Pengadaan Aset</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => this.toggleExpand('Disposal Aset')}
            >
              <Icon name='delete' size={18} color="#fff" />
              <Text style={styles.menuText}>Disposal Aset</Text>
              <Icon
                name={expandedMenus['Disposal Aset'] ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#fff"
                style={{ marginLeft: 'auto' }}
              />
            </TouchableOpacity>
            {expandedMenus['Disposal Aset'] && (
              <View>
                {(level !== 6 && level !== 4 && level !== 3) && (
                  <TouchableOpacity style={[styles.menuItem, styles.subMenu]} onPress={() => this.goRoute({menu: 'DisposalTab', screen: 'Disposal'})}>
                    <IconAwe name='send' size={12} color="#fff" />
                    <Text style={styles.menuText}>Pengajuan Disposal Aset</Text>
                  </TouchableOpacity>
                )}
                
                {(level === 6) && (
                  <TouchableOpacity style={[styles.menuItem, styles.subMenu]} onPress={() => this.goRoute({menu: 'DisposalTab', screen: 'PurchDisposal'})}>
                    <IconAwe name='dollar' size={15} color="#fff" />
                    <Text style={styles.menuText}>Verifikasi Purchasing</Text>
                  </TouchableOpacity>
                )}

                {allowSet.find(item => item === level) && (
                  <TouchableOpacity style={[styles.menuItem, styles.subMenu]} onPress={() => this.goRoute({menu: 'DisposalTab', screen: 'PersetujuanDisposal'})}>
                    <IconAwe name='file-text' size={12} color="#fff" />
                    <Text style={styles.menuText}>Persetujuan Disposal Aset</Text>
                  </TouchableOpacity>
                )}

                {level === 2 && (
                  <TouchableOpacity style={[styles.menuItem, styles.subMenu]} onPress={() => this.goRoute({menu: 'DisposalTab', screen: 'EksekusiDisposal'})}>
                    <IconAwe name='truck' size={12} color="#fff" />
                    <Text style={styles.menuText}>Eksekusi Disposal Aset</Text>
                  </TouchableOpacity>
                )}
                
                {level === 3 && (
                  <TouchableOpacity style={[styles.menuItem, styles.subMenu]} onPress={() => this.goRoute({menu: 'DisposalTab', screen: 'TaxFinDisposal'})}>
                    <IconAwe name='gear' size={12} color="#fff" />
                    <Text style={styles.menuText}>Proses Tax Disposal</Text>
                  </TouchableOpacity>
                )}
                
                {level === 4 && (
                  <TouchableOpacity style={[styles.menuItem, styles.subMenu]} onPress={() => this.goRoute({menu: 'DisposalTab', screen: 'TaxFinDisposal'})}>
                    <IconAwe name='gear' size={12} color="#fff" />
                    <Text style={styles.menuText}>Proses Finance Disposal</Text>
                  </TouchableOpacity>
                )}
                
                {level === 2 && (
                  <TouchableOpacity style={[styles.menuItem, styles.subMenu]} onPress={() => this.goRoute({menu: 'DisposalTab', screen: 'TaxFinDisposal'})}>
                    <IconAwe name='calendar-check-o' size={12} color="#fff" />
                    <Text style={styles.menuText}>Verifikasi Final Disposal</Text>
                  </TouchableOpacity>
                )}

                {(level === 5 || level === 9) && (
                  <TouchableOpacity style={[styles.menuItem, styles.subMenu]} onPress={() => this.goRoute({menu: 'DisposalTab', screen: 'RevisiDisposal'})}>
                    <IconAwe name='repeat' size={12} color="#fff" />
                    <Text style={styles.menuText}>Revisi Disposal Aset</Text>
                  </TouchableOpacity>
                )}
                
              </View>
            )}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => this.toggleExpand('Mutasi Aset')}
            >
              <Icon name='swap-horizontal' size={18} color="#fff" />
              <Text style={styles.menuText}>Mutasi Aset</Text>
              <Icon
                name={expandedMenus['Mutasi Aset'] ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#fff"
                style={{ marginLeft: 'auto' }}
              />
            </TouchableOpacity>
            {expandedMenus['Mutasi Aset'] && (
              <View>
                {level !== 8 && (
                  <TouchableOpacity style={[styles.menuItem, styles.subMenu]} onPress={() => this.goRoute({menu: 'MutasiTab', screen: 'Mutasi'})}>
                    <IconAwe name='send' size={12} color="#fff" />
                    <Text style={styles.menuText}>Pengajuan Mutasi Aset</Text>
                  </TouchableOpacity>
                )}
                {level === 8 && (
                  <TouchableOpacity style={[styles.menuItem, styles.subMenu]} onPress={() => this.goRoute({menu: 'MutasiTab', screen: 'BudgetMutasi'})}>
                    <IconAwe name='gear' size={12} color="#fff" />
                    <Text style={styles.menuText}>Verifikasi Budget Mutasi</Text>
                  </TouchableOpacity>
                )}
                {level === 2 && (
                  <TouchableOpacity style={[styles.menuItem, styles.subMenu]} onPress={() => this.goRoute({menu: 'MutasiTab', screen: 'EksekusiMutasi'})}>
                    <IconAwe name='truck' size={12} color="#fff" />
                    <Text style={styles.menuText}>Eksekusi Mutasi</Text>
                  </TouchableOpacity>
                )}

                {(level === 5 || level === 9) && (
                  <TouchableOpacity style={[styles.menuItem, styles.subMenu]} onPress={() => this.goRoute({menu: 'MutasiTab', screen: 'RevisiMutasi'})}>
                    <IconAwe name='repeat' size={12} color="#fff" />
                    <Text style={styles.menuText}>Revisi Mutasi Aset</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => this.toggleExpand('Stock Opname Aset')}
            >
              <Icon name='clipboard-list' size={18} color="#fff" />
              <Text style={styles.menuText}>Stock Opname Aset</Text>
              <Icon
                name={expandedMenus['Stock Opname Aset'] ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#fff"
                style={{ marginLeft: 'auto' }}
              />
            </TouchableOpacity>
            {expandedMenus['Stock Opname Aset'] && (
              <View>
                {level !== 2 && ( 
                  <TouchableOpacity style={[styles.menuItem, styles.subMenu]} onPress={() => this.goRoute({menu: 'StockTab', screen: 'Stock'})}>
                    <IconAwe name='send' size={12} color="#fff" />
                    <Text style={styles.menuText}>Pengajuan Stock Opname</Text>
                  </TouchableOpacity>
                )}
                {level === 2 && (
                  <TouchableOpacity style={[styles.menuItem, styles.subMenu]} onPress={() => this.goRoute({menu: 'StockTab', screen: 'Stock'})}>
                    <IconAwe name='truck' size={12} color="#fff" />
                    <Text style={styles.menuText}>Terima Stock Opname</Text>
                  </TouchableOpacity> 
                )}
                {(level === 5 || level === 9) && (
                  <TouchableOpacity style={[styles.menuItem, styles.subMenu]} onPress={() => this.goRoute({menu: 'StockTab', screen: 'RevisiStock'})}>
                    <IconAwe name='repeat' size={12} color="#fff" />
                    <Text style={styles.menuText}>Revisi Stock Opname</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            <TouchableOpacity style={[styles.menuItem]} onPress={() => this.goRoute({menu: 'ReleaseApk', screen: 'ReleaseApk'})}>
              <IconAwe name='mobile-phone' size={24} color="#fff" />
              <Text style={styles.menuText}>Release APK</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: 'rgba(192, 57, 43, 0.8)',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
  },
  logo: {
    width: 90,
    height: 70,
  },
  menuContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  subMenu: {
    paddingLeft: 30, // indent masuk ke kanan
  },
  menuText: {
    color: '#fff',
    fontSize: 14, // lebih kecil dari sebelumnya
    marginLeft: 8,
  },
});

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(Sidebar)
