import React from 'react';
import tailwind from 'tailwind-rn';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
    TouchableOpacity,
    ScrollView,
    View,
    ActivityIndicator,
    SafeAreaView,
    Dimensions,
    Text,
    Alert,
} from 'react-native';

Number.prototype.clamp = function (min, max) {
    return this <= min ? min : this >= max ? max : this;
};

export default class Statistics extends React.Component {
    state = {
        appointments: [],
        description: 'Loading...',
        buyerOrSeller: 'Buyer',
        propertyPrice: 430000,
        commissionPercentage: 2.0,
        commissionCash: 8600,
        commissionCapped: 4300,
        commissionNotCapped: 3440,
        commissionToBroker: 860,
    };

    componentDidMount() {
        fetch('https://homexe.win/appointment/get')
            .then((response) => response.json())
            .then((data) => this.setState({ appointments: data }));
    }

    renderApptList() {
        var apptList = [];

        apptList.push(
            <ActivityIndicator
                style={tailwind('pb-4 w-40 h-40 self-center')}
            />,
        );

        for (let i = 0; i < this.state.appointments.length; i++) {
            apptList.push(
                <TouchableOpacity
                    onPress={() => {
                        let appointment = this.state.appointments[i];

                        this.setState({ description: appointment.description });
                        this.setState({
                            buyerOrSeller:
                                appointment.seller_actually_selling == null
                                    ? 'Buyer'
                                    : 'Seller',
                        });
                        this.setState({
                            propertyPrice: parseInt(appointment.mls_price),
                        });
                        this.setState({ commissionPercentage: 2 });
                        this.setState({
                            commissionCash: (2 / 100) * appointment.mls_price,
                        });
                        this.setState({
                            commissionCapped:
                                (2 / 100) * appointment.mls_price * 0.5,
                        });
                        this.setState({
                            commissionNotCapped:
                                (2 / 100) * appointment.mls_price * 0.5 * 0.8,
                        });
                        this.setState({
                            commissionToBroker:
                                (2 / 100) * appointment.mls_price * 0.5 * 0.2,
                        });

                        if (
                            appointment.seller_actually_selling == null &&
                            appointment.buyer_serious_about_buying == null
                        ) {
                            Alert.alert(
                                null,
                                'This appointment has not been filled out yet. Please go online to do so.',
                            );
                        } else {
                            this.RBSheet.open();
                        }
                    }}
                >
                    <DetailCard
                        address={
                            this.state.appointments[i].location == ''
                                ? this.state.appointments[i].title
                                : this.state.appointments[i].location
                        }
                        price={
                            this.state.appointments[i].mls_price == null
                                ? 'Price Unknown'
                                : '$' +
                                  this.numberWithCommas(
                                      this.state.appointments[i].mls_price,
                                  )
                        }
                        status={
                            this.state.appointments[i].odds_of_conversion ==
                            null
                                ? 'Active'
                                : this.state.appointments[i]
                                      .odds_of_conversion == 5
                                ? 'Sold'
                                : this.state.appointments[i]
                                      .odds_of_conversion +
                                  '/5 odds of conversion'
                        }
                    />
                </TouchableOpacity>,
            );
        }

        if (apptList.length > 1) {
            apptList.shift();
        }

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
                        <Title text='Appointments' />
                    </View>

                    {this.renderApptList()}

                    <RBSheet
                        ref={(ref) => {
                            this.RBSheet = ref;
                        }}
                        height={350}
                        openDuration={250}
                        customStyles={{
                            container: {
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                backgroundColor: '#F9FAFB',
                            },
                        }}
                    >
                        <View style={tailwind('w-full')}>
                            <View style={tailwind('px-4 py-5')}>
                                <Text
                                    style={tailwind(
                                        'text-2xl font-medium text-gray-900',
                                    )}
                                >
                                    {this.state.buyerOrSeller}
                                </Text>
                            </View>

                            <View
                                style={tailwind('px-4 mt-2 bg-gray-50 h-full')}
                            >
                                <LabelGroup
                                    label='description'
                                    text={this.state.description}
                                />

                                <LabelGroup
                                    label='property price'
                                    text={
                                        '$' +
                                        this.numberWithCommas(
                                            this.state.propertyPrice,
                                        )
                                    }
                                />

                                {/* <LabelGroup label="commission percentage"
														text={this.state.commissionPercentage + "%"} /> */}

                                <LabelGroup
                                    label='commission'
                                    text={
                                        '$' +
                                        this.numberWithCommas(
                                            this.state.commissionCash,
                                        )
                                    }
                                />

                                {/* <LabelGroup label="capped"
														text={"$" + this.numberWithCommas(this.state.commissionCapped)} />
					
													<LabelGroup label="not capped"
														text={"$" + this.numberWithCommas(this.state.commissionNotCapped)} />
					
													<LabelGroup label="broker commission"
														text={"$" + this.numberWithCommas(this.state.commissionToBroker)} /> */}
                            </View>
                        </View>
                    </RBSheet>
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

const AdaptiveTitle = (item) => (
    <Text
        style={{
            color: item.text == 'Sold' ? global.greenColor : global.redColor,
            fontWeight: 'bold',
            fontSize: 25,
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
            height: 140,
            backgroundColor: global.chartColor,
            borderRadius: 25,
            padding: 15,
            marginTop: 20,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
        }}
    >
        <View
            style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignContent: 'space-between',
            }}
        >
            <View>
                <SmallestTitle text={item.address} />
                <Title text={item.price} />
            </View>
            <AdaptiveTitle text={item.status} />
        </View>
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
