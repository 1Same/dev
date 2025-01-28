import { useNetInfo } from "@react-native-community/netinfo";
import { Login, NoInterNetConnection } from "../screens";
import { useSelector } from 'react-redux';

let netInfo;
let authData;

export const checkInterNet = () => {
    netInfo = useNetInfo();
    authData = useSelector((state) => state.auth);
}

export const getComp = (compName, isAuthCheckNeeded = 3) => {
    if (netInfo.isConnected?.toString() == "false") return NoInterNetConnection //IF NOT INTERNATE
    else if (isAuthCheckNeeded == 2 && (authData.data?.slug == '' || typeof authData.data?.slug == "undefined")) return Login //IF USE TYR TO ACCESS ANY SCREEN WHIHC NEEDED AUTH, REDIRECT TO LOGIN SCREEN
    else if (isAuthCheckNeeded == 1 && (authData.data?.slug != '' && typeof authData.data?.slug != "undefined")) return Home //IF USER TRY TO LOGIN WITHOUT AUTH SCREEN
    else return compName
}