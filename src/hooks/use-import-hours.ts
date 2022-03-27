import useHours from './use-hours';

export interface IImportResult {
    isSuccess: boolean,
    message: string,
}

export interface IUseImportHours {
    importJson: () => Promise<IImportResult>,
}

export const enum MergeStrategy {
    REPLACE = 'REPLACE',
    MERGE = 'MERGE',
}

const useImportHours = (
    importFileInputEl: HTMLInputElement | null,
    mergeStrategy: MergeStrategy,
): IUseImportHours => {

    const { hours, setHours } = useHours();

    const importJson = async () => {
        if (!importFileInputEl) {
            return {
                isSuccess: false,
                message: 'No input element passed to hook',
            };
        }
        if ((importFileInputEl.files?.length || 0) < 1) {
            return {
                isSuccess: false,
                message: 'No file selected for import',
            };
        }
        const jsonFile = importFileInputEl.files![0];
        const fileText = await jsonFile.text();
        const fileHours = JSON.parse(fileText);
        // TODO: Validate file's JSON schema
        const importedDayCount = Object.keys(fileHours).length;
        let newHours = null;
        if (mergeStrategy === MergeStrategy.REPLACE) newHours = fileHours;
        if (mergeStrategy === MergeStrategy.MERGE) newHours = { ...hours, ...fileHours };
        setHours(newHours);
        return {
            isSuccess: true,
            message: `Imported hours for ${importedDayCount} days from file "${jsonFile.name}"`
        };
    };

    return { importJson };
}

export default useImportHours;
