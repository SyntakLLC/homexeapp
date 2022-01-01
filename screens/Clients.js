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
    Linking,
    Platform,
} from 'react-native';

Number.prototype.clamp = function (min, max) {
    return this <= min ? min : this >= max ? max : this;
};

export default class Clients extends React.Component {
    state = {
        clients: [],
        phonePrefix: '',
        filter: 'All',
    };

    componentDidMount() {
        fetch('https://homexe.win/client/get')
            .then((response) => response.json())
            .then((data) => this.setState({ clients: data }));

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

        for (let i = 0; i < this.state.clients.length; i++) {
            let client = this.state.clients[i];
            if (
                client.status == this.state.filter ||
                this.state.filter == 'All'
            ) {
                apptList.push(
                    <DetailCard
                        name={client.name}
                        clientType={client.client_type}
                        gci={client.gci}
                        email={client.email}
                        phone={client.phone}
                    />,
                );
            }
        }

        // if (apptList.length > 1) {
        apptList.shift();
        // }

        return <View>{apptList}</View>;
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
                        <Title text='Clients' />
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

                        <SmallestTitle text={'GCI: ' + item.gci + '%'} />
                    </View>

                    <RowView
                        first={
                            <TouchableOpacity
                                onPress={() =>
                                    Linking.openURL('mailto:' + item.email)
                                }
                                style={{
                                    marginHorizontal: 10,
                                    padding: 5,
                                    borderRadius: 30,
                                    alignItems: 'center',
                                    backgroundColor: global.primaryColor,
                                    width: 30,
                                    height: 30,
                                }}
                            >
                                <EmailSymbol />
                            </TouchableOpacity>
                        }
                        second={
                            <TouchableOpacity
                                onPress={() =>
                                    Linking.openURL(
                                        this.state.phonePrefix + item.phone,
                                    )
                                }
                                style={{
                                    padding: 5,
                                    borderRadius: 30,
                                    alignItems: 'center',
                                    backgroundColor: global.primaryColor,
                                    width: 30,
                                    height: 30,
                                }}
                            >
                                <PhoneSymbol />
                            </TouchableOpacity>
                        }
                    />
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
