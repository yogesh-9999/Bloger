const grid =require('gridfs-stream');
const mongoose=require('mongoose');

const url = process.env.IMG_URL;

let gfs, gridfsBucket;
const conn = mongoose.connection;

conn.once('open',()=>{
    gridfsBucket=new mongoose.mongo.GridFSBucket(
        conn.db,{
            bucketName:'fs'
        }
    );
    gfs=grid(conn.db,mongoose.mongo);
    gfs.collection('fs');
});


const uploadImage =(req,res)=>{

    console.log('upload proces1');
    if(!req.file){
        return res.status(404).json("file not found");}
    const imageUrl=`${url}/file/${req.file.filename}`;
    console.log('upload proces2');
    res.status(200).json(imageUrl);
    
}

const getImage=async(req,res)=>{
    try { 
        
        console.log('get image');
        const file=await gfs.files.findOne({
            filename: req.params.filename 
        });
        console.log('upload proces2');
        const readStream = gridfsBucket.openDownloadStream(file._id);
        console.log('upload proces5');
        readStream.pipe(res);
        
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
}

module.exports = {
   getImage,
   uploadImage
    
   
  };