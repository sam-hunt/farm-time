import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2196f3',
            light: '#6ec6ff',
            dark: '#0069c0',
            contrastText: '#fff',
        },
        secondary: {
            main: '#26a69a',
            light: '#64d8cb',
            dark: '#00766c',
            contrastText: '#fff',
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#2196f3',
            light: '#6ec6ff',
            dark: '#0069c0',
            contrastText: '#fff',
        },
        secondary: {
            main: '#26a69a',
            light: '#64d8cb',
            dark: '#00766c',
            contrastText: '#fff',
        },
    },
});
