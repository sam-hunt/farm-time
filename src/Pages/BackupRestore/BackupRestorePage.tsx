
import Icon from '@mdi/react';
import { mdiExport, mdiImport } from '@mdi/js';
import { Alert, AlertColor, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Snackbar, Typography } from '@mui/material';
import { useState, ChangeEvent, useRef, SyntheticEvent } from 'react';
import useImportHours, { MergeStrategy } from '../../hooks/use-import-hours';
import useExportHours from '../../hooks/use-export-hours';

const BackupRestorePage = () => {
    const [mergeStrategy, setMergeStrategy] = useState<MergeStrategy>(MergeStrategy.REPLACE);
    const importFileInputEl = useRef<HTMLInputElement>(null);

    const { importJson } = useImportHours(importFileInputEl?.current, mergeStrategy);
    const { exportJson } = useExportHours();

    const [snackOpen, setSnackOpen] = useState<boolean>(false);
    const [snackSeverity, setSnackSeverity] = useState<AlertColor>('info');
    const [snackMessage, setSnackMessage] = useState<string>('');

    const handleExport = () => {
        const { isSuccess, message } = exportJson();
        setSnackMessage(message);
        setSnackSeverity(isSuccess ? 'success' : 'error');
        setSnackOpen(true);
    }
    const handleImport = async () => {
        const { isSuccess, message } = await importJson();
        setSnackMessage(message);
        setSnackSeverity(isSuccess ? 'success' : 'error');
        setSnackOpen(true);
    }
    const handleSnackClose = (event?: SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setSnackOpen(false);
        setSnackMessage('');
        setSnackSeverity('info');
    };


    return <section id='backup-restore-section'>
        <Typography variant='h2' sx={{ my: 2 }}>
            Backup/Restore
        </Typography>

        <section id='backup-section'>
            <Typography variant='h4' sx={{ my: 2 }}>Backup</Typography>
            <Button variant='contained' color='secondary' onClick={handleExport} startIcon={<Icon path={mdiExport} title='Import' size={1} />}>
                Export JSON
            </Button>
        </section>

        <section id='restore-section'>
            <Typography variant='h4' sx={{ mb: 2, mt: 6 }}>Restore</Typography>
            <FormControl>
                <FormLabel id='import-strategy-label'>Strategy</FormLabel>
                <RadioGroup
                    row
                    value={mergeStrategy}
                    aria-labelledby='import-strategy-label'
                    onChange={(event: ChangeEvent<HTMLInputElement>) => { setMergeStrategy(event.target.value as MergeStrategy); }}
                >
                    <FormControlLabel value={MergeStrategy.REPLACE} control={<Radio />} label='Replace' />
                    <FormControlLabel value={MergeStrategy.MERGE} control={<Radio />} label='Merge' />
                </RadioGroup>
            </FormControl>
            <br />
            <br />
            <label htmlFor='upload-json'>
                <input
                    ref={importFileInputEl}
                    onChange={handleImport}
                    style={{ display: 'none' }}
                    id='upload-json'
                    name='upload-json'
                    type='file'
                    accept='.json' />
                <Button
                    variant='contained'
                    color='error'
                    component='span'
                    startIcon={<Icon path={mdiImport} title='Import' size={1} />}
                >
                    Import JSON
                </Button>
            </label>
        </section>

        <Snackbar open={snackOpen} autoHideDuration={5000} onClose={handleSnackClose}>
            <Alert onClose={handleSnackClose} severity={snackSeverity}>{snackMessage}</Alert>
        </Snackbar>

    </section>;
}

export default BackupRestorePage;
