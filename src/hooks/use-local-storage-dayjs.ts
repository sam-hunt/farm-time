import dayjs from 'dayjs';
import useLocalStorage from './use-local-storage';

const useLocalStorageDayjs = (key: string, initialValue: dayjs.Dayjs) => {
    const [value, setValue] = useLocalStorage<dayjs.Dayjs>(key, initialValue);
    const storedValue = dayjs(value);
    return [storedValue, setValue] as const;
}

export default useLocalStorageDayjs;
