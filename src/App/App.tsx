import './App.css';
import dayjs from 'dayjs';
import { createContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../Layout/Layout';
import CalendarPage from '../Pages/Calendar/CalendarPage';
import ReportsPage from '../Pages/Reports/ReportsPage';
import useLocalStorage from '../hooks/use-local-storage';

export interface ITimeRange {
    startTime: string;
    endTime: string;
}
export type IHours = {
    [date: string]: ITimeRange[],
};

interface IHoursContext {
    hours: IHours;
    setHours: (hours: IHours) => any,
}

export const HoursContext = createContext<IHoursContext>({ hours: {}, setHours: (hours) => {} });

const App = () => {
    const [hours, setHours] = useLocalStorage<IHours>('hours', {});

    return (
        <HoursContext.Provider value={{ hours, setHours } as any}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                </Route>
            </Routes>
        </HoursContext.Provider>
    );
}

export default App;
