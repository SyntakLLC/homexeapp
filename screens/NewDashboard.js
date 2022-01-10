import React from 'react';
import tailwind from 'tailwind-rn';
import { LineChart } from 'react-native-chart-kit';
import {
    ScrollView,
    View,
    ActivityIndicator,
    SafeAreaView,
    Dimensions,
    Text,
} from 'react-native';
import moment from 'moment';
import { DollarSymbol, HomeSymbol, LeadSymbol, PhoneSymbol } from '../icons';
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

class NewDashboard extends React.Component {
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
                        <Title text='WELCOME!' />
                        <Subtitle text={this.props.name} />
                    </View>

                    {this.renderDashboardData()}

                    <RowView
                        first={
                            <DetailCard
                                text={'Track My\nNet Worth'}
                                symbol={<DollarSymbol width={30} height={30} />}
                                content={
                                    <RowView
                                        first={
                                            <ActivityRings
                                                data={[
                                                    {
                                                        value:
                                                            this.returnExpectedIncome() /
                                                            this.returnMaximumHistoricalIncome(
                                                                0,
                                                            ),
                                                        color:
                                                            this.returnExpectedIncome() >
                                                            this.returnMaximumHistoricalIncome(
                                                                0,
                                                            )
                                                                ? global.greenColor
                                                                : global.redColor,
                                                    },
                                                ]}
                                                config={{
                                                    width: 100,
                                                    height: 100,
                                                }}
                                            />
                                        }
                                        second={
                                            <SmallestTitle
                                                text={
                                                    (
                                                        ((this.returnExpectedIncome() -
                                                            this.returnMaximumHistoricalIncome(
                                                                0,
                                                            )) /
                                                            this.returnMaximumHistoricalIncome(
                                                                0,
                                                            )) *
                                                        100
                                                    ).toFixed(0) + '%'
                                                }
                                            />
                                        }
                                    />
                                }
                            />
                        }
                        second={
                            <DetailCard
                                text='Appts'
                                symbol={<HomeSymbol width={30} height={30} />}
                                content={
                                    <View style={{ paddingTop: 10 }}>
                                        <RowView
                                            first={
                                                <SmallestTitle text={'Day: '} />
                                            }
                                            second={
                                                <AdaptiveSmallestTitle
                                                    text={this.returnSetOfToday(
                                                        this.state.appointments,
                                                    )}
                                                />
                                            }
                                        />
                                        <RowView
                                            first={
                                                <SmallestTitle
                                                    text={'Week: '}
                                                />
                                            }
                                            second={
                                                <AdaptiveSmallestTitle
                                                    text={this.returnSetOfWeek(
                                                        this.state.appointments,
                                                    )}
                                                />
                                            }
                                        />
                                        <RowView
                                            first={
                                                <SmallestTitle
                                                    text={'Month: '}
                                                />
                                            }
                                            second={
                                                <AdaptiveSmallestTitle
                                                    text={this.returnSetOfMonth(
                                                        this.state.appointments,
                                                    )}
                                                />
                                            }
                                        />
                                    </View>
                                }
                            />
                        }
                    />

                    {/*<RowView
                        first={
                            <DetailCard
                                text='Top 25'
                                symbol={<UsersSymbol width={30} height={30} />}
                            />
                        }
                        second={
                            <DetailCard
                                text='Metrics'
                                symbol={<MetricsSymbol width={30} height={30} />}
                            />
                        }
                    />*/}

                    <RowView
                        first={
                            <DetailCard
                                text='Calls'
                                symbol={<PhoneSymbol width={30} height={30} />}
                                content={
                                    <View style={{ paddingTop: 10 }}>
                                        <RowView
                                            first={
                                                <SmallestTitle text={'Day: '} />
                                            }
                                            second={
                                                <AdaptiveSmallestTitle
                                                    text={this.returnSetOfToday(
                                                        this.state.calls,
                                                    )}
                                                />
                                            }
                                        />
                                        <RowView
                                            first={
                                                <SmallestTitle
                                                    text={'Week: '}
                                                />
                                            }
                                            second={
                                                <AdaptiveSmallestTitle
                                                    text={this.returnSetOfWeek(
                                                        this.state.calls,
                                                    )}
                                                />
                                            }
                                        />
                                        <RowView
                                            first={
                                                <SmallestTitle
                                                    text={'Month: '}
                                                />
                                            }
                                            second={
                                                <AdaptiveSmallestTitle
                                                    text={this.returnSetOfMonth(
                                                        this.state.calls,
                                                    )}
                                                />
                                            }
                                        />
                                    </View>
                                }
                            />
                        }
                        second={
                            <DetailCard
                                text='Leads'
                                symbol={<LeadSymbol width={30} height={30} />}
                                content={
                                    <View style={{ paddingTop: 10 }}>
                                        <SmallestTitle text='Buyer leadsource' />
                                        <SmallestTitle
                                            text={'-Zillow\n-Referral\n-Yelp'}
                                        />
                                    </View>
                                }
                            />
                        }
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewDashboard);

const RowView = (item) => (
    <View
        style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}
    >
        {item.first}
        {item.second}
    </View>
);

const SmallerTitle = (item) => (
    <Text
        style={{
            color: global.primaryColor,
            fontWeight: 'bold',
            fontSize: 20,
        }}
    >
        {item.text}
    </Text>
);

const AdaptiveSmallestTitle = (item) => (
    <Text
        style={{
            color:
                parseInt(item.text) == 0 ? global.redColor : global.greenColor,
            fontWeight: 'bold',
            fontSize: 15,
        }}
    >
        {item.text}
    </Text>
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
            width: 160,
            height: 160,
            backgroundColor: global.grayColor,
            borderRadius: 25,
            padding: 15,
            marginTop: 20,
        }}
    >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <SmallerTitle text={item.text} />
            <View
                style={{
                    width: 40,
                    height: 40,
                    backgroundColor: global.primaryColor,
                    borderRadius: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {item.symbol}
            </View>
        </View>

        <View>{item.content}</View>
    </View>
);
