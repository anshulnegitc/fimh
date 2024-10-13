import { pinata } from "../../../utils/config";

import Image from "../../../Model/image";
import connectDB from "../../../utils/db"



export async function GET(req, { params }) {
    try {
        await connectDB()
        const { id } = params;

        const data = await Image.findOne({ shortId: id }, { _id: 0, cid: 1, expiresAt: 1, createdAt: 1, properties: 1 }).lean();

        if (data) {
            let optimizeImageProp = {}
            for (let prop in data.properties) {
                if (prop !== 'expiry') {
                    optimizeImageProp[prop] = data.properties[prop]
                }
            }

            const diff = Math.abs(data.expiresAt - new Date());
            const signedUrl = await pinata.gateways.createSignedURL({
                cid: data.cid,
                expires: Math.ceil(diff / 1000)
            }).optimizeImage(optimizeImageProp);

            return Response.json({
                message: "success",
                data: {
                    url: signedUrl,
                    createdAt: data.createdAt,
                    expiresAt: data.expiresAt
                }
            });

        } else {
            throw new Error('No Image Found!')
        }
    } catch (error) {
        const {
            message = 'Internal Server Error'
        } = error

        return Response.json({ error: message }, { status: 500 })
    }
}