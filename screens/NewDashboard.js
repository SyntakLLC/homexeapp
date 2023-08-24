import React from 'react';
import tailwind from 'tailwind-rn';
import LineChart from '../components/LineChart';
import {
    ScrollView,
    View,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Text,
    AsyncStorage,
    Alert,
} from 'react-native';
import { DollarSymbol, HomeSymbol, LeadSymbol, PhoneSymbol } from '../icons';
import ActivityRings from 'react-native-activity-rings';
import { connect } from 'react-redux';
import {
    Title,
    Subtitle,
    RowView,
    DashboardGridItem,
    SmallestTitle,
    AdaptiveSmallestTitle,
    LogoutButton,
    StockPrice,
    StockChange,
} from '../components/components';
import Users from './Users';

// AsyncStorage stuff regarding the login status:
const USER_KEY = 'auth-key-csv';
const onSignOut = () => AsyncStorage.removeItem(USER_KEY);

// Where we grab the redux name state
function mapStateToProps(state) {
    return {
        name: state.name,
        calls: state.calls,
        clients: state.clients,
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
        updateCalls: (calls) =>
            dispatch({
                type: 'UPDATE_CALLS',
                calls,
            }),
        updateAppointments: (appointments) =>
            dispatch({
                type: 'UPDATE_APPOINTMENTS',
                appointments,
            }),
        updateClients: (clients) =>
            dispatch({
                type: 'UPDATE_CLIENTS',
                clients,
            }),
        updateListings: (listings) =>
            dispatch({
                type: 'UPDATE_LISTINGS',
                listings,
            }),
        updateLineChartData: (lineChartData) =>
            dispatch({
                type: 'UPDATE_LINE_CHART_DATA',
                lineChartData,
            }),
        updateGoal: (goal) =>
            dispatch({
                type: 'UPDATE_GOAL',
                goal,
            }),
    };
}

class NewDashboard extends React.Component {
    emptyRedux() {
        this.props.updateCalls([]);
        this.props.updateAppointments([]);
        this.props.updateListings([]);
        this.props.updateClients([]);
        this.props.updateGoal(0);
    }

    async editGoal(goal) {
        const token = await AsyncStorage.getItem('token');
        const id = await AsyncStorage.getItem('id');
        console.log(id);

        const data = {
            userId: parseInt(id),
            goal: parseInt(goal),
        };

        await fetch('https://homexe.win/api/goal/update', {
            method: 'PUT',
            headers: new Headers({
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }),
            body: JSON.stringify(data),
        })
            .then((response) => {
                this.props.updateGoal(goal.toString());
            })
            .catch((error) => {
                Alert.alert(error);
            });
    }

    returnStockChange() {
        let current =
            this.props.lineChartData[this.props.lineChartData.length - 1];
        let lastMonth =
            this.props.lineChartData[this.props.lineChartData.length - 2];
        let change = current - lastMonth;

        if (isNaN(change)) {
            change = 0;
        }

        if (change > 0) {
            return (
                <StockChange
                    positive={true}
                    text={
                        '$' +
                        global.numberWithCommas(change.toFixed(0)) +
                        ' ↑ month'
                    }
                />
            );
        } else {
            return (
                <StockChange
                    positive={false}
                    text={
                        '$' +
                        global.numberWithCommas(Math.abs(change).toFixed(0)) +
                        ' ↓ month'
                    }
                />
            );
        }
    }

    returnGoalPercentage() {
        let percentage =
            this.props.lineChartData[this.props.lineChartData.length - 1] /
            parseInt(this.props.goal);

        return percentage > 1 ? 1.0 : percentage;
    }

    storeToken = async (token) => {
        try {
            await AsyncStorage.setItem('token', token);
        } catch (error) {}
    };

    switchUserTo = async (name) => {
        try {
            await AsyncStorage.setItem('name', name);
            this.refreshData();
        } catch (error) {}
    };

    async refreshData() {
        const token = await AsyncStorage.getItem('token');
        const name = await AsyncStorage.getItem('name');

        await fetch('https://homexe.win/api/chart/get', {
            headers: new Headers({
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                this.props.updateLineChartData(data[name]);
            });

        await fetch('https://homexe.win/api/call/get', {
            headers: new Headers({
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                this.props.updateCalls(data[name]);
            });

        await fetch('https://homexe.win/api/appointment/get', {
            headers: new Headers({
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                this.props.updateAppointments(data[name]);
            });

        await fetch('https://homexe.win/client/get', {
            headers: new Headers({
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                this.props.updateClients(data[name]);
            });

        await fetch('https://homexe.win/listing/get', {
            headers: new Headers({
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                this.props.updateListings(data[name]);
            });

        await fetch('https://homexe.win/api/goal/get', {
            headers: new Headers({
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.toString()[name]);
                this.props.updateGoal(data.toString());
            });
    }

    render() {
        return (
            <SafeAreaView
                style={{
                    height: global.screenHeight,
                    width: global.screenWidth,
                    backgroundColor: '#fff',
                    height: Dimensions.get('window').height,
                }}
            >
                <ScrollView
                    style={{ paddingHorizontal: 16 }}
                    contentContainerStyle={{ paddingBottom: 120 }}
                >
                    <View style={tailwind('mt-6 mb-4 flex-col')}>
                        <StockPrice
                            text={
                                this.props.lineChartData.length > 0
                                    ? '$' +
                                      global.numberWithCommas(
                                          this.props.lineChartData[
                                              this.props.lineChartData.length -
                                                  1
                                          ].toFixed(2),
                                      )
                                    : 'Loading...'
                            }
                        />
                        {this.returnStockChange()}
                        <Text
                            style={{
                                color: global.secondaryColor,
                                fontWeight: 'bold',
                                fontSize: 20,
                            }}
                        >
                            {'Goal: $' +
                                global.numberWithCommas(
                                    parseInt(this.props.goal),
                                )}
                        </Text>
                    </View>

                    <LineChart />

                    <RowView
                        first={
                            <DashboardGridItem
                                text={'Goal\nTracker'}
                                symbol={<DollarSymbol width={30} height={30} />}
                                content={
                                    <RowView
                                        first={
                                            <ActivityRings
                                                data={[
                                                    {
                                                        value: this.returnGoalPercentage(),
                                                        color:
                                                            this.returnGoalPercentage() >=
                                                            0.5
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
                                                        (this.props
                                                            .lineChartData[
                                                            this.props
                                                                .lineChartData
                                                                .length - 1
                                                        ] /
                                                            parseInt(
                                                                this.props.goal,
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
                            <DashboardGridItem
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
                                                    text={
                                                        this.props.appointments
                                                            .day
                                                    }
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
                                                    text={
                                                        this.props.appointments
                                                            .week
                                                    }
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
                                                    text={
                                                        this.props.appointments
                                                            .month
                                                    }
                                                />
                                            }
                                        />
                                    </View>
                                }
                            />
                        }
                    />
                    <RowView
                        first={
                            <DashboardGridItem
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
                                                    text={this.props.calls.day}
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
                                                    text={this.props.calls.week}
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
                                                    text={
                                                        this.props.calls.month
                                                    }
                                                />
                                            }
                                        />
                                    </View>
                                }
                            />
                        }
                        second={
                            <DashboardGridItem
                                text='Deals'
                                symbol={<LeadSymbol width={30} height={30} />}
                                content={
                                    <View style={{ paddingTop: 10 }}>
                                        <RowView
                                            first={
                                                <SmallestTitle
                                                    text={'Signed: '}
                                                />
                                            }
                                            second={
                                                <AdaptiveSmallestTitle
                                                    text={
                                                        this.props.clients.filter(
                                                            (client) => {
                                                                return (
                                                                    client.status ==
                                                                    'Signed'
                                                                );
                                                            },
                                                        ).length
                                                    }
                                                />
                                            }
                                        />
                                        <RowView
                                            first={
                                                <SmallestTitle
                                                    text={'Contract: '}
                                                />
                                            }
                                            second={
                                                <AdaptiveSmallestTitle
                                                    text={
                                                        this.props.clients.filter(
                                                            (client) => {
                                                                return (
                                                                    client.status ==
                                                                    'Contract'
                                                                );
                                                            },
                                                        ).length
                                                    }
                                                />
                                            }
                                        />
                                        <RowView
                                            first={
                                                <SmallestTitle
                                                    text={'Closed: '}
                                                />
                                            }
                                            second={
                                                <AdaptiveSmallestTitle
                                                    text={
                                                        this.props.clients.filter(
                                                            (client) => {
                                                                return (
                                                                    client.status ==
                                                                    'Closed'
                                                                );
                                                            },
                                                        ).length
                                                    }
                                                />
                                            }
                                        />
                                    </View>
                                }
                            />
                        }
                    />

                    <TouchableOpacity
                        style={{
                            width: '100%',
                            alignItems: 'center',
                            marginTop: 20,
                        }}
                        onPress={() => {
                            Alert.prompt(
                                'Change goal',
                                'Enter your new desired income goal. Please only use numbers.',
                                [
                                    {
                                        text: 'Cancel',
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'OK',
                                        onPress: (goal) => this.editGoal(goal),
                                    },
                                ],
                            );
                        }}
                    >
                        <LogoutButton text='Change Goal' />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            width: '100%',
                            alignItems: 'center',
                            marginTop: 8,
                        }}
                        onPress={() => {
                            onSignOut();
                            // this.emptyRedux();
                            this.props.navigation.navigate('Login');
                        }}
                    >
                        <LogoutButton
                            reduxName={this.props.name}
                            text='Logout'
                        />
                    </TouchableOpacity>

                    <SwitchUserButton
                        user='Tyler'
                        onPress={() => {
                            this.switchUserTo('Tyler Scaglione');
                        }}
                    />
                    <SwitchUserButton
                        user='David'
                        onPress={() => {
                            this.switchUserTo('David Tran');
                        }}
                    />
                    <SwitchUserButton
                        user='Christian'
                        onPress={() => {
                            this.switchUserTo('Christian Molina');
                        }}
                    />
                    <SwitchUserButton
                        user='Jamie'
                        onPress={() => {
                            this.switchUserTo('Jamie Dodd');
                        }}
                    />
                    <SwitchUserButton
                        user='Jared'
                        onPress={() => {
                            this.switchUserTo('Jared Venezia');
                        }}
                    />
                    <SwitchUserButton
                        user='John'
                        onPress={() => {
                            this.switchUserTo('John Kyle');
                        }}
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewDashboard);

const SwitchUserButton = (props) => {
    return (
        <TouchableOpacity
            style={{
                width: '100%',
                alignItems: 'center',
                marginTop: 8,
            }}
            onPress={() => {
                props.onPress();
            }}
        >
            <LogoutButton text={`Switch to ${props.user.split(' ')}`} />
        </TouchableOpacity>
    );
};
