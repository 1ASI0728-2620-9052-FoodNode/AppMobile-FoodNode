import { ValueObject } from '../../../shared/kernel/ValueObject.js';
import { DomainError } from '../../../shared/kernel/DomainError.js';

function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export class OpeningSchedule extends ValueObject {
  constructor(schedules) {
    super();
    this.schedules = schedules;
    Object.freeze(this);
  }

  /**
   * Checks if the given date falls within any schedule entry.
   * @param {Date} date
   * @returns {boolean}
   */
  isOpenAt(date) {
    const dayOfWeek = date.getDay(); // 0=Sunday, 6=Saturday
    const currentMinutes = date.getHours() * 60 + date.getMinutes();

    return this.schedules.some((entry) => {
      if (entry.dayOfWeek !== dayOfWeek) return false;
      const openMinutes = timeToMinutes(entry.openTime);
      const closeMinutes = timeToMinutes(entry.closeTime);
      return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
    });
  }

  static create(schedules) {
    if (!Array.isArray(schedules)) {
      throw new DomainError('schedules must be an array', 'INVALID_SCHEDULE');
    }
    return new OpeningSchedule(schedules);
  }
}
