import React from 'react';
import './global';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Tabs from './Tabs';

// REDUX INITIAL STATES:
const initialState = {
    name: 'Tyler Scaglione',
};

// The Redux change state functions
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_NAME':
            return { ...state, name: action.name };
        default:
            return state;
    }
};
const store = createStore(reducer);

export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Tabs />
            </Provider>
        );
    }
}
