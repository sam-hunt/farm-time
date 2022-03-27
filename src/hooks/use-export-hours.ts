import dayjs from 'dayjs';
import useHours from './use-hours';

export interface IExportResult {
    isSuccess: boolean,
    message: string,
}

export interface IUseExportHours {
    exportJson: () => IExportResult,
}

const useExportHours = (): IUseExportHours => {
    const { hours } = useHours();

    const exportJson = () => {
        const filename = `farm-time-export-${dayjs().format('YYYYMMDD-hhmmss')}.json`;
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(hours)));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        return {
            isSuccess: true,
            message: `Exported hours for ${Object.keys(hours).length} days to download file "${filename}"`,
        };
    };

    return { exportJson };
}

export default useExportHours;
