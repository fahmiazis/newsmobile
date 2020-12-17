import React, {Component} from 'react'
import { Text, View, StyleSheet, ScrollView, FlatList, ToastAndroid} from 'react-native'

import RenderHomeHeader from './RenderHomeHeader'
import RenderSorotan from './RenderSorotan'
import RenderTerkini from './RenderTerkini'

import {connect} from 'react-redux'
import news from '../redux/actions/news'
import article from '../redux/actions/article'
import category from '../redux/actions/category'
import bookmark from '../redux/actions/bookmark'
import profile from '../redux/actions/profile'

class HomeV1 extends Component {
    state = {
        data: {},
        loading: false
    }

    componentDidMount(){
        const {isLogin, token} = this.props.auth
        if (isLogin === false && token === '') {
            this.props.getSameNews()
            this.props.sorotan()
            this.props.getNews()
            const {data} = this.props.news
            this.setState({data: data})
        } else {
            this.props.getSameNews()
            this.props.sorotan()
            this.props.getNews()
            this.props.getBookmark(this.props.auth.token)
            this.props.getMyArticle(this.props.auth.token)
            this.props.getProfile(this.props.auth.token)
            const {data} = this.props.news
            this.setState({data: data})
        }
    }

    isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
        return layoutMeasurement.height + contentOffset.y 
        >= contentSize.height - 50; }

    goDetail = async (idNews) => {
        const {id} = idNews 
        await this.props.getDetailNews(id)
        this.props.navigation.navigate('Detail')
    }

    nextPage = async () => {
        const {isProccess, data} = this.props.news
        const { nextLink } = data.pageInfo
        if (nextLink && !isProccess) {
            await this.props.nextGetNews(nextLink)
            this.setState({data: data})
        }
    }

    getTerkini = async () => {
        this.setState({loading: true})
        await this.props.getNews()
        await this.props.sorotan(),
        await this.props.getSameNews()
        this.setState({loading: false})
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


    render(){
        const {data, same, sorotan} = this.props.news
        const {loading} = this.state
        const {bookmark} = this.props.bookmark
        return(
            <View style={style.parent}>
                <View>
                <FlatList
                    horizontal = {true}
                    data = {Object.keys(same).length > 0 && same.data.rows}
                    refreshing={loading}
                    onRefresh={this.getTerkini}
                    renderItem = {({item}) => (
                    <RenderHomeHeader
                    onPress={() => this.goDetail({id: item.id})}
                    list={item} 
                    />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    />
                </View>
                <ScrollView
                onScroll={({ nativeEvent }) => {
                if (this.isCloseToBottom(nativeEvent)) {                
                    this.nextPage(); }}}
                >
                <View style={[style.secSorotan, style.parent]}>
                    <View style={style.sorotan}>
                        <Text style={style.textSorotan}>SOROTAN</Text>
                    </View>
                    <View>
                        <FlatList
                            data = {Object.keys(sorotan).length > 0 && sorotan.data.rows}
                            // refreshing={loading}
                            // onRefresh={this.getTerkini}
                            renderItem = {({item}) => (
                            <RenderSorotan
                            onPress={() => this.goDetail({id: item.id})}
                            onBookmark={() => this.addBookmark({id: item.id})}
                            list={item}
                            />
                            )}
                            keyExtractor={(item) => item.id.toString()}
                            />
                    </View>
                </View>
                <View style={[style.secSorotan, style.parent]}>
                    <View style={style.sorotan}>
                        <Text style={style.textSorotan}>TERKINI</Text>
                    </View>
                    <View>
                        <FlatList
                            data = {Object.keys(data).length > 0 && data.data.rows}
                            onEndReached={this.nextPage}
                            onEndReachedThreshold={0.5}
                            // refreshing={loading}
                            // onRefresh={this.getTerkini}
                            renderItem = {({item}) => (
                            <RenderTerkini
                            onPress={() => this.goDetail({id: item.id})}
                            list={item}
                            onBookmark={() => this.addBookmark({id: item.id})}
                            />
                            )}
                            keyExtractor={(item) => item.id.toString()}
                            />
                    </View>
                </View>
                </ScrollView>
            </View>
        );
    }
}

const style = StyleSheet.create({
    parent: {
        flex: 1
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
    },
    textImg:{
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
        marginLeft: 10,
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
    footerTerkini: {
        flexDirection: "row",
        marginBottom: 15,
        marginLeft: 10
    },
    footer: {
        flexDirection: "row-reverse",
        marginBottom: 15,
        marginLeft: 10
    }
})


const mapStateToProps = state => ({
    news: state.news,
    auth: state.auth,
    category: state.category,
    bookmark: state.bookmark,
})
  
const mapDispatchToProps = {
    getNews: news.getNews,
    getCategory: category.getCategory,
    getSameNews: news.getSameNews,
    sorotan: news.sorotan,
    nextGetNews: news.nextGetNews,
    getDetailNews: news.getDetailNews,
    getBookmark: bookmark.getBookmark,
    addBookmark: bookmark.addBookmark,
    getMyArticle: article.getMyArticle,
    getProfile: profile.getProfile
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeV1)