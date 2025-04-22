export default async function handler(req, res) {
  // try {
  //     switch (req.method) {
  //         case 'GET':
  //             return res.status(200).json({ message: 'GET request successful' });
  //         case 'POST':
  //             const chunks = [];
  //             for await (const chunk of req) {
  //                 chunks.push(chunk);
  //             }
  //             const body = JSON.parse(Buffer.concat(chunks).toString());
  //             return res.status(201).json({ message: 'POST request successful', data: body });
  //         default:
  //             return res.status(405).json({ error: 'Method Not Allowed' });
  //     }
  // } catch (error) {
  //     console.error('Error handling request:', error.message);
  //     return res.status(500).json({ error: 'Internal Server Error' });
  // }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
