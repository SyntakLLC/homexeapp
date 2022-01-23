import React from 'react';
import {
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Linking,
    Text,
    Animated,
    Alert,
    AsyncStorage,
    ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components';

// AsyncStorage stuff regarding the login status:
const USER_KEY = 'auth-key-csv';
const onSignIn = () => AsyncStorage.setItem(USER_KEY, 'true');
isSignedIn = () => {
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
        updateToken: (token) =>
            dispatch({
                type: 'UPDATE_TOKEN',
                token,
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
        isLoggingIn: false,
    };

    async componentDidMount() {
        // This code is run whenever navigation comes to this screen
        // this.props.navigation.addListener('focus', async () => {
        this.retrieveName();
        await isSignedIn()
            .then((res) => {
                res ? this.props.navigation.navigate('Tabs') : {};
            })
            .catch((err) => {});
        // });
    }

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
        this.setState({ isLoggingIn: true });
        try {
            var url = 'http://homexe.win/api/sanctum/token';

            var xhr = new XMLHttpRequest();
            xhr.open('POST', url);

            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    // console.log(xhr.status);
                    // console.log(xhr.responseText);
                    try {
                        var name = JSON.parse(xhr.responseText).user.name;
                        var token = JSON.parse(xhr.responseText).token;
                        this.storeToken(token);

                        this.storeName(name);
                        AsyncStorage.getItem(USER_KEY).then((res) => {});
                        onSignIn();
                        AsyncStorage.getItem(USER_KEY).then((res) => {});
                        this.props.updateName(name);
                        this.props.navigation.navigate('Tabs');
                        this.setState({ isLoggingIn: false });
                    } catch (e) {
                        Alert.alert(
                            'Whoops!',
                            'Your login credentials were incorrect.',
                        );
                        this.setState({ isLoggingIn: false });
                    }
                }
            };

            var data =
                '{"email": "' +
                this.state.loginEmail +
                '", "password": "' +
                this.state.loginPassword +
                '", "device_name": "Homexe.win App"}';

            xhr.send(data);
        } catch {
            // console.log('ERRRO');
        }
    }

    // ................................................................
    // THE FOLLOWING FUNCTIONS ARE LOGIN/ASYNCSTORAGE RELATED FUNCTIONS

    // stores the email into AsyncStorage
    storeName = async (name) => {
        try {
            await AsyncStorage.setItem('name', name);
        } catch (error) {}
    };
    storeToken = async (token) => {
        try {
            await AsyncStorage.setItem('token', token);
        } catch (error) {}
    };

    // Gets the email from AsyncStorage
    retrieveName = async () => {
        try {
            const name = await AsyncStorage.getItem('name');

            if (name !== null) {
                this.props.updateName(name);
                // this.setState({
                //     loginEmail: email,
                //     name: this.convertToUserName(email),
                // });
            }
        } catch (error) {}
    };

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
                            height: 300,
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

                        {/* The forgot password button */}
                        <TouchableOpacity
                            style={{ margin: 5 }}
                            onPress={() => {
                                Linking.openURL('https://homexe.win/register');
                            }}
                        >
                            <Subtitle style={{ color: global.primaryColor }}>
                                Create Account
                            </Subtitle>
                        </TouchableOpacity>

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
                                <AddJobText>
                                    {this.state.isLoggingIn ? (
                                        <ActivityIndicator color='white' />
                                    ) : (
                                        'Log In'
                                    )}
                                </AddJobText>
                            </SelectButton>
                        </TouchableOpacity>
                    </ModalButtonView>

                    {/* The image logo on top for looks */}
                    <LoginLogo
                        source={{ uri: 'https://i.imgur.com/obvXOnI.gif' }}
                        style={{ bottom: 370 }}
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

const Subtitle = styled.Text`
    font-size: 16;
    color: white;
    margin-left: 20;
    margin-right: 20;
    margin-top: 10;
`;
