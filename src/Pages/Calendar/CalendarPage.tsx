import dayjs from 'dayjs'
import { useState } from 'react';
import AdapterDayjs from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { Box, IconButton, Typography } from '@mui/material';
import { theme } from '../../theme';
import Icon from '@mdi/react'
import { mdiPlus, mdiDelete } from '@mdi/js';
import TimePicker from '@mui/lab/TimePicker';
import useLocalStorageDayjs from '../../hooks/use-local-storage-dayjs';
import useHoursForDay from '../../hooks/use-hours-for-day';
import DateSelectorWithHours from './DateSelectorWithHours';


const today = () => dayjs().hour(0).minute(0).second(0).millisecond(0);

const CalendarPage = () => {
    const [selectedDate, setSelectedDate] = useLocalStorageDayjs('selected-date', today());

    const { hoursForDay, setHoursForDay, hoursForDayTotal } = useHoursForDay(selectedDate);

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

    // Ensure that the date is correct, e.g. in case a timepicker tries to roll it over a dateline 🤦
    const ensureSelectedDate = ((date: dayjs.Dayjs | null) => date?.date(selectedDate.date()).month(selectedDate.month()).year(selectedDate.year()) || null)

    return (
        <section>
            <Typography variant='h2' sx={{ my: 2 }}>
                Calendar
            </Typography>
            <DateSelectorWithHours value={selectedDate} onChange={(newValue) => setSelectedDate(newValue || today())} />
            <Typography variant='h4' sx={{ mb: 2 }}>
                {hoursForDayTotal.totalHours} Hours,&nbsp;
                {hoursForDayTotal.totalLeftoverMins} Minutes
            </Typography>

            {hoursForDay.map((h, i) => {
                const start = dayjs(h.startTime);
                const end = dayjs(h.endTime);
                const minsDiff = end.diff(start, 'minutes');
                const leftoverMins = minsDiff % 60;
                const hoursDiff = (minsDiff - leftoverMins) / 60;
                const timeDiff = `${hoursDiff}:${leftoverMins.toString().padStart(2, '0')} hours`;
                return (
                    <Box key={i} display="flex" flexDirection="row" alignItems="center" mb="8px">
                        <Typography color='primary'>
                            <strong>{start.format('hh:mm A')}</strong>
                        </Typography>
                        <Typography sx={{ mx: 1 }}>to</Typography>
                        <Typography color='primary'>
                            <strong>{dayjs(end).format('hh:mm A')}</strong>
                        </Typography>
                        <Typography color='secondary' sx={{ ml: 2 }}>
                            (<strong>{timeDiff}</strong>)
                        </Typography>
                        <IconButton aria-label="delete" color="error" onClick={delHours(i)} style={{ marginLeft: '10px' }}>
                            <Icon path={mdiDelete}
                                title="Delete"
                                size={0.8}
                            />
                        </IconButton>
                    </Box>);
            }
            )}
            <Box display="flex" flexDirection="row" alignItems="center" mt="30px">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        label="Start"
                        value={newStartTime}
                        maxTime={newEndTime || undefined}
                        onChange={(newStartTime: dayjs.Dayjs | null) => setNewStartTime(ensureSelectedDate(newStartTime))}
                        renderInput={(params: any) => <TextField {...params} variant="standard" style={{ width: '110px' }} />}
                    />
                    <Typography sx={{ mx: 2, mt: 1 }}>to</Typography>
                    <TimePicker
                        label="End"
                        value={newEndTime}
                        minTime={newStartTime || undefined}
                        onChange={(newEndTime: dayjs.Dayjs | null) => setNewEndTime(ensureSelectedDate(newEndTime))}
                        renderInput={(params: any) => <TextField {...params} variant="standard" style={{ width: '110px' }} />}
                    />
                    <IconButton aria-label="Add new hours" onClick={addHours} style={{
                        color: theme.palette.secondary.contrastText,
                        backgroundColor: theme.palette.secondary.main,
                        marginLeft: '20px',
                    }}>
                        <Icon path={mdiPlus} title="Add new hours" size={1} />
                    </IconButton>
                </LocalizationProvider>
            </Box>
        </section >
    );
};

export default CalendarPage;
