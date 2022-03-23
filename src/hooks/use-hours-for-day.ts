import dayjs from 'dayjs';
import { ITimeRange } from '../App/App';
import useHours from './use-hours';
import useHoursForRange, { IUseHoursForRange } from './use-hours-for-range';

export type IUseHoursForDay = {
    hoursForDay: ITimeRange[],
    setHoursForDay: (newPeriod: ITimeRange[]) => void,
    hoursForDayTotal: IUseHoursForRange,
};

const useHoursForDay = (day: dayjs.Dayjs): IUseHoursForDay => {
    const { hours, setHours } = useHours();
    const hoursForDayTotal = useHoursForRange(day, day);

    if (!dayjs.isDayjs(day)) return {
        hoursForDay: [],
        setHoursForDay: () => {},
        hoursForDayTotal,
    };

    const dayKey = day.format('YYYY-MM-DD');
    const hoursForDay = hours[dayKey] || [];

    const setHoursForDay = (hoursForDay: ITimeRange[]) => {
        const newHours = { ...hours, [dayKey]: hoursForDay }
        if (hoursForDay.length === 0) delete newHours[dayKey];
        setHours(newHours);
    }

    return { hoursForDay, setHoursForDay, hoursForDayTotal };
};

export default useHoursForDay;
