import dayjs from 'dayjs';
import { useContext } from 'react';
import { HoursContext } from '../../App/App';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface IReportProps {
    start: dayjs.Dayjs,
    end: dayjs.Dayjs,
}

const Report = ({ start, end }: IReportProps) => {

    const { hours } = useContext(HoursContext);

    const daysInRange = Object.keys(hours).filter(d => {
        const day = dayjs(d);
        return day.isSame(start, 'day') || day.isSame(end, 'day') || (day.isAfter(start) && day.isBefore(end));
    }).sort();

    const rows = daysInRange.flatMap(date => hours[date].map(times => {
        const dateObj = dayjs(date);
        const startObj = dayjs(times.startTime);
        const endObj = dayjs(times.endTime);
        const minsDiff = endObj.diff(startObj, 'minutes');
        const leftoverMins = minsDiff % 60;
        const hoursDiff = (minsDiff - leftoverMins) / 60;
        const timeDiff = `${hoursDiff}:${leftoverMins.toString().padStart(2,'0')}`;
        return {
            key: date + times.startTime,
            day: dateObj.format('dddd'),
            start: startObj.format('hh:mm A'),
            end: endObj.format('hh:mm A'),
            date, timeDiff,
        };
    }));

    return (<>
        <TableContainer component={Paper} style={{ padding: '5px' }} >
            <Table aria-label="Hours breakdown">
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Day</TableCell>
                        <TableCell align="right">Start</TableCell>
                        <TableCell align="right">End</TableCell>
                        <TableCell align="right">Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.key}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.date}
                            </TableCell>
                            <TableCell>{row.day}</TableCell>
                            <TableCell align="right">{row.start}</TableCell>
                            <TableCell align="right">{row.end}</TableCell>
                            <TableCell align="right">{row.timeDiff}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>);
}

export default Report;
