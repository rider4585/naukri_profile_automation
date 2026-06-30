import { DateTime } from "luxon";
import { loadState, saveState } from "./state.service.js";
import { todayIST } from "../utils/time.js";

function randomTime(startHour, endHour) {
    const start = DateTime.now().set({ hour: startHour, minute: 0 });
    const end = DateTime.now().set({ hour: endHour, minute: 59 });

    const diff = end.toMillis() - start.toMillis();
    const random = start.toMillis() + Math.floor(Math.random() * diff);

    return DateTime.fromMillis(random).setZone("Asia/Kolkata");
}

export function getTodaySchedule() {
    const state = loadState();
    const today = todayIST();

    if (state?.date === today) return state;

    const newState = {
        date: today,
        morningTime: randomTime(8, 9).toFormat("HH:mm"),
        afternoonTime: randomTime(13, 14).toFormat("HH:mm"),
        morningDone: false,
        afternoonDone: false,
    };

    saveState(newState);

    return newState;
}

export function shouldRunNow(schedule) {
    const now = DateTime.now().setZone("Asia/Kolkata").toFormat("HH:mm");

    if (now === schedule.morningTime && !schedule.morningDone) {
        return "morning";
    }

    if (now === schedule.afternoonTime && !schedule.afternoonDone) {
        return "afternoon";
    }

    return null;
}

export function markDone(type) {
    const state = loadState();

    if (!state) return;

    state[`${type}Done`] = true;

    saveState(state);
}