import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { isUri } from 'valid-url';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  app.get("/filteredimage", async (req: Request, res: Response) => {
    const { image_url: imageUrl } = req.query;
    if (!imageUrl || !isUri(imageUrl)) {
      return res.status(400).send({ auth: false, message: 'Image url is not available' });
    }
  //    2. call filterImageFromURL(image_url) to filter the image
    const filteredPath = await filterImageFromURL(imageUrl);
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
    res.sendFile(filteredPath, {}, () => deleteLocalFiles([filteredPath]));
  });

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();