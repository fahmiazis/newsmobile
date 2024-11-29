import React, { Component } from 'react'
import {View, Text, FlatList, StyleSheet, Button, ScrollView, TouchableOpacity} from 'react-native'
import placeholder from '../assets/placeholder.png'
import {connect} from 'react-redux'
import article from '../redux/actions/article'
import news from '../redux/actions/news'
import RenderArticle from './RenderArticle'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
class Article extends Component {

    componentDidMount(){
        const {token, isLogin} = this.props.auth
        if (isLogin && token !== '') {
            this.props.getMyArticle(this.props.auth.token)
        }
    }

    goEdit = async (idNews) => {
        const {id} = idNews 
        await this.props.getDetailNews(id)
        this.props.navigation.navigate('EditArticle', {id: id})
    }

    delete = async (idNews) => {
        const {id} = idNews
        await this.props.deleteArticle(this.props.auth.token, id)
        await this.props.getMyArticle(this.props.auth.token)
    }

    render() {
        const {article} = this.props.article
        const {isLogin, token} = this.props.auth
        return (
            <View style={style.parent}>
                {isLogin === true && token !== '' ? (
                <ScrollView>
                    <Text style={style.title3}>My Article</Text>
                    <View style={style.margin}>
                        <FlatList
                            data = {Object.keys(article).length > 0 && article.data.rows}
                            // refreshing={loading}
                            // onRefresh={this.getTerkini}
                            renderItem = {({item}) => (
                            <RenderArticle
                            onPress={() => this.goEdit({id: item.id})}
                            list={item}
                            onDelete={() => this.delete({id: item.id})}
                            />
                            )}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    </View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('AddArticle')} style={style.btn}>
                        <Text style={style.textbtn}>Create new article</Text>
                    </TouchableOpacity>
                </ScrollView>
                ) : (
                    <View style={style.par}>
                        <Text style={style.title2}> Article </Text>
                        <View style={style.bookmark}>
                            <Icon name='newspaper' size={100} color="rgb(164,164,164)" />
                        </View>
                        <Text style={style.textSave}>Login first to see, edit, and add your article</Text>
                    </View>
                )}
            </View>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    article: state.article
})

const mapDispatchToProps = {
    getMyArticle: article.getMyArticle,
    editArticle: article.editArticle,
    deleteArticle: article.deleteArticle,
    getDetailNews: news.getDetailNews
}

export default connect(mapStateToProps, mapDispatchToProps)(Article)


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
    },
    btn: {
        backgroundColor: 'rgb(0,0,0)',
        marginHorizontal: "3%",
        borderRadius: 10,
        height: 40,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },
    textbtn: {
        color: "rgb(255,255,255)",
        fontSize: 20,
    },
})
