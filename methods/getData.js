import { AsyncStorage } from "react-native";

export async function getCalls() {
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

export async function getAppointments() {
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

export async function getClients() {
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

export async function getListings() {
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

export async function getLineChartData() {
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

export async function getGoal() {
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
