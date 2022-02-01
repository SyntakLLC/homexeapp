import React from 'react';
import tailwind from 'tailwind-rn';
import { LineChart } from 'react-native-chart-kit';
import {
    TouchableOpacity,
    ScrollView,
    View,
    ActivityIndicator,
    SafeAreaView,
    Dimensions,
    Text,
    Image,
} from 'react-native';
import moment from 'moment';
import ActivityRings from 'react-native-activity-rings';
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

class Insights extends React.Component {
    state = {
        buyers: [],
        sellers: [],
    };

    returnListingVolume(statusFilter) {
        var filteredListings = this.props.clients.filter((listing) => {
            return listing.status == statusFilter;
        });

        if (filteredListings.length == 0) return 0;
        else
            return filteredListings
                .map((listing) => {
                    return parseInt(listing.gci);
                })
                .reduce((accumulator, curr) => accumulator + curr);
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
                    <View style={tailwind('mt-6  flex-col')}>
                        <Title text='Insights' />
                    </View>

                    <GroupDetailCard
                        first={
                            <InfoBubble
                                text='Closed Volume'
                                value={
                                    (this.returnListingVolume('Closed') /
                                        4000000) *
                                    100
                                }
                                actualValue={
                                    '$' +
                                    this.numberWithCommas(
                                        this.returnListingVolume('Closed'),
                                    )
                                }
                            />
                        }
                        second={
                            <InfoBubble
                                text='Contracts'
                                value={(this.props.clients.length / 50) * 100}
                                actualValue={this.props.clients.length}
                            />
                        }
                        third={
                            <InfoBubble
                                text='Contract Volume'
                                value={(
                                    (this.returnListingVolume('Contract') /
                                        5000000) *
                                    100
                                ).toFixed(2)}
                                actualValue={
                                    '$' +
                                    this.numberWithCommas(
                                        this.returnListingVolume('Contract'),
                                    )
                                }
                            />
                        }
                        content={
                            <View>
                                <RowView
                                    first={
                                        <StatisticsBar
                                            text='Buyers Signed'
                                            value={
                                                this.state.buyers.filter(
                                                    (buyer) => {
                                                        return (
                                                            buyer.status ==
                                                            'Signed'
                                                        );
                                                    },
                                                ).length
                                            }
                                            max={100}
                                        />
                                    }
                                    second={
                                        <StatisticsBar
                                            text='Listings Signed'
                                            value={
                                                this.state.sellers.filter(
                                                    (seller) => {
                                                        return (
                                                            seller.status ==
                                                            'Signed'
                                                        );
                                                    },
                                                ).length
                                            }
                                            max={250}
                                        />
                                    }
                                />
                                <RowView
                                    first={
                                        <StatisticsBar
                                            text='Buyers Under Contract'
                                            value={
                                                this.state.buyers.filter(
                                                    (buyer) => {
                                                        return (
                                                            buyer.status ==
                                                            'Contract'
                                                        );
                                                    },
                                                ).length
                                            }
                                            max={250}
                                        />
                                    }
                                    second={
                                        <StatisticsBar
                                            text='Listings Under Contract'
                                            value={
                                                this.state.sellers.filter(
                                                    (seller) => {
                                                        return (
                                                            seller.status ==
                                                            'Contract'
                                                        );
                                                    },
                                                ).length
                                            }
                                            max={250}
                                        />
                                    }
                                />
                                <RowView
                                    first={
                                        <StatisticsBar
                                            text='Buyers Closed'
                                            value={
                                                this.state.buyers.filter(
                                                    (buyer) => {
                                                        return (
                                                            buyer.status ==
                                                            'Closed'
                                                        );
                                                    },
                                                ).length
                                            }
                                            max={250}
                                        />
                                    }
                                    second={
                                        <StatisticsBar
                                            text='Listings Closed'
                                            value={
                                                this.state.sellers.filter(
                                                    (seller) => {
                                                        return (
                                                            seller.status ==
                                                            'Closed'
                                                        );
                                                    },
                                                ).length
                                            }
                                            max={250}
                                        />
                                    }
                                />
                            </View>
                        }
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Insights);

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

const GroupDetailCard = (item) => (
    <View
        style={{
            width: '100%',
            minHeight: 140,
            backgroundColor: global.chartColor,
            borderRadius: 25,
            padding: 15,
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                transform: [{ scale: 0.8 }],
            }}
        >
            {item.first}
            {item.second}
            {item.third}
        </View>

        {item.content}
    </View>
);

const InfoBubble = (item) => (
    <View
        style={{
            alignItems: 'center',
            margin: 4,
        }}
    >
        <SmallestTitle text={item.text} />
        <ActivityRings
            data={[
                {
                    value: (item.value / 100).clamp(0.01, 1),
                    color:
                        (item.value / 100).clamp(0.01, 1) > 0.5
                            ? global.greenColor
                            : global.redColor,
                },
            ]}
            config={{
                width: 100,
                height: 100,
                ringSize: 8,
            }}
        />
        <SmallestTitle text={item.actualValue} />
    </View>
);
const SingleDetailCard = (item) => (
    <View
        style={{
            width: 160,
            height: 160,
            backgroundColor: global.chartColor,
            borderRadius: 25,
            padding: 15,
            marginTop: 20,
        }}
    >
        <View style={{ alignItems: 'center' }}>
            <SmallerTitle text={item.text} />
            <View>{item.content}</View>
        </View>
    </View>
);

const StatisticsBar = (item) => (
    <View
        style={{ width: '50%', marginBottom: 10, transform: [{ scale: 0.8 }] }}
    >
        <SmallestTitle text={item.text} />
        <View
            style={{
                height: 10,
            }}
        />
        {/*<View
            style={{
                width: '100%',
                height: 15,
                backgroundColor: '#fff',
                borderRadius: 8,
            }}
        >
            <View
                style={{
                    width: (item.value / item.max) * 100 + '%',
                    height: 15,
                    backgroundColor:
                        (item.value / item.max) * 100 < 25
                            ? global.redColor
                            : (item.value / item.max) * 100 > 75
                            ? global.greenColor
                            : global.primaryColor,
                    borderRadius: 8,
                }}
            />
        </View>*/}
        <Title text={item.value} />
    </View>
);
