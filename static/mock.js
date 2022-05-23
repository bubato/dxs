/**
 * ・公式リファレンス
 * https://www.npmjs.com/package/faker
 * ・Demo
 * https://cdn.rawgit.com/Marak/faker.js/master/examples/browser/index.html
 */
const faker = require('faker')
// 日本語化
// faker.locale = 'ja'

// const db = {
//   xxx: []
// }
const db = []

const mockLength = 100

/**
 * 企業一覧サンプル
 */
for (let i = 0; i < mockLength; i++) {
  db.push({
    contentid: null,
    companyName: faker.company.companyName(),
    phone: faker.phone.phoneNumber(),
    address: faker.address.streetAddress(),
    jobType: faker.name.jobType(),
    employeeSize: faker.random.number(),
    capital: faker.random.number(),
    tag: 'tag1 tag2',
    all: faker.internet.url(),
    settings: faker.internet.url(),
  })
}

/**
 * スペース4文字でインデント
 */
console.log(JSON.stringify(db, null, 2))
