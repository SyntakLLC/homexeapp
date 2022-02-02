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
import { connect } from 'react-redux';
import {
    Title,
    GroupDetailCard,
    RowView,
    InfoBubble,
    StatisticsBar,
} from '../components/components';

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

    componentDidMount() {
        this.setState({
            buyers: this.props.clients.filter((client) => {
                return client.client_type == 'Buyer';
            }),
        });
        this.setState({
            sellers: this.props.clients.filter((client) => {
                return client.client_type == 'Listing';
            }),
        });
    }

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
                                    global.numberWithCommas(
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
                                    global.numberWithCommas(
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
