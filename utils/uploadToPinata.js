const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
// require("dotenv").config()

const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)

async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagesPath)
    console.log("Uploading to Pinata...")
    let responses = []
    for (const fileIndex in files) {
        const filename = files[fileIndex]
        console.log(`Working on ${filename}...`)
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${filename}`)
        const options = {
            pinataMetadata: {
                name: filename,
            },
        }
        try {
            const response = await pinata.pinFileToIPFS(readableStreamForFile, options)
            responses.push(response)
        } catch (error) {
            console.log(error)
        }
    }
    return { responses, files }
}

async function storeTokenUriMetadata(metadata) {
    try {
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (error) {
        console.log(error)
    }
    return null
}

module.exports = { storeImages, storeTokenUriMetadata }
