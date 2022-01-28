import React from 'react';
import tailwind from 'tailwind-rn';
import LineChart from '../components/LineChart';
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
    return { calls: state.calls, appointments: state.appointments };
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

                    <LineChart />

                    <DetailCard
                        first={
                            <InfoBubble
                                text='Calls This Week'
                                value={this.props.calls.week.toFixed(2)}
                            />
                        }
                        second={
                            <InfoBubble
                                text='Calls This Month'
                                value={this.props.calls.month.toFixed(2)}
                            />
                        }
                        third={
                            <InfoBubble
                                text='Avg Daily Calls'
                                value={this.props.calls.average.toFixed(2)}
                            />
                        }
                    />

                    <DetailCard
                        first={
                            <InfoBubble
                                text='Appts Today'
                                value={this.props.appointments.day.toFixed(2)}
                            />
                        }
                        second={
                            <InfoBubble
                                text='Appts This Month'
                                value={this.props.appointments.month.toFixed(2)}
                            />
                        }
                        third={
                            <InfoBubble
                                text='Conversion Rate'
                                value={this.props.appointments.conversion_rate.toFixed(
                                    2,
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
