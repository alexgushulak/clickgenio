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

export default prisma