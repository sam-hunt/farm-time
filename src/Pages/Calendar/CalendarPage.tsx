import dayjs from 'dayjs'
import { useState } from 'react';
import AdapterDayjs from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { Box, Button, Divider, IconButton, Typography, useTheme } from '@mui/material';
import Icon from '@mdi/react'
import { mdiPlus, mdiDelete, mdiPencil, mdiCheck, mdiClose, mdiArrowLeft, mdiCalendarToday, mdiArrowRight } from '@mdi/js';
import TimePicker from '@mui/lab/TimePicker';
import useLocalStorageDayjs from '../../hooks/use-local-storage-dayjs';
import useHoursForDay from '../../hooks/use-hours-for-day';
import DateSelectorWithHours from './DateSelectorWithHours';


const today = () => dayjs().hour(0).minute(0).second(0).millisecond(0);

const CalendarPage = () => {
    const [selectedDate, setSelectedDate] = useLocalStorageDayjs('selected-date', today());
    const [editingId, setEditingId] = useState<number | null>(null);
    const isEditing = editingId !== null;

    const { hoursForDay, setHoursForDay, hoursForDayTotal } = useHoursForDay(selectedDate);

    const [newStartTime, setNewStartTime] = useState<dayjs.Dayjs | null>(null);
    const [newEndTime, setNewEndTime] = useState<dayjs.Dayjs | null>(null);

    const theme = useTheme();

    const addHours = () => {
        if (newStartTime && newEndTime) {
            const newHours = [
                ...hoursForDay,
                { startTime: newStartTime.toISOString(), endTime: newEndTime.toISOString() },
            ];
            newHours.sort((a, b) => dayjs(a.startTime).diff(dayjs(b.startTime), 'minute'));
            setHoursForDay(newHours);
        }
        setNewStartTime(null);
        setNewEndTime(null);
        setEditingId(null);
    };
    const editHours = (i: number) => () => {
        setEditingId(i);
        setNewStartTime(dayjs(hoursForDay[i].startTime));
        setNewEndTime(dayjs(hoursForDay[i].endTime));
    }
    const delHours = (i: number) => () => {
        setHoursForDay([...hoursForDay.slice(0, i), ...hoursForDay.slice(i + 1)]);
    }
    const saveEdit = () => {
        if (newStartTime && newEndTime) {
            const newHours = [...hoursForDay]
            newHours[editingId!] = {
                startTime: newStartTime.toISOString(),
                endTime: newEndTime.toISOString(),
            };
            newHours.sort((a, b) => dayjs(a.startTime).diff(dayjs(b.startTime), 'minute'));
            setHoursForDay(newHours);
        }
        setEditingId(null);
    }
    const discardEdit = () => {
        setNewStartTime(null);
        setNewEndTime(null);
        setEditingId(null);
    }

    // Ensure that the date is correct in case a timepicker tries to roll it over a dateline 🤦
    // Also truncate seconds and ms as our pickers and calculations only got to minute-precision
    const ensureSelectedDate = ((date: dayjs.Dayjs | null) => (date
        ?.date(selectedDate.date())
        .month(selectedDate.month())
        .year(selectedDate.year())
        .second(0).millisecond(0) || null))

    return (
        <section>
            <Typography variant='h2' sx={{ my: 2 }}>
                Calendar
            </Typography>
            <DateSelectorWithHours value={selectedDate} onChange={(newValue) => setSelectedDate(newValue || today())} />
            <Button
                variant='outlined'
                aria-label='previous day'
                onClick={() => setSelectedDate(selectedDate.subtract(1, 'day'))}
                color='inherit'
                sx={{ ml: 2, mr: 1 }}
                startIcon={<Icon path={mdiArrowLeft} title='Previous Day' size={0.8} />}
            >
                Previous
            </Button>
            <Button
                variant='outlined'
                aria-label='today'
                onClick={() => setSelectedDate(today())}
                color='inherit'
                sx={{ ml: 1, mr: 1 }}
                startIcon={<Icon path={mdiCalendarToday} title='Today' size={0.8} />}
            >
                Today
            </Button>
            <Button
                variant='outlined'
                aria-label='next day'
                onClick={() => setSelectedDate(selectedDate.add(1, 'day'))}
                color='inherit'
                endIcon={<Icon path={mdiArrowRight} title='Next Day' size={0.8} />}
                sx={{ ml: 1, mr: 2 }}
            >
                Next
            </Button>
            <br /><br />
            <Divider />
            <br />

            <Typography variant='h4' sx={{ mb: 2 }}>
                {hoursForDayTotal.totalHours} Hours,&nbsp;
                {hoursForDayTotal.totalLeftoverMins} Minutes
            </Typography>

            <Box display='flex' flexDirection='row' alignItems='center' mb='30px'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        label='Start'
                        value={newStartTime}
                        onChange={(newStartTime: dayjs.Dayjs | null) => setNewStartTime(ensureSelectedDate(newStartTime))}
                        renderInput={(params: any) => <TextField {...params} variant='standard' style={{ width: '140px' }} />}
                    />
                    <Typography sx={{ mx: 2, mt: 1 }}>to</Typography>
                    <TimePicker
                        label='End'
                        value={newEndTime}
                        onChange={(newEndTime: dayjs.Dayjs | null) => setNewEndTime(ensureSelectedDate(newEndTime))}
                        renderInput={(params: any) => <TextField {...params} variant='standard' style={{ width: '140px' }} />}
                    />
                    {!isEditing ?
                        // Add hours as new row
                        <IconButton aria-label='Add new hours' onClick={addHours} style={{
                            color: theme.palette.secondary.contrastText,
                            backgroundColor: theme.palette.secondary.main,
                            marginLeft: '25px',
                        }}>
                            <Icon path={mdiPlus} title='Add new hours' size={1} />
                        </IconButton>
                        :
                        // Save changes to editing row
                        <IconButton aria-label='Save changes' onClick={saveEdit} style={{
                            color: theme.palette.success.main,
                            marginLeft: '25px',
                        }}>
                            <Icon path={mdiCheck} title='Save changes' size={1} />
                        </IconButton>
                    }
                    <IconButton aria-label='Discard changes' onClick={discardEdit} style={{
                        color: theme.palette.warning.main,
                        marginLeft: '5px',
                    }}>
                        <Icon path={mdiClose} title='Discard changes' size={1} />
                    </IconButton>
                </LocalizationProvider>
            </Box>

            {hoursForDay.map((h, i) => {
                const start = dayjs(h.startTime);
                const end = dayjs(h.endTime);
                const minsDiff = end.diff(start, 'minutes');
                const leftoverMins = minsDiff % 60;
                const hoursDiff = (minsDiff - leftoverMins) / 60;
                const timeDiff = `${hoursDiff}:${leftoverMins.toString().padStart(2, '0')} hours`;
                return (
                    <Box key={i} display='flex' flexDirection='row' alignItems='center' mb='8px' pl='5px'
                        style={{ backgroundColor: isEditing ? (editingId === i ? (theme.palette.mode === 'light' ? 'whitesmoke' : 'black') : 'inherit') : 'inherit' }}
                    >
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
                        <IconButton aria-label='edit' disabled={isEditing && editingId !== i} onClick={editHours(i)} style={{ marginLeft: '10px' }}>
                            <Icon path={mdiPencil}
                                title='Edit'
                                size={0.8}
                            />
                        </IconButton>
                        <IconButton aria-label='delete' disabled={isEditing && editingId !== i} color='error' onClick={delHours(i)}>
                            <Icon path={mdiDelete}
                                title='Delete'
                                size={0.8}
                            />
                        </IconButton>
                    </Box>
                );
            })}
        </section >
    );
};

export default CalendarPage;
