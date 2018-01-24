const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
  console.log(`Palette picker listening on port ${app.get('port')}.`);
});

app.get('/api/v1/palettes/', (request, response) => {
  database('palettes').select()
    .then(palettes => {
      console.log(palettes);
      return response.status(200).json({palettes});
    })
    .catch(palettes => {
      return response.status(500).json({error: 'could not retrieve palettes'});
    });
});

app.get('/api/v1/projects/', (request, response) => {
  database('projects').select()
    .then(projects => {
      console.log(projects);
      return response.status(200).json({projects});
    })
    .catch(() => {
      return response.status(500).json({error: 'could not retrieve folders'});
    });
});

app.post('/api/v1/palettes/', (request, response) => {
  const { palette } = request.body;

  if (!palette.palette_name) {
    return response.status(422).json({error: 'Please enter a valid palette name'});
  } else if (!palette.project_id) {
    return response.status(422).json({error: 'Select a folder to insert a palette'});
  }

  database('palettes').insert(palette).returning('palette_id')
    .then((pId) => {
      return response.status(200).json(pId[0]);
    })
    .catch(() => {
      return response.status(500).json({error: 'Error inserting palette'});
    });
});

app.post('/api/v1/projects/', (request, response) => {
  const { project } = request.body;

  console.log(project);

  if (!project.project_name) {
    return response.status(422).json({error: 'Please enter a valid project name'});
  }

  database('projects').insert(project).returning('project_id')
    .then((pId) => {
      return response.status(200).json(pId[0]);
    })
    .catch(() => {
      return response.status(500).json({error: 'Error inserting project'});
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
    database('palettes').where('palette_id', request.params.id).delete()
      .then(() => {
        response.sendStatus(204);
      })
      .catch(() => {
        response.status(500).json({status: 'Error: could not delete palette.'});
      });
});

app.delete('/api/v1/projects/:id', (request, response) => {
    database('projects').where('project_id', request.params.id).delete()
      .then(() => {
        response.sendStatus(204);
      })
      .catch(() => {
        response.status(500).json({status: 'Error: could not delete palette.'});
      });
});
