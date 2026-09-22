import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';

export function FileDropzone({ onFileSelect, selectedFile, error, isLoading }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    multiple: false,
    disabled: isLoading
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-200 cursor-pointer ${
          isDragActive
            ? 'border-sky-500 bg-sky-50/50 scale-[1.01]'
            : selectedFile
            ? 'border-emerald-300 bg-emerald-50/30'
            : error
            ? 'border-rose-300 bg-rose-50/30'
            : 'border-slate-200 bg-slate-50/40 hover:border-sky-400 hover:bg-sky-50/20'
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center border border-slate-100">
            {selectedFile ? (
              <FileSpreadsheet className="w-7 h-7 text-emerald-600" />
            ) : isDragActive ? (
              <Upload className="w-7 h-7 text-sky-600 animate-bounce" />
            ) : (
              <Upload className="w-7 h-7 text-slate-400" />
            )}
          </div>

          {selectedFile ? (
            <div>
              <p className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 inline" />
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {(selectedFile.size / 1024).toFixed(1)} KB — Click or drag to change file
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {isDragActive ? 'Drop your CSV file here...' : 'Click to select or drag & drop CSV file'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Upload bulk water sample data matching standard column readings
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-600 font-medium mt-2 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export default FileDropzone;
