import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import Icon3 from 'react-native-vector-icons/FontAwesome5'
import Icon4 from 'react-native-vector-icons/Fontisto'
import {connect} from 'react-redux'
import search from '../redux/actions/search'

class Menu extends Component {

    goCategory = async (idCat) => {
        const {name, search, sort} = idCat
        this.props.getSort(search, sort)
        this.props.navigation.navigate('Category', {name: name})
    }

    render() {
        return (
            <View style={style.parent}>
                <View style={style.body}>
                    <TouchableOpacity onPress={() => this.goCategory({search: '', sort: 'view', name: 'Trending'})}>
                        <View style={style.category}>
                            <Icon name='trending-up' size={35} />
                            <Text style={style.textCategory}>Trending</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.goCategory({search: 'politics', sort: '', name: 'Politics'})}>
                        <View style={style.category}>
                            <Icon3 name='building' size={37} />
                            <Text style={style.textCategory}>Politics</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.goCategory({search: 'finance', sort: '', name: 'Finance & Economy'})}>
                        <View style={style.category}>
                            <Icon2 name='attach-money' size={35} />
                            <Text style={style.textCategory}>Finance & Economy</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.goCategory({search: 'entertainment', sort: '', name: 'Entertainment, Art & Culture'})}>
                        <View style={style.category}>
                            <Icon3 name='theater-masks' size={30} />
                            <Text style={style.textCategory}>Entertainment, Art & Culture</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.goCategory({search: 'agriculture', sort: '', name: 'Agriculture'})}>
                        <View style={style.category}>
                            <Icon3 name='tractor' size={30} />
                            <Text style={style.textCategory}>Agriculture</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.goCategory({search: 'sports', sort: '', name: 'Sports'})}>
                        <View style={style.category}>
                            <Icon2 name='sports-football' size={35} />
                            <Text style={style.textCategory}>Sports</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.goCategory({search: 'sains', sort: '', name: 'Sains and Technology'})}>
                        <View style={style.category}>
                            <Icon4 name='atom' size={35} />
                            <Text style={style.textCategory}>Sains and Technology</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    parent: {
        flex: 1,
        paddingLeft: 20,
        backgroundColor: "rgb(255,255,255)"
    },
    body: {
        marginTop: 20
    },
    category: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 25
    },
    textCategory: {
        fontSize: 15,
        fontWeight: "bold",
        marginLeft: 20
    }
})
const mapStateToProps = state => ({
    news: state.news,
    search: state.search
})

const mapDispatchToProps = {
    getSort: search.getSort
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)