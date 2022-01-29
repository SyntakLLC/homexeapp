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
                                    ? 'Capped: Yes'
                                    : 'Capped: No';

                            Alert.alert(
                                client.name,
                                address +
                                    salesPrice +
                                    closingDate +
                                    status +
                                    commission +
                                    capped,
                            );
                        }}
                    >
                        <DetailCard
                            key={client.name}
                            name={client.name}
                            clientType={client.client_type}
                            gci={client.gci}
                            email={client.email}
                            status={client.status}
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
                                                (540000.0).toFixed(2),
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
                                                540000) +
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
                                                540000) +
                                        '%',
                                    height: 15,
                                    backgroundColor: global.greenColor + '70',
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
                                                540000) +
                                        '%',
                                    height: 15,
                                    backgroundColor: global.redColor + '70',
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
                        backgroundColor: '#fff',
                        width: 50,
                        height: 50,
                    }}
                >
                    <ClientSymbol />
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
                        <SmallestTitle text={item.name} />

                        <SecondaryTitle text={item.clientType} />

                        <SmallestTitle
                            text={'$' + numberWithCommas(item.gci)}
                        />
                    </View>

                    <View
                        style={{
                            marginHorizontal: 30,
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
                            width: 30,
                            height: 30,
                        }}
                    >
                        <Text style={{ color: 'white' }}>
                            {item.status == 'Signed'
                                ? 'S'
                                : item.status == 'Closed'
                                ? 'Cl'
                                : 'Co'}
                        </Text>
                    </View>
                </View>
            }
        />
    </View>
);

const LabelGroup = (item) => (
    <View>
        <Text
            style={tailwind('text-xs font-medium uppercase text-gray-500 mb-1')}
        >
            {item.label}
        </Text>
        <Text style={tailwind('text-xl text-gray-700 mb-5')}>{item.text}</Text>
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
