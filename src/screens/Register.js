import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Button, ToastAndroid} from 'react-native'
import { Formik } from 'formik'
import {Radio, Label} from 'native-base'
import { Input, Item, Form } from 'native-base'
import * as Yup from 'yup'
import {connect} from 'react-redux'

import auth from '../redux/actions/auth'

const registerSchema = Yup.object().shape({
    email: Yup.string().required('must be filled'),
    name: Yup.string().min(5).required('must be filled'),
    phone: Yup.number().required('must be filled'),
    password: Yup.string().min(8).required('must be filled')
  });

class Register extends Component {

    state = {
        gender: 'Laki-laki',
        laki: true,
        perempuan: false
    }

    register = async (values) => {
        const {gender} = this.state
        const data = {
            email: values.email,
            phone: values.phone,
            password: values.password,
            name: values.name,
            gender: gender
        }
        ToastAndroid.show('waiting...', ToastAndroid.LONG);
        await this.props.register(data)
        this.props.navigation.navigate('Login')
        ToastAndroid.show('Register succesfully', ToastAndroid.LONG);
    }

    render() {
        const {laki, perempuan} = this.state
        return (
            <ScrollView>
            <Formik
            initialValues={{ email: '', name: '', phone: '', password: '' }}
            validationSchema={registerSchema}
            onSubmit={values => this.register(values)}
            >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={style.parent}>
                <Text style={style.title}>REGISTRASI NEWSID</Text>
                <Form>
                    <Item style={style.input}>
                        <Input
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                        placeholder='Email'
                        />
                    </Item>
                    {errors.email ? (
                        <Text style={style.txtError}>{errors.email}</Text>
                    ) : null}
                    <Item style={style.input}>
                        <Input
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        value={values.name}
                        placeholder='Nama Lengkap'
                        />
                    </Item>
                    {errors.name ? (
                        <Text style={style.txtError}>{errors.name}</Text>
                    ) : null}
                    <Item style={style.input}>
                        <Input
                        onChangeText={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        value={values.phone}
                        placeholder="Nomor HP"
                        />
                    </Item>
                    {errors.phone ? (
                        <Text style={style.txtError}>{errors.phone}</Text>
                    ) : null}
                    <View style={style.radioWrapper}>
                        <View style={style.radioView2}>
                            <Radio
                            color={'#5E50A1'}
                            selectedColor={'#5E50A1'}
                            onPress={() => this.setState({
                                laki: true,
                                perempuan: false,
                                gender: 'Laki-laki'
                            })}
                            selected={laki}
                            />
                            <Label style={style.labelRadio}>Laki-laki</Label>
                        </View>
                        <View style={style.radioView2}>
                            <Radio
                            color={'#5E50A1'}
                            selectedColor={'#5E50A1'}
                            onPress={() => this.setState({
                                laki: false,
                                perempuan: true,
                                gender: 'Perempuan'
                            })}
                            selected={perempuan}
                            />
                            <Label style={style.labelRadio}>Perempuan</Label>
                        </View>
                    </View>
                    <Item style={style.input}>
                        <Input
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        placeholder="Password"
                        secureTextEntry
                        />
                    </Item>
                    {errors.password ? (
                        <Text style={style.txtError}>{errors.password}</Text>
                    ) : null}
                    <Text style={style.textSetuju}>Dengan Menekan tombol "Daftar", saya menyetujui *Kebijakan Privasi dan Syarat dan Persetujuan</Text>
                    <TouchableOpacity style={style.btn} onPress={handleSubmit}>
                        <Text style={style.textbtn}>Daftar</Text>
                    </TouchableOpacity>
                </Form>
                <View style={style.foot}>
                <Text style={style.textAkun}>
                    Sudah Punya Akun ? 
                </Text>
                <TouchableOpacity style={style.textKlik} onPress={() => this.props.navigation.navigate('Login')}>
                        <Text style={style.textLogin}>Kembali ke halaman login</Text>
                    </TouchableOpacity>
                </View>
            </View>
            )}
        </Formik>
        </ScrollView>
        )
    }
}

const style = StyleSheet.create({
    parent: {
        flex: 1,
        paddingRight: "3%",
        paddingLeft: "1%"
    },
    title: {
        textAlign: "center",
        fontSize: 20,
        marginTop: 20,
        fontWeight: "bold",
        marginBottom: 20
    },
    input: {
        borderColor: "rgb(164,164,164)",
        borderRadius: 5,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        backgroundColor: "rgb(249,249,249)",
        marginBottom: 20,
        paddingHorizontal: 5
    },
    btn: {
        backgroundColor: 'rgb(25,119,243)',
        marginLeft: "3%",
        borderRadius: 10,
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    textbtn: {
        color: "rgb(255,255,255)",
        fontSize: 20,
    },
    textKar: {
        marginLeft: "3%",
        marginBottom: 10
    },
    textSetuju: {
        marginLeft: "3%",
        marginBottom: 20,
        fontSize: 15,
        color: "rgb(108,108,108)"
    },
    textAkun: {
        textAlign: "center",
        fontSize: 15,
        marginTop: 10,
    },
    textLogin: {
        color: 'rgb(25,119,243)',
        fontSize: 15,
        marginLeft: 5
    },
    foot: {
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "center"
    },
    txtError: {
        marginLeft: 20,
        fontSize: 13,
        color: 'red',
        marginBottom: 20
    },
    radioWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    radioView2: {
        flexDirection: 'row',
        padding: 12,
    },
    labelRadio: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 17,
        lineHeight: 19,
        color: '#46505C',
    },
})

const mapStateToProps = state => ({
    auth: state.auth
})

const mapDispatchToProps = {
    register: auth.register
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);