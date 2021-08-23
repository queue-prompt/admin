const admin = require('firebase-admin')
const Functions  =require('firebase-functions')
const {storageBucket,functionRegion} = require('../constant/constant')

admin.initializeApp({
  storageBucket
})

const bucket =admin.storage().bucket()

const functions = Functions.region(functionRegion)

module.exports={
  bucket,
  functions
}