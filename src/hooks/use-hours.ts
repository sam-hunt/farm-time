import dayjs from 'dayjs';
import { useContext } from 'react';
import { HoursContext, ITimeRange } from '../App/App';

export type IUseHoursForDay = [
    ITimeRange[],
    (newPeriod: ITimeRange[]) => void,
];

export const useHoursForDay = (day: dayjs.Dayjs): IUseHoursForDay => {
    const { hours, setHours } = useContext(HoursContext);

    if (!dayjs.isDayjs(day)) return [[], () => {}];

    const dayKey = day.format('YYYY-MM-DD');
    const hoursForDay = hours[dayKey] || [];

    const setHoursForDay = (hoursForDay: ITimeRange[]) => {
        const newHours = { ...hours, [dayKey]: hoursForDay }
        if (hoursForDay.length === 0) delete newHours[dayKey];
        setHours(newHours);
    }

    return [hoursForDay, setHoursForDay];
};
