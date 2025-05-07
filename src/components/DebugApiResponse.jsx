import React from 'react';

const DebugApiResponse = ({ apiData, connectionTest }) => {
  return (
    <div className="mb-8 rounded-lg border border-purple-800 bg-slate-900/70 p-4 text-left">
      <h3 className="mb-2 font-mono text-lg font-bold text-purple-400">API Response Debug</h3>
      
      {connectionTest && (
        <div className="mb-4">
          <h4 className="font-mono text-sm font-bold text-purple-300">Connection Test:</h4>
          <div className="mt-1 overflow-x-auto rounded-md bg-slate-800/50 p-3 font-mono text-xs text-slate-300">
            <pre>{JSON.stringify(connectionTest, null, 2)}</pre>
          </div>
        </div>
      )}

      <div>
        <h4 className="font-mono text-sm font-bold text-purple-300">Projects Data:</h4>
        <div className="mt-1 max-h-60 overflow-y-auto rounded-md bg-slate-800/50 p-3 font-mono text-xs text-slate-300">
          <pre>{JSON.stringify(apiData, null, 2)}</pre>
        </div>
      </div>
      
      {Array.isArray(apiData) && apiData.length > 0 && apiData[0].image && (
        <div className="mt-4">
          <h4 className="font-mono text-sm font-bold text-purple-300">First Image Path:</h4>
          <p className="break-all font-mono text-xs text-slate-300">{apiData[0].image}</p>
          
          <h4 className="mt-2 font-mono text-sm font-bold text-purple-300">Resolved URL:</h4>
          <p className="break-all font-mono text-xs text-slate-300">
            {apiData[0].image.startsWith('http') 
              ? apiData[0].image 
              : `${import.meta.env.VITE_API_BASE_URL}/${apiData[0].image}`}
          </p>
          
          <div className="mt-2">
            <h4 className="font-mono text-sm font-bold text-purple-300">Test Image:</h4>
            <img 
              src={apiData[0].image.startsWith('http') 
                ? apiData[0].image 
                : `${import.meta.env.VITE_API_BASE_URL}/${apiData[0].image}`}
              alt="Test" 
              className="mt-1 h-20 w-auto rounded border border-purple-800"
              onError={(e) => {
                e.target.parentElement.innerHTML += '<p class="text-red-400 text-xs mt-1">✖️ Image failed to load</p>';
              }}
              onLoad={(e) => {
                e.target.parentElement.innerHTML += '<p class="text-green-400 text-xs mt-1">✓ Image loaded successfully</p>';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugApiResponse;