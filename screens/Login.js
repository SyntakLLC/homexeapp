import React from 'react';
import {
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Text,
    Animated,
} from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components';
import axios from 'axios';

axios.defaults.baseURL = 'http://homexe.win';

// Where we grab the redux name state
function mapStateToProps(state) {
    return { name: state.name };
}

// Where we define the function to update redux name
function mapDispatchToProps(dispatch) {
    return {
        updateName: (name) =>
            dispatch({
                type: 'UPDATE_NAME',
                name,
            }),
    };
}

class Login extends React.Component {
    state = {
        calls: [],
        appointments: [],
        loginModalTop: new Animated.Value(150),
        pickerOpen: true,
        hasLoggedIn: false,
        loginEmail: '',
        loginPassword: '',
    };

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    // opens the login modal
    openModal() {
        this.setState({
            pickerOpen: true,
        });

        Animated.spring(this.state.loginModalTop, {
            toValue: 150,
            duration: 10000,
            useNativeDriver: false,
        }).start();
    }

    // CLOSES the login modal
    closeModal() {
        this.setState({
            pickerOpen: false,
        });

        Animated.spring(this.state.loginModalTop, {
            toValue: -global.screenHeight + 800,
            duration: 10000,
            useNativeDriver: false,
        }).start();
    }

    // signs in
    signIn() {
        try {
            var url = 'http://homexe.win/api/sanctum/token';

            var xhr = new XMLHttpRequest();
            xhr.open('POST', url);

            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    // console.log(xhr.status);
                    // console.log(xhr.responseText);

                    let name = JSON.parse(xhr.responseText).user.name;
                    this.props.updateName(name);
                    this.props.navigation.navigate('Tabs');
                }
            };

            var data =
                '{"email": "' +
                this.state.loginEmail +
                '", "password": "' +
                this.state.loginPassword +
                '", "device_name": "Homexe.win App"}';

            console.log(data);

            xhr.send(data);
        } catch {}
    }

    render() {
        return (
            <SafeAreaView>
                <AnimatedModalView
                    style={{
                        top: this.state.loginModalTop,
                    }}
                >
                    {/* The Background */}
                    <ModalButtonView
                        style={{
                            width: 300,
                            height: 280,
                            padding: 20,
                            marginLeft: 0,
                            paddingTop: 40,
                        }}
                    >
                        {/* The Title where it says login or signup */}
                        <ModalButtonText
                            style={{
                                marginLeft: 0,
                                color: global.primaryColor,
                            }}
                        >
                            Login
                        </ModalButtonText>

                        {/* The 2 or 4 text inputs depending on if it's logging in or signing up */}
                        <LoginInput
                            style={{
                                backgroundColor: global.grayColor,
                            }}
                            placeholder='EMAIL'
                            fontWeight='bold'
                            autoCorrect={false}
                            placeholderTextColor='#11182750'
                            onChangeText={(val) => {
                                this.setState({ loginEmail: val });
                            }}
                        />
                        <LoginInput
                            style={{
                                backgroundColor: global.grayColor,
                            }}
                            placeholder='PASSWORD'
                            fontWeight='bold'
                            blurOnSubmit={false}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            secureTextEntry={true}
                            placeholderTextColor='#11182750'
                            onChangeText={(val) => {
                                this.setState({ loginPassword: val });
                            }}
                        />

                        {/* The actual log in/sign up button where it does it */}
                        <TouchableOpacity
                            onPress={() => {
                                this.signIn();
                            }}
                            style={{
                                // bottom: '4%',
                                top: 20,
                                height: 40,
                                width: '100%',
                                alignSelf: 'center',
                                marginLeft: 16,
                            }}
                        >
                            <SelectButton
                                style={{ backgroundColor: global.primaryColor }}
                            >
                                <AddJobText>Log In</AddJobText>
                            </SelectButton>
                        </TouchableOpacity>
                    </ModalButtonView>

                    {/* The image logo on top for looks */}
                    <LoginLogo
                        source={{ uri: 'https://i.imgur.com/obvXOnI.gif' }}
                        style={{ bottom: 350 }}
                    />
                </AnimatedModalView>
            </SafeAreaView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const SmallerTitle = (item) => (
    <Text
        style={{
            color: global.primaryColor,
            fontWeight: 'bold',
            fontSize: 20,
        }}
    >
        {item.text}
    </Text>
);

const LoginLogo = styled.Image`
    width: 80px;
    height: 80px;
    bottom: 420px;
    border-radius: 20px;
    overflow: hidden;
    border-color: #ffffff60;
    border-width: 0.5px;
    /* box-shadow: 0px 0px 20px rgba(0, 0, 0, 1); */
`;

const ModalView = styled.View`
    flex: 1;
    align-items: center;
    justify-content: flex-start;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
    z-index: 50;
`;

const AnimatedModalView = Animated.createAnimatedComponent(ModalView);

const LoginInput = styled.TextInput`
    height: 40px;
    border-radius: 20px;
    background-color: rgb(230, 230, 230);
    width: 90%;
    padding-left: 20px;
    margin-top: 10px;
    color: #111827;
`;

const SelectButton = styled.View`
    height: 50px;
    width: 94%;
    flex: 1;
    color: white;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
`;

const AddJobText = styled.Text`
    font-weight: 700;
    font-size: 17px;
    color: white;
    text-align: center;
    line-height: 22px;
`;

const ModalButtonView = styled.View`
    width: 90%;
    min-height: 120;
    margin-left: 5%;
    border-radius: 15;
    background-color: rgb(255, 255, 255);
    align-items: center;
    margin-bottom: 20;
    overflow: hidden;
    box-shadow: 5px 5px 10px black;
`;

const ModalButtonText = styled.Text`
    font-size: 25;
    font-weight: 600;
    color: black;
    margin-left: 20;
    margin-bottom: 10;
`;

const ModalSubtitle = styled.Text`
    font-size: 16;
    color: black;
    margin-left: 20;
    margin-right: 20;
    margin-top: 10;
`;
