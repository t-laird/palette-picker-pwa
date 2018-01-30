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

const requireHTTPS = (req, res, next) => {
  if (req.header['x-forwarded-proto'] !== 'https') {
    return res.redirect('https://' + req.get('host') +req.url);
  } else {
    next();
  }
};

app.use(requireHTTPS);

app.listen(app.get('port'), () => {
  console.log(`Palette picker listening on port ${app.get('port')}.`);
});

app.get('/api/v1/palettes/', (request, response) => {
  database('palettes').select()
    .then(palettes => {
      return response.status(200).json({palettes});
    })
    .catch(palettes => {
      return response.status(500).json({error: 'could not retrieve palettes'});
    });
});

app.get('/api/v1/projects/', (request, response) => {
  database('projects').select()
    .then(projects => {
      return response.status(200).json({projects});
    })
    .catch(() => {
      return response.status(500).json({error: 'could not retrieve folders'});
    });
});

app.post('/api/v1/palettes/', (request, response) => {
  const { palette } = request.body;
  console.log

  let reqParams = ['color1', 'color2', 'color3', 'color4', 'color5', 'palette_name', 'project_id'];

  for (let param of reqParams) {
    if (!palette[param]) {
      return response.status(422).json({error: `Please enter a valid ${param}`});
    }
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
      .catch((error) => {
        response.status(500).json({ error });
      });
});

app.delete('/api/v1/projects/:id', (request, response) => {
    database('palettes').where('project_id', request.params.id).delete()
      .then(() => {
        database('projects').where('project_id', request.params.id).delete()
          .then(() => {
            return response.sendStatus(204);
          })
          .catch(( error ) => {
            return response.status(500).json({ error });
          });
      })
      .catch((error ) => {
        response.status(500).json({ error })
      });
});

module.exports = app;