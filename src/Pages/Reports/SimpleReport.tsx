import dayjs from 'dayjs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import useHours from '../../hooks/use-hours';

interface IReportProps {
    start: dayjs.Dayjs,
    end: dayjs.Dayjs,
}

const SimpleReport = ({ start, end }: IReportProps) => {

    const { hours } = useHours();

    const daysInRange = Object.keys(hours).filter(d => {
        const day = dayjs(d);
        return day.isSame(start, 'day') || day.isSame(end, 'day') || (day.isAfter(start) && day.isBefore(end));
    }).sort();

    const rows = daysInRange.map(date => {
        const dateObj = dayjs(date);
        const totalMins = hours[date].reduce(
            (dayTotal, times) => dayTotal + dayjs(times.endTime).diff(dayjs(times.startTime), 'minutes'),
            0,
        );
        const totalLeftoverMins = totalMins % 60;
        const totalHours = (totalMins - totalLeftoverMins) / 60;
        const timeDiff = `${totalHours} hours, ${totalLeftoverMins.toString().padStart(2,'0')} mins`;
        return {
            key: date,
            day: dateObj.format('dddd'),
            date, timeDiff,
        };
    });

    return (<>
        <TableContainer>
            <Table aria-label='Hours breakdown'>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Day</TableCell>
                        <TableCell align='right'>Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.key}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component='th' scope='row'>
                                {row.date}
                            </TableCell>
                            <TableCell>{row.day}</TableCell>
                            <TableCell align='right'>{row.timeDiff}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>);
}

export default SimpleReport;
