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

export async function getLastNImages(imageCount) {
    return await prisma.image.findMany({
        skip: 3,
        take: imageCount,
        orderBy: {
            createdAt: 'desc'
        }
    })
}

export default prisma