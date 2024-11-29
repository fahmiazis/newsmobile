import React from 'react'
import {View, Image, TouchableOpacity, Text, StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/Fontisto'
import placeholder from '../assets/placeholder.png'
export default function RenderSorotan({list, onPress, onBookmark}) {
    return (
        <View style={style.card}>
            <Image source={list.picture === null ? placeholder : {uri: `http://54.147.40.208:6060${list.picture}`}} style={style.imgCard} />
            <View>
                <View style={style.content}>
                    <Text style={style.category}>{list.category.name}</Text>
                    <TouchableOpacity onPress={onPress}>
                        <Text style={style.title}>
                            {list.title}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={style.footer}>
                    <TouchableOpacity onPress={onBookmark}>
                        <Icon name="bookmark" color="rgb(164,164,164)" size={30} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
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
