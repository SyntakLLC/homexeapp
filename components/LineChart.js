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
    return {
        calls: state.calls,
        appointments: state.appointments,
        lineChartData: state.lineChartData,
        goal: state.goal,
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

class LineChartComponent extends React.Component {
    state = {
        goal: 200000,
        limit: 12,
    };

    componentDidMount() {
        this.setState({ goal: this.props.goal });
    }

    renderDashboardData() {
        var dashboardData = [];

        if (this.props.lineChartData.length == 0) {
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
                <View
                    style={{
                        paddingVertical: 10,
                        backgroundColor: global.chartColor,
                        borderRadius: 25,
                    }}
                >
                    <LineChart
                        data={{
                            labels: this.returnMonthList(this.state.limit),
                            datasets: [
                                {
                                    data: this.props.lineChartData.slice(
                                        this.props.lineChartData.length -
                                            this.state.limit,
                                        this.props.lineChartData.length,
                                    ),
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
                            decimalPlaces: 0, // optional, defaults to 2dp
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

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ limit: 3 });
                            }}
                            style={{
                                padding: 10,
                                backgroundColor:
                                    this.state.limit == 3
                                        ? global.primaryColor
                                        : global.secondaryColor,
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontWeight: '700',
                                }}
                            >
                                3 months
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ limit: 6 });
                            }}
                            style={{
                                padding: 10,
                                backgroundColor:
                                    this.state.limit == 6
                                        ? global.primaryColor
                                        : global.secondaryColor,
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontWeight: '700',
                                }}
                            >
                                6 months
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ limit: 12 });
                            }}
                            style={{
                                padding: 10,
                                backgroundColor:
                                    this.state.limit == 12
                                        ? global.primaryColor
                                        : global.secondaryColor,
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontWeight: '700',
                                }}
                            >
                                12 months
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>,
            );
        }

        return <View>{dashboardData}</View>;
    }

    // shifts the month list so the current month is first
    returnMonthList(limit) {
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
        if (months.length - limit == months.length) {
            return months;
        } else {
            return months.slice(months.length - limit, months.length);
        }
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
        return <View>{this.renderDashboardData()}</View>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LineChartComponent);
