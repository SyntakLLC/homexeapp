import { ClientSymbol, PhoneSymbol, EmailSymbol } from "../icons";
import {
    TouchableOpacity,
    ScrollView,
    View,
    ActivityIndicator,
    SafeAreaView,
    Dimensions,
    Text,
    Alert,
    Platform,
    Switch,
    AsyncStorage,
} from "react-native";
import { connect } from "react-redux";
import { Picker as BasePicker } from "@react-native-picker/picker";
import styled from "styled-components";
import ActivityRings from "./ActivityRings";

export const RowView = (item) => (
    <View
        style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        }}
    >
        {item.first}
        {item.second}
        {item.third}
        {item.fourth}
    </View>
);

export const SmallestTitle = (item) => (
    <Text
        style={{
            color: global.primaryColor,
            fontWeight: "bold",
            fontSize: 15,
        }}
    >
        {item.text}
    </Text>
);

export const SecondaryTitle = (item) => (
    <Text
        style={{
            color: global.primaryColor,
            fontSize: 15,
        }}
    >
        {item.text}
    </Text>
);

export const MenuTitle = (item) => (
    <Text
        style={{
            color: global.primaryColor,
            fontWeight: "bold",
            paddingHorizontal: 5,
            fontSize: 15,
            textDecorationLine: item.textDecoration,
        }}
    >
        {item.text}
    </Text>
);

export const Title = (item) => (
    <Text
        style={{
            color: global.primaryColor,
            fontWeight: "bold",
            fontSize: 25,
        }}
    >
        {item.text}
    </Text>
);

export const Subtitle = (item) => (
    <Text
        style={{
            color: global.secondaryColor,
            fontWeight: "bold",
            fontSize: 25,
        }}
    >
        {item.text}
    </Text>
);

export const StockPrice = (item) => (
    <Text
        style={{
            color: global.primaryColor,
            fontWeight: "bold",
            fontSize: 25,
        }}
    >
        {item.text}
    </Text>
);

export const StockChange = (item) => (
    <Text
        style={{
            color: item.positive ? global.greenColor : global.redColor,
            fontWeight: "bold",
            fontSize: 20,
        }}
    >
        {item.text}
    </Text>
);

export const ClientCard = (item) => (
    <View
        style={{
            width: "100%",
            backgroundColor: global.grayColor,
            borderRadius: 10,
            padding: 15,
            marginTop: 20,
            justifyContent: "flex-start",
            alignItems: "flex-start",
        }}
    >
        <RowView
            first={
                <View
                    style={{
                        padding: 5,
                        borderRadius: 30,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor:
                            item.status == "Signed"
                                ? global.primaryColor
                                : item.status == "Closed"
                                ? global.greenColor
                                : global.redColor,
                        width: 50,
                        height: 50,
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontSize: 20,
                            fontWeight: "bold",
                        }}
                    >
                        {item.status == "Signed"
                            ? "S"
                            : item.status == "Closed"
                            ? "Cl"
                            : "Co"}
                    </Text>
                </View>
            }
            second={
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        maxWidth: "77%",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "column",
                            justifyContent: "center",
                            paddingLeft: 10,
                            width: "77%",
                        }}
                    >
                        <Text
                            numberOfLines={1}
                            style={{
                                color: global.primaryColor,
                                fontWeight: "bold",
                                fontSize: 15,
                            }}
                        >
                            {item.address}
                        </Text>

                        <SecondaryTitle
                            text={item.name + " • " + item.clientType}
                        />

                        <Text
                            numberOfLines={1}
                            style={{
                                color: global.primaryColor,
                                fontWeight: "bold",
                                fontSize: 15,
                            }}
                        >
                            {"$" +
                                global.numberWithCommas(item.gci) +
                                " • " +
                                item.agentName}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={item.onPress}
                        style={{
                            marginHorizontal: 30,
                            padding: 15,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingVertical: 20,
                        }}
                    >
                        <Text
                            style={{
                                color: global.primaryColor,
                                fontWeight: "bold",
                            }}
                        >
                            Edit
                        </Text>
                    </TouchableOpacity>
                </View>
            }
        />
    </View>
);

export const SmallerTitle = (item) => (
    <Text
        style={{
            color: global.primaryColor,
            fontWeight: "bold",
            fontSize: 15,
        }}
    >
        {item.text}
    </Text>
);

export const LoginInput = styled.TextInput`
    height: 40px;
    border-radius: 20px;
    background-color: rgb(230, 230, 230);
    width: 90%;
    padding-left: 20px;
    margin-top: 10px;
    color: #111827;
    margin-bottom: 10px;
`;

export const Picker = styled(BasePicker)`
    height: 220px;
    border-radius: 20px;
    background-color: white;
    width: 90%;
    padding-left: 20px;
    margin-top: 10px;
    color: #111827;
    margin-bottom: 10px;
    overflow: hidden;
`;

export const SelectButton = styled.View`
    height: 50px;
    width: 94%;
    flex: 1;
    color: white;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
`;

export const AddJobText = styled.Text`
    font-weight: 700;
    font-size: 17px;
    color: white;
    text-align: center;
    line-height: 22px;
`;

/////////////////////////////////////////

export const GroupDetailCard = (item) => (
    <View
        style={{
            width: "100%",
            minHeight: 140,
            backgroundColor: global.chartColor,
            borderRadius: 25,
            padding: 15,
            marginTop: 20,
            justifyContent: "center",
            alignItems: "center",
        }}
    >
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                transform: [{ scale: 0.8 }],
            }}
        >
            {item.first}
            {item.second}
            {item.third}
        </View>

        {item.content}
    </View>
);

export const InfoBubble = (item) => (
    <View
        style={{
            alignItems: "center",
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
                ringSize: 8,
            }}
        />
        <SmallestTitle text={item.actualValue} />
    </View>
);
export const SingleDetailCard = (item) => (
    <View
        style={{
            width: 160,
            height: 160,
            backgroundColor: global.chartColor,
            borderRadius: 25,
            padding: 15,
            marginTop: 20,
        }}
    >
        <View style={{ alignItems: "center" }}>
            <SmallerTitle text={item.text} />
            <View>{item.content}</View>
        </View>
    </View>
);

export const StatisticsBar = (item) => (
    <View
        style={{ width: "50%", marginBottom: 10, transform: [{ scale: 0.8 }] }}
    >
        <SmallestTitle text={item.text} />
        <View
            style={{
                height: 10,
            }}
        />
        {/*<View
            style={{
                width: '100%',
                height: 15,
                backgroundColor: '#fff',
                borderRadius: 8,
            }}
        >
            <View
                style={{
                    width: (item.value / item.max) * 100 + '%',
                    height: 15,
                    backgroundColor:
                        (item.value / item.max) * 100 < 25
                            ? global.redColor
                            : (item.value / item.max) * 100 > 75
                            ? global.greenColor
                            : global.primaryColor,
                    borderRadius: 8,
                }}
            />
        </View>*/}
        <Title text={item.value} />
    </View>
);

////////////////////////
export const AdaptiveSmallestTitle = (item) => (
    <Text
        style={{
            color:
                parseInt(item.text) == 0 ? global.redColor : global.greenColor,
            fontWeight: "bold",
            fontSize: 15,
        }}
    >
        {item.text}
    </Text>
);

export const DashboardGridItem = (item) => (
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
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <SmallerTitle text={item.text} />
            <View
                style={{
                    width: 40,
                    height: 40,
                    backgroundColor: global.primaryColor,
                    borderRadius: 40,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {item.symbol}
            </View>
        </View>

        <View>{item.content}</View>
    </View>
);

export const LogoutButton = (item) => (
    <View
        style={{
            width: Dimensions.get("window").width / 2 - 20,
            borderRadius: 200,
            minHeight: 50,
            borderColor: global.primaryColor,
            borderWidth: 2,
            backgroundColor: "white",
            justifyContent: "center",
            marginBottom: 10,
            alignItems: "center",
        }}
    >
        <SmallerTitle reduxName={item.reduxName} text={item.text} />
    </View>
);

///////////////////////
export const StatisticsCard = (item) => (
    <View
        style={{
            width: "100%",
            height: 140,
            backgroundColor: global.grayColor,
            borderRadius: 25,
            padding: 15,
            marginTop: 20,
            justifyContent: "center",
            alignItems: "center",
        }}
    >
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                transform: [{ scale: 0.8 }],
            }}
        >
            {item.first}
            {item.second}
            {item.third}
        </View>
    </View>
);

export const StatisticsInfoBubble = (item) => (
    <View
        style={{
            alignItems: "center",
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
