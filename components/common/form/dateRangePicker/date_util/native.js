import { dateFormat, getWeek } from '../dateformat'

const DateUtil = {
  isSame: (date1, date2, granularity) => {
    const dt1 = new Date(date1)
    const dt2 = new Date(date2)
    if (granularity === 'date') {
      dt1.setHours(0, 0, 0, 0)
      dt2.setHours(0, 0, 0, 0)
    }
    return dt1.getTime() === dt2.getTime()
  },
  daysInMonth: (year, month) => {
    return new Date(year, month, 0).getDate()
  },
  weekNumber: (date) => {
    return getWeek(date)
  },
  format: (date, mask) => {
    return dateFormat(date, mask)
  },
  nextMonth: (date) => {
    const nextMonthDate = new Date(date.getTime())
    nextMonthDate.setDate(1)
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1)
    return nextMonthDate
  },
  prevMonth: (date) => {
    const prevMonthDate = new Date(date.getTime())
    prevMonthDate.setDate(1)
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1)
    return prevMonthDate
  },
  validateDateRange: (newDate, min, max) => {
    const maxDate = new Date(max)
    const minDate = new Date(min)

    if (max && newDate.getTime() > maxDate.getTime()) {
      return maxDate
    }

    if (min && newDate.getTime() < minDate.getTime()) {
      return minDate
    }

    return newDate
  },
  localeData: (options) => {
    const defaultLocale = {
      direction: 'ltr',
      format: 'yyyy/mm/dd',
      separator: ' ~ ',
      applyLabel: 'Apply',
      cancelLabel: 'Cancel',
      weekLabel: 'W',
      customRangeLabel: 'Custom Range',
      daysOfWeek: ['日', '月', '火', '水', '木', '金', '土'],
      monthNames: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
      ],
      firstDay: 0,
    }

    return { ...defaultLocale, ...options }
  },
  yearMonth: (date) => {
    const month = date.getMonth() + 1
    return date.getFullYear() + (month < 10 ? '0' : '') + month
  },
  isValidDate: (d) => {
    return d instanceof Date && !isNaN(d)
  },
}

export default DateUtil
