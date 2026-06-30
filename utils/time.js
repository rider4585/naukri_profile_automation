import { DateTime } from "luxon";

export function nowIST() {
    return DateTime.now().setZone("Asia/Kolkata");
}

export function formatTime(dt) {
    return dt.toFormat("HH:mm");
}

export function todayIST() {
    return nowIST().toFormat("yyyy-MM-dd");
}