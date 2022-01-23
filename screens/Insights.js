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
        try {
            this.setState({
                buyers: this.props.clients.filter((client) => {
                    return client.client_type == 'Buyer';
                }),
            }),
                this.setState({
                    sellers: this.props.clients.filter((client) => {
                        return client.client_type == 'Listing';
                    }),
                });
        } catch {}
    }

    returnListingVolume(statusFilter) {
        var filteredListings = this.props.listings.filter((listing) => {
            return listing.status == statusFilter;
        });

        if (filteredListings.length == 0) return 0;
        else
            return filteredListings
                .map((listing) => {
                    return listing.price;
                })
                .reduce((accumulator, curr) => accumulator + curr);
    }

    // returns the maximum income this user has had in the past year
    returnMaximumHistoricalIncome(howManyToCutOff) {
        let incomes = [
            this.returnExpectedIncome(11),
            this.returnExpectedIncome(10),
            this.returnExpectedIncome(9),
            this.returnExpectedIncome(8),
            this.returnExpectedIncome(7),
            this.returnExpectedIncome(6),
            this.returnExpectedIncome(5),
            this.returnExpectedIncome(4),
            this.returnExpectedIncome(3),
            this.returnExpectedIncome(2),
            this.returnExpectedIncome(1),
            this.returnExpectedIncome(0),
        ];
        return Math.max(...incomes.slice(howManyToCutOff));
    }
    // returns the number of days there was an element in the set
    returnNumberOfSetDays(set) {
        var datesArrays = [];
        set.forEach((item) => {
            datesArrays.push(moment(item.created_at).format('MM-DD-YYYY'));
        });
        return datesArrays.filter(this.onlyUnique).length;
    }

    // # of appointment with 100% signed contract
    returnNumberOfSignedContracts() {
        return this.props.appointments.filter(
            (appt) =>
                appt.odds_of_conversion === '1' &&
                appt.user_name == this.props.name,
        ).length;
    }

    // gives THIS USER'S the number of X made today
    returnSetOfToday(set) {
        return set.filter((item) => {
            return item.user_name === this.props.name && this.wasToday(item);
        }).length;
    }
    // gives THIS USER'S the number of X made today
    returnSetOfWeek(set) {
        return set.filter((item) => {
            return item.user_name === this.props.name && this.wasWeek(item);
        }).length;
    }
    // gives THIS USER'S the number of X made today
    returnSetOfMonth(set) {
        return set.filter((item) => {
            return item.user_name === this.props.name && this.wasMonth(item);
        }).length;
    }

    wasToday(item) {
        return moment(item.created_at).isSame(moment(), 'day');
    }

    wasWeek(item) {
        return moment(item.created_at).isSame(moment(), 'week');
    }

    wasMonth(item) {
        return moment(item.created_at).isSame(moment(), 'month');
    }

    // to draw the chart, we want to show the change in expected income over time.
    // so, we need to, for each month, show the expected income based on the prior months.
    returnExpectedIncome(month) {
        let expectedIncomeBasedOnCalls =
            ((this.returnDailyCallCount(month) * 260) / 900) * 5000;
        let expectedIncomeBasedOnAppts =
            ((this.returnDailyApptCount(month) * 52) / 10) * 5000;
        let expectedIncome =
            expectedIncomeBasedOnCalls + expectedIncomeBasedOnAppts;
        return expectedIncome <= 0 ? 0 : expectedIncome;
    }

    // calculates the user's average daily call count
    returnDailyCallCount(month) {
        let now = moment().subtract(month, 'months');

        let your_date = moment('2021-11-28');
        let num_of_days = now.diff(your_date, 'days') + 1;

        try {
            return Math.abs(
                this.props.calls.filter((call) => {
                    return (
                        call.user_name === this.props.name &&
                        moment(call.created_at).isBefore(now)
                    );
                }).length / num_of_days,
            );
        } catch {
            return Math.abs(this.props.calls.length / num_of_days);
        }
    }

    // calculates the user's average daily appointment count
    returnDailyApptCount(month, user) {
        let now = moment().subtract(month, 'months');
        let your_date = moment('2021-10-05');
        let num_of_days = now.diff(your_date, 'days') + 1;

        try {
            return Math.abs(
                this.props.appointments.filter((appt) => {
                    return (
                        appt.user_name === user.name &&
                        moment(appt.created_at).isBefore(now)
                    );
                }).length / num_of_days,
            );
        } catch {
            return Math.abs(this.props.appointments.length / num_of_days);
        }
    }

    // shifts the month list so the current month is first
    returnMonthList() {
        var months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];

        let now = moment().format('MMMM');
        let n = months.indexOf(now.toString()) + 2;
        months = this.arrayRotate(months, false, n);

        return months;
    }

    // divides the calls by appointments, and if there are no appointments, returns 0
    returnConversionRate() {
        let usersCalls = this.props.calls.filter(
            (call) => call.user_name === this.props.name,
        ).length;
        let usersAppts = this.props.appointments.filter(
            (appt) => appt.user_name === this.props.name,
        ).length;
        if (usersAppts === 0) return 0;

        var conversionRate = usersCalls / usersAppts;
        if (this.props.appointments.length === 0) {
            conversionRate = 0;
        }

        return this.numberWithCommas(conversionRate.toFixed(2));
    }

    // rotates an array n times
    arrayRotate(arr, reverse, n) {
        if (reverse) {
            for (let i = 0; i < n; i++) {
                arr.unshift(arr.pop());
            }
        } else {
            for (let i = 0; i < n; i++) {
                arr.push(arr.shift());
            }
        }
        return arr;
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
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

                    <View
                        style={{
                            width: '100%',
                            alignItems: 'center',
                        }}
                    >
                        <SmallerTitle
                            style={{
                                color: global.secondaryColor,
                            }}
                            text='Your Money'
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
                                            this.numberWithCommas(
                                                this.returnExpectedIncome(
                                                    0,
                                                ).toFixed(2),
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
                                            this.numberWithCommas(
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
                            }}
                        >
                            <View
                                style={{
                                    width:
                                        100 *
                                            (this.returnExpectedIncome(-2) /
                                                540000) +
                                        '%',
                                    height: 15,
                                    backgroundColor: global.primaryColor,
                                    borderRadius: 8,
                                }}
                            />
                        </View>
                    </View>

                    <GroupDetailCard
                        first={
                            <InfoBubble
                                text='Closed Volume'
                                value={
                                    (this.returnListingVolume('Sold') /
                                        4000000) *
                                    100
                                }
                                actualValue={this.numberWithCommas(
                                    this.returnListingVolume('Sold').toFixed(2),
                                )}
                            />
                        }
                        second={
                            <InfoBubble
                                text='Contacts'
                                value={(this.props.clients.length / 50) * 100}
                                actualValue={this.props.clients.length}
                            />
                        }
                        third={
                            <InfoBubble
                                text='Contract Volume'
                                value={(
                                    (this.returnListingVolume('Pending') /
                                        5000000) *
                                    100
                                ).toFixed(2)}
                                actualValue={this.numberWithCommas(
                                    this.returnListingVolume('Pending').toFixed(
                                        2,
                                    ),
                                )}
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
        <SmallestTitle text={item.text + ': ' + item.value + '/' + item.max} />
        <View
            style={{
                height: 10,
            }}
        />
        <View
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
        </View>
    </View>
);
