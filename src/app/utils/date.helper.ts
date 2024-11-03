export class DateHelper {

  public static parseIsoToDate(strIsoDate: string): Date {
    return new Date([strIsoDate.slice(0, 4), '-', strIsoDate.slice(4, 6), '-', strIsoDate.slice(6), 'T00:00'].join(''));
  }

  public static parseDateToIso(date: Date): string {
    return date.toISOString().slice(0, 10).replace(/\-/g, '');
  }

  public static buildDateFromYYYYMMDD(stringDate: string) {
    const year: number = Number(stringDate.slice(0, 4));
    const month: number = Number(stringDate.slice(4, 6)) - 1; // Restamos 1 al mes porque en JavaScript los meses van de 0 a 11
    const day: number = Number(stringDate.slice(6, 8));

    const date: Date = new Date(year, month, day);

    return date;
  }
}
