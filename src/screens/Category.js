import React, { Component } from 'react'
import {View, Text, FlatList, StyleSheet, ToastAndroid, ScrollView} from 'react-native'

import {connect} from 'react-redux'
import bookmark from '../redux/actions/bookmark'
import news from '../redux/actions/news'
import RenderCat from './RenderCat'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

class Category extends Component {

    goDetail = async (idNews) => {
        const {id} = idNews 
        await this.props.getDetailNews(id)
        this.props.navigation.navigate('DetailCategory', {id: id})
    }

    addBookmark = async (idNews) => {
        const {id} = idNews
        const {isLogin, token} = this.props.auth
        if (isLogin === false && token === '') {
            ToastAndroid.show('login first', ToastAndroid.LONG)
        } else {
            const data = {newsId: id}
            await this.props.addBookmark(this.props.auth.token, data)
            await this.props.getBookmark(this.props.auth.token)
            ToastAndroid.show('successfully added to bookmarks', ToastAndroid.LONG)
        }
    }


    render() {
        const {sort} = this.props.search
        const {name} = this.props.route.params
        return (
            <View style={style.parent}>
                <ScrollView>
                    <Text style={style.title3}>{name}</Text>
                    <View style={style.margin}>
                        <FlatList
                            data = {Object.keys(sort).length > 0 && sort.data.rows}
                            // refreshing={loading}
                            // onRefresh={this.getTerkini}
                            renderItem = {({item}) => (
                            <RenderCat
                            onPress={() => this.goDetail({id: item.id})}
                            list={item}
                            onBookmark={() => this.addBookmark({id: item.id})}
                            />
                            )}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    article: state.article,
    news: state.news,
    search: state.search
})

const mapDispatchToProps = {
    getBookmark: bookmark.getBookmark,
    addBookmark: bookmark.addBookmark,
    getDetailNews: news.getDetailNews
}

export default connect(mapStateToProps, mapDispatchToProps)(Category)


const style = StyleSheet.create({
    parent: {
        flex: 1
    },
    par: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(255,255,255)",
        paddingHorizontal: "8%"
    },
    scrollHead: {
        borderBottomWidth: 5,
        borderColor: "rgb(164,164,164)",
        height: 250,
    },
    head: {
        position: "relative",
        display: "flex",
        width: 300,
        height: 200,
        paddingBottom: 10,
    },
    img: {
        width: 300,
        height: 200,
    },
    textHead:{
        position: "absolute",
        marginTop: "35%",
        backgroundColor: "rgba(0,0,0,0.4)",
        height: 95,
        width: "100%"
        // opacity: 0.8
        // flexDirection: "column-reverse",
        // justifyContent: "flex-start",
        // alignItems: "flex-end"
    },
    textImg:{
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
        marginLeft: 10,
        // marginBottom: 10,
        textShadowColor: "rgb(0,0,0)",
        textShadowOffset: {
            width: 1,
            height: 1
        },
        textShadowRadius: 1
    },
    card: {
        flexDirection: "row",
        width: "100%",
        height: 170,
        borderBottomWidth: 1,
        borderColor: "rgb(164,164,164)",
        marginTop: 30
    },
    cardTerkini: {
        flexDirection: "row-reverse",
        width: "100%",
        height: 170,
        borderBottomWidth: 1,
        borderColor: "rgb(164,164,164)",
        marginTop: 30
    },
    imgCard: {
        width: 150,
        height: 150
    },
    sorotan: {
        width: "100%",
        height: 40,
        borderBottomWidth: 1,
        borderColor: "rgb(164,164,164)"
    },
    textSorotan: {
        fontWeight: "bold",
        fontSize: 15,
        width: 70,
        height: 40,
        borderBottomWidth: 6,
        borderColor: "rgb(86,173,201)",
    },
    content: {
        flexDirection: "column",
        width: 280,
        height: 150,
        marginLeft: 10,
        flex: 1
    },
    secSorotan: {
        paddingHorizontal: "5%",
        marginTop: 20
    },
    category: {
        color: "rgb(164,164,164)",
        marginBottom: 5,
    },
    title: {
        fontSize: 15,
        fontWeight: "bold"
    },
    title2: {
        fontSize: 30,
        fontWeight: "bold",
        color: "rgb(164,164,164)",
        marginBottom: 50
    },
    footerTerkini: {
        flexDirection: "row",
        marginBottom: 15,
        marginLeft: 10
    },
    footer: {
        flexDirection: "row-reverse",
        marginBottom: 15,
        marginLeft: 10
    },
    bookmark: {
        width: 100,
        height: 80,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "rgb(164,164,164)",
        marginBottom: 50
    },
    title3: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    btnArticle: {
        borderRadius: 20,
        marginTop: 30,
        width: 400,
        alignSelf: 'center'
    },
    margin: {
        marginHorizontal: 20
    }
})
