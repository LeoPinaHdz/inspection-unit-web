import fileSaver from 'file-saver';

export const saveFile = (data: any, filename: string | null, mimeType: string | null): void => {
    const blob = new Blob([data], { type: mimeType ?? 'application/pdf; charset=utf-8' });
    fileSaver.saveAs(blob, filename ?? 'File.pdf');
}