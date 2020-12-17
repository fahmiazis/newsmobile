import React, { Component } from 'react'
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ToastAndroid} from 'react-native'
import { Input, Item } from 'native-base'
import {connect} from 'react-redux'
import search from '../redux/actions/search'
import news from '../redux/actions/news'
import bookmark from '../redux/actions/bookmark'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import RenderSearch from './RenderSearch'

class Search extends Component {
    state = {
        search : " "
    }

    goSearch = () => {
        const {search} = this.state
        this.props.procSearch(search)
    }

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
        const {search} = this.props.search
        return (
            <View style={style.parent}>
                <View style={style.search}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name="arrow-left" size={30} color="black" />
                    </TouchableOpacity>
                    <View>
                        <Item style={style.input}>
                            <Input placeholder="Search..." onChangeText={search=>this.setState({search})} />
                            <TouchableOpacity onPress={this.goSearch}>
                                <Icon name="magnify" size={25} color="black"/>
                            </TouchableOpacity>
                        </Item>
                    </View>
                </View>
                <View style={style.body}>
                <FlatList
                    data = {Object.keys(search).length > 0 && search.data.rows}
                    renderItem = {({item}) => (
                    <RenderSearch
                    onPress={() => this.goDetail({id: item.id})}
                    list={item}
                    onBookmark={() => this.addBookmark({id: item.id})}
                    />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
                </View>
            </View>            
        )
    }
}
const mapStateToProps = state => ({
    auth: state.auth,
    search: state.search
})

const mapDispatchToProps = {
    procSearch: search.procSearch,
    getBookmark: bookmark.getBookmark,
    addBookmark: bookmark.addBookmark,
    getDetailNews: news.getDetailNews
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)

const style = StyleSheet.create({
    parent: {
        flex: 1,
        backgroundColor: "#ffffff"
    },
    body: {
        flex: 1,
        backgroundColor: "#ffffff",
        marginHorizontal: 10
    },
    input: {
        width: "68%",
        height: 70,
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 0
    },
    search: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        borderBottomWidth: 2,
        borderBottomColor: "rgb(108,108,108)"
    }
})