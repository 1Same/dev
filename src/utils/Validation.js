import * as yup from 'yup'

export default Validation = {
    email: yup
        .string()
        .email("Please enter valid email")
        .required('Email is required')
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Please enter valid email"),
    password: yup
        .string()
        .test(
            'password-complexity',
            'The password must have a combination of uppercase alphabet, lowercase alphabet, numeric and special character(!@#$%^&*).',
            value => {
                const lowercaseRegex = /[a-z]/;
                const uppercaseRegex = /[A-Z]/;
                const numberRegex = /\d/;
                const specialCharRegex = /[!@#$%^&*()\-_"=+{}; :,<.>]/;

                return (
                    lowercaseRegex.test(value) &&
                    uppercaseRegex.test(value) &&
                    numberRegex.test(value) &&
                    specialCharRegex.test(value)
                );
            }
        )
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Confirm password do not match with password')
        .required('Confirm password is required'),
    reTypePassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Re-type password do not match with new password')
        .required('Re-type password is required'),
    name: yup
        .string()
        .required('Name is required'),
    loginPassword: yup
        .string()
        .required('Password is required'),
    firstName: yup
        .string()
        .required('First name is required')
        .max(100, ({ max }) => `First name maximum ${max} characters.`),
    lastName: yup
        .string()
        // .matches(/^[A-Za-z ]*$/, 'Please must have a combination of uppercase alphabet, lowercase alphabet(A-Za-z)')
        .required('Last name is required')
        .max(100, ({ max }) => `Last name maximum ${max} characters.`),
    mobileNumber: yup
        .string()
        .matches(/^[0-9]+$/, 'Mobile number must only contain digits')
        .required('Mobile number is required')
        .min(7, ({ min }) => `Minimum ${min} characters.`)
        .max(15, ({ max }) => `Mobile number maximum ${max} characters.`),
    altNum: yup
        .string()
        .matches(/^[0-9]+$/, 'Mobile number must only contain digits')
        .min(7, ({ min }) => `minimum ${min} characters.`)
        .max(15, ({ max }) => `Mobile number maximum ${max} characters.`),
    address: yup
        .string()
        .required('Address is required')
        .max(300, ({ max }) => `Address maximum ${max} characters.`),
    city: yup
        .string()
        .required('City is required'),
    country: yup
        .string()
        .required('country is required'),
    senderName: yup
        .string()
        // .matches(/^[A-Za-z ]*$/, 'Please must have a combination of uppercase alphabet, lowercase alphabet(A-Za-z)')
        .required('Sender name is required.')
        .max(40, ({ max }) => `Message maximum ${max} characters.`),
    message: yup
        .string()
        .required('Message is required.')
        .max(300, ({ max }) => `Message maximum ${max} characters.`),
    vatNumber: yup
        .string()
        .required('VatNumber is required'),
    location: yup
        .string()
        .required('Location is required'),
    otp: yup
        .string()
        .min(6, ({ min }) => `OTP must be ${min} characters.`)
        .required('OTP is required'),
}