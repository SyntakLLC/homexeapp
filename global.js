import { Dimensions } from 'react-native';

global.primaryColor = '#146ec0';
global.secondaryColor = '#8ebbf2';
global.grayColor = '#EEF6F6';
global.redColor = '#E0575A';
global.greenColor = '#50C87A';
global.chartColor = '#EEF7FD';
global.selectedUserName = 'Tyler Scaglione';
global.screenHeight = Dimensions.get('window').height;
global.screenWidth = Dimensions.get('window').width;

global.numberWithCommas = function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
