import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { GeneratedFile } from '../types';

export async function downloadAsZip(files: GeneratedFile[], entityName: string) {
  const zip = new JSZip();

  for (const file of files) {
    // Create folder structure
    const fullPath = `${file.path}/${file.fileName}`;
    zip.file(fullPath, file.content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${entityName}_Generated.zip`);
}

export async function copyAllToClipboard(files: GeneratedFile[]): Promise<void> {
  const content = files
    .map((file) => {
      return `
// ============================================================
// File: ${file.path}/${file.fileName}
// Category: ${file.category}
// ============================================================

${file.content}
`;
    })
    .join('\n\n');

  await navigator.clipboard.writeText(content);
}
