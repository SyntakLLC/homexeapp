import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Login from './screens/Login';
import Tabs from './Tabs';
import './global';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

export default class App extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName='Login'
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
