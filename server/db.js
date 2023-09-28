import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function create(imageId, text, s3url) {
    await prisma.image.create({
        data: {
            imageId: {imageId},
            text: {text},
            s3url: {s3url},
        },
    })
}

export async function getAllImages() {
    return await prisma.image.findMany()
}

export async function getLastNImages(imageCount) {
    return await prisma.image.findMany({
        take: imageCount,
        orderBy: {
            createdAt: 'desc'
        }
    })
}

console.log(await getAllImages())

export default prisma