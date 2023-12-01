import express from 'express';
import { sequelize } from './config/database';
import Document from './models/document';
const cors = require('cors');


const app = express();
const PORT = 3000;
app.use(cors());

app.use(express.json());

// Synchronisation du base de donnée 
sequelize.sync().then(() => {
    console.log('Database synchronized');
  });


// api :lister les documents avec pagination et filtration du type
app.get('/documents', async (req, res) => {
    const { page: rawPage = '1', documentType } = req.query;
  
    // conserver page avec type any
    const page: any = rawPage;
  
    const limit = 10;
    const offset = (page - 1) * limit;
  
    // Utiliser un objet pour construire la clause WHERE en fonction des paramètres fournis
    const whereClause: any = {};
    if (documentType) {
      whereClause.type = documentType;
    }
  
    try {
      // Utiliser findAll au lieu de findAndCountAll pour obtenir les résultats paginés
      const documents = await Document.findAll({
        where: whereClause,
        limit,
        offset,
      });
  
      // Utiliser count pour obtenir le nombre total d'éléments sans pagination
      const totalCount = await Document.count({ where: whereClause });
  
      res.json({
        documents,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching documents.' });
    }
  });
  

// api pour afficher un document avec id
app.get('/documents/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const document = await Document.findByPk(id);

    if (document) {
      res.json(document);
    } else {
      res.status(404).json({ error: 'Document not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching the document.' });
  }
});

// api pour mettre a jour un document
app.put('/documents/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type, description } = req.body;

  try {
    const document = await Document.findByPk(id);

    if (document) {
      document.name = name || document.name;
      document.type = type || document.type;
      document.description = description || document.description;

      await document.save();

      res.json(document);
    } else {
      res.status(404).json({ error: 'Document not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating the document.' });
  }
});

// api pour supprimer un api
app.delete('/documents/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const document = await Document.findByPk(id);

    if (document) {
      await document.destroy();
      res.json({ message: 'Document deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Document not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting the document.' });
  }
});
app.post('/documents', async (req, res) => {
    try {
      const { name, type, description } = req.body;
      
      console.log('Received values:', name, type, description);
  
      // Validate name length
      if (typeof name !== 'string' || name.length > 48) {
        return res.status(400).json({ error: 'Name must be a string with a maximum length of 48 characters' });
      }
  
      const newDocument = await Document.create({ name, type, description });
  
      res.json(newDocument);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.get('/alldocuments', async (req, res) => {
    try {
      const allDocuments = await Document.findAll();
      res.json(allDocuments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching all documents.' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});



