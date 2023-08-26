import React from "react";
import tailwind from "tailwind-rn";
import LineChart from "../components/LineChart";
import {
    TouchableOpacity,
    ScrollView,
    View,
    ActivityIndicator,
    SafeAreaView,
    Dimensions,
    Text,
    Image,
} from "react-native";
import moment from "moment";
import ActivityRings from "../components/ActivityRings";
import { connect } from "react-redux";
import {
    StatisticsCard,
    StatisticsInfoBubble,
    Title,
} from "../components/components";

// Where we grab the redux name state
function mapStateToProps(state) {
    return { calls: state.calls, appointments: state.appointments };
}

// Where we define the function to update redux name
function mapDispatchToProps(dispatch) {
    return {
        updateName: (name) =>
            dispatch({
                type: "UPDATE_NAME",
                name,
            }),
    };
}

Number.prototype.clamp = function (min, max) {
    return this <= min ? min : this >= max ? max : this;
};

class Statistics extends React.Component {
    render() {
        return (
            <SafeAreaView
                style={{
                    paddingHorizontal: 8,
                    backgroundColor: "#fff",
                    height: Dimensions.get("window").height,
                }}
            >
                <ScrollView
                    style={{ paddingHorizontal: 16 }}
                    contentContainerStyle={{ paddingBottom: 120 }}
                >
                    <View style={tailwind("mt-6 mb-4 flex-col")}>
                        <Title text="Statistics" />
                    </View>

                    <LineChart />

                    <StatisticsCard
                        first={
                            <StatisticsInfoBubble
                                text="Calls This Week"
                                value={this.props.calls.week.toFixed(2)}
                            />
                        }
                        second={
                            <StatisticsInfoBubble
                                text="Calls This Month"
                                value={this.props.calls.month.toFixed(2)}
                            />
                        }
                        third={
                            <StatisticsInfoBubble
                                text="Avg Daily Calls"
                                value={this.props.calls.average.toFixed(2)}
                            />
                        }
                    />

                    <StatisticsCard
                        first={
                            <StatisticsInfoBubble
                                text="Appts Today"
                                value={this.props.appointments.day.toFixed(2)}
                            />
                        }
                        second={
                            <StatisticsInfoBubble
                                text="Appts This Month"
                                value={this.props.appointments.month.toFixed(2)}
                            />
                        }
                        third={
                            <StatisticsInfoBubble
                                text="Conversion Rate"
                                value={this.props.appointments.conversion_rate.toFixed(
                                    2
                                )}
                            />
                        }
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
