import React from "react";
import {
    View,
    Dimensions,
    Platform,
    TouchableOpacity,
    Text,
    AsyncStorage,
} from "react-native";
import {
    HomeSymbol,
    StatisticsSymbol,
    DealsSymbol,
    UsersSymbol,
    InsightsSymbol,
    PlusSymbol,
    FilledPlusSymbol,
    FilledInsightsSymbol,
    FilledHomeSymbol,
    FilledStatisticsSymbol,
    FilledDealsSymbol,
    FilledUsersSymbol,
} from "./icons";
import {
    NavigationContainer,
    getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Statistics from "./screens/Statistics";
import Users from "./screens/Users";
import NewDashboard from "./screens/NewDashboard";
import Insights from "./screens/Insights";
import Clients from "./screens/Clients";
import ClientShow from "./screens/ClientShow";
import Plus from "./screens/Plus";
import Login from "./screens/Login";
import "./global";
import { connect } from "react-redux";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Where we grab the redux name state
function mapStateToProps(state) {
    return { name: state.name };
}

// Where we define the function to update redux name
function mapDispatchToProps(dispatch) {
    return {
        updateName: (name) =>
            dispatch({
                type: "UPDATE_NAME",
                name,
            }),
        updateCalls: (calls) =>
            dispatch({
                type: "UPDATE_CALLS",
                calls,
            }),
        updateAppointments: (appointments) =>
            dispatch({
                type: "UPDATE_APPOINTMENTS",
                appointments,
            }),
        updateClients: (clients) =>
            dispatch({
                type: "UPDATE_CLIENTS",
                clients,
            }),
        updateListings: (listings) =>
            dispatch({
                type: "UPDATE_LISTINGS",
                listings,
            }),
        updateLineChartData: (lineChartData) =>
            dispatch({
                type: "UPDATE_LINE_CHART_DATA",
                lineChartData,
            }),
        updateGoal: (goal) =>
            dispatch({
                type: "UPDATE_GOAL",
                goal,
            }),
    };
}

class ClientStack extends React.Component {
    render() {
        return (
            <Stack.Navigator
                initialRouteName="Clients"
                screenOptions={({ route }) => ({
                    headerShown: false,
                })}
            >
                <Stack.Screen name="Clients" component={Clients} />
                <Stack.Screen name="ClientShow" component={ClientShow} />
            </Stack.Navigator>
        );
    }
}

class Tabs extends React.Component {
    async getCalls() {
        const token = await AsyncStorage.getItem("token");
        const name = await AsyncStorage.getItem("name");
        await fetch("https://homexe.win/api/call/get", {
            headers: new Headers({
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                this.props.updateCalls(data[name]);
            });
    }

    async getAppointments() {
        const token = await AsyncStorage.getItem("token");
        const name = await AsyncStorage.getItem("name");
        await fetch("https://homexe.win/api/appointment/get", {
            headers: new Headers({
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                this.props.updateAppointments(data[name]);
            });
    }

    async getClients() {
        const token = await AsyncStorage.getItem("token");
        const name = await AsyncStorage.getItem("name");
        await fetch("https://homexe.win/client/get", {
            headers: new Headers({
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                this.props.updateClients(data[name]);
            });
    }

    async getListings() {
        const token = await AsyncStorage.getItem("token");
        const name = await AsyncStorage.getItem("name");
        await fetch("https://homexe.win/listing/get", {
            headers: new Headers({
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                this.props.updateListings(data[name]);
            });
    }

    async getLineChartData() {
        const token = await AsyncStorage.getItem("token");
        const name = await AsyncStorage.getItem("name");
        await fetch("https://homexe.win/api/chart/get", {
            headers: new Headers({
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                this.props.updateLineChartData(data[name]);
            });
    }

    async getGoal() {
        const token = await AsyncStorage.getItem("token");
        const name = await AsyncStorage.getItem("name");
        await fetch("https://homexe.win/api/goal/get", {
            headers: new Headers({
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                this.props.updateGoal(data.toString());
            });
    }

    async componentDidMount() {
        this.getCalls();
        this.getAppointments();
        this.getClients();
        this.getListings();
        this.getLineChartData();
        this.getGoal();
    }

    render() {
        return (
            <Tab.Navigator
                tabBar={(props) => <TabBar {...props} />}
                initialRouteName="NewDashboard"
                screenOptions={({ route }) => ({
                    headerShown: false,
                })}
            >
                <Tab.Screen name="Statistics" component={Statistics} />
                <Tab.Screen name="Plus" component={Plus} />
                <Tab.Screen name="Insights" component={Insights} />
                <Tab.Screen name="NewDashboard" component={NewDashboard} />
                <Tab.Screen name="Clients" component={ClientStack} />
                <Tab.Screen name="Users" component={Users} />
            </Tab.Navigator>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);

function returnTabWidth() {
    var thing = "xx";
    userIsAdmin().then((res) => {
        if (res) {
            thing = "16.6%";
        } else {
            thing = "20%";
        }
    });

    return thing;
}

function userIsAdmin() {
    // var res = (await AsyncStorage.getItem('admin')) == 'true';
    return false;
    return res;
}

const TabBar = (item) => (
    <View
        style={{
            height: 83,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 10,
            backgroundColor: "white",
        }}
    >
        <TouchableOpacity
            style={{
                display: "flex",
                width: userIsAdmin() ? "16.6%" : "20%",
                alignItems: "center",
            }}
            onPress={() => item.navigation.navigate("NewDashboard")}
        >
            {returnDashboardIcon(item)}
        </TouchableOpacity>

        <TouchableOpacity
            style={{
                display: "flex",
                width: userIsAdmin() ? "16.6%" : "20%",
                alignItems: "center",
            }}
            onPress={() => item.navigation.navigate("Statistics")}
        >
            {returnStatisticsIcon(item)}
        </TouchableOpacity>

        <TouchableOpacity
            style={{
                display: "flex",
                width: userIsAdmin() ? "16.6%" : "20%",
                alignItems: "center",
            }}
            onPress={() => item.navigation.navigate("Plus")}
        >
            {returnPlusIcon(item)}
        </TouchableOpacity>

        <TouchableOpacity
            style={{
                display: "flex",
                width: userIsAdmin() ? "16.6%" : "20%",
                alignItems: "center",
            }}
            onPress={() => item.navigation.navigate("Insights")}
        >
            {returnInsightsIcon(item)}
        </TouchableOpacity>

        <TouchableOpacity
            style={{
                display: "flex",
                width: userIsAdmin() ? "16.6%" : "20%",
                alignItems: "center",
            }}
            onPress={() => item.navigation.navigate("Clients")}
        >
            {returnDealsIcon(item)}
        </TouchableOpacity>

        {/*<TouchableOpacity
            style={{
                display: 'flex',
                width: userIsAdmin() ? '16.6%' : '20%',
                alignItems: 'center',
            }}
            onPress={() => item.navigation.navigate('Users')}
        >
            {returnUsersIcon(item)}
        </TouchableOpacity>*/}
    </View>
);

function returnDashboardIcon(item) {
    const { index, routes } = item.navigation.getState();
    const currentRoute = routes[index].name;
    if (currentRoute == "NewDashboard") {
        return (
            <View>
                <FilledHomeSymbol
                    width={35}
                    height={35}
                    color={global.primaryColor}
                />
                <View
                    style={{
                        width: 6,
                        height: 6,
                        backgroundColor: global.primaryColor,
                        borderRadius: 6,
                        alignSelf: "center",
                    }}
                />
            </View>
        );
    } else {
        return (
            <HomeSymbol width={35} height={35} color={global.secondaryColor} />
        );
    }
}

function returnStatisticsIcon(item) {
    const { index, routes } = item.navigation.getState();
    const currentRoute = routes[index].name;
    if (currentRoute == "Statistics") {
        return (
            <View>
                <FilledStatisticsSymbol
                    width={35}
                    height={35}
                    color={global.primaryColor}
                />
                <View
                    style={{
                        width: 6,
                        height: 6,
                        backgroundColor: global.primaryColor,
                        borderRadius: 6,
                        alignSelf: "center",
                    }}
                />
            </View>
        );
    } else {
        return (
            <StatisticsSymbol
                width={35}
                height={35}
                color={global.secondaryColor}
            />
        );
    }
}

function returnInsightsIcon(item) {
    const { index, routes } = item.navigation.getState();
    const currentRoute = routes[index].name;

    if (currentRoute == "Insights") {
        return (
            <View>
                <FilledInsightsSymbol
                    width={35}
                    height={35}
                    color={global.primaryColor}
                />
                <View
                    style={{
                        width: 6,
                        height: 6,
                        backgroundColor: global.primaryColor,
                        borderRadius: 6,
                        alignSelf: "center",
                    }}
                />
            </View>
        );
    } else {
        return (
            <InsightsSymbol
                width={35}
                height={35}
                color={global.secondaryColor}
            />
        );
    }
}

function returnDealsIcon(item) {
    const { index, routes } = item.navigation.getState();
    const currentRoute = routes[index].name;

    if (currentRoute == "Clients") {
        return (
            <View>
                <FilledDealsSymbol
                    width={35}
                    height={35}
                    color={global.primaryColor}
                />
                <View
                    style={{
                        width: 6,
                        height: 6,
                        backgroundColor: global.primaryColor,
                        borderRadius: 6,
                        alignSelf: "center",
                    }}
                />
            </View>
        );
    } else {
        return (
            <DealsSymbol width={35} height={35} color={global.secondaryColor} />
        );
    }
}

function returnPlusIcon(item) {
    const { index, routes } = item.navigation.getState();
    const currentRoute = routes[index].name;

    if (currentRoute == "Plus") {
        return (
            <View>
                <FilledPlusSymbol
                    width={35}
                    height={35}
                    color={global.primaryColor}
                />
                <View
                    style={{
                        width: 6,
                        height: 6,
                        backgroundColor: global.primaryColor,
                        borderRadius: 6,
                        alignSelf: "center",
                    }}
                />
            </View>
        );
    } else {
        return (
            <PlusSymbol width={35} height={35} color={global.secondaryColor} />
        );
    }
}

function returnUsersIcon(item) {
    const { index, routes } = item.navigation.getState();
    const currentRoute = routes[index].name;

    if (currentRoute == "Users") {
        return (
            <View>
                <FilledUsersSymbol
                    width={35}
                    height={35}
                    color={global.primaryColor}
                />
                <View
                    style={{
                        width: 6,
                        height: 6,
                        backgroundColor: global.primaryColor,
                        borderRadius: 6,
                        alignSelf: "center",
                    }}
                />
            </View>
        );
    } else {
        return (
            <UsersSymbol width={35} height={35} color={global.secondaryColor} />
        );
    }
}
