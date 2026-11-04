/** Mock base URL. With `adb reverse tcp:8787 tcp:8787` Android uses host loopback. */
export const API_BASE_URL = 'http://127.0.0.1:8787';

export const MAX_FILE_BYTES = 10 * 1024 * 1024;

export const POLL_INTERVAL_MS = 400;
