import React, { Component } from 'react'
import { Text, View, StyleSheet, ToastAndroid, ScrollView, TouchableOpacity } from 'react-native'
import { Button, Input, Item, Form, Left } from 'native-base'

import Icon from 'react-native-vector-icons/FontAwesome5'
import {Formik} from 'formik'
import * as Yup from 'yup'
import {connect} from 'react-redux'
import bookmark from '../redux/actions/bookmark'
import article from '../redux/actions/article'
import auth from '../redux/actions/auth'
import profile from '../redux/actions/profile'

const loginSchema = Yup.object().shape({
    email: Yup.string().required('must be filled'),
    password: Yup.string().required('must be filled'),
  });

class Login extends Component {
    state = {
        email: '',
        password: '',
    }
    login = async (values) => {
        ToastAndroid.show('waiting...', ToastAndroid.LONG);
        await this.props.login(values)
    }

    componentDidUpdate(){
        const {isError, isLogin} = this.props.auth
        if (isLogin) {
            ToastAndroid.show('Login succesfully', ToastAndroid.LONG);
            this.props.navigation.navigate('Tabbed')
        }
        else if (isError) {
            ToastAndroid.show('wrong email or password', ToastAndroid.LONG);
        }
    }

    render() {
        return (
            <ScrollView>
            <View style={style.parent}>
                <View style={style.form}>
                    <Text style={style.sign}> Sign In </Text>
                    <Text style={style.textHead}>Gunakan account NewsId untuk sign in di News.com</Text>
                    <Formik
                        initialValues={{
                        email: '',
                        password: ''
                        }}
                        validationSchema={loginSchema}
                        onSubmit={(values) => {
                        this.login(values)
                        }}>
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,
                        }) => (
                        <Form>
                            <Item style={style.input}>
                                <Input
                                onChangeText={handleChange('email')}
                                placeholder="Email"
                                onBlur={handleBlur('email')}
                                value={values.email}
                                />
                            </Item>
                            {errors.email ? (
                                <Text style={style.txtError}>{errors.email}</Text>
                            ) : null}
                            <Item style={style.input}>
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
                            <TouchableOpacity style={[style.btn, style.color]} onPress={handleSubmit}>
                                <Text style={style.textLogin}>LOGIN</Text>
                            </TouchableOpacity>
                        </Form>
                        )}
                    </Formik>
                    <Text style={style.forgot}>Lupa Password</Text>
                    <Text style={style.or}>Atau gunakan</Text>
                    <Button block style={[style.btn, style.btnfb]}><Icon style={style.iconfb} name="facebook" color="rgb(255,255,255)" size={20}/><Text style={style.textfb}>Continue with Facebook</Text></Button>
                    <Button block style={[style.btn, style.btngo]}><Icon style={style.iconfb} name="google-plus-g" color="rgb(0,0,0)" size={20}/><Text style={style.textgo}>Sign in with Google</Text></Button>
                    <Text style={style.or}>Belum punya account</Text>
                    <TouchableOpacity style={[style.btn, style.regis, style.color]} onPress={() => this.props.navigation.navigate("Register")}><Text style={style.textLogin}>DAFTAR SEKARANG</Text></TouchableOpacity>
                </View>
            </View>
            </ScrollView>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
})

const mapDispatchToProps = {
    login: auth.login,
    getProfile: profile.getProfile,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const style = StyleSheet.create({
    parent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    form: {
        width: "90%",
    },
    sign: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 30,
        color: "rgb(108,108,108)",
        textAlign: "center"
    },
    textHead: {
        fontSize: 15,
        color: "rgb(108,108,108)",
        marginBottom: 10,
        textAlign: "center"
    },
    input: {
        borderColor: "rgb(164,164,164)",
        borderRadius: 10,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        backgroundColor: "rgb(255,255,255)",
        marginBottom: 20,
        paddingHorizontal: 5
    },
    color: {
        backgroundColor: 'rgb(25,119,243)',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    btn: {
        borderRadius: 10,
        marginLeft: "3%",
        height: 50
    },
    forgot: {
        textAlign: "right",
        marginVertical: 10,
        color: "rgb(108,108,108)"
    },
    or: {
        textAlign: "center",
        color: "rgb(108,108,108)",
        marginBottom: 10,
    },
    textLogin: {
        color: "rgb(255,255,255)",
        fontSize: 15,
        fontWeight: '400'
    },
    btnfb: {
        marginBottom: 20,
        backgroundColor: 'rgb(25,119,243)',   
        flexDirection: "row",
        paddingLeft: 10
    },
    textfb: {
        color: "rgb(255,255,255)",
        textAlign: "center",
        position: "absolute",
    },
    textgo: {
        textAlign: "center",
        position: "absolute",
    },
    iconfb: {
        marginRight: "90%"
    },
    btngo: {
        marginBottom: 20,
        backgroundColor: "rgb(255,255,255)",
        elevation: 2,
        flexDirection: "row",
        paddingLeft: 10
    },
    regis: {
        marginTop: 10,
    },
    txtError: {
        marginLeft: 20,
        fontSize: 13,
        color: 'red',
        marginBottom: 20
    },
})