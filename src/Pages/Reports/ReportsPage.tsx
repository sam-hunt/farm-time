import dayjs from 'dayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { DateRange } from '@mui/lab/DateRangePicker/RangeTypes';
import AdapterDayjs from '@mui/lab/AdapterDayjs';
import MobileDateRangePicker from '@mui/lab/MobileDateRangePicker';
import useLocalStorage from '../../hooks/use-local-storage';
import useHoursForRange from '../../hooks/use-hours-for-range';
import DetailedReport from './DetailedReport';
import SimpleReport from './SimpleReport';

const ReportsPage = () => {

    const [dateRange, setValue] = useLocalStorage<DateRange<dayjs.Dayjs>>('report-date-range', [null, null]);
    const [selectedReport, setSelectedReport] = useLocalStorage('selected-report', 'simple');
    const { totalHours, totalLeftoverMins } = useHoursForRange(...dateRange);

    const renderReport = dateRange[0] !== null && dateRange[1] !== null;

    return (
        <section id='reports'>
            <Typography variant='h2' sx={{ my: 2 }}>
                Reports
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDateRangePicker
                    startText='Start'
                    value={dateRange}
                    onChange={(newValue) => setValue(newValue)}
                    inputFormat='YYYY-MM-DD'
                    renderInput={(startProps, endProps) => (<>
                        <TextField {...startProps} variant='standard' />
                        <Typography sx={{ mx: 2 }}>to</Typography>
                        <TextField {...endProps} variant='standard' />
                    </>)}
                />
            </LocalizationProvider>
            <br />
            <br />
            {renderReport && <Typography variant='h4'>Total {totalHours} hours{totalLeftoverMins > 0 && `, ${totalLeftoverMins} minutes`}</Typography>}
            <br />
            <InputLabel id='report-selector-label'>Report</InputLabel>
            <Select
                style={{ minWidth: '200px' }}
                labelId='report-selector-label'
                value={selectedReport}
                label='Report'
                onChange={(event) => setSelectedReport(event.target.value)}
            >
                <MenuItem value='simple'>Simple</MenuItem>
                <MenuItem value='detailed'>Detailed</MenuItem>
            </Select>
            <br />
            <br />
            {renderReport && {
                'simple': <SimpleReport start={dateRange[0]!} end={dateRange[1]!} />,
                'detailed': <DetailedReport start={dateRange[0]!} end={dateRange[1]!} />,
            }[selectedReport]}
            <br />
            <br />
        </section>
    );
}

export default ReportsPage;
