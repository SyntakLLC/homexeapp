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

class Users extends React.Component {
    state = {
        currentlySwitchingUsers: false,
        newUserNameWillBe: '',
    };

    returnLoadingIfSwitchingUsers() {
        if (this.state.currentlySwitchingUsers) {
            return (
                <View
                    style={{
                        position: 'absolute',
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height,
                        backgroundColor: global.grayColor,
                        zIndex: 50,
                        opacity: 0.8,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: global.primaryColor,
                            fontWeight: 'bold',
                            fontSize: 25,
                            maxWidth: '75%',
                            paddingVertical: 25,
                            textAlign: 'center',
                        }}
                    >
                        {'Fetching ' +
                            this.state.newUserNameWillBe.split(' ')[0] +
                            "'s data..."}
                    </Text>
                    <ActivityIndicator
                        color={global.primaryColor}
                        size='large'
                    />
                </View>
            );
        } else {
            return <View />;
        }
    }

    async changeNameTo(name) {
        this.setState({ newUserNameWillBe: name });

        this.setState({
            currentlySwitchingUsers: true,
        });
        setTimeout(() => {
            this.props.updateName(name);
            this.setState({
                currentlySwitchingUsers: false,
            });
        }, 100);
    }

    render() {
        return (
            <View>
                {this.returnLoadingIfSwitchingUsers()}

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
                            <Title text='Select a user' />
                        </View>

                        <RowView
                            first={
                                <TouchableOpacity
                                    onPress={() => {
                                        this.changeNameTo('Tyler Scaglione');
                                    }}
                                >
                                    <CategoryButton
                                        reduxName={this.props.name}
                                        text='Tyler Scaglione'
                                    />
                                </TouchableOpacity>
                            }
                            second={
                                <TouchableOpacity
                                    onPress={() => {
                                        this.changeNameTo('David Tran');
                                    }}
                                >
                                    <CategoryButton
                                        reduxName={this.props.name}
                                        text='David Tran'
                                    />
                                </TouchableOpacity>
                            }
                        />

                        <RowView
                            first={
                                <TouchableOpacity
                                    onPress={() => {
                                        this.changeNameTo('Jamie Dodd');
                                    }}
                                >
                                    <CategoryButton
                                        reduxName={this.props.name}
                                        text='Jamie Dodd'
                                    />
                                </TouchableOpacity>
                            }
                            second={
                                <TouchableOpacity
                                    onPress={() => {
                                        this.changeNameTo('Christian Molina');
                                    }}
                                >
                                    <CategoryButton
                                        reduxName={this.props.name}
                                        text='Christian Molina'
                                    />
                                </TouchableOpacity>
                            }
                        />
                    </ScrollView>
                </SafeAreaView>
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);

const CategoryButton = (item) => (
    <View
        style={{
            width: Dimensions.get('window').width / 2 - 20,
            borderRadius: 25,
            minHeight: 100,
            backgroundColor:
                item.reduxName == item.text
                    ? global.primaryColor
                    : global.chartColor,
            justifyContent: 'center',
            marginBottom: 10,
        }}
    >
        <SmallerTitle reduxName={item.reduxName} text={item.text} />
    </View>
);

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

const SmallerTitle = (item) => (
    <Text
        style={{
            color:
                item.reduxName == item.text ? '#FFFFFF' : global.primaryColor,
            fontWeight: 'bold',
            fontSize: 20,
            textAlign: 'center',
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

const AdaptiveTitle = (item) => (
    <Text
        style={{
            color: item.text == 'Sold' ? global.greenColor : global.redColor,
            fontWeight: 'bold',
            fontSize: 25,
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
            backgroundColor: global.chartColor,
            borderRadius: 25,
            padding: 15,
            marginTop: 20,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
        }}
    >
        <View
            style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignContent: 'space-between',
            }}
        >
            <View>
                <SmallestTitle text={item.address} />
                <Title text={item.price} />
            </View>
            <AdaptiveTitle text={item.status} />
        </View>
    </View>
);

const LabelGroup = (item) => (
    <View>
        <Text
            style={tailwind('text-xs font-medium uppercase text-gray-500 mb-1')}
        >
            {item.label}
        </Text>
        <Text style={tailwind('text-xl text-gray-700 mb-5')}>{item.text}</Text>
    </View>
);