import Toast from 'react-native-simple-toast';

export const ToastSuccess = (message) => {
    return Toast.show(message);
};

export const ToastError = (msg) => {
    return Toast.show(msg);
};

export const AlertSuccess = (message) => {
    return Toast.show(message);
};

export const AlertError = (msg) => {
    return Toast.show(msg);
};