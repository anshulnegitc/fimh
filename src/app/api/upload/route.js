import { pinata } from "../../utils/config";
import ShortUniqueId from 'short-unique-id';

import Image from "../../Model/image";
import connectDB from "../../utils/db"


const uid = new ShortUniqueId({ length: 7 });

export async function POST(req) {
    try {
        await connectDB()

        const data = await req.formData();
        const properties = [];
        let expiresAt = null;

        for (let d of data) {
            if (
                ['dpr', 'width', 'height', 'quality', 'sharpen'].includes(d[0])
            ) {
                properties.push({
                    key: d[0],
                    value: parseInt(d[1])
                })
            } else if (
                ['fit', 'format', 'metadata'].includes(d[0])
            ) {
                properties.push({
                    key: d[0],
                    value: d[1]
                })
            } else if (
                ['animation', 'onError', 'format'].includes(d[0])
            ) {
                properties.push({
                    key: d[0],
                    value: Boolean(d[1])
                })
            }
            else if (d[0] == 'expiry') {
                expiresAt = parseInt(d[1]) * 60 * 1000;
                properties.push({
                    key: d[0],
                    value: expiresAt
                })
            }
        }

        const file = data.get("file");
        const uploadData = await pinata.upload.file(file)

        const image = new Image({
            imageId: uploadData.id,
            shortId: uid.rnd(),
            cid: uploadData.cid,
            expiresAt: new Date().getTime() + expiresAt,
            properties: properties
        });

        await image.save()

        return Response.json({ message: "success", data: { shortId: image.shortId } })
    } catch (error) {
        const {
            message = "Internal Server Error!"
        } = error;

        return Response.json({ error: message }, { status: 500 });
    }
}