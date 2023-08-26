import React from "react";
import tailwind from "tailwind-rn";
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
} from "react-native";
import { connect } from "react-redux";
import {
    Title,
    LoginInput,
    Picker,
    AddJobText,
    SelectButton,
    Subtitle,
} from "../components/components";
import styled from "styled-components";

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

class Plus extends React.Component {
    state = {
        name: "",
        phoneNumber: "",
        closingDate: "",
        email: "",
        status: "Select Status",
        clientType: "Select Client Type",
        employee: "Select Employee",
        gci: 0,
        salesPrice: 0,
        commission: 0,
        capped: false,
        address: "",
        closingDateAvailable: false,
    };

    async addClient() {
        if (!this.state.closingDateAvailable) {
            this.state.closingDate = "TBD";
        }

        if (this.state.name == "") {
            Alert.alert("Hold on!", "Please fill out the client's name");
            return null;
        } else if (this.state.address == "") {
            Alert.alert("Hold on!", "Please fill out the client's address");
            return null;
        } else if (this.state.clientType == "Select Client Type") {
            Alert.alert("Hold on!", "Please fill out the client type");
            return null;
        } else if (this.state.status == "Select Status") {
            Alert.alert("Hold on!", "Please fill out the client's status");
            return null;
        } else if (
            this.state.status == "Contract" &&
            this.state.closingDate == ""
        ) {
            Alert.alert("Hold on!", "Please fill out the closing date");
            return null;
        } else if (this.state.salesPrice == 0) {
            Alert.alert("Hold on!", "Please fill out the sales price");
            return null;
        } else if (this.state.commission == 0 && this.state.salesPrice == 0) {
            Alert.alert("Hold on!", "Please fill out the commission");
            return null;
        } else {
            const token = await AsyncStorage.getItem("token");
            const name = await AsyncStorage.getItem("name");

            const headers = {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
            };

            let cappedMultiplier = this.state.capped ? 1 : 0.8;

            var gci = (gci =
                this.state.salesPrice *
                (this.state.commission / 100) *
                0.55 *
                cappedMultiplier);

            if (this.state.clientType == "Mass Offer Acquisition") {
                gci = 4500;
            }

            if (this.state.clientType == "Listing Handoff") {
                gci = 1500;
            }

            const data = {
                name: this.state.name,
                phoneNumber: "",
                email: "",
                status: this.state.status,
                clientType: this.state.clientType,
                user_name:
                    this.state.employee == "Select Employee"
                        ? name
                        : this.state.employee,
                salesPrice: this.state.salesPrice,
                address: this.state.address,
                closingDate: this.state.closingDate,
                capped: this.state.capped,
                gci: gci,
            };

            await fetch("https://homexe.win/api/client/create", {
                method: "POST",
                headers: new Headers({
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                }),
                body: JSON.stringify(data),
            })
                .then((response) => {
                    Alert.alert("Success");

                    this.setState({ name: "" });
                    this.setState({ phoneNumber: "" });
                    this.setState({ email: "" });
                    this.setState({ status: "Select Status" });
                    this.setState({ client_type: "Select Client Type" });
                    this.setState({ employee: "Select Employee" });
                    this.setState({ gci: 0 });
                    this.setState({ salesPrice: 0 });
                    this.setState({ address: 0 });
                    this.setState({ commission: 0 });

                    this.refreshClients();
                })
                .catch((error) => {
                    Alert.alert(error);
                });
        }
    }

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

    returnListOfUsers() {
        var users = [];
        users.push(<Picker.Item label="Select Employee" value="NONE" />);
        var testData = [
            "Tyler Scaglione",
            "Christian Molina",
            "David Tran",
            "Jamie Dodd",
        ];

        for (let i = 0; i < testData.length; i++) {
            users.push(<Picker.Item label={testData[i]} value={testData[i]} />);
        }

        return users;
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
                        <Title text="Add Client" />
                    </View>

                    <FormSection
                        style={{
                            backgroundColor: global.chartColor,
                        }}
                    >
                        <FormHeader
                            style={{
                                color: global.primaryColor,
                            }}
                        >
                            Details
                        </FormHeader>

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
                    </FormSection>

                    <FormSection
                        style={{
                            backgroundColor: global.chartColor,
                        }}
                    >
                        <FormHeader
                            style={{
                                color: global.primaryColor,
                            }}
                        >
                            Tags
                        </FormHeader>

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
                            <Picker.Item
                                label="Mass Offer Acquisition"
                                value="Mass Offer Acquisition"
                            />
                            <Picker.Item
                                label="Listing Handoff"
                                value="Listing Handoff"
                            />
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

                        <Picker
                            selectedValue={this.state.employee}
                            onValueChange={(itemValue) =>
                                this.setState({ employee: itemValue })
                            }
                        >
                            {this.returnListOfUsers()}
                        </Picker>
                    </FormSection>

                    <FormSection
                        style={{
                            backgroundColor: global.chartColor,
                        }}
                    >
                        <FormHeader
                            style={{
                                color: global.primaryColor,
                            }}
                        >
                            Commission
                        </FormHeader>
                        <LoginInput
                            style={{
                                backgroundColor: "#fff",
                            }}
                            value={this.state.salesPrice}
                            keyboardType="numeric"
                            placeholder={
                                this.state.clientType ==
                                "Mass Offer Acquisition"
                                    ? "PURCHASE PRICE"
                                    : "SALES PRICE"
                            }
                            fontWeight="bold"
                            autoCorrect={false}
                            placeholderTextColor="#11182750"
                            onChangeText={(val) => {
                                this.setState({ salesPrice: val });
                            }}
                        />

                        {this.state.clientType != "Mass Offer Acquisition" &&
                        this.state.clientType !== "Listing Handoff" ? (
                            <LoginInput
                                style={{
                                    backgroundColor: "#fff",
                                }}
                                value={this.state.commission}
                                keyboardType="numeric"
                                placeholder="COMMISSION % (i.e. 20)"
                                fontWeight="bold"
                                autoCorrect={false}
                                placeholderTextColor="#11182750"
                                onChangeText={(val) => {
                                    this.setState({ commission: val });
                                }}
                            />
                        ) : (
                            <View />
                        )}

                        {this.state.clientType != "Mass Offer Acquisition" &&
                        this.state.clientType !== "Listing Handoff" ? (
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
                        ) : (
                            <View />
                        )}

                        <View
                            style={{
                                width: "85%",
                                paddingVertical: 10,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
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
                                    CLOSING DATE AVAILABLE
                                </Text>

                                <Switch
                                    trackColor={{
                                        false: "#767577",
                                        true: global.primaryColor,
                                    }}
                                    onValueChange={(val) =>
                                        this.setState({
                                            closingDateAvailable: val,
                                        })
                                    }
                                    value={this.state.closingDateAvailable}
                                />
                            </View>

                            <Text
                                style={{
                                    maxWidth: "80%",
                                    paddingRight: 20,
                                    fontSize: 12,
                                    color: global.primaryColor,
                                    fontWeight: "normal",
                                }}
                            >
                                Leave this off if you want your closing date to
                                be TBD
                            </Text>
                        </View>

                        {this.state.closingDateAvailable ? (
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

                        <TouchableOpacity
                            onPress={() => {
                                this.addClient();
                            }}
                            style={{
                                marginTop: 20,
                                marginBottom: 10,
                                height: 40,
                                width: "90%",
                                alignSelf: "center",
                                marginLeft: 16,
                            }}
                        >
                            <SelectButton
                                style={{ backgroundColor: global.primaryColor }}
                            >
                                <AddJobText>Add Client</AddJobText>
                            </SelectButton>
                        </TouchableOpacity>
                    </FormSection>

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

export default connect(mapStateToProps, mapDispatchToProps)(Plus);

const FormSection = styled.View`
    width: 100%;
    align-items: center;
    margin-bottom: 20px;
    padding-vertical: 10px;
    border-radius: 20px;
`;

const FormHeader = styled.Text`
    font-weight: 700;
    font-size: 20px;
    padding-vertical: 5px;
`;
