const admin = require('firebase-admin')
const Functions  =require('firebase-functions')
const {storageBucket,functionRegion} = require('../constant/constant')

admin.initializeApp({
  storageBucket
})

const bucket =admin.storage().bucket()

const functions = Functions.region(functionRegion)

const firestore =admin.firestore()

module.exports={
  firestore,
  bucket,
  functions
}