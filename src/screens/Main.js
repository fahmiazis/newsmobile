import React, { Component } from 'react'
import {StyleSheet, View, TouchableOpacity} from 'react-native'
import {NavigationContainer, useNavigation} from '@react-navigation/native'
import {createStackNavigator, HeaderBackButton, HeaderHeightContext} from '@react-navigation/stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {connect, useSelector} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon2 from 'react-native-vector-icons/MaterialIcons'

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

//import TestPage from './TestPage' //untuk uji coba
import Login from './Login'  
import Register from './Register'
import Home from './HomeV1'
import Detail from './DetailNews'
import Settings from './Settings'
import Menu from './Menu'
import BookmarkNull from './BookmarkNull'
import Profile from './Profile'
import Article from './Article'
import AddArticle from './AddArticle'
import EditArticle from './EditArticle'
import Category from './Category'
import Search from './Search'

const SearchButton = () => {
    const navigation = useNavigation()
    return(
        <View style={style.search}>
        <TouchableOpacity onPress={() => navigation.navigate('Search') }>
            <Icon name="magnify" size={25} color="white"/>
        </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    textHeader1: {
        fontStyle: "italic",
        fontWeight: "bold",
        color: "rgb(255,255,255)",
        fontSize: 30,
        fontFamily: 'times new roman'
    },
    header: {
        backgroundColor: "rgb(0,0,0)",
    },
    arrow: {
        color: "rgb(255,255,255)"
    },
    search: {
        flexDirection: "row",
        width: 80,
        justifyContent: 'flex-end',
        marginRight: 20
    },
})

const BookmarkStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
            options={{
                title: "News.com",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                // headerTintColor: 'white'
            }}
            name="BookmarkNull"
            component={BookmarkNull}
            />
            <Stack.Screen 
            options={{
                title: "News.com",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerTintColor: 'white'
            }}
            name="DetailBook"
            component={Detail}
            />
        </Stack.Navigator>
    );
};

const MenuStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
            options={{
                title: "News.com",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                // headerTintColor: 'white'
            }}
            name="Menu"
            component={Menu}
            />
            <Stack.Screen 
            options={{
                title: "News.com",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerTintColor: 'white'
            }}
            name="Category"
            component={Category}
            />
            <Stack.Screen 
            options={{
                title: "News.com",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerTintColor: 'white'
            }}
            name="DetailCategory"
            component={Detail}
            />
        </Stack.Navigator>
    );
};

const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
            options={{
                title: "News.com",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerRight: SearchButton
                // headerLeft: <HeaderBackButton tintColor={'white'} />
            }}
            name="Home"
            component={Home}
            />
            <Stack.Screen 
            options={{
                title: "News.com",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerTintColor: 'white'
            }}
            name="Detail"
            component={Detail}
            />
        </Stack.Navigator>
    );
};

const NewsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
            options={{
                title: "News.com",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                // headerLeft: <HeaderBackButton tintColor={'white'} />
            }}
            name="Article"
            component={Article}
            />
            <Stack.Screen 
            options={{
                title: "News.com",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerTintColor: 'white'
            }}
            name="EditArticle"
            component={EditArticle}
            />
            <Stack.Screen 
            options={{
                title: "News.com",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerTintColor: 'white'
            }}
            name="AddArticle"
            component={AddArticle}
            />
        </Stack.Navigator>
    );
};

const AuthStack = () => {
    const auth = useSelector(state => state.auth)
    return (
        <Stack.Navigator>
            <Stack.Screen 
            name='Login' 
            component={Login} 
            options={{
                title: "News.com",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                // headerLeft: <HeaderBackButton tintColor={'white'} />
            }}
            />
            <Stack.Screen 
            name='Register' 
            component={Register} 
            options={{
                title: "News.com",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerTintColor: 'white'
            }}
            />
        </Stack.Navigator>
    );
};

const SettingsStack = () => {
    const auth = useSelector(state => state.auth)
    return (
        <Stack.Navigator>
            <Stack.Screen 
            options={{
                title: "News.com",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                // headerLeft: <HeaderBackButton tintColor={'white'} />
            }}
            name="Setting"
            component={Settings}
            />
            <Stack.Screen 
            options={{
                title: "News.com",
                headerTitleAlign: "center", 
                headerTitleStyle: style.textHeader1,
                headerStyle: style.header,
                headerTintColor: 'white'
            }}
            name="Profile"
            component={Profile}
            />
        </Stack.Navigator>
    );
};

const TabbedScreen = () => {
    const auth = useSelector(state => state.auth)
    return (
        <BottomTab.Navigator>
            <BottomTab.Screen 
            options={{
                tabBarIcon: ({size, color, focused}) => (
                    <Icon name='home' size={size} color={color} />
                ),
            }}
            name="Home"
            component={HomeStack}
            />

            <BottomTab.Screen
            options={{
                tabBarIcon: ({size, color, focused}) => (
                    <Icon name='newspaper' size={size} color={color} />
                ),
            }}
            name="My Article"
            component={NewsStack}
            />

            <BottomTab.Screen 
            options={{
                tabBarIcon: ({size, color, focused}) => (
                    <Icon name='menu' size={size} color={color} />
                ),
            }}
            name="Menu"
            component={MenuStack}
            />

            <BottomTab.Screen 
            options={{
                tabBarIcon: ({size, color, focused}) => (
                    <Icon2 name='collections-bookmark' size={size} color={color} />
                ),
            }}
            name="Bookmark"
            component={BookmarkStack}
            />

            <BottomTab.Screen 
            options={{
                tabBarIcon: ({size, color, focused}) => (
                    <Icon name='account' size={size} color={color} />
                ),
            }}
            name="Settings"
            component={auth.isLogin === false && auth.token === '' ? (AuthStack) : (SettingsStack)}
            />
        </BottomTab.Navigator>
    );
};

class Main extends Component {
    render() {
        return (
            <NavigationContainer>
                    <Stack.Navigator>
                        {/* <Stack.Screen name="Bookmarkv7" component={Bookmark} /> */}
                        <Stack.Screen name="Tabbed" component={TabbedScreen} 
                        options={{
                            headerShown: false
                        }}
                        />
                        <Stack.Screen name="Search" component={Search} 
                        options={{
                            headerShown: false
                        }}
                        />
                    </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(Main);