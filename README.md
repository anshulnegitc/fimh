# Free Image Hosting

Store and share file with temporary url.

A Next.js-based application that uses Pinata to store image files and MongoDB to store data. Images can be configured with different properties for optimization. Documents are deleted using a TTL index in MongoDB, and triggers or functions in MongoDB remove the corresponding files from Pinata
