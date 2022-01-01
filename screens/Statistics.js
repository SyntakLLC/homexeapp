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

    componentDidMount() {
        try {
            fetch('https://homexe.win/call/get')
                .then((response) => response.json())
                .then((data) => this.setState({ calls: data }));

            fetch('https://homexe.win/appointment/get')
                .then((response) => response.json())
                .then((data) => this.setState({ appointments: data }));
        } catch {}
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
        let your_date = moment('2021-10-05');
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
                        appt.user_name === this.props.name &&
                        moment(appt.created_at).isBefore(now)
                    );
                }).length / num_of_days,
            );
        } catch {
            return Math.abs(this.state.appointments.length / num_of_days);
        }
    }

    // shifts the month list so the current month is first
    returnMonthList() {
        var months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        let now = moment().format('MMMM');
        let n = months.indexOf(now.toString()) + 1;
        months = this.arrayRotate(months, false, n);

        return months;
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

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    renderDashboardData() {
        var dashboardData = [];

        if (this.state.calls.length == 0) {
            dashboardData.push(
                <View
                    style={{
                        height: 345,
                        width: '100%',
                        alignSelf: 'center',
                        backgroundColor: global.chartColor,
                        borderRadius: 25,
                    }}
                >
                    <ActivityIndicator
                        color={global.primaryColor}
                        style={{
                            height: 345,
                            width: '100%',
                            alignSelf: 'center',
                        }}
                    />
                </View>,
            );
        } else {
            dashboardData.push(
                <View>
                    <LineChart
                        data={{
                            labels: [
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
                            ],
                            legend: [
                                'Estimated Income: ' +
                                    this.numberWithCommas(
                                        this.returnExpectedIncome(-2).toFixed(
                                            2,
                                        ),
                                    ),
                            ],
                            datasets: [
                                {
                                    data: [
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
                                        this.returnExpectedIncome(-1),
                                        this.returnExpectedIncome(-2),
                                    ],
                                },
                            ],
                        }}
                        width={Dimensions.get('window').width - 30} // from react-native
                        height={300}
                        yAxisLabel='$'
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                            backgroundColor: global.chartColor,
                            backgroundGradientFrom: global.chartColor,
                            backgroundGradientTo: global.chartColor,
                            decimalPlaces: 2, // optional, defaults to 2dp
                            color: (opacity = 1) =>
                                `rgba(29, 79, 202, ${opacity})`,
                            labelColor: (opacity = 1) =>
                                `rgba(29, 79, 202, ${opacity})`,
                            style: {
                                borderRadius: 25,
                            },
                            propsForDots: {
                                r: '6',
                                strokeWidth: '2',
                                stroke: global.grayColor,
                            },
                        }}
                        bezier
                        style={{
                            borderRadius: 25,
                        }}
                    />
                </View>,
            );
        }

        return <View>{dashboardData}</View>;
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
                    {this.renderDashboardData()}
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
