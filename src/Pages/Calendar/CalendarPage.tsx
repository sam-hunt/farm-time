import dayjs from 'dayjs'
import { useState, useMemo, useContext } from 'react';
import AdapterDayjs from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import TextField from '@mui/material/TextField';
import { Box, IconButton, Typography } from '@mui/material';
import { theme } from '../../theme';
import PickersDay, { PickersDayProps, pickersDayClasses } from '@mui/lab/PickersDay';
import { useHoursForDay } from '../../hooks/use-hours';
import Icon from '@mdi/react'
import { mdiPlus, mdiDelete } from '@mdi/js';
import MobileTimePicker from '@mui/lab/MobileTimePicker';
import { HoursContext } from '../../App/App';
import useLocalStorageDayjs from '../../hooks/use-local-storage-dayjs';

const highlightedDayStyles = {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}
const today = () => dayjs().hour(0).minute(0).second(0).millisecond(0);

const CalendarPage = () => {
    const [selectedDate, setSelectedDate] = useLocalStorageDayjs('selected-date', today());

    const { hours } = useContext(HoursContext);
    const [hoursForDay, setHoursForDay] = useHoursForDay(selectedDate);

    const [newStartTime, setNewStartTime] = useState<dayjs.Dayjs | null>(selectedDate.hour(0).minute(0).second(0).millisecond(0));
    const [newEndTime, setNewEndTime] = useState<dayjs.Dayjs | null>(selectedDate.hour(23).minute(59).second(59).millisecond(59));

    const addHours = () => {
        if (newStartTime && newEndTime)
            setHoursForDay([...hoursForDay, { startTime: newStartTime.toISOString(), endTime: newEndTime.toISOString() }]);
            setNewStartTime(newEndTime);
            setNewEndTime(selectedDate.hour(23).minute(59).second(59).millisecond(59));
    };

    const delHours = (i: number) => () => {
        setHoursForDay([...hoursForDay.slice(0, i), ...hoursForDay.slice(i + 1)]);
    }

    const highlightedDays = useMemo(() => Object.keys(hours), [hours])

    return (
        <section>
            <Typography variant='h2' sx={{ my: 2 }}>
                Calendar
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                    openTo="day"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue || today())}
                    inputFormat='YYYY-MM-DD'
                    renderInput={(params) => <TextField {...params} />}
                    renderDay={(
                        date: dayjs.Dayjs,
                        selectedDates: Array<dayjs.Dayjs | null>,
                        pickersDayProps: PickersDayProps<dayjs.Dayjs>
                    ) => {
                        const matchedStyles = highlightedDays.reduce((a, v) => {
                            return date.isSame(v, 'day') ? highlightedDayStyles : a;
                        }, {});

                        return (
                            <PickersDay
                                {...pickersDayProps}
                                sx={{
                                    ...matchedStyles,
                                    [`&&.${pickersDayClasses.selected}`]: {
                                        backgroundColor: theme.palette.secondary.main,
                                    }
                                }}
                            />
                        );
                    }}
                />
                <Typography variant='h4' sx={{ mb: 2 }}>
                    Hours
                </Typography>
                {hoursForDay.map((h, i) => (
                    <Box key={i} display="flex" flexDirection="row" alignItems="center" mb="8px">
                        <Typography>{dayjs(h.startTime).format('hh:mm A')}</Typography>
                        <Typography sx={{ mx: 2 }}>to</Typography>
                        <Typography>{dayjs(h.endTime).format('hh:mm A')}</Typography>
                        <IconButton aria-label="delete" color="error" onClick={delHours(i)} style={{ marginLeft: '10px' }}>
                            <Icon path={mdiDelete}
                                title="Delete"
                                size={0.8}
                            />
                        </IconButton>
                    </Box>)
                )}
                <Box display="flex" flexDirection="row" alignItems="center" mt="30px">
                    <MobileTimePicker
                        label="Start"
                        value={newStartTime}
                        maxTime={newEndTime || undefined}
                        onChange={(newStartTime: dayjs.Dayjs | null) => setNewStartTime(newStartTime)}
                        renderInput={(params: any) => <TextField {...params} variant="standard" style={{ width: '100px' }} />}
                    />
                    <Typography sx={{ mx: 2 }}>to</Typography>
                    <MobileTimePicker
                        label="End"
                        value={newEndTime}
                        minTime={newStartTime || undefined}
                        onChange={(newEndTime: dayjs.Dayjs | null) => setNewEndTime(newEndTime)}
                        renderInput={(params: any) => <TextField {...params} variant="standard" style={{ width: '100px' }} />}
                    />
                    <IconButton aria-label="Add new hours" onClick={addHours} style={{
                        color: theme.palette.secondary.contrastText,
                        backgroundColor: theme.palette.secondary.main,
                        marginLeft: '10px',
                    }}>
                        <Icon path={mdiPlus} title="Add new hours" size={1}/>
                    </IconButton>
                </Box>
            </LocalizationProvider>
        </section >
    );
};

export default CalendarPage;
