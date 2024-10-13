import mongoose from "mongoose";

const ImageSchema = mongoose.Schema(
    {
        imageId: String,
        cid: String,
        shortId: String,
        expiresAt: Date,
        properties: [mongoose.Schema({ key: String, value: mongoose.Schema.Types.Mixed }, { _id: false })],
        createdAt: { type: Date, default: Date.now }
    }
);

let Image = null
try {
    Image = mongoose.model('image')
} catch {
    Image = mongoose.model("image", ImageSchema)
}
export default Image;