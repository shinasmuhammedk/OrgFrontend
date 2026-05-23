export default function LiveLogsPanel({ liveLogs }) {
    return (
        <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4 mt-6 mb-6">
            <h3 className="text-base font-semibold m-0 mb-3 text-white">
                Live Execution Logs
            </h3>

            {liveLogs.length === 0 ? (
                <p className="text-[#8a8a99] text-sm m-0">
                    Run a workflow to see live execution logs.
                </p>
            ) : (
                <div className="flex flex-col gap-2">
                    {liveLogs.map((log) => (
                        <div
                            key={log.id}
                            className={`font-mono text-xs p-2.5 rounded-lg border border-[#2a2a35] bg-white/5 ${
                                log.status === "success"
                                    ? "text-[#22c55e]"
                                    : log.status === "failed"
                                    ? "text-[#ef4444]"
                                    : "text-[#eab308]"
                            }`}
                        >
                            [{log.time}] {log.message}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
