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

export async function markImageAsPurchased(imageID) {
  try {
    const image = await prisma.image.findUnique({
      where: { imageId: imageID },
    });

    if (!image) {
      throw new Error(`Image with imageID ${imageID} not found`);
    }

    // Update the isDownloaded and isPurchased fields to true
    await prisma.image.update({
      where: { imageId: imageID },
      data: {
        isPurchased: true,
      },
    });

    console.log(`Image with imageID ${imageID} marked as purchased.`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

export async function markImageAsDownloaded(imageID) {
  try {
    console.log(imageID)
    // Find the image by its imageID
    const image = await prisma.image.findUnique({
      where: { imageId: imageID },
    });

    if (!image) {
      throw new Error(`Image with imageID ${imageID} not found`);
    }

    // Update the isDownloaded and isPurchased fields to true
    await prisma.image.update({
      where: { imageId: imageID },
      data: {
        isDownloaded: true,
      },
    });

    console.log(`Image with imageID ${imageID} marked as downloaded.`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

export async function markCTAClicked(sessionId) {
  try {
    // Find the image by its imageID
    const session = await prisma.userdata.findUnique({
      where: { sessionId: sessionId },
    });

    if (!session) {
      throw new Error(`Session with Session ID ${imageID} not found`);
    }

    // Update the isDownloaded and isPurchased fields to true
    await prisma.userdata.update({
      where: { sessionId: sessionId },
      data: {
        isCTAClicked: true,
      },
    });

    console.log(`Session with Session ID ${imageID} marked as clicked.`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

export default prisma