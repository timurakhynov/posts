export const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    const day = date.getDate();
    const dayString: string = day <= 9 ? `0${day}` : `${day}`;
    const hours = date.getHours();
    const hoursString: string = hours <= 9 ? `0${hours}` : `${hours}`;
    const minutes = date.getMinutes();
    const minutesString: string = minutes <= 9 ? `0${minutes}` : `${minutes}`;
    const formatedDate = `${dayString}.${('0' + (date.getMonth() + 1)).slice(-2)}.` +
        `${date.getFullYear()} ${hoursString}:${minutesString}`;
    return formatedDate;
};