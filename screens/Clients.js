import React from 'react';
import tailwind from 'tailwind-rn';
import { ClientSymbol, PhoneSymbol, EmailSymbol } from '../icons';
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
    AsyncStorage,
} from 'react-native';
import { connect } from 'react-redux';

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
    };
}

Number.prototype.clamp = function (min, max) {
    return this <= min ? min : this >= max ? max : this;
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

class Clients extends React.Component {
    state = {
        phonePrefix: '',
        filter: 'All',
    };

    componentDidMount() {
        if (Platform.OS !== 'android') {
            this.setState({ phonePrefix: 'telprompt:' });
        } else {
            this.setState({ phonePrefix: 'tel:' });
        }
    }

    getExpectedIncome() {
        return this.props.lineChartData[
            this.props.lineChartData.length - 1
        ].toFixed(2);
    }

    async updateClient(client) {
        const token = await AsyncStorage.getItem('token');

        const data = {
            clientId: client.uuid,
            name: 'JJ',
            phoneNumber: 'JJ',
            email: 'JJ',
            status: 'JJ',
            clientType: 'JJ',
            salesPrice: 'JJ',
            address: 'JJ',
            closingDate: 'JJ',
            capped: 1,
            gci: 200.0,
        };

        // console.log(data);

        await fetch('https://homexe.win/api/client/update', {
            method: 'PUT',
            headers: new Headers({
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }),
            body: JSON.stringify(data),
        })
            .then((response) => {
                // this.refreshClients();
            })
            .catch((error) => {
                Alert.alert(error);
            });
    }

    renderClientList() {
        var apptList = [];

        apptList.push(
            <ActivityIndicator
                style={tailwind('pb-4 w-40 h-40 self-center')}
            />,
        );

        if (this.props.clients.length == 0) {
            apptList.push(
                <View
                    style={{
                        marginTop: 30,
                        width: '100%',
                        alignItems: 'center',
                    }}
                >
                    <SmallestTitle text='You have no clients' />
                </View>,
            );
        }

        for (let i = 0; i < this.props.clients.length; i++) {
            let client = this.props.clients[i];
            if (
                client.status == this.state.filter ||
                this.state.filter == 'All'
            ) {
                apptList.push(
                    <TouchableOpacity
                        onPress={() => {
                            let address = 'Address: ' + client.address + '\n';
                            let salesPrice =
                                'Sales Price: $' +
                                numberWithCommas(client.sales_price) +
                                '\n';
                            let closingDate =
                                client.closing_date == null
                                    ? ''
                                    : 'Closing Date: ' +
                                      client.closing_date +
                                      '\n';
                            let status = 'Status: ' + client.status + '\n';
                            let commission =
                                'Commission: $' +
                                numberWithCommas(client.gci) +
                                '\n';
                            let capped =
                                client.capped == 1
                                    ? 'Capped: Yes\n'
                                    : 'Capped: No\n';
                            let userName = 'Agent: ' + client.user_name;

                            this.updateClient();

                            Alert.alert(
                                client.name,
                                address +
                                    salesPrice +
                                    closingDate +
                                    status +
                                    commission +
                                    capped +
                                    userName,
                            );
                        }}
                    >
                        <DetailCard
                            address={client.address}
                            key={client.name}
                            name={client.name}
                            clientType={client.client_type}
                            gci={client.gci}
                            email={client.email}
                            status={client.status}
                            agentName={client.user_name}
                            onPress={() => {
                                this.props.navigation.navigate('ClientShow', {
                                    client,
                                });
                            }}
                        />
                    </TouchableOpacity>,
                );
            }
        }

        // if (apptList.length > 1) {
        apptList.shift();
        // }

        return <View>{apptList}</View>;
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
                        <Title text='Clients' />
                    </View>

                    <View
                        style={{
                            width: '100%',
                            alignItems: 'center',
                            marginBottom: 20,
                        }}
                    >
                        <SmallerTitle
                            style={{
                                color: global.secondaryColor,
                            }}
                            text='Your Actual Income (so far)'
                        />

                        <View style={{ width: '100%' }}>
                            <RowView
                                first={
                                    <SmallerTitle
                                        style={{
                                            color: global.secondaryColor,
                                        }}
                                        text={
                                            '$' +
                                            numberWithCommas(
                                                this.props.clients
                                                    .reduce(function (a, b) {
                                                        return (
                                                            a + parseInt(b.gci)
                                                        );
                                                    }, 0)
                                                    .toFixed(2),
                                            )
                                        }
                                    />
                                }
                                second={
                                    <SmallerTitle
                                        style={{
                                            color: global.secondaryColor,
                                        }}
                                        text={
                                            '$' +
                                            numberWithCommas(
                                                this.getExpectedIncome(),
                                            )
                                        }
                                    />
                                }
                            />
                        </View>

                        <View
                            style={{
                                width: '100%',
                                height: 15,
                                marginTop: 10,
                                backgroundColor: global.secondaryColor + '50',
                                borderRadius: 8,
                                overflow: 'hidden',
                                flexDirection: 'row',
                            }}
                        >
                            <View
                                style={{
                                    width:
                                        100 *
                                            (this.props.clients
                                                .filter((client) => {
                                                    return (
                                                        client.status ==
                                                        'Signed'
                                                    );
                                                })
                                                .reduce(function (a, b) {
                                                    return a + parseInt(b.gci);
                                                }, 0) /
                                                this.getExpectedIncome()) +
                                        '%',
                                    height: 15,
                                    backgroundColor: global.primaryColor + '70',
                                }}
                            />

                            <View
                                style={{
                                    width:
                                        100 *
                                            (this.props.clients
                                                .filter((client) => {
                                                    return (
                                                        client.status ==
                                                        'Contract'
                                                    );
                                                })
                                                .reduce(function (a, b) {
                                                    return a + parseInt(b.gci);
                                                }, 0) /
                                                this.getExpectedIncome()) +
                                        '%',
                                    height: 15,
                                    backgroundColor: global.redColor + '70',
                                }}
                            />

                            <View
                                style={{
                                    width:
                                        100 *
                                            (this.props.clients
                                                .filter((client) => {
                                                    return (
                                                        client.status ==
                                                        'Closed'
                                                    );
                                                })
                                                .reduce(function (a, b) {
                                                    return a + parseInt(b.gci);
                                                }, 0) /
                                                this.getExpectedIncome()) +
                                        '%',
                                    height: 15,
                                    backgroundColor: global.greenColor + '70',
                                }}
                            />
                        </View>
                    </View>

                    <View
                        style={{
                            width: '100%',
                            backgroundColor: global.grayColor,
                            borderRadius: 10,
                            padding: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ filter: 'All' });
                                }}
                            >
                                <MenuTitle
                                    text='All'
                                    textDecoration={
                                        this.state.filter == 'All'
                                            ? 'underline'
                                            : 'none'
                                    }
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ filter: 'Signed' });
                                }}
                            >
                                <MenuTitle
                                    text='Signed'
                                    textDecoration={
                                        this.state.filter == 'Signed'
                                            ? 'underline'
                                            : 'none'
                                    }
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ filter: 'Contract' });
                                }}
                            >
                                <MenuTitle
                                    text='Contract'
                                    textDecoration={
                                        this.state.filter == 'Contract'
                                            ? 'underline'
                                            : 'none'
                                    }
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ filter: 'Closed' });
                                }}
                            >
                                <MenuTitle
                                    text='Closed'
                                    textDecoration={
                                        this.state.filter == 'Closed'
                                            ? 'underline'
                                            : 'none'
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {this.renderClientList()}
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Clients);

const RowView = (item) => (
    <View
        style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
        }}
    >
        {item.first}
        {item.second}
        {item.third}
        {item.fourth}
    </View>
);

const SmallestTitle = (item) => (
    <Text
        style={{
            color: global.primaryColor,
            fontWeight: 'bold',
            fontSize: 15,
        }}
    >
        {item.text}
    </Text>
);

const SecondaryTitle = (item) => (
    <Text
        style={{
            color: global.primaryColor,
            fontSize: 15,
        }}
    >
        {item.text}
    </Text>
);

const MenuTitle = (item) => (
    <Text
        style={{
            color: global.primaryColor,
            fontWeight: 'bold',
            paddingHorizontal: 5,
            fontSize: 15,
            textDecorationLine: item.textDecoration,
        }}
    >
        {item.text}
    </Text>
);

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

const Subtitle = (item) => (
    <Text
        style={{
            color: global.secondaryColor,
            fontWeight: 'bold',
            fontSize: 25,
        }}
    >
        {item.text}
    </Text>
);

const DetailCard = (item) => (
    <View
        style={{
            width: '100%',
            backgroundColor: global.grayColor,
            borderRadius: 10,
            padding: 15,
            marginTop: 20,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
        }}
    >
        <RowView
            first={
                <View
                    style={{
                        padding: 5,
                        borderRadius: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:
                            item.status == 'Signed'
                                ? global.primaryColor
                                : item.status == 'Closed'
                                ? global.greenColor
                                : global.redColor,
                        width: 50,
                        height: 50,
                    }}
                >
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}
                    >
                        {item.status == 'Signed'
                            ? 'S'
                            : item.status == 'Closed'
                            ? 'Cl'
                            : 'Co'}
                    </Text>
                </View>
            }
            second={
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        maxWidth: '77%',
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            paddingLeft: 10,
                            width: '77%',
                        }}
                    >
                        <Text
                            numberOfLines={1}
                            style={{
                                color: global.primaryColor,
                                fontWeight: 'bold',
                                fontSize: 15,
                            }}
                        >
                            {item.address}
                        </Text>

                        <SecondaryTitle
                            text={item.name + ' • ' + item.clientType}
                        />

                        <Text
                            numberOfLines={1}
                            style={{
                                color: global.primaryColor,
                                fontWeight: 'bold',
                                fontSize: 15,
                            }}
                        >
                            {'$' +
                                numberWithCommas(item.gci) +
                                ' • ' +
                                item.agentName}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={{
                            marginHorizontal: 30,
                            padding: 15,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 20,
                        }}
                        onPress={item.onPress}
                    >
                        <Text
                            style={{
                                color: global.primaryColor,
                                fontWeight: 'bold',
                            }}
                        >
                            Edit
                        </Text>
                    </TouchableOpacity>
                </View>
            }
        />
    </View>
);

const SmallerTitle = (item) => (
    <Text
        style={{
            color: global.primaryColor,
            fontWeight: 'bold',
            fontSize: 15,
        }}
    >
        {item.text}
    </Text>
);
