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
        loginModalTop: new Animated.Value(-550),
        pickerOpen: false,
        hasLoggedIn: true,
        loginEmail: '',
        loginPassword: '',
    };

    componentDidMount() {
        try {
            this.refreshData();
        } catch {}
    }

    async refreshData() {
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

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    // opens the login modal
    openModal() {
        this.setState({
            pickerOpen: true,
        });

        Animated.spring(this.state.loginModalTop, {
            toValue: -550,
            duration: 10000,
            useNativeDriver: false,
        }).start();
    }

    // CLOSES the login modal
    closeModal() {
        this.setState({
            pickerOpen: false,
        });

        Animated.spring(this.state.loginModalTop, {
            toValue: -global.screenHeight + 800,
            duration: 10000,
            useNativeDriver: false,
        }).start();
    }

    // signs in
    signIn() {
        try {
            var url = 'http://homexe.win/api/sanctum/token';

            var xhr = new XMLHttpRequest();
            xhr.open('POST', url);

            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    // console.log(xhr.status);
                    // console.log(xhr.responseText);

                    let name = JSON.parse(xhr.responseText).user.name;
                    this.props.updateName(name);

                    this.closeModal();
                    this.setState({ hasLoggedIn: true });
                    this.refreshData();
                }
            };

            var data =
                '{"email": "' +
                this.state.loginEmail +
                '", "password": "' +
                this.state.loginPassword +
                '", "device_name": "Homexe.win App"}';

            console.log(data);

            xhr.send(data);
        } catch {}
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
                                    symbol={
                                        <UsersSymbol width={30} height={30} />
                                    }
                                />
                            }
                            second={
                                <DetailCard
                                    text='Metrics'
                                    symbol={
                                        <MetricsSymbol width={30} height={30} />
                                    }
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

const NamePickerOverlay = (item) => (
    <AnimatedModalView
        style={{
            top: item.top,
        }}
    >
        {/* The Background */}
        <ModalButtonView
            style={{
                width: 300,
                height: 280,
                padding: 20,
                marginLeft: 0,
                paddingTop: 40,
            }}
        >
            {/* The Title where it says login or signup */}
            <ModalButtonText
                style={{ marginLeft: 0, color: global.primaryColor }}
            >
                {item.loginOrSignup == 'Login' ? 'Login' : 'Sign Up'}
            </ModalButtonText>

            {/* The 2 or 4 text inputs depending on if it's logging in or signing up */}
            <LoginInput
                style={{
                    backgroundColor: global.grayColor,
                }}
                placeholder='EMAIL'
                fontWeight='bold'
                autoCorrect={false}
                placeholderTextColor='#11182750'
                onChangeText={(val) => {
                    item.updateLoginEmail(val);
                }}
            />
            <LoginInput
                style={{
                    backgroundColor: global.grayColor,
                }}
                placeholder='PASSWORD'
                fontWeight='bold'
                blurOnSubmit={false}
                onSubmitEditing={() => Keyboard.dismiss()}
                secureTextEntry={true}
                placeholderTextColor='#11182750'
                onChangeText={(val) => {
                    item.updateLoginPassword(val);
                }}
            />

            {/* The actual log in/sign up button where it does it */}
            <TouchableOpacity
                onPress={() => {
                    item.signIn();
                }}
                style={{
                    // bottom: '4%',
                    top: 20,
                    height: 40,
                    width: '100%',
                    alignSelf: 'center',
                    marginLeft: 16,
                }}
            >
                <SelectButton style={{ backgroundColor: global.primaryColor }}>
                    <AddJobText>Log In</AddJobText>
                </SelectButton>
            </TouchableOpacity>
        </ModalButtonView>

        {/* The image logo on top for looks */}
        <LoginLogo
            source={{ uri: 'https://i.imgur.com/obvXOnI.gif' }}
            style={{ bottom: 350 }}
        />
    </AnimatedModalView>
);

const LoginLogo = styled.Image`
    width: 80px;
    height: 80px;
    bottom: 420px;
    border-radius: 20px;
    overflow: hidden;
    border-color: #ffffff60;
    border-width: 0.5px;
    /* box-shadow: 0px 0px 20px rgba(0, 0, 0, 1); */
`;

const ModalView = styled.View`
    flex: 1;
    align-items: center;
    justify-content: flex-start;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
    z-index: 50;
`;

const AnimatedModalView = Animated.createAnimatedComponent(ModalView);

const LoginInput = styled.TextInput`
    height: 40px;
    border-radius: 20px;
    background-color: rgb(230, 230, 230);
    width: 90%;
    padding-left: 20px;
    margin-top: 10px;
    color: #111827;
`;

const SelectButton = styled.View`
    height: 50px;
    width: 94%;
    flex: 1;
    color: white;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
`;

const AddJobText = styled.Text`
    font-weight: 700;
    font-size: 17px;
    color: white;
    text-align: center;
    line-height: 22px;
`;

const ModalButtonView = styled.View`
    width: 90%;
    min-height: 120;
    margin-left: 5%;
    border-radius: 15;
    background-color: rgb(255, 255, 255);
    align-items: center;
    margin-bottom: 20;
    overflow: hidden;
    box-shadow: 5px 5px 10px black;
`;

const ModalButtonText = styled.Text`
    font-size: 25;
    font-weight: 600;
    color: black;
    margin-left: 20;
    margin-bottom: 10;
`;

const ModalSubtitle = styled.Text`
    font-size: 16;
    color: black;
    margin-left: 20;
    margin-right: 20;
    margin-top: 10;
`;
