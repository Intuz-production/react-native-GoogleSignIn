//The MIT License (MIT)
//
//Copyright (c) 2020 INTUZ
//
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import React, { Component } from 'react'
import {
    View,
    SafeAreaView,
    Text,
    Alert
} from 'react-native'

import styles from './styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions, StackActions } from 'react-navigation'
import { GoogleSignin, GoogleSigninButton } from '@react-native-community/google-signin';

class HomeViewController extends Component {

    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props)
        const { navigation } = this.props.navigation
        this.state = {
            userInfo: null
        }
    }

    async componentDidMount() {
        try {
            const value = await AsyncStorage.getItem('userInfo')
            if (value !== null) {
                this.setState({
                    userInfo: JSON.parse(value)
                })
            }
        } catch (e) {
            // error reading value
        }
    }

    onLogoutTapped() {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Yes', onPress: () => this.onLogoutPress() },
            ],
            { cancelable: true }
        )
    }

    onLogoutPress() {
        signOut = async () => {
            try {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
                this.setState({ user: null });
            } catch (error) {
                console.error(error);
            }
        };
        AsyncStorage.removeItem("userInfo", () => { });
        const resetAction = StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    render() {
        var name = ''
        if (this.state.userInfo != null) {
            name = this.state.userInfo.givenName
        } else {
            name = ''
        }
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <View style={styles.subContainer}>
                    <Text>Welcome home, {name}!</Text>
                </View>
                <TouchableOpacity style={styles.subLogoutContainer} onPress={this.onLogoutTapped.bind(this)}>
                    <Text>LOGOUT</Text>
                </TouchableOpacity>
            </SafeAreaView >
        )
    }
}
export default HomeViewController