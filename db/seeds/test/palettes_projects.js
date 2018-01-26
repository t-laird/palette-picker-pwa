const mockProjects = [ 
  { project_name: 'hey' },
  { project_name: 'Jules fave palettes' },
  { project_name: 'test2' },
  { project_name: 'fore' },
  { project_name: 'cap' } 
];

const mockPalettes = 
[ {
    palette_name: 'nice',
    color1: '#3507F7',
    color2: '#A28C59',
    color3: '#D2E252',
    color4: '#7158FD',
    color5: '#7848C4'
  },
  {
    palette_name: 'winter',
    color1: '#5B1A5C',
    color2: '#433557',
    color3: '#EE1443',
    color4: '#DAB24F',
    color5: '#7B2C8F'
  },
  {
    palette_name: 'clothes',
    color1: '#AA0D08',
    color2: '#E4D5D8',
    color3: '#0C2B36',
    color4: '#9CADAC',
    color5: '#2C3F59'
  }
];


exports.seed = function(knex, Promise) {
  return knex('palettes').del()
    .then(() => {
      return knex('projects').del();
    })
    .then(() => {
      return knex('projects').insert(mockProjects).returning('project_id');
    })
    .then((projectIds) => {
      return knex('palettes').insert(
        mockPalettes.map( palette => { 
          palette.project_id = projectIds[0];
          return palette;
        })        
      );
    })
    .then(() => {
      console.log('successfully seeded data');
    });
};
