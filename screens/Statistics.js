import React from 'react';
import tailwind from 'tailwind-rn';
import LineChart from '../components/LineChart';
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
    return { name: state.name };
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

class Statistics extends React.Component {
    state = {
        calls: [],
        appointments: [],
    };

    async componentDidMount() {
        try {
            await fetch('https://homexe.win/call/get')
                .then((response) => response.json())
                .then((data) =>
                    this.setState({
                        calls: data.filter((item) => {
                            return item.user_name == this.props.name;
                        }),
                    }),
                );

            await fetch('https://homexe.win/appointment/get')
                .then((response) => response.json())
                .then((data) =>
                    this.setState({
                        appointments: data.filter((item) => {
                            return item.user_name == this.props.name;
                        }),
                    }),
                );
        } catch {}
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
        return this.state.appointments.filter(
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
                this.state.calls.filter((call) => {
                    return (
                        call.user_name === this.props.name &&
                        moment(call.created_at).isBefore(now)
                    );
                }).length / num_of_days,
            );
        } catch {
            return Math.abs(this.state.calls.length / num_of_days);
        }
    }

    // calculates the user's average daily appointment count
    returnDailyApptCount(month, user) {
        let now = moment().subtract(month, 'months');
        let your_date = moment('2021-10-05');
        let num_of_days = now.diff(your_date, 'days') + 1;

        try {
            return Math.abs(
                this.state.appointments.filter((appt) => {
                    return (
                        appt.user_name === user.name &&
                        moment(appt.created_at).isBefore(now)
                    );
                }).length / num_of_days,
            );
        } catch {
            return Math.abs(this.state.appointments.length / num_of_days);
        }
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // divides the calls by appointments, and if there are no appointments, returns 0
    returnConversionRate() {
        let usersCalls = this.state.calls.filter(
            (call) => call.user_name === this.props.name,
        ).length;
        let usersAppts = this.state.appointments.filter(
            (appt) => appt.user_name === this.props.name,
        ).length;
        if (usersAppts === 0) return 0;

        var conversionRate = usersCalls / usersAppts;
        if (this.state.appointments.length === 0) {
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
                        <Title text='Statistics' />
                    </View>

                    <LineChart />

                    <DetailCard
                        first={
                            <InfoBubble
                                text='Calls This Week'
                                value={this.returnSetOfWeek(this.state.calls)}
                            />
                        }
                        second={
                            <InfoBubble
                                text='Calls This Month'
                                value={this.returnSetOfMonth(this.state.calls)}
                            />
                        }
                        third={
                            <InfoBubble
                                text='Avg Daily Calls'
                                value={this.numberWithCommas(
                                    this.returnDailyCallCount(0).toFixed(2),
                                )}
                            />
                        }
                    />

                    <DetailCard
                        first={
                            <InfoBubble
                                text='Appts Today'
                                value={this.returnSetOfToday(
                                    this.state.appointments,
                                )}
                            />
                        }
                        second={
                            <InfoBubble
                                text='Appts This Month'
                                value={this.returnSetOfMonth(
                                    this.state.appointments,
                                )}
                            />
                        }
                        third={
                            <InfoBubble
                                text='Conversion Rate'
                                value={this.returnConversionRate()}
                            />
                        }
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);

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
            backgroundColor: global.grayColor,
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
            }}
        />
        <SmallestTitle text={item.value} />
    </View>
);
