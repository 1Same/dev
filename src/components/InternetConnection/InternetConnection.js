import NetInfo from '@react-native-community/netinfo';
import { memo, useEffect, useState } from 'react';

const useNetInfo = () => {
    const [connectionInfo, setConnectionInfo] = useState(false);
    useEffect(() => {
        NetInfo.fetch().then(state => {
            setConnectionInfo(state.isConnected);
        });
        let netInfoListener = NetInfo.addEventListener(state => {
            setConnectionInfo(state.isConnected);
        });
        return () => netInfoListener
    }, [connectionInfo]);

    return [connectionInfo];
};
export default memo(useNetInfo);