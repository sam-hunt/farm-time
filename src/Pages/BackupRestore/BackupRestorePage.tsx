
import dayjs from 'dayjs';
import Icon from '@mdi/react';
import { mdiExport, mdiImport } from '@mdi/js';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { useState, ChangeEvent, useRef } from 'react';
import useHours from '../../hooks/use-hours';

enum MergeStrategy {
    REPLACE = 'REPLACE',
    MERGE = 'MERGE',
}

const BackupRestorePage = () => {
    const [mergeStrategy, setMergeStrategy] = useState<MergeStrategy>(MergeStrategy.REPLACE);
    const { hours, setHours } = useHours();
    const importFileInputEl = useRef<HTMLInputElement>(null);

    const importJson = async () => {
        if (!importFileInputEl?.current) return;
        const fileInput: HTMLInputElement = importFileInputEl!.current;
        if ((fileInput.files?.length || 0) < 1) return;
        const jsonFile = fileInput.files![0];
        const fileText = await jsonFile.text();
        const fileHours = JSON.parse(fileText);
        // TODO: Validate file's JSON schema
        let newHours = null;
        if (mergeStrategy === MergeStrategy.REPLACE) newHours = fileHours;
        if (mergeStrategy === MergeStrategy.MERGE) newHours = { ...hours, ...fileHours };
        setHours(newHours);
    }
    const exportJson = () => {
        const filename = `farm-time-export-${dayjs().format('YYYYMMDD-hhmmss')}.json`;
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(hours)));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    return <section id='backup-restore-section'>
        <Typography variant='h2' sx={{ my: 2 }}>
            Backup/Restore
        </Typography>

        <section id='backup-section'>
            <Typography variant='h4' sx={{ my: 2 }}>Backup</Typography>
            <Button variant='contained' color='secondary' onClick={exportJson} startIcon={<Icon path={mdiExport} title='Import' size={1} />}>
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
                    onChange={importJson}
                    style={{ display: 'none' }}
                    id='upload-json'
                    name='upload-json'
                    type='file'
                    accept='.json'/>
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

    </section>;
}

export default BackupRestorePage;
