import base64 from 'react-native-base64';
import setting from './setting';

// let baseUrl = "https://api-m.sandbox.paypal.com"; // hirdes sir
const baseUrl = "https://api-m.paypal.com"; //live

// // hirdes sir
// let clientId = "Adim5uPFNzof_gvAaL2t5d4nZ9ay0MQJyICKIBu8pg0-sMQwdi0SscM8VtFm4_iLiG1w7Mmla2nRHsdM";
// let secretKey = "EGn1D55sX64WFUmEnygdHQ6tgkBzduV0jyST5VT38fFOYB9EuJuIssoGUSpk7p15BEvXY2GJrqP4BQWC";

// clint
let clientId = "AU0Z18ry3LUzu2n6N6C5pVNYaAlR6iYny5TDPRSbqFPCJoFAsG4eao1bSgRAe8lv3mc4E_Ac2tiA3Cg5";
let secretKey = "EJAifTPZpf6zE_jz3ntI0ybDV-xxWfuoesTDwTing_qc-yor5RTkXy2IXtyOle9WYVsF_Yj2dkWVH8-H";


const generateToken = () => {
    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append('Authorization', "Basic " + base64.encode(`${clientId}:${secretKey}`));

    let requireOptions = {
        method: 'POST',
        headers: headers,
        body: 'grant_type=client_credentials',
    }
    return new Promise((resolve, reject) => {
        fetch(baseUrl + '/v1/oauth2/token', requireOptions).then(response => response.text()).then(result => {
            const { access_token } = JSON.parse(result)
            resolve(access_token)

        }).catch(error => {
            console.log('error====', error);
            reject(error)
        })
    })
}

const createOrder = async (token = '', payAmount = '', payCurrency = '') => {

    // let amount = parseFloat(payAmount).toFixed(2);
    let amount = parseFloat(payAmount).toFixed(2);

    let requestData = {
        "intent": "CAPTURE",
        "purchase_units": [
            {

                "amount": {
                    "currency_code": "USD",
                    "value": amount,
                    "breakdown": {
                        "item_total": {
                            "currency_code": "USD",
                            "value": amount
                        }
                    }
                }
            }
        ],
        "application_context": {
            "return_url": setting[setting.environment].cms_url + "payment-success/",
            "cancel_url": setting[setting.environment].cms_url + "payment-failed/"
        }

    }

    let requireOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` //not show in api formate
        },
        body: JSON.stringify(requestData),
    }

    return new Promise((resolve, reject) => {
        fetch(baseUrl + '/v2/checkout/orders', requireOptions).then(response => response.text()).then(result => {
            const res = JSON.parse(result);
            // console.log('createOrder======', res);
            resolve(res)

        }).catch(error => {
            console.log('error====', error);
            reject(error)
        })
    })
}

const capturePayment = (id, token = '') => {

    let requireOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` //not show in api formate
        },
    }

    return new Promise((resolve, reject) => {
        fetch(baseUrl + `/v2/checkout/orders/${id}/capture`, requireOptions).then(response => response.text()).then(result => {
            const res = JSON.parse(result)
            // console.log('res====', res);

            resolve(res)
        }).catch(error => {
            console.log('error====', error);
            reject(error)
        })
    })
}

export default {
    generateToken,
    createOrder,
    capturePayment,
}
