import React from 'react';
import tailwind from 'tailwind-rn';
// import { LineChart } from 'react-native-chart-kit';
import LineChart from '../components/LineChart';
import {
    ScrollView,
    View,
    ActivityIndicator,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Text,
    Animated,
    AsyncStorage,
} from 'react-native';
import moment from 'moment';
import { DollarSymbol, HomeSymbol, LeadSymbol, PhoneSymbol } from '../icons';
import ActivityRings from 'react-native-activity-rings';
import { connect } from 'react-redux';
import styled from 'styled-components';

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
    };
}

class NewDashboard extends React.Component {
    state = {
        calls: [],
        appointments: [],
        loginModalTop: new Animated.Value(-550),
        pickerOpen: false,
        hasLoggedIn: true,
        loginEmail: '',
        loginPassword: '',
    };

    emptyRedux() {
        this.props.updateCalls([]);
        this.props.updateAppointments([]);
        this.props.updateListings([]);
        this.props.updateClients([]);
    }

    render() {
        return (
            <SafeAreaView
                style={{}}
                pointerEvents={this.state.pickerOpen ? 'none' : 'auto'}
                style={
                    this.state.pickerOpen
                        ? {
                              opacity: 0.4,
                              height: global.screenHeight,
                              width: global.screenWidth,
                              paddingHorizontal: 8,
                              backgroundColor: '#fff',
                              height: Dimensions.get('window').height,
                          }
                        : {
                              height: global.screenHeight,
                              width: global.screenWidth,
                              paddingHorizontal: 8,
                              backgroundColor: '#fff',
                              height: Dimensions.get('window').height,
                          }
                }
            >
                <ScrollView
                    style={{ paddingHorizontal: 16 }}
                    contentContainerStyle={{ paddingBottom: 120 }}
                >
                    <View style={tailwind('mt-6 mb-4 flex-col')}>
                        <Title text='WELCOME!' />
                        <Subtitle text={this.props.name} />
                    </View>
                    <LineChart />
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
                                                            this.props
                                                                .lineChartData[
                                                                this.props
                                                                    .lineChartData
                                                                    .length - 1
                                                            ] /
                                                            Math.max(
                                                                ...this.props
                                                                    .lineChartData,
                                                            ),
                                                        color:
                                                            this.props
                                                                .lineChartData[
                                                                this.props
                                                                    .lineChartData
                                                                    .length - 1
                                                            ] /
                                                                Math.max(
                                                                    ...this
                                                                        .props
                                                                        .lineChartData,
                                                                ) >=
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
                                                            Math.max(
                                                                ...this.props
                                                                    .lineChartData,
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
                            <DetailCard
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

const LogoutButton = (item) => (
    <View
        style={{
            width: Dimensions.get('window').width / 2 - 20,
            borderRadius: 200,
            minHeight: 50,
            borderColor: global.primaryColor,
            borderWidth: 2,
            backgroundColor: 'white',
            justifyContent: 'center',
            marginBottom: 10,
            alignItems: 'center',
        }}
    >
        <SmallerTitle reduxName={item.reduxName} text={item.text} />
    </View>
);
