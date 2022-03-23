import dayjs from 'dayjs';
import { useContext } from 'react';
import { HoursContext } from '../App/App';

export interface IUseHoursForRange {
    totalHours: number,
    totalMins: number,
    totalLeftoverMins: number,
}

const useHoursForRange = (start: dayjs.Dayjs | null, end: dayjs.Dayjs | null): IUseHoursForRange => {
    const { hours } = useContext(HoursContext);

    if (!start || !end) return { totalHours: 0, totalMins: 0, totalLeftoverMins: 0 }

    const daysInRange = Object.keys(hours).filter(d => {
        const day = dayjs(d);
        return day.isSame(start, 'day') || day.isSame(end, 'day') || (day.isAfter(start) && day.isBefore(end));
    }).sort();

    const totalMins = daysInRange.reduce(
        (total, day) => total + hours[day].reduce(
            (dayTotal, times) => dayTotal + dayjs(times.endTime).diff(dayjs(times.startTime), 'minutes'),
            0,
        ),
        0,
    );

    const totalLeftoverMins = totalMins % 60;
    const totalHours = (totalMins - totalLeftoverMins) / 60;

    return { totalHours, totalMins, totalLeftoverMins };
}

export default useHoursForRange;
