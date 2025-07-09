function getDaysBetweenDates(startDate: Date, endDate: Date): number {
    // Calculate the time difference in milliseconds
    const timeDifference = endDate.getTime() - startDate.getTime();

    // Convert milliseconds to days
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return daysDifference;
}

function getDayOfWeek(date: Date): string {
    const dayOfWeekOptions: any = { weekday: 'short', timeZone: 'America/Sao_Paulo', locale: 'pt-BR' };
    const strDayOfWeek = date.toLocaleDateString('pt-BR', dayOfWeekOptions);
    return strDayOfWeek;
}

function getDayOfMonth(date: Date): number {
    const dayOfMonthOptions: any = { day: '2-digit', timeZone: 'America/Sao_Paulo', locale: 'pt-BR' };
    const strDayOfMonth = date.toLocaleDateString('pt-BR', dayOfMonthOptions);
    return Number(strDayOfMonth);
}

export { getDaysBetweenDates, getDayOfWeek, getDayOfMonth }