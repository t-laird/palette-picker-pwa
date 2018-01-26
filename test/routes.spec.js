process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex');


chai.use(chaiHttp);

describe('Client routes', () => {
  it('should return the palette picker homepage', () => {
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(error => {
        throw error;
      })
  });

  it('should return a 404 given an unexpected route', () => {
    return chai.request(server)
      .get('/sdlfjsldf')
      .then( () => {
      })
      .catch(error => {
        error.should.have.status(404);
      });
  });
});

describe('API routes', () => {
  beforeEach( (done) => {
    knex.seed.run()
      .then(() => {
        done();
      });
  });
  
  describe('GET /api/v1/projects', () => {
    it('should get from api/v1/projects', () => {
      return chai.request(server)
        .get('/api/v1/palettes')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.palettes.length.should.equal(3);
  
          response.body.palettes[0].should.have.property('palette_id');
          response.body.palettes[0].should.have.property('project_id');
          response.body.palettes[0].should.have.property('color1');
          response.body.palettes[0].should.have.property('color2');
          response.body.palettes[0].should.have.property('color3');
          response.body.palettes[0].should.have.property('color4');
          response.body.palettes[0].should.have.property('color5');
          
          const findPalette = response.body.palettes.find( palette => palette.color1 === '#3507F7');
  
          findPalette.color2.should.equal('#A28C59');
          findPalette.color3.should.equal('#D2E252');
          findPalette.color4.should.equal('#7158FD');
          findPalette.color5.should.equal('#7848C4');
        })
        .catch(error => {
          throw error;
        })
    });
  });

  describe('GET /api/v1/projects', () => {
    it('should GET from api/v1/projects', () => {
      return chai.request(server)
        .get('/api/v1/projects')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.projects.length.should.equal(5);
  
          response.body.projects[0].should.have.property('project_id');
          response.body.projects[0].should.have.property('project_name');
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('POST /api/v1/palettes', () => {
    it('should POST successfully to /api/v1/palettes', () => {
      return chai.request(server)
        .get('/api/v1/projects')
        .then(getRes => {
          return chai.request(server)
          .post('/api/v1/palettes')
          .send({
            palette: 
              {
                color1: '#123456',
                color2: '#234567',
                color3: '#345678',
                color4: '#456789',
                color5: '#567890',
                palette_name: 'test pal',
                project_id: getRes.body.projects[0].project_id
              }
          })
          .then(response => {
            response.should.have.status(200);
            response.should.be.json;

            const resBodyType = typeof response.body;

            resBodyType.should.equal('number');
          })
          .catch(error => {
            throw error;
          });
        });
    });

    it('should return a 422 given an incomplete request', () => {
      return chai.request(server)
        .post('/api/v1/palettes')
        .send({
          palette: 
            {
              color2: '#234567',
              color3: '#345678',
              color4: '#456789',
              color5: '#567890',
              palette_name: 'test pal',
              project_id: 2
            }
        })
        .then(response => {
        })
        .catch(error => {
          error.should.have.status(422);
        });
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should POST successfully to /api/v1/projects', () => {
      return chai.request(server)
        .post('/api/v1/projects')
        .send({
          project: {
            project_name: 'hello'
          }
        })
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          const resBodyType = typeof response.body;

          resBodyType.should.equal('number');
        })
        .catch(error => {
          throw error;
        });
    });

    it('should error appropriately when a project_name is not passed', () => {
      return chai.request(server)
        .post('/api/v1/projects')
        .send({
          project: {
          }
        })
        .then(response => {
        })
        .catch(error => {
          error.should.have.status(422);
        });
    });
  });

  describe('DELETE /api/v1/palettes/:id', () => {
    it('should delete a palette', () => {
      return chai.request(server)
        .delete('/api/v1/palettes/200')
        .then(response => {
          response.should.have.status(204);
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('DELETE /api/v1/projects/:id', () => {
    it('should delete a project', () => {
      return chai.request(server)
        .delete('/api/v1/projects/200')
        .then(response => {
          response.should.have.status(204);
        })
        .catch(error => {
          throw error;
        });
    });
  });

});