
"use client";

export default function StopwatchOverview({laps = []}) {
  return (
    <div className={`w-full p-2 transition-all duration-300`}>
    <h3 className="text-lg font-semibold text-gray-700 mb-3">Lap Times</h3>
      {laps?.length > 0 && (
        <div className="mt-8">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg shadow-inner p-4 max-h-96 overflow-y-auto border border-purple-100">
            <ul className="divide-y divide-purple-100">
              {[...laps].reverse().map((lap, index) => {
                const min = Math.floor((lap % 3600000) / 60000);
                const sec = Math.floor((lap % 60000) / 1000);
                const ms = Math.floor((lap % 1000) / 10);
                return (
                  <li key={index} className="py-2 flex justify-between text-sm text-gray-700">
                    <span className="font-medium text-indigo-600">Lap {laps.length - index}</span>
                    <span className="font-mono tabular-nums">
                      {String(min).padStart(2, '0')}:{String(sec).padStart(2, '0')}.{String(ms).padStart(2, '0')}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
