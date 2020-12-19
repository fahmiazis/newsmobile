import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Switch } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'

import akun from '../assets/akun.png'

import {connect} from 'react-redux'
import bookmark from '../redux/actions/bookmark'
import article from '../redux/actions/article'
import auth from '../redux/actions/auth'
import profile from '../redux/actions/profile'

class Settings extends Component {

    componentDidMount(){
        this.props.getProfile(this.props.auth.token)
    }

    logout = () => {
        this.props.logout()
    }
        render() {
            const {data} = this.props.profile
            return (
            <View style={style.parent}>
                <View style={style.ident}>
                    <Image source={data.picture === null ? akun : {uri: `http://54.147.40.208:6060${data.picture}`}} style={style.img} />
                    <View style={style.textIdent}>
                        <Text style={style.textName}>{data.name}</Text>
                        <Text style={style.textEmail}>{data.email}</Text>
                    </View>
                </View>
                <Text style={style.textSetting}>Settings</Text>
                <View style={style.card}>
                    <Text style={style.textCard}>Notifications</Text>
                    <Switch />
                </View>
                <View style={style.card}>
                    <Text style={style.textCard}>Dark Mode</Text>
                    <Switch />
                </View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
                    <View style={style.card1}>
                        <Text style={style.textCard}>Edit profile</Text>
                        <Icon style={style.icon} name="keyboard-arrow-right"  size={30} />
                    </View>
                </TouchableOpacity>
                <Text style={style.textSetting}>Help and Other</Text>
                <TouchableOpacity>
                    <View style={style.card}>
                        <Text style={style.textCardReport}>Report App Issue</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={style.card1}>
                        <Text style={style.textCard}>About Our App</Text>
                        <Icon style={style.icon} name="keyboard-arrow-right"  size={30} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.logout}>
                    <View style={style.card1}>
                        <Text style={style.textCard}>Logout</Text>
                        <Icon style={style.icon} name="keyboard-arrow-right"  size={30} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

const mapDispatchToProps = {
    logout: auth.logout,
    getProfile: profile.getProfile,
    getMyArticle: article.getMyArticle,
    getBookmark: bookmark.getBookmark,
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

const style = StyleSheet.create({
    parent: {
        flex: 1,
    },
    img: {
        width: 64,
        height: 64,
        borderRadius: 50,
    },
    ident: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        paddingHorizontal: "5%"
    },
    textSetting: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: "5%",
        marginTop: 30,
        marginBottom: 30
    },
    textIdent: {
        marginLeft: 20,
        flexDirection: "column",
        justifyContent: "space-between"
    },
    textName: {
        fontSize: 20,
        fontWeight: "bold"
    },
    textEmail: {
        fontSize: 15,
        color: "rgb(108,108,108)"
    },
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: "rgb(255,255,255)",
        paddingHorizontal: "5%",
        paddingVertical: "4%",
        borderBottomWidth: 2,
        borderColor: "rgb(249,249,249)"
    },
    card1: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: "rgb(255,255,255)",
        paddingHorizontal: "5%",
        paddingVertical: "4%",
    },
    textCard: {
        fontSize: 15
    },
    textCardReport: {
        fontSize: 15,
        color: "rgb(25,119,243)"
    },
})
