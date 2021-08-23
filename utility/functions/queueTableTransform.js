import moment from 'moment'

export const rowsDateTransformtoDateList = (rowsDate) => {
  const data = []
  for (let i = 0; i < rowsDate.length; i++) {
    const row = rowsDate[i]
    if (row.checkbox) {
      data.push(moment(row.date).format('YYYY-MM-DD'))
    }
  }

  return data
}

export const rowsTimeTransformToTimeslotsHolder = (rowsTime) => {
  let timesHolder = {}
  for (let i = 0; i < rowsTime.length; i++) {
    const row = rowsTime[i]
    const splitStart = row.start.split(':')
    const splitEnd = row.end.split(':')
    const timeStart = splitStart[0] + splitStart[1]
    const timeEnd = splitEnd[0] + splitEnd[1]
    timesHolder = {
      ...timesHolder,
      [`${timeStart}-${timeEnd}`]: row.limit
    }
  }

  return timesHolder
}

export const rowsDateTransformToRowDateHolder = (rowsDate) => {
  let holder = {}
  for (let i = 0; i < rowsDate.length; i++) {
    const row = rowsDate[i]
    holder = {
      ...holder,
      [row.date]: {
        ...row
      }
    }
  }

  return holder
}

export const timeHolderTransformToRowsTime = (timeslotsList) => {
  const data = []
  for (const time in timeslotsList) {
    const timeslot = timeslotsList[time]
    const splitTime = time.split('-')
    const start = splitTime[0].slice(0, 2) + ':' + splitTime[0].slice(2, 4)
    const end = splitTime[1].slice(0, 2) + ':' + splitTime[1].slice(2, 4)
    data.push({
      start,
      end,
      limit: timeslot.open,
      reserve: timeslot.reserve
    })
  }

  return data
}

export const createdDateTransformDateList = (month, year, createdDate) => {
  const endOfMonth = Number.parseInt(moment().endOf('months').format('DD'))

  let dataHolder = {}
  for (let i = 1; i <= endOfMonth; i++) {
    const date = `${year}-${month}-${i < 10 ? `0${i}` : i}`
    if(createdDate[date]) {
      dataHolder = {
        ...dataHolder,
        [date]: {
          ...createdDate[date]
        }
      }
    } else {
      dataHolder[date] = {}
    }
  }

  return dataHolder
}
