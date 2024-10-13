# Free Image Hosting

Store and share file with temporary url.

A Next.js-based application that uses **[Pinata](https://pinata.cloud/)**  to store image files and MongoDB to store data. Images can be configured with different properties for optimization. Documents are deleted using a TTL index in MongoDB, and triggers-functions in MongoDB remove the corresponding files from Pinata

## 🚀 Features

- **Seamless Image Upload**: File API to upload image.
- **Signed Url**: Signed Url to access image for limited amount of time.
- **Optimized Performance**: Leverages Pinata's Image Opimization for fast content delivery and enhanced user experience.

## 📂 Tech Stack

- **Frontend**: React, Next.js
- **Backend**: Next.js, Pinata API, MongoDb
- **Styling**: Bootstrap
- **Hosting**: Vercel

## ⚙️ Setup & Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/anshulnegitc/fimh.git
   cd fimh
   ```
2. **Install Dependencies:**:
    ```bash
    npm install
    ```
3. **Environment Variables:** Set up environment variables for Pinata API keys in a `.env.local` file(Place .env.local inside fimh folder):
    ```bash
    NEXT_PUBLIC_PINATA_JWT=your_api_key
    NEXT_PUBLIC_GATEWAY_URL=your_secret_key
    NEXT_PUBLIC_DATABASE_URL=your_mongo_connection_url
    ```
4. **Install Dependencies:**
    ```bash
    npm run dev
    ```
5. **MongoDb Setup:**
   1. Create TTL index to delete document
      ```bash
      db.images.createIndex({"expiresAt":1},{expireAfterSeconds:0})
      ```
    
   2. Setup Trigger and Function in MongoDb, to delete Image file from Pinata storage after document gets deleted
      
       Follow this [link](https://www.mongodb.com/docs/atlas/app-services/triggers/database-triggers) to add trigger
       and **Enable Document Pre-Image** to get full document at deletion.
   
       Follow this [link](https://www.mongodb.com/docs/atlas/atlas-ui/triggers/functions/values/) to add JWT secret value
       so that they are accessible in functions.
      
       Add this code in functions
      
       ```bash
       exports = async function(changeEvent) {
        try{
          const { fullDocumentBeforeChange } = changeEvent;
          
          const axios =require("axios").default;
          const options = {
            headers: { 
              'Authorization': `Bearer ${context.values.get('pinataToken')}`
            }
          };
          
          axios.delete(`https://api.pinata.cloud/v3/files/${fullDocumentBeforeChange.imageId}`,options)
          .then((response) => {
            console.log("Success ",response);
          })
          .catch((error) => {
            console.error("Deletion : ",error);
          });
        } catch(err){
          console.error(err)
        }
      };
     
## 📝 License

This project is licensed under the MIT License.
