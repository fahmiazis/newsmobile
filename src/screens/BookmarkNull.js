import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Fontisto'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import {connect} from 'react-redux'
import news from '../redux/actions/news'
import bookmark from '../redux/actions/bookmark'
import RenderBookmark from './RenderBookmark'

class BookmarkNull extends Component {

    componentDidMount(){
        const {token, isLogin} = this.props.auth
        if (isLogin && token !== '') {
            this.props.getBookmark(this.props.auth.token)
        }
    }

    deleteAll = async () => {
        await this.props.deleteBookmark(this.props.auth.token)
        this.props.getBookmark(this.props.auth.token)
    }

    deleteItem = async (idNews) => {
        const {id} = idNews
        await this.props.deleteItemBookmark(this.props.auth.token, id)
        this.props.getBookmark(this.props.auth.token)
    }

    goDetail = async (idNews) => {
        const {id} = idNews
        await this.props.getDetailNews(id)
        this.props.navigation.navigate('DetailBook', {id: id})
    }

    render() {
        const {token, isLogin} = this.props.auth 
        const {bookmark} = this.props.bookmark
        return (
            <View style={style.grandpa}>
                {isLogin && token !== '' ? (
                    <ScrollView>
                    <View>
                        <View style={style.header}>
                            <Text style={style.textTitle}>My Bookmark</Text>
                            {/* <TouchableOpacity style={style.itemHeader} onPress={this.deleteAll}>
                                <Icon2 name="trash-can" color="red" size={40} />
                            </TouchableOpacity> */}
                        </View>
                        <View style={style.margin}>
                            <FlatList
                                data = {Object.keys(bookmark).length > 0 && bookmark.data.rows}
                                renderItem = {({item}) => (
                                <RenderBookmark
                                onPress={() => this.goDetail({id: item.id})}
                                list={item}
                                onDelete={() => this.deleteItem({id: item.id})}
                                />
                                )}
                                keyExtractor={(item) => item.id.toString()}
                            />
                        </View>
                    </View>
                    </ScrollView>
                ) : (
                    <View style={style.parent}>
                        <Text style={style.title}> Bookmark </Text>
                        <View style={style.bookmark}>
                            <Icon name='bookmark-alt' size={50} color="rgb(164,164,164)" />
                        </View>
                        <Text style={style.textSave}>Save the news you want to read here. Click the Bookmark icon located next to the news</Text>
                    </View>
                )}
            </View>
        );
    }
}
const mapStateToProps = state => ({
    auth: state.auth,
    bookmark: state.bookmark
})

const mapDispatchToProps = {
    getDetailNews: news.getDetailNews,
    getBookmark: bookmark.getBookmark,
    deleteBookmark: bookmark.deleteBookmark,
    deleteItemBookmark: bookmark.deleteItemBookmark
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkNull)

const style = StyleSheet.create({
    grandpa: {
        flex: 1
    },
    parent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(255,255,255)",
        paddingHorizontal: "8%"
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "rgb(164,164,164)",
        marginBottom: 70
    },
    bookmark: {
        borderRadius: 50,
        width: 80,
        height: 80,
        borderWidth: 3,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "rgb(164,164,164)",
        marginBottom: 50
    },
    textSave: {
        color: "rgb(164,164,164)",
        fontSize: 15,
        textAlign: "center"
    },
    margin: {
        marginHorizontal: 20
    },
    textTitle: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    itemHeader: {
        alignSelf: 'flex-end'
    },
    header: {
        flexDirection: 'row',
        width: '70%',
        alignSelf: 'flex-end',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 20
    }
})