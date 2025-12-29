/* eslint-disable prettier/prettier */
/* eslint-disable semi */
import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ToastAndroid,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Image,
} from 'react-native';
import { Button, Input, Item, Form, Left } from 'native-base';

import IconAwe from 'react-native-vector-icons/FontAwesome5';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import bookmark from '../redux/actions/bookmark';
import article from '../redux/actions/article';
import auth from '../redux/actions/auth';
import profile from '../redux/actions/profile';
import logo from '../assets/logo.png'
import imgBackground from '../assets/loginOffice.webp'
import messaging from '@react-native-firebase/messaging';
import FCMHelper from '../helpers/fcmHelper';
import {API_URL} from '@env';


const loginSchema = Yup.object().shape({
    username: Yup.string().required('must be filled'),
    password: Yup.string().required('must be filled'),
});

class Login extends Component {
    state = {
        username: '',
        password: '',
        fcmToken: '',
    };

    componentDidMount() {
        this.initializeFCM();

        // Setup listeners
        FCMHelper.setupListeners(
            this.handleNotificationReceived,
            this.handleNotificationOpened
        );

        // Listen token refresh
        this.unsubscribeTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
            console.log('FCM Token refreshed:', newToken);
            this.setState({ fcmToken: newToken });
        });
    }

    componentWillUnmount() {
        FCMHelper.cleanup();
        if (this.unsubscribeTokenRefresh) {
            this.unsubscribeTokenRefresh();
        }
    }

    initializeFCM = async () => {
        try {
            const hasPermission = await FCMHelper.requestPermission();

            if (hasPermission) {
                const token = await FCMHelper.getFCMToken();
                this.setState({ fcmToken: token });
            }
        } catch (error) {
            console.error('Error initializing FCM:', error);
        }
    }

    handleNotificationReceived = (remoteMessage) => {
        console.log('Handle notification received:', remoteMessage);
        // Bisa refresh notif badge, dll
    }

    handleNotificationOpened = (remoteMessage) => {
        console.log('Handle notification opened:', remoteMessage);

        // Navigate berdasarkan data notification
        if (remoteMessage.data && this.props.navigation) {
            const { route, transaksi, no_transaksi } = remoteMessage.data;

            if (route) {
                // Bisa navigate ke screen tertentu
                console.log('Navigate to:', route);
            }
        }
    }

    login = async (values) => {
        ToastAndroid.show('waiting...', ToastAndroid.LONG);
        await this.props.login(values);
    };

    componentDidUpdate() {
        const { isError, isLogin } = this.props.auth;
        if (isLogin) {
            ToastAndroid.show('Login succesfully', ToastAndroid.LONG);

            this.updateFCMTokenAfterLogin();

            this.props.navigation.navigate('Tabbed');
        } else if (isError) {
            ToastAndroid.show('wrong username or password', ToastAndroid.LONG);
        }
    }

    updateFCMTokenAfterLogin = async () => {
        try {
            const { fcmToken } = this.state;
            const { token } = this.props.auth;

            if (fcmToken && token) {
                // Ganti dengan API URL kamu
                await FCMHelper.updateFCMTokenToBackend(fcmToken, API_URL, token);
            }
        } catch (error) {
            console.error('Error updating FCM token after login:', error);
        }
    }

    render() {
        return (
            <ImageBackground
                source={imgBackground}
                style={style.bg}
                resizeMode="cover"
            >
                <ScrollView
                    // eslint-disable-next-line react-native/no-inline-styles
                    contentContainerStyle={style.scroll}
                    keyboardShouldPersistTaps="handled"

                >
                    <View style={style.parent}>
                        <View style={style.form}>
                            {/* <Text style={style.sign}> Sign In </Text> */}
                            <Image source={logo} style={style.logo} />
                            <Text style={style.textHead}>
                                Please login with your account
                            </Text>
                            <Formik
                                initialValues={{
                                    username: '',
                                    password: '',
                                }}
                                validationSchema={loginSchema}
                                onSubmit={(values) => {
                                    this.login(values);
                                }}>
                                {({
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    values,
                                    errors,
                                    touched,
                                }) => (
                                    <Form>
                                        <Item style={[style.input, errors.username ? style.mrError : style.mrNormal]}>
                                            <Input
                                                onChangeText={handleChange('username')}
                                                placeholder="Username"
                                                onBlur={handleBlur('username')}
                                                value={values.username}
                                            />
                                        </Item>
                                        {errors.username ? (
                                            <Text style={style.txtError}>{errors.username}</Text>
                                        ) : null}
                                        <Item style={[style.input, errors.password ? style.mrError : style.mrNormal]}>
                                            <Input
                                                onChangeText={handleChange('password')}
                                                secureTextEntry
                                                value={values.password}
                                                placeholder="Password"
                                                onBlur={handleBlur('password')}
                                            />
                                        </Item>
                                        {errors.password ? (
                                            <Text style={style.txtError}>{errors.password}</Text>
                                        ) : null}
                                        <TouchableOpacity
                                            style={[style.btn]}
                                            onPress={handleSubmit}>
                                            <Text style={style.textLogin}>LOGIN</Text>
                                        </TouchableOpacity>
                                    </Form>
                                )}
                            </Formik>
                            <View style={style.footer}>
                                <IconAwe name="copyright" size={10} color="#c0392b"/>
                                <Text style={style.txtfoot}>
                                    ASET-PMA 2025
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
});

const mapDispatchToProps = {
    login: auth.login,
    getProfile: profile.getProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const style = StyleSheet.create({
    bg: {
        flex: 1,
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    parent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    form: {
        width: '90%',
        backgroundColor: 'rgba(255,255,255,0.85)',
        padding: 20,
        borderRadius: 15,
        elevation: 5,
    },
    sign: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 30,
        color: 'rgb(108,108,108)',
        textAlign: 'center',
    },
    textHead: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#c0392b',
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        borderColor: 'rgb(164,164,164)',
        borderRadius: 10,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        backgroundColor: 'rgb(255,255,255)',
        paddingHorizontal: 5,
    },
    color: {
        backgroundColor: '#c0392b',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    btn: {
        borderRadius: 10,
        marginLeft: 18,
        backgroundColor: '#c0392b',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        marginTop: 10,
        width: '92%',
    },
    or: {
        textAlign: 'center',
        color: 'rgb(108,108,108)',
        marginBottom: 10,
    },
    textLogin: {
        color: 'rgb(255,255,255)',
        fontSize: 15,
        fontWeight: '400',
    },
    textfb: {
        color: 'rgb(255,255,255)',
        textAlign: 'center',
        position: 'absolute',
    },
    textgo: {
        textAlign: 'center',
        position: 'absolute',
    },
    iconfb: {
        marginRight: '90%',
    },
    regis: {
        marginTop: 10,
    },
    mrError: {
        marginBottom: 5,
    },
    mrNormal: {
        marginBottom: 20,
    },
    txtError: {
        marginLeft: 20,
        fontSize: 13,
        color: 'red',
        marginBottom: 15,
    },
    logo: {
        width: 60,
        height: 80,
        alignSelf: 'center',
        marginBottom: 30,
    },
    footer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 18,
        marginVertical: 10,
    },
    txtfoot: {
        textAlign: 'right',
        marginLeft: 5,
        color: '#c0392b',
    },
});
