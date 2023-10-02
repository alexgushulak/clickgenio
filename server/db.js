import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function uploadImageDataToDB(imageId, userPrompt, stableDiffusionPrompt) {
    try {
        await prisma.image.create({
            data: {
                imageId: imageId,
                userPrompt: userPrompt,
                stableDiffusionPrompt: stableDiffusionPrompt,
                downloadUrl: `https://clickgenio-production.up.railway.app/download/full?id=${imageId}`,
                previewUrl: `https://clickgenio-production.up.railway.app/download/preview?id=${imageId}`,
                watermarkUrl: `https://clickgenio-production.up.railway.app/download/watermark?id=${imageId}`
            },
        })
        console.log("Image Data Uploaded to DB")
    } catch (err) {
        console.error("Prisma Upload Error", err)
    }
}

export async function getLastNImages(imageCount) {
    try {
        await prisma.$connect()
        const images = await prisma.image.findMany({
            take: imageCount,
            orderBy: {
                createdAt: 'desc'
            }
        })

        return images
    } catch (err) {
        console.error("getLastNImages Error: ", err)
    }
}

export default prisma