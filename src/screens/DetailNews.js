import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, ScrollView } from 'react-native'

import {connect} from 'react-redux'
import placeholder from '../assets/placeholder.png'
import news from '../redux/actions/news'

class DetailNews extends Component {

    render() {
        const {detail} = this.props.news
        return (
            <View style={style.parent}>
                <ScrollView>
                <View style={style.parent}>
                    <Image source={detail.picture === null ? placeholder : {uri: `http://54.147.40.208:6060${detail.picture}`}} style={style.img}/>
                    <View style={style.body}>
                        <Text style={style.title}>{detail.title}</Text>
                        <Text style={style.headline}>{detail.headline}</Text>
                        <Text style={style.content}>{detail.content}</Text>
                    </View>
                </View>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    news: state.news
})
  
const mapDispatchToProps = {
    getDetailNews: news.getDetailNews
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailNews)

const style = StyleSheet.create({
    parent: {
        flex: 1
    },
    img: {
        width: 480,
        height: 360
    },
    body: {
        paddingHorizontal: "2%"
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 20,
        textTransform: "capitalize"
    },
    headline: {
        fontStyle: "italic",
        fontSize: 17,
        marginBottom: 10
    },
    content: {
        fontSize: 15
    }
})