import React from 'react';
import tailwind from 'tailwind-rn';
import {
    ScrollView,
    View,
    SafeAreaView,
    Dimensions,
    Text,
    Alert,
    TouchableOpacity,
    AsyncStorage,
    Switch,
} from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components';
import axios from 'axios';

// Where we grab the redux name state
function mapStateToProps(state) {
    return {
        name: state.name,
        calls: state.calls,
        appointments: state.appointments,
        clients: state.clients,
        listings: state.listings,
        lineChartData: state.lineChartData,
    };
}

// Where we define the function to update redux name
function mapDispatchToProps(dispatch) {
    return {
        updateName: (name) =>
            dispatch({
                type: 'UPDATE_NAME',
                name,
            }),
        updateClients: (clients) =>
            dispatch({
                type: 'UPDATE_CLIENTS',
                clients,
            }),
    };
}

class Plus extends React.Component {
    state = {
        name: '',
        phoneNumber: '',
        email: '',
        status: 'Select Status',
        clientType: 'Select Client Type',
        gci: 0,
        salesPrice: 0,
        commission: 0,
        capped: false,
    };

    async addClient() {
        if (this.state.name == '') {
            Alert.alert('Hold on!', "Please fill out the client's name");
            return null;
        } else if (this.state.phoneNumber == '') {
            Alert.alert(
                'Hold on!',
                "Please fill out the client's phone number",
            );
            return null;
        } else if (this.state.email == '') {
            Alert.alert('Hold on!', "Please fill out the client's email");
            return null;
        } else if (this.state.salesPrice == 0) {
            Alert.alert('Hold on!', 'Please fill out the sales price');
            return null;
        } else if (this.state.commission == 0) {
            Alert.alert('Hold on!', 'Please fill out the commission');
            return null;
        } else if (this.state.clientType == 'Select Client Type') {
            Alert.alert('Hold on!', 'Please fill out the client type');
            return null;
        } else if (this.state.status == 'Select Status') {
            Alert.alert('Hold on!', "Please fill out the client's status");
            return null;
        } else {
            const token = await AsyncStorage.getItem('token');
            const name = await AsyncStorage.getItem('name');

            const headers = {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
            };

            let cappedMultiplier = this.state.capped ? 1 : 0.8;

            const data = {
                name: this.state.name,
                phoneNumber: this.state.phoneNumber,
                email: this.state.email,
                status: this.state.status,
                clientType: this.state.clientType,
                user_name: name,
                gci:
                    this.state.salesPrice *
                    (this.state.commission / 100) *
                    0.55 *
                    cappedMultiplier,
            };

            await fetch('https://homexe.win/api/client/create', {
                method: 'POST',
                headers: new Headers({
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                }),
                body: JSON.stringify(data),
            })
                .then((response) => {
                    console.log(response);
                    Alert.alert('Success');

                    this.setState({ name: '' });
                    this.setState({ phoneNumber: '' });
                    this.setState({ email: '' });
                    this.setState({ status: 'Select Status' });
                    this.setState({ client_type: 'Select Client Type' });
                    this.setState({ gci: 0 });
                    this.setState({ salesPrice: 0 });
                    this.setState({ commission: 0 });

                    this.refreshClients();
                })
                .catch((error) => {
                    Alert.alert(error);
                });
        }
    }

    async refreshClients() {
        const token = await AsyncStorage.getItem('token');
        const name = await AsyncStorage.getItem('name');
        var clients = [];
        await fetch('https://homexe.win/client/get', {
            headers: new Headers({
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                this.props.updateClients(data);
            });
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    render() {
        return (
            <SafeAreaView
                style={{
                    paddingHorizontal: 8,
                    backgroundColor: '#fff',
                    height: Dimensions.get('window').height,
                }}
            >
                <ScrollView
                    style={{ paddingHorizontal: 16 }}
                    contentContainerStyle={{ paddingBottom: 120 }}
                >
                    <View style={tailwind('mt-6 mb-4 flex-col')}>
                        <Title text='Add Client' />
                    </View>

                    <View
                        style={{
                            width: '100%',
                            paddingBottom: 40,
                            backgroundColor: global.chartColor,
                            alignItems: 'center',
                            paddingTop: 10,
                            borderRadius: 20,
                        }}
                    >
                        <LoginInput
                            style={{
                                backgroundColor: '#fff',
                            }}
                            value={this.state.name}
                            placeholder='NAME'
                            autoCapitalize='words'
                            fontWeight='bold'
                            autoCorrect={false}
                            placeholderTextColor='#11182750'
                            onChangeText={(val) => {
                                this.setState({ name: val });
                            }}
                        />
                        <LoginInput
                            style={{
                                backgroundColor: '#fff',
                            }}
                            value={this.state.phoneNumber}
                            placeholder='PHONE NUMBER'
                            keyboardType='numeric'
                            fontWeight='bold'
                            autoCorrect={false}
                            placeholderTextColor='#11182750'
                            onChangeText={(val) => {
                                this.setState({ phoneNumber: val });
                            }}
                        />
                        <LoginInput
                            style={{
                                backgroundColor: '#fff',
                            }}
                            value={this.state.email}
                            placeholder='EMAIL'
                            fontWeight='bold'
                            autoCorrect={false}
                            placeholderTextColor='#11182750'
                            onChangeText={(val) => {
                                this.setState({ email: val });
                            }}
                        />

                        <Picker
                            selectedValue={this.state.clientType}
                            onValueChange={(itemValue) =>
                                this.setState({ clientType: itemValue })
                            }
                        >
                            <Picker.Item
                                label='Select Client Type'
                                value='NONE'
                            />
                            <Picker.Item label='Listing' value='Listing' />
                            <Picker.Item label='Buyer' value='Buyer' />
                        </Picker>

                        <Picker
                            selectedValue={this.state.status}
                            onValueChange={(itemValue) =>
                                this.setState({ status: itemValue })
                            }
                        >
                            <Picker.Item label='Select Status' value='NONE' />
                            <Picker.Item label='Signed' value='Signed' />
                            <Picker.Item label='Contract' value='Contract' />
                            <Picker.Item label='Closed' value='Closed' />
                        </Picker>

                        <LoginInput
                            style={{
                                backgroundColor: '#fff',
                            }}
                            value={this.state.salesPrice}
                            keyboardType='numeric'
                            placeholder='SALES PRICE'
                            fontWeight='bold'
                            autoCorrect={false}
                            placeholderTextColor='#11182750'
                            onChangeText={(val) => {
                                this.setState({ salesPrice: val });
                            }}
                        />

                        <LoginInput
                            style={{
                                backgroundColor: '#fff',
                            }}
                            value={this.state.commission}
                            keyboardType='numeric'
                            placeholder='COMMISSION % (i.e. 20%)'
                            fontWeight='bold'
                            autoCorrect={false}
                            placeholderTextColor='#11182750'
                            onChangeText={(val) => {
                                this.setState({ commission: val });
                            }}
                        />

                        <View
                            style={{
                                width: '85%',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingVertical: 10,
                            }}
                        >
                            <Text
                                style={{
                                    paddingRight: 20,
                                    fontSize: 17,
                                    color: global.primaryColor,
                                    fontWeight: 'bold',
                                }}
                            >
                                CAPPED?
                            </Text>

                            <Switch
                                trackColor={{
                                    false: '#767577',
                                    true: global.primaryColor,
                                }}
                                onValueChange={(val) =>
                                    this.setState({ capped: val })
                                }
                                value={this.state.capped}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                this.addClient();
                            }}
                            style={{
                                top: 20,
                                height: 40,
                                width: '90%',
                                alignSelf: 'center',
                                marginLeft: 16,
                            }}
                        >
                            <SelectButton
                                style={{ backgroundColor: global.primaryColor }}
                            >
                                <AddJobText>Add Client</AddJobText>
                            </SelectButton>
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            height: 200,
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    ></View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Plus);

const Title = (item) => (
    <Text
        style={{
            color: global.primaryColor,
            fontWeight: 'bold',
            fontSize: 25,
        }}
    >
        {item.text}
    </Text>
);

const LoginInput = styled.TextInput`
    height: 40px;
    border-radius: 20px;
    background-color: rgb(230, 230, 230);
    width: 90%;
    padding-left: 20px;
    margin-top: 10px;
    color: #111827;
    margin-bottom: 10px;
`;

const Picker = styled.Picker`
    height: 220px;
    border-radius: 20px;
    background-color: white;
    width: 90%;
    padding-left: 20px;
    margin-top: 10px;
    color: #111827;
    margin-bottom: 10px;
    overflow: hidden;
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
