import React, { Component } from 'react'
import {Text, View, TextInput, StyleSheet, Image, ScrollView, Button, ToastAndroid, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import {Radio, Label} from 'native-base'
import placeholder from '../assets/placeholder.png'
import news from '../redux/actions/news'
import article from '../redux/actions/article'
import {Formik} from 'formik'
import * as Yup from 'yup'
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const articleSchema = Yup.object().shape({
    title: Yup.string().required('must be filled'),
    headline: Yup.string().required('must be filled'),
    content: Yup.string().required('must be filled'),
    category_id: Yup.number().required('choose one')
  });

class EditArticle extends Component {

    state = {
        one: false,
        two: false,
        three: false,
        four: false,
        five: false,
        six: false,
        category_id: 0
    }

    componentDidMount(){
        const {id} = this.props.route.params
        this.props.getDetailNews(id)
        const {detail} = this.props.news
        if (detail.category_id === 1) {
            this.setState({one: true, category_id: detail.category_id})
        } else if (detail.category_id === 2) {
            this.setState({two: true, category_id: detail.category_id})
        } else if (detail.category_id === 3) {
            this.setState({three: true, category_id: detail.category_id})
        } else if (detail.category_id === 4) {
            this.setState({four: true, category_id: detail.category_id})
        } else if (detail.category_id === 5) {
            this.setState({two: true, category_id: detail.category_id})
        } else if (detail.category_id === 6) {
            this.setState({two: true, category_id: detail.category_id})
        }
    }

    saveArticle = async (values) => {
        const {category_id} = this.state
        const {id} = this.props.route.params
        console.log(values)
        const data = {
            title: values.title,
            headline: values.headline,
            content: values.content,
            category_id: category_id
        }
        await this.props.editArticle(this.props.auth.token, id, data)
        this.props.getMyArticle(this.props.auth.token)
        this.props.navigation.navigate('Article')
    }

    chooseImage = async () => {
        const options = {
            noData: true,
        }
        ImagePicker.showImagePicker(options, async (response) => {
          if (response.didCancel) {
            ToastAndroid.show('No image choseen', ToastAndroid.LONG);
          } else if (response.error) {
            ToastAndroid.show('Please try again later', ToastAndroid.LONG);
          } else {
            const form = new FormData();
    
            form.append('picture', {
              uri: response.uri,
              name: response.fileName,
              type: response.type,
            });
            const {id} = this.props.route.params
            await this.props.uploadPictureNews(this.props.auth.token, id, form)
            const {alertMsg} = this.props.article
            if(alertMsg === 'upload picture succesfully'){
                await this.props.getDetailNews(id)
            } 
          }
        });
      };

    render() {
        const {id} = this.props.route.params
        const {detail} = this.props.news
        const {one, two, three, four, five, six} = this.state
        return (
            <View style={style.parent}>
                <Text style={style.title2}>Edit Article</Text>
                <ScrollView>
                <View style={style.parent}>
                    <View>
                        <Image source={detail.picture === null ? placeholder : {uri: `http://54.147.40.208:6060${detail.picture}`}} style={style.img}/>
                        <View style={style.chose}>
                            <TouchableOpacity onPress={this.chooseImage} style={style.camera}>
                                <Icon name="camera" color="white" size={50} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Formik
                        initialValues={{
                        title: detail.title,
                        headline: detail.headline,
                        content: detail.content,
                        category_id: detail.category_id
                        }}
                        validationSchema={articleSchema}
                        onSubmit={(values) => {
                        this.saveArticle(values)
                        }}>
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,
                        }) => (
                        <View style={style.body}>
                            <Text style={style.input}>Title</Text>
                            <TextInput
                            value={values.title}
                            style={style.title}
                            multiline={true}
                            scrollEnabled={true}
                            onChangeText={handleChange('title')}
                            onBlur={handleBlur('title')}
                            />
                            {errors.title ? (
                                <Text style={style.txtError}>{errors.title}</Text>
                            ) : null}
                            <Text style={style.input}>Headline</Text>
                            <TextInput
                            value={values.headline}
                            style={style.headline}
                            multiline={true}
                            scrollEnabled={true}
                            onChangeText={handleChange('headline')}
                            onBlur={handleBlur('headline')}
                            />
                            {errors.headline ? (
                                <Text style={style.txtError}>{errors.headline}</Text>
                            ) : null}
                            <Text style={style.input}>Content</Text>
                            <TextInput
                            value={values.content}
                            style={style.content}
                            multiline={true}
                            scrollEnabled={true}
                            onChangeText={handleChange('content')}
                            onBlur={handleBlur('content')}
                            />
                            {errors.content ? (
                                <Text style={style.txtError}>{errors.content}</Text>
                            ) : null}
                            <Text style={style.input}>Choose category</Text>
                            <View style={style.radioWrapper}>
                                <View style={style.radioView2}>
                                    <Radio
                                    color={'#5E50A1'}
                                    selectedColor={'#5E50A1'}
                                    onPress={() => this.setState({
                                        one: true,
                                        two: false,
                                        three: false,
                                        four: false,
                                        five: false,
                                        six: false,
                                        category_id: 1
                                    })}
                                    selected={one}
                                    onChangeText={handleChange('category_id')}
                                    onBlur={handleBlur('category_id')}
                                    value={values.category_id = 1}
                                    />
                                    <Label style={style.labelRadio}>Politics</Label>
                                </View>
                                <View style={style.radioView2}>
                                    <Radio
                                    color={'#5E50A1'}
                                    selectedColor={'#5E50A1'}
                                    onPress={() => this.setState({
                                        one: false,
                                        two: true,
                                        three: false,
                                        four: false,
                                        five: false,
                                        six: false,
                                        category_id: 2
                                    })}
                                    selected={two}
                                    onChangeText={handleChange('category_id')}
                                    onBlur={handleBlur('category_id')}
                                    value={values.category_id = 2}
                                    />
                                    <Label style={style.labelRadio}>Finance & Economy</Label>
                                </View>
                                <View style={style.radioView2}>
                                    <Radio
                                    color={'#5E50A1'}
                                    selectedColor={'#5E50A1'}
                                    onPress={() => this.setState({
                                        one: false,
                                        two: false,
                                        three: false,
                                        four: false,
                                        five: false,
                                        six: true,
                                        category_id: 6
                                    })}
                                    selected={six}
                                    onChangeText={handleChange('category_id')}
                                    onBlur={handleBlur('category_id')}
                                    value={values.category_id = 6}
                                    />
                                    <Label style={style.labelRadio}>Sains and Technology</Label>
                                </View>
                            </View>
                            <View style={style.radioWrapper}>
                                <View style={style.radioView2}>
                                    <Radio
                                    color={'#5E50A1'}
                                    selectedColor={'#5E50A1'}
                                    onPress={() => this.setState({
                                        one: false,
                                        two: false,
                                        three: false,
                                        four: true,
                                        five: false,
                                        six: false,
                                        category_id: 4
                                    })}
                                    selected={four}
                                    onChangeText={handleChange('category_id')}
                                    onBlur={handleBlur('category_id')}
                                    value={values.category_id = 4}
                                    />
                                    <Label style={style.labelRadio}>Agriculture</Label>
                                </View>
                                <View style={style.radioView2}>
                                    <Radio
                                    color={'#5E50A1'}
                                    selectedColor={'#5E50A1'}
                                    onPress={() => this.setState({
                                        one: false,
                                        two: false,
                                        three: false,
                                        four: false,
                                        five: true,
                                        six: false,
                                        category_id: 5
                                    })}
                                    selected={five}
                                    onChangeText={handleChange('category_id')}
                                    onBlur={handleBlur('category_id')}
                                    value={values.category_id = 5}
                                    />
                                    <Label style={style.labelRadio}>Sports</Label>
                                </View>
                                <View style={style.radioView2}>
                                    <Radio
                                    color={'#5E50A1'}
                                    selectedColor={'#5E50A1'}
                                    onPress={() => this.setState({
                                        one: false,
                                        two: false,
                                        three: true,
                                        four: false,
                                        five: false,
                                        six: false,
                                        category_id: 3
                                    })}
                                    selected={three}
                                    onChangeText={handleChange('category_id')}
                                    onBlur={handleBlur('category_id')}
                                    value={values.category_id = 3}
                                    />
                                    <Label style={style.labelRadio}>Entertainment, Art & Culture</Label>
                                </View>
                            </View>
                            <TouchableOpacity onPress={handleSubmit} style={style.btn}>
                                <Text style={style.textbtn}>SAVE</Text>
                            </TouchableOpacity>
                        </View>
                        )}
                    </Formik>
                </View>
                </ScrollView>
            </View>
        );
    }
}


const mapStateToProps = state => ({
    news: state.news,
    auth: state.auth,
    article: state.article
})
  
const mapDispatchToProps = {
    getDetailNews: news.getDetailNews,
    editArticle: article.editArticle,
    uploadPictureNews: article.uploadPictureNews,
    getMyArticle: article.getMyArticle
}

export default connect(mapStateToProps, mapDispatchToProps)(EditArticle)

const style = StyleSheet.create({
    parent: {
        flex: 1,
        backgroundColor: 'white'
    },
    title2: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 20
    },
    img: {
        width: 480,
        height: 360
    },
    body: {
        paddingHorizontal: "2%"
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textTransform: "capitalize",
        borderWidth: 1,
        borderColor: 'grey',
        color: 'black',
        borderRadius: 10,
        padding: 20
    },
    headline: {
        fontStyle: "italic",
        fontSize: 17,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'grey',
        color: 'black',
        borderRadius: 10,
        padding: 20
    },
    content: {
        fontSize: 15,
        borderWidth: 1,
        borderColor: 'grey',
        color: 'black',
        borderRadius: 10,
        padding: 20
    },
    input: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 15
    },
    txtError: {
        marginLeft: 10,
        fontSize: 13,
        color: 'red',
    },
    radioWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    radioView2: {
        flexDirection: 'row',
        padding: 12,
    },
    labelRadio: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 14,
        lineHeight: 19,
        color: '#46505C',
    },
    chose: {
        position: 'absolute',
        flexDirection: "row",
        justifyContent: 'flex-end',
        marginTop: '58%',
        width: '100%',
        paddingHorizontal: 10,
    },
    camera: {
        backgroundColor: "rgba(0,0,0,0.7)",
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    btn: {
        backgroundColor: 'rgb(0,0,0)',
        marginLeft: "3%",
        borderRadius: 10,
        height: 40,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    textbtn: {
        color: "rgb(255,255,255)",
        fontSize: 20,
    },
})