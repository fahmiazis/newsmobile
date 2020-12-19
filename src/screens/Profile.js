import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, ToastAndroid, ScrollView} from 'react-native'
import { Formik } from 'formik'
import { Button, Input, Item, Form } from 'native-base'
import * as Yup from 'yup'
import {Radio, Label} from 'native-base'
import akun from '../assets/akun.png'
import profile from '../redux/actions/profile'
import {connect} from 'react-redux'
import ImagePicker from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const profileSchema = Yup.object().shape({
    email: Yup.string().required('must be filled'),
    name: Yup.string().min(5).required('must be filled'),
    phone: Yup.number().required('must be filled'),
  });

class Profile extends Component {
    constructor(props) {
        super(props);
        this.setDate = this.setDate.bind(this);
      }
      setDate(newDate) {
        this.setState({ chosenDate: newDate });
      }

    state = {
        gender: '',
        laki: false,
        perempuan: false
    }

    componentDidMount(){
        const {data} = this.props.profile
        if (data.gender === 'Laki-laki') {
            this.setState({laki: true, gender: 'Laki-laki', perempuan: false})
        } else if (data.gender === 'Perempuan') {
            this.setState({laki: false, gender: 'Perempuan', perempuan: true})
        }
    }

    saveProfile = async (values) => {
        const {gender} = this.state
        const data = {
            phone: values.phone,
            name: values.name,
            gender: gender
        }
        await this.props.updateProfile(this.props.auth.token, data)
        this.props.getProfile(this.props.auth.token)
        ToastAndroid.show('Edit profile succesfully', ToastAndroid.LONG);
    }

    chooseImage = async () => {
        const options = {
            noData: true,
        }
        ImagePicker.showImagePicker(options, async (response) => {
          if (response.didCancel) {
            ToastAndroid.show('No image choseen', ToastAndroid.LONG);
          } else if (response.error) {
            ToastAndroid.show('Please try again later', ToastAndroid.LONG);
          } else {
            const form = new FormData();
    
            form.append('picture', {
              uri: response.uri,
              name: response.fileName,
              type: response.type,
            });
            await this.props.uploadImage(this.props.auth.token, form)
            const {alertMsg} = this.props.profile
            if(alertMsg === 'update image succesfully'){
                await this.props.getProfile(this.props.auth.token)
            } 
          }
        });
      };

    render() {
        const {data} = this.props.profile
        const {laki, perempuan} = this.state
        return (
            <ScrollView>
            <Formik
            initialValues={{ email: data.email, name: data.name, phone: data.phone}}
            validationSchema={profileSchema}
            onSubmit={values => this.saveProfile(values)}
            >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={style.parent}>
                <Text style={style.title}>My Profile</Text>
                <View style={style.header}>
                    <Image style={style.img} source={data.picture === null ? akun : {uri: `http://54.147.40.208:6060${data.picture}`}} />
                    <TouchableOpacity style={style.icon} onPress={this.chooseImage}>
                        <Icon name="camera" color="white" size={30} />
                    </TouchableOpacity>
                </View>
                <Form>
                <Item style={style.input}>
                        <Input
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                        placeholder='Email'
                        disabled={true}
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
                <TouchableOpacity onPress={handleSubmit} style={style.btn}>
                    <Text style={style.textbtn}>SAVE</Text>
                </TouchableOpacity>
                </Form>
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
        fontSize: 30,
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
        backgroundColor: 'black',
        marginLeft: "3%",
        borderRadius: 10,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    textbtn: {
        color: "rgb(255,255,255)",
        fontSize: 20
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
    img: {
        width: 150,
        height: 150,
        borderRadius: 100,
        position: "relative"
    },
    header: {
        alignSelf: "center",
        marginTop: 10,
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        marginBottom: 20
    },
    icon: {
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        height: 50,
        padding: 10,
        backgroundColor: "black",
        borderRadius: 50,
        position: "absolute",
    },
    radioWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 10
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
    profile: state.profile,
    auth: state.auth
})

const mapDispatchToProps = {
    getProfile: profile.getProfile,
    updateProfile: profile.updateProfile,
    uploadImage: profile.uploadImage
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
