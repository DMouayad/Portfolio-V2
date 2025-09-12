export function trimText(input: string, maxLength: number = 100): string {
    if (input.length <= maxLength) return input;
    return input.substring(0, maxLength - 3) + "...";
}
export function getCurrentTime(): Date {
    // Create a date object with the current UTC time
    const now = new Date();

    // Convert the UTC time to Italy's time
    const offsetDamascus = 3; // Italy is in Central European Summer Time (UTC+2), but you might need to adjust this based on Daylight Saving Time
    now.setHours(now.getUTCHours() + offsetDamascus);

    return now;
}

export function formatTimeForDamascus(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "2-digit",
        hour12: true, // This will format the time in 12-hour format with AM/PM
        timeZone: "Asia/Damascus",
        timeZoneName: "short",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);

}

export function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}