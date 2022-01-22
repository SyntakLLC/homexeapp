import React from 'react';
import tailwind from 'tailwind-rn';
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
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment';
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

class LineChartComponent extends React.Component {
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

    renderDashboardData() {
        var dashboardData = [];

        if (this.state.calls.length == 0) {
            dashboardData.push(
                <View
                    style={{
                        height: 253,
                        width: '100%',
                        alignSelf: 'center',
                        backgroundColor: global.chartColor,
                        borderRadius: 25,
                    }}
                >
                    <ActivityIndicator
                        color={global.primaryColor}
                        style={{
                            height: 253,
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
                            labels: this.returnMonthList(),
                            legend: [
                                'Estimated Income: ' +
                                    this.numberWithCommas(
                                        this.returnExpectedIncome(0).toFixed(2),
                                    ),
                            ],
                            datasets: [
                                {
                                    data: [
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
                                    ],
                                },
                            ],
                        }}
                        width={Dimensions.get('window').width - 30} // from react-native
                        height={220}
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

    render() {
        return <View>{this.renderDashboardData()}</View>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LineChartComponent);
