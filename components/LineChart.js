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
                <View>
                    <LineChart
                        data={{
                            labels: this.returnMonthList(),
                            legend: [
                                'Estimated Income: ' +
                                    this.numberWithCommas(
                                        this.props.lineChartData[
                                            this.props.lineChartData.length - 1
                                        ].toFixed(2),
                                    ),
                            ],
                            datasets: [
                                {
                                    data: this.props.lineChartData,
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
