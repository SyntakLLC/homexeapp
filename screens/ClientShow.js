import React from "react";
import tailwind from "tailwind-rn";
import { ClientSymbol, PhoneSymbol, EmailSymbol } from "../icons";
import {
    TouchableOpacity,
    ScrollView,
    View,
    ActivityIndicator,
    SafeAreaView,
    Dimensions,
    Text,
    Alert,
    Platform,
    Switch,
    AsyncStorage,
} from "react-native";
import { connect } from "react-redux";
import styled from "styled-components";
import {
    Title,
    LoginInput,
    Picker,
    SelectButton,
    AddJobText,
} from "../components/components";

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
                type: "UPDATE_NAME",
                name,
            }),
        updateClients: (clients) =>
            dispatch({
                type: "UPDATE_CLIENTS",
                clients,
            }),
    };
}

class Clients extends React.Component {
    state = {
        name: this.props.route.params.client.name,
        phoneNumber: this.props.route.params.client.phone,
        closingDate: this.props.route.params.client.closing_date,
        email: this.props.route.params.client.email,
        status: this.props.route.params.client.status,
        clientType: this.props.route.params.client.client_type,
        gci: this.props.route.params.client.gci,
        salesPrice: this.props.route.params.client.sales_price,
        commission: "",
        capped: this.props.route.params.client.capped == 1 ? true : false,
        address: this.props.route.params.client.address,
    };

    async refreshClients() {
        const token = await AsyncStorage.getItem("token");
        await fetch("https://homexe.win/client/get", {
            headers: new Headers({
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                this.props.updateClients(data);
            });
    }

    async updateClient() {
        const token = await AsyncStorage.getItem("token");

        const data = {
            clientId: this.props.route.params.client.uuid,
            name: this.state.name,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            status: this.state.status,
            clientType: this.state.clientType,
            salesPrice: this.state.salesPrice,
            address: this.state.address,
            closingDate: this.state.closingDate,
            capped: this.state.capped,
            gci: this.state.gci,
        };

        await fetch("https://homexe.win/api/client/update", {
            method: "PUT",
            headers: new Headers({
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
            body: JSON.stringify(data),
        })
            .then((response) => {
                this.refreshClients();
                this.props.navigation.goBack();
            })
            .catch((error) => {
                Alert.alert(error);
            });
    }

    render() {
        return (
            <SafeAreaView
                style={{
                    paddingHorizontal: 8,
                    backgroundColor: "#fff",
                    height: Dimensions.get("window").height,
                }}
            >
                <ScrollView
                    style={{ paddingHorizontal: 16 }}
                    contentContainerStyle={{ paddingBottom: 120 }}
                >
                    <View style={tailwind("mt-6 mb-4 flex-col")}>
                        <Title text={this.props.route.params.client.name} />
                    </View>

                    <View
                        style={{
                            width: "100%",
                            paddingBottom: 40,
                            backgroundColor: global.chartColor,
                            alignItems: "center",
                            paddingTop: 10,
                            borderRadius: 20,
                        }}
                    >
                        <LoginInput
                            style={{
                                backgroundColor: "#fff",
                            }}
                            value={this.state.name}
                            placeholder="NAME"
                            autoCapitalize="words"
                            fontWeight="bold"
                            autoCorrect={false}
                            placeholderTextColor="#11182750"
                            onChangeText={(val) => {
                                this.setState({ name: val });
                            }}
                        />
                        {/*<LoginInput
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
                        />*/}
                        <LoginInput
                            style={{
                                backgroundColor: "#fff",
                            }}
                            value={this.state.address}
                            placeholder="ADDRESS"
                            fontWeight="bold"
                            autoCorrect={false}
                            placeholderTextColor="#11182750"
                            onChangeText={(val) => {
                                this.setState({ address: val });
                            }}
                        />

                        <Picker
                            selectedValue={this.state.clientType}
                            onValueChange={(itemValue) =>
                                this.setState({ clientType: itemValue })
                            }
                        >
                            <Picker.Item
                                label="Select Client Type"
                                value="NONE"
                            />
                            <Picker.Item label="Listing" value="Listing" />
                            <Picker.Item label="Buyer" value="Buyer" />
                        </Picker>

                        <Picker
                            selectedValue={this.state.status}
                            onValueChange={(itemValue) =>
                                this.setState({ status: itemValue })
                            }
                        >
                            <Picker.Item label="Select Status" value="NONE" />
                            <Picker.Item label="Signed" value="Signed" />
                            <Picker.Item label="Contract" value="Contract" />
                            <Picker.Item label="Closed" value="Closed" />
                        </Picker>

                        {this.state.status == "Contract" ? (
                            <LoginInput
                                style={{
                                    backgroundColor: "#fff",
                                }}
                                value={this.state.closingDate}
                                placeholder="CLOSING DATE (MM/DD/YY)"
                                fontWeight="bold"
                                autoCorrect={false}
                                placeholderTextColor="#11182750"
                                onChangeText={(val) => {
                                    this.setState({ closingDate: val });
                                }}
                            />
                        ) : (
                            <View />
                        )}

                        <LoginInput
                            style={{
                                backgroundColor: "#fff",
                            }}
                            value={this.state.salesPrice}
                            keyboardType="numeric"
                            placeholder="SALES PRICE"
                            fontWeight="bold"
                            autoCorrect={false}
                            placeholderTextColor="#11182750"
                            onChangeText={(val) => {
                                this.setState({ salesPrice: val });
                            }}
                        />

                        <View
                            style={{
                                width: "85%",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                paddingVertical: 10,
                            }}
                        >
                            <Text
                                style={{
                                    paddingRight: 20,
                                    fontSize: 17,
                                    color: global.primaryColor,
                                    fontWeight: "bold",
                                }}
                            >
                                CAPPED?
                            </Text>

                            <Switch
                                trackColor={{
                                    false: "#767577",
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
                                // this.addClient();
                                this.updateClient();
                            }}
                            style={{
                                top: 20,
                                height: 40,
                                width: "90%",
                                alignSelf: "center",
                                marginLeft: 16,
                            }}
                        >
                            <SelectButton
                                style={{ backgroundColor: global.primaryColor }}
                            >
                                <AddJobText>Save</AddJobText>
                            </SelectButton>
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            height: 200,
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    ></View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Clients);
