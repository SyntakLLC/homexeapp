import React from 'react';
import './global';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Home from './Home';
import { LogBox, StatusBar } from 'react-native';
LogBox.ignoreAllLogs(); //Ignore all log notifications

// var SafariView = require('react-native-safari-view');

// REDUX INITIAL STATES:
const initialState = {
    name: 'Tyler Scaglione',
    token: 'xyz',
    calls: [],
    appointments: [],
    listings: [],
    clients: [],
    lineChartData: [],
};

// The Redux change state functions
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_NAME':
            return { ...state, name: action.name };
        case 'UPDATE_TOKEN':
            return { ...state, token: action.token };
        case 'UPDATE_CALLS':
            return { ...state, calls: action.calls };
        case 'UPDATE_APPOINTMENTS':
            return { ...state, appointments: action.appointments };
        case 'UPDATE_CLIENTS':
            return { ...state, clients: action.clients };
        case 'UPDATE_LISTINGS':
            return { ...state, listings: action.listings };
        case 'UPDATE_LINE_CHART_DATA':
            return { ...state, lineChartData: action.lineChartData };
        default:
            return state;
    }
};
const store = createStore(reducer);

export default class App extends React.Component {
    componentDidMount() {
        if (Platform.OS == 'ios') {
            StatusBar.setBarStyle('dark-content', true);
        }
    }

    render() {
        return (
            <Provider store={store}>
                <Home />
            </Provider>
        );
    }
}
