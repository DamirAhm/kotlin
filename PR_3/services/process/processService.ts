export class ProcessService {
	static handleExit(callback: Function) {
		process.on('SIGTERM', (signal) => callback);
		process.on('SIGINT', (signal) => callback);
		process.on('SIGUSR2', (signal) => callback);
	}
}
