import { MongoClient } from 'mongodb';

// nie je component je to api...musi sa volat api a byt v priecinku pod pages
// nazov js-fajlu vytvori cestu...cize tu: /api/new-meetup
async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    //const { title, image, address, description } = data;

    //kod je akoze na serveri, preto takyto connection string aj s credentials je ok
    //v kliente takto nikdy nesmie byt!!! napr. javascript, react a pod...
    //...pretoze klient bezi v browseri a vsetci ho uvidia!!!!
    const mongoUrl =
      'mongodb://localhost:27027/meetups?retryWrites=true&w=majority';

    try {
      const client = await MongoClient.connect(mongoUrl);
      const db = client.db();
      const meetupsColletion = db.collection('meetups');
      const result = await meetupsColletion.insertOne(data);
      console.log(result);
      client.close();

      res.status(201).json({ message: 'New meetup inserted' });
    } catch (error) {
      console.log(error);
      res.status(500);
    }
  }
}

export default handler;
