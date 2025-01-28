import moment from 'moment';

export const dateFormat = (date, format = 'YYYY-MM-DD') => {
    return moment(date)?.format(format)
}