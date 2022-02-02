import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Login from './screens/Login';
import Tabs from './Tabs';
import './global';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import { AsyncStorage } from 'react-native';

// AsyncStorage stuff regarding the login status:
const USER_KEY = 'auth-key-csv';
isSignedIn = async () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(USER_KEY)
            .then((res) => {
                if (res !== null) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch((err) => reject(err));
    });
};

export default class App extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName={'Login'}
                    screenOptions={({ route }) => ({
                        headerShown: false,
                    })}
                >
                    <Stack.Screen name='Tabs' component={Tabs} />
                    <Stack.Screen name='Login' component={Login} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
