const pharmaciesRaw = require('./data/pharmacies.json')
const usersRaw = require('./data/users.json')
const fs = require('fs')

function pharmaciesFormatter (pharmaciesRaw) {
  const newFormat = []
  pharmaciesRaw.forEach(pharmacy => {
    const { name, masks, cashBalance, openingHours } = pharmacy
    const maskList = []

    masks.forEach(maskInfor => {
      const splitInfor = maskInfor.name.split('(')
      const price = maskInfor.price
      const name = splitInfor[0].slice(0, -1)
      const color = splitInfor[1].slice(0, -2)
      const unitPerPack = splitInfor[2].slice(0, splitInfor[2].indexOf(' '))
      maskList.push({ name, price, color, unitPerPack })
    })

    const openingTimes = []
    openingHours.split(' / ').forEach(opening => {
      const openDays = opening.slice(0, opening.length - 14)
      const openTime = opening.slice(opening.length - 13)
      if (openDays.includes(',')) {
        const openDay = openDays.split(', ')
        openDay.forEach(day => {
          openingTimes.push({ openDay: day, openTime })
        })
      } else {
        const openDay = openDays.split(' - ')
        const weekDays = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
        const start = weekDays.indexOf(openDay[0])
        const end = weekDays.indexOf(openDay[1])
        for (let i = start; i <= end; i++) {
          openingTimes.push({ openDay: weekDays[i], openTime })
        }
      }
    })

    newFormat.push({
      name,
      cashBalance,
      openingTimes,
      masks: maskList
    })
  })

  return newFormat
}

function usersFormatter (usersRaw) {
  const newFormat = []
  usersRaw.forEach(userHistory => {
    const { name, cashBalance, purchaseHistories } = userHistory
    const maskList = []

    purchaseHistories.forEach(history => {
      const splitInfor = history.maskName.split('(')
      const name = splitInfor[0].slice(0, -1)
      const color = splitInfor[1].slice(0, -2)
      const unitPerPack = splitInfor[2].slice(0, splitInfor[2].indexOf(' '))
      const { pharmacyName, transactionAmount, transactionDate } = history
      maskList.push({ pharmacyName, name, color, unitPerPack, transactionAmount, transactionDate })
    })

    newFormat.push({
      name,
      cashBalance,
      purchaseHistories: maskList
    })
  })

  return newFormat
}

function writeFile (raw, fn, fileName) {
  const data = fn(raw)
  fs.writeFileSync(`./data/${fileName}.json`, JSON.stringify(data, 0, 2))
}

writeFile(pharmaciesRaw, pharmaciesFormatter, 'pharmaciesTable')
writeFile(usersRaw, usersFormatter, 'usersTable')
