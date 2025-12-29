/* eslint-disable */
import React, { Component, createContext, useContext, useState, useEffect } from 'react'
import {StyleSheet, View, TouchableOpacity, Image, Text, FlatList, Animated, Easing} from 'react-native'
import Modal from 'react-native-modal';
import {NavigationContainer, useNavigation, useRoute} from '@react-navigation/native'
import {createStackNavigator, HeaderBackButton, HeaderHeightContext} from '@react-navigation/stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {connect, useSelector, useDispatch} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconMateri from 'react-native-vector-icons/MaterialIcons'
import IconAnt from 'react-native-vector-icons/AntDesign'
import IconAwe from 'react-native-vector-icons/FontAwesome5';
import IconTisto from 'react-native-vector-icons/Fontisto';
import logo from '../assets/logo.png'
import notifAct from '../redux/actions/newnotif'
import moment from 'moment';
import messaging from '@react-native-firebase/messaging';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

//import TestPage from './TestPage' //untuk uji coba
// import Search from './Search'
import Login from './Login'  
import Home from './HomeV1'
import Profile from './Profile'
import Scanner from './Scanner'
import Sidebar from '../components/Sidebar'
import Notif from './Notif';
import ReleaseApk from './ReleaseApk';

// Mutasi
import Mutasi from './Mutasi/Mutasi'
import CartMutasi from './Mutasi/CartMutasi'
import BudgetMutasi from './Mutasi/BudgetMutasi'
import EksekusiMutasi from './Mutasi/EksekusiMutasi'
import RevisiMutasi from './Mutasi/RevisiMutasi'

// Disposal
import Disposal from './Disposal/Disposal'
import CartDisposal from './Disposal/CartDisposal'
import PurchDisposal from './Disposal/PurchDisposal'
import PersetujuanDisposal from './Disposal/PersetujuanDisposal'
import EksekusiDisposal from './Disposal/EksekusiDisposal'
import TaxFinDisposal from './Disposal/TaxFinDisposal'
import RevisiDisposal from './Disposal/RevisiDisposal'

// Stock
import Stock from './Stock/Stock'
import CartStock from './Stock/CartStock'
import RevisiStock from './Stock/RevisiStock'

// Pengadaan
import Pengadaan from './Pengadaan/Pengadaan'
import EksekusiPengadaan from './Pengadaan/EksekusiPengadaan'
import CartPengadaan from './Pengadaan/CartPengadaan'
import RevisiPengadaan from './Pengadaan/RevisiPengadaan'

const SidebarContext = createContext({ toggleSidebar: () => {} })

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

// const SearchButton = () => {
//     const navigation = useNavigation()
//     return(
//         <View style={style.search}>
//             <TouchableOpacity onPress={() => navigation.navigate('Search') }>
//                 <Icon name="magnify" size={22} color="#c0392b"/>
//             </TouchableOpacity>
//         </View>
//     )
// }


const AccountButton = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const [notifVisible, setNotifVisible] = useState(false)
    const notifDucer = useSelector((state) => state.newnotif)
    const authDucer = useSelector((state) => state.auth)

    const dispatch = useDispatch()

    useEffect(() => {
        const { token } = authDucer
        const getData = async () => {
            await dispatch(notifAct.getAllNewNotif(token))
        };

        getData();
    }, [])

    // const dataAllNotif = Array(10).fill(0).flatMap(() => notifDucer.dataAllNotif)
    const { dataAllNotif, dataRoutes } = notifDucer

    const toggleNotif = () => setNotifVisible(!notifVisible)

    const goRoute = async (val) => {
        const { token } = authDucer
        // const typeNotif = val.tipe === 'pengajuan area' && val.transaksi === 'vendor' ? 'approve' : val.tipe
        // const data = {
        //     route: val.routes, 
        //     type: typeNotif, 
        //     item: val,
        //     filter: val.filter
        // }
        await dispatch(notifAct.readNewNotif(token, val.id))
        const cekRoute = dataRoutes.find(item => item.web === val.routes)
        if (cekRoute) {
            setNotifVisible(false)
            navigation.navigate(cekRoute.mobile, { screen: cekRoute.sub })
        }
    }

    return(
        <View style={style.search}>
            <TouchableOpacity style={style.notif} onPress={toggleNotif}>
                <IconMateri name="notifications" size={22} color={route.name === 'Home' ? "black" : "#c0392b"}/>
                 {(dataAllNotif.length > 0 && dataAllNotif.find(({status}) => status === null) !== undefined) &&(
                    <View style={style.badge}>
                        <Text style={style.badgeText}>{dataAllNotif.filter(e => e.status === null).length}</Text>
                    </View>
                 )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile') }>
                <Icon name="account-circle" size={22} color={route.name === 'Home' ? "black" : "#c0392b"}/>
            </TouchableOpacity>
            <Modal
                isVisible={notifVisible}
                onBackdropPress={toggleNotif} // klik di luar close
                backdropOpacity={0.1}         // transparan tipis
                animationIn="fadeIn"
                animationOut="fadeOut"
                style={style.modalStyle}
            >
                <View style={style.notifDropdownModal}>
                    {(dataAllNotif.length > 0 && dataAllNotif.find(({status}) => status === null) !== undefined) ? (
                        <FlatList
                            data={dataAllNotif.filter(e => e.status === null)}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={style.notifItemBell} onPress={() => goRoute(item)}>
                                    <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon name="file-document-outline" size={40} color="#c0392b" />
                                    </View>
                                    <View style={{ flex: 9, justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{item.proses} ({item.tipe})</Text>
                                        <Text>No transaksi: {item.no_transaksi}</Text>
                                        <Text style={{ color: '#888', fontSize: 12 }}>{moment(item.createdAt).format('LLL')}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            style={{ maxHeight: 300 }}
                        />
                    ) : (
                        <Text style={{ textAlign: 'center', color: '#555' }}>You don't have any notifications </Text>
                    )}
                    <TouchableOpacity style={style.bellLabelBell} onPress={() => {navigation.navigate('Notif'); setNotifVisible(false)}}>
                        <Text style={{ textAlign: 'center', color: '#555' }}>See all notifications</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}

const LogoButton = ({ onNavReady }) => {
  const { toggleSidebar } = useContext(SidebarContext);
  const navigation = useNavigation();

  React.useEffect(() => {
    if (onNavReady) onNavReady(navigation);
  }, [navigation, onNavReady]);

  return (
    <TouchableOpacity onPress={toggleSidebar}>
      <View style={style.search}>
        <Image source={logo} style={style.logo} />
      </View>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
    notif: {
        position: 'relative',
        padding: 5,
    },
    badge: {
        position: 'absolute',
        right: 0,
        top: -2,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        maxWidth: 25,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        // paddingHorizontal: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    textHeader1: {
        fontWeight: "700",
        color: "#c0392b",
        fontSize: 15,
        fontFamily: 'times new roman'
    },
    headerHome: {
    },
    header: {
        backgroundColor: "rgb(255,255,255)",
    },
    arrow: {
        color: "rgb(255,255,255)"
    },
    search: {
        flexDirection: "row",
        width: 80,
        justifyContent: 'flex-end',
        marginRight: 20,
        alignItems: 'center'
    },
    logo: {
        flexDirection: "row",
        width: 20,
        height: 30,
        justifyContent: 'flex-start',
        marginRight: 40
    },
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBarContainer: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    qrisButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#c0392b',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 6,
    },
    qrisText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 8,
    },

    // Modal Notif
    modalStyle: { 
        justifyContent: 'flex-start', 
        alignItems: 'flex-end', 
        margin: 0 
    },
    notifDropdownModal: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 5,
        marginTop: 60,
        marginRight: 10,
        paddingVertical: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    notifItemBell: { 
        flexDirection: 'row', 
        paddingVertical: 8, 
        paddingHorizontal: 10, 
        borderBottomWidth: 0.5, 
        borderColor: '#ccc' 
    },
    bellLabelBell: { 
        paddingVertical: 5, 
        borderTopWidth: 0.5, 
        borderColor: '#ccc' 
    }
})


const MutasiStack = ({ setSidebarNav }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
            options={{
                title: "ASSET ~ PMA",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerRight: AccountButton,
                headerLeft: () => <LogoButton onNavReady={setSidebarNav} />
            }}
            name="Mutasi"
            component={Mutasi}
            />
            <Stack.Screen 
            options={{
                title: "ASSET ~ PMA",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerRight: AccountButton,
                headerLeft: () => <LogoButton onNavReady={setSidebarNav} />
            }}
            name="BudgetMutasi"
            component={BudgetMutasi}
            />
            <Stack.Screen 
            options={{
                title: "ASSET ~ PMA",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerRight: AccountButton,
                headerLeft: () => <LogoButton onNavReady={setSidebarNav} />
            }}
            name="EksekusiMutasi"
            component={EksekusiMutasi}
            />
            <Stack.Screen 
            options={{
                title: "ASSET ~ PMA",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerRight: AccountButton,
                headerLeft: () => <LogoButton onNavReady={setSidebarNav} />
            }}
            name="RevisiMutasi"
            component={RevisiMutasi}
            />
        </Stack.Navigator>
    );
}

const DisposalStack = ({ setSidebarNav }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
            options={{
                title: "ASSET ~ PMA",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerRight: AccountButton,
                headerLeft: () => <LogoButton onNavReady={setSidebarNav} />
            }}
            name="Disposal"
            component={Disposal}
            />
            <Stack.Screen 
            options={{
                title: "ASSET ~ PMA",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerRight: AccountButton,
                headerLeft: () => <LogoButton onNavReady={setSidebarNav} />
            }}
            name="PurchDisposal"
            component={PurchDisposal}
            />
            <Stack.Screen 
            options={{
                title: "ASSET ~ PMA",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerRight: AccountButton,
                headerLeft: () => <LogoButton onNavReady={setSidebarNav} />
            }}
            name="PersetujuanDisposal"
            component={PersetujuanDisposal}
            />
            <Stack.Screen 
            options={{
                title: "ASSET ~ PMA",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerRight: AccountButton,
                headerLeft: () => <LogoButton onNavReady={setSidebarNav} />
            }}
            name="EksekusiDisposal"
            component={EksekusiDisposal}
            />
            <Stack.Screen 
            options={{
                title: "ASSET ~ PMA",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerRight: AccountButton,
                headerLeft: () => <LogoButton onNavReady={setSidebarNav} />
            }}
            name="TaxFinDisposal"
            component={TaxFinDisposal}
            />
            <Stack.Screen 
            options={{
                title: "ASSET ~ PMA",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerRight: AccountButton,
                headerLeft: () => <LogoButton onNavReady={setSidebarNav} />
            }}
            name="RevisiDisposal"
            component={RevisiDisposal}
            />
        </Stack.Navigator>
    );
}

const StockStack = ({ setSidebarNav }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
            options={{
                title: "ASSET ~ PMA",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerRight: AccountButton,
                headerLeft: () => <LogoButton onNavReady={setSidebarNav} />
            }}
            name="Stock"
            component={Stock}
            />
            <Stack.Screen 
            options={{
                title: "ASSET ~ PMA",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerRight: AccountButton,
                headerLeft: () => <LogoButton onNavReady={setSidebarNav} />
            }}
            name="CartStock"
            component={CartStock}
            />
            <Stack.Screen 
            options={{
                title: "ASSET ~ PMA",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerRight: AccountButton,
                headerLeft: () => <LogoButton onNavReady={setSidebarNav} />
            }}
            name="RevisiStock"
            component={RevisiStock}
            />
        </Stack.Navigator>
    );
}

const PengadaanStack = ({ setSidebarNav }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
            options={{
                title: "ASSET ~ PMA",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerRight: AccountButton,
                headerLeft: () => <LogoButton onNavReady={setSidebarNav} />
            }}
            name="Pengadaan"
            component={Pengadaan}
            />
            <Stack.Screen 
            options={{
                title: "ASSET ~ PMA",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerRight: AccountButton,
                headerLeft: () => <LogoButton onNavReady={setSidebarNav} />
            }}
            name="EksekusiPengadaan"
            component={EksekusiPengadaan}
            />
            <Stack.Screen 
            options={{
                title: "ASSET ~ PMA",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerRight: AccountButton,
                headerLeft: () => <LogoButton onNavReady={setSidebarNav} />
            }}
            name="RevisiPengadaan"
            component={RevisiPengadaan}
            />
        </Stack.Navigator>
    );
}


const HomeStack = ({ setSidebarNav }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
            options={{
                title: "",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.headerHome,
                headerTransparent: true,
                headerRight: AccountButton,
                headerLeft: () => <LogoButton onNavReady={setSidebarNav} />
            }}
            name="Home"
            component={Home}
            />
        </Stack.Navigator>
    );
};

CustomTabBar = ({ navigation }) => {
    const authDucer = useSelector((state) => state.auth)
    const { dataUser } = authDucer
    const level = dataUser.user_level;
    return (
        (level === 5 || level === 9) ? (
            <View style={style.tabBarContainer}>
                <TouchableOpacity
                    style={style.qrisButton}
                    onPress={() => navigation.navigate('Scanner')}
                >
                    <Icon name="qrcode-scan" size={28} color="#fff" />
                    <Text style={style.qrisText}>SCAN</Text>
                </TouchableOpacity>
            </View>
        ) : (
            <View></View>
        )
    );
}

const TabbedScreen = ({ setSidebarNav }) => {
    const auth = useSelector(state => state.auth)
    return (
        <BottomTab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
        >
            <BottomTab.Screen
                name="Home"
                children={() => <HomeStack setSidebarNav={setSidebarNav} />}
            />
            <BottomTab.Screen
                name="PengadaanTab"
                children={() => <PengadaanStack setSidebarNav={setSidebarNav} />}
            />
            <BottomTab.Screen
                name="StockTab"
                children={() => <StockStack setSidebarNav={setSidebarNav} />}
            />
            <BottomTab.Screen
                name="MutasiTab"
                children={() => <MutasiStack setSidebarNav={setSidebarNav} />}
            />
            <BottomTab.Screen
                name="DisposalTab"
                children={() => <DisposalStack setSidebarNav={setSidebarNav} />}
            />
        </BottomTab.Navigator>
    );
};

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showSidebar: false,
            sidebarNav: null
        };
    }

    toggleSidebar = () => {
        this.setState(prev => ({ showSidebar: !prev.showSidebar }));
    };

    onClose = () => {
        this.setState({showSidebar: false})
    }

    goRoute = (val) => {
        this.props.navigation.navigate(val)
    }

    setSidebarNav = (nav) => {
        this.setState({ sidebarNav: nav });
    }

    goToChildScreen = (tabName, screenName) => {
        if (!this.state.sidebarNav) return;
        this.state.sidebarNav.navigate(tabName, { screen: screenName });
    }


    render() {
        const auth = this.props.auth
        return (
            <SidebarContext.Provider value={{ toggleSidebar: this.toggleSidebar }}>
                <View style={{ flex: 1 }}>
                    <Stack.Navigator>
                        {auth.isLogin === false && auth.token === '' ? (
                            <Stack.Screen color={'red'} name="Login" component={Login} 
                                options={{
                                    headerShown: false
                                }}
                            />
                        ) : (
                            <>
                                <Stack.Screen
                                    color={'red'} 
                                    name="Tabbed" 
                                    // component={TabbedScreen} 
                                    options={{
                                        headerShown: false
                                    }}
                                    children={() => <TabbedScreen setSidebarNav={this.setSidebarNav} />}
                                />
                                <Stack.Screen name="Scanner" component={Scanner} 
                                    options={{
                                        headerShown: false
                                    }}
                                />
                                <Stack.Screen name="Profile" component={Profile} 
                                    options={{
                                        headerShown: false
                                    }}
                                />
                                <Stack.Screen 
                                    options={{
                                        title: "ASSET ~ PMA",
                                        headerTitleAlign: "center", 
                                        headerTitleStyle: style.textHeader1,
                                        headerStyle: style.header,
                                        headerRight: AccountButton,
                                        headerLeft: () => (
                                            <LogoButton onNavReady={this.setSidebarNav} />
                                        )
                                    }}
                                    name="Notif"
                                    component={Notif}
                                />
                                <Stack.Screen 
                                    options={{
                                        title: "ASSET ~ PMA",
                                        headerTitleAlign: "center", 
                                        headerTitleStyle: style.textHeader1,
                                        headerStyle: style.header,
                                        headerRight: AccountButton,
                                        headerLeft: () => (
                                            <LogoButton onNavReady={this.setSidebarNav} />
                                        )
                                    }}
                                    name="CartMutasi"
                                    component={CartMutasi}
                                />
                                <Stack.Screen 
                                    options={{
                                        title: "ASSET ~ PMA",
                                        headerTitleAlign: "center", 
                                        headerTitleStyle: style.textHeader1,
                                        headerStyle: style.header,
                                        headerRight: AccountButton,
                                        headerLeft: () => (
                                            <LogoButton onNavReady={this.setSidebarNav} />
                                        )
                                    }}
                                    name="CartPengadaan"
                                    component={CartPengadaan}
                                />
                                <Stack.Screen 
                                    options={{
                                        title: "ASSET ~ PMA",
                                        headerTitleAlign: "center", 
                                        headerTitleStyle: style.textHeader1,
                                        headerStyle: style.header,
                                        headerRight: AccountButton,
                                        headerLeft: () => (
                                            <LogoButton onNavReady={this.setSidebarNav} />
                                        )
                                    }}
                                    name="CartDisposal"
                                    component={CartDisposal}
                                />
                                <Stack.Screen 
                                    options={{
                                        title: "ASSET ~ PMA",
                                        headerTitleAlign: "center", 
                                        headerTitleStyle: style.textHeader1,
                                        headerStyle: style.header,
                                        headerRight: AccountButton,
                                        headerLeft: () => (
                                            <LogoButton onNavReady={this.setSidebarNav} />
                                        )
                                    }}
                                    name="ReleaseApk"
                                    component={ReleaseApk}
                                />
                            </>
                        )}
                        
                    </Stack.Navigator>
                    {this.state.sidebarNav && 
                        <Sidebar
                            visible={this.state.showSidebar}
                            onClose={this.onClose}
                            navigation={this.goToChildScreen}
                        />
                    }
                </View>
            </SidebarContext.Provider>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(Main);
