import dayjs from 'dayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { TextField, Typography } from '@mui/material';
import { DateRange } from '@mui/lab/DateRangePicker/RangeTypes';
import AdapterDayjs from '@mui/lab/AdapterDayjs';
import MobileDateRangePicker from '@mui/lab/MobileDateRangePicker';
import Report from './Report';
import useLocalStorage from '../../hooks/use-local-storage';
import Total from './Total';

const ReportsPage = () => {

    const [dateRange, setValue] = useLocalStorage<DateRange<dayjs.Dayjs>>('report-date-range', [null, null]);
    const renderReport = dateRange[0] !== null && dateRange[1] !== null;

    console.log(dateRange);

    return (
        <section id='reports'>
            <Typography variant='h2' sx={{ my: 2 }}>
                Reports
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDateRangePicker
                    startText="Start"
                    value={dateRange}
                    onChange={(newValue) => setValue(newValue) }
                    inputFormat='YYYY-MM-DD'
                    renderInput={(startProps, endProps) => (<>
                        <TextField {...startProps} variant='standard'/>
                        <Typography sx={{ mx: 2 }}>to</Typography>
                        <TextField {...endProps} variant='standard'/>
                    </>)}
                />
            </LocalizationProvider>
            <br />
            <br />
            {renderReport && <Total start={dateRange[0]!} end={dateRange[1]!} />}
            <br />
            <br />
            {renderReport && <Report start={dateRange[0]!} end={dateRange[1]!} />}
        </section>
    );
}

export default ReportsPage;
