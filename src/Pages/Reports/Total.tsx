import dayjs from 'dayjs'; 
import { Typography } from '@mui/material';
import { useContext } from 'react';
import { HoursContext } from '../../App/App';

interface ITotalProps {
    start: dayjs.Dayjs,
    end: dayjs.Dayjs,
}

const Total = ({ start, end }: ITotalProps) => {
    const { hours } = useContext(HoursContext);

    const daysInRange = Object.keys(hours).filter(d => {
        const day = dayjs(d);
        return day.isSame(start, 'day') || day.isSame(end, 'day') || (day.isAfter(start) && day.isBefore(end));
    }).sort();

    const totalMins = daysInRange.reduce((total, day) => total + hours[day].reduce((dayTotal, times) => dayTotal + dayjs(times.endTime).diff(dayjs(times.startTime), 'minutes'), 0), 0)

    const totalLeftoverMins = totalMins % 60;
    const totalHours = (totalMins - totalLeftoverMins) / 60;

    return <Typography variant='h4'>Total {totalHours} hours{totalLeftoverMins > 0 && `, ${totalLeftoverMins} minutes`}</Typography>;
}

export default Total;
