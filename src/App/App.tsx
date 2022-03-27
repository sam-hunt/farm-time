import './App.css';
import { createContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import CalendarPage from '../Pages/Calendar/CalendarPage';
import ReportsPage from '../Pages/Reports/ReportsPage';
import BackupRestorePage from '../Pages/BackupRestore/BackupRestorePage';
import useLocalStorage from '../hooks/use-local-storage';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { lightTheme, darkTheme } from '../theme';
import { BrowserRouter } from 'react-router-dom';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export interface ITimeRange {
    startTime: string;
    endTime: string;
}
export type IHours = {
    [date: string]: ITimeRange[],
};

export interface IHoursContext {
    hours: IHours;
    setHours: (hours: IHours) => void,
}
export interface IThemeContext {
    currentTheme: string,
    toggleTheme: () => void,
}

export const HoursContext = createContext<IHoursContext>({ hours: {}, setHours: () => { } });
export const ThemeContext = createContext<IThemeContext>({ currentTheme: 'light', toggleTheme: () => { } });

const App = () => {
    const [hours, setHours] = useLocalStorage<IHours>('hours', {});
    const [currentTheme, setCurrentTheme] = useLocalStorage<'light' | 'dark'>('currentTheme', 'light');
    const toggleTheme = () => setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');

    return (
        <HoursContext.Provider value={{ hours, setHours }}>
        <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
            <ThemeProvider theme={currentTheme === 'light' ? lightTheme : darkTheme}>
                <CssBaseline enableColorScheme />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route path="calendar" element={<CalendarPage />} />
                            <Route path="reports" element={<ReportsPage />} />
                            <Route path="backup-restore" element={<BackupRestorePage />} />
                            <Route path="" element={<Navigate replace to="/calendar" />} />
                            <Route path="*" element={<Navigate replace to="/calendar" />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </ThemeContext.Provider>
        </HoursContext.Provider>
    );
}

export default App;
