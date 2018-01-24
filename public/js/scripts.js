const frames = {
  frame1: {frame: $('.frame1'), color: $('.color1'), hint: $('.short1'), lock: $('.shortLock1'), locked: false},
  frame2: {frame: $('.frame2'), color: $('.color2'), hint: $('.short2'), lock: $('.shortLock2'), locked: false},
  frame3: {frame: $('.frame3'), color: $('.color3'), hint: $('.short3'), lock: $('.shortLock3'), locked: false},
  frame4: {frame: $('.frame4'), color: $('.color4'), hint: $('.short4'), lock: $('.shortLock4'), locked: false},
  frame5: {frame: $('.frame5'), color: $('.color5'), hint: $('.short5'), lock: $('.shortLock5'), locked: false}
};

let projects = [];
let palettes = [];
let selectedProject = null;

const fetchInitialData = () => {
  randomizeColors();
  getProjects();
  getPalettes();
};

const getProjects = async () => {
  const projectsResponse = await fetch('/api/v1/projects');
  const storedProjects = await projectsResponse.json();
  projects = storedProjects.projects;
  updateProjects();
};

const getPalettes = async () => {
  const palettesResponse = await fetch('/api/v1/palettes');
  const storedPalettes = await palettesResponse.json();
  palettes = storedPalettes.palettes;
  updatePalettes();
}

const createRandColor = () => {
  const availableChars = ['F', 'E', 'D', 'C', 'B', 'A', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  let hex = '#';
  
  for (var i = 0 ; i < 6 ; i++) {
    const randomPosition = Math.floor(Math.random() * 16);
    hex += availableChars[randomPosition];
  }

  return hex;
};

const randomizeColors = () => {
  for (var frameNum in frames) {
    if (!frames[frameNum].locked) {
      const randomColor = createRandColor();
      frames[frameNum].frame.css("background-color", randomColor);
      frames[frameNum].hint.css("background-color", randomColor);
  
      const html = `<span>${randomColor} <i class="icon-clipboard"></i></span>`;
      frames[frameNum].color.html(html);
    }
  }

  $('.icon-clipboard').on('click', copyHex);
};

const toggleLockClick = (event) => {
  const targetFrame = $(event.target).parents('.colorFrame');
  const buttonIcon = event.target.children[0];
  const panelTarget = targetFrame[0].classList[1];

  toggleLock(panelTarget, buttonIcon);
};

const toggleLockKey = (num) => {
  const targetedFrame = `frame${num}`;
  const frameLockButton = $(`.${targetedFrame}`).find('.lockButton');
  const frameLockIcon = frameLockButton.find('i');

  toggleLock(targetedFrame, frameLockIcon);
};

const toggleLock = (panel, lockIcon) => {
  frames[panel].locked = !frames[panel].locked;
  frames[panel].lock.toggleClass('icon-lock-open-1 icon-lock-1');
  
  $(`.${panel}`).toggleClass('highlight');
  $(lockIcon).toggleClass('icon-lock-open-1 icon-lock-1');
  
};

const copyHex = (event) => {
  const hexSpan = $(event.target).parents('.currentColor');
  const hexCode = hexSpan.text().trim();
  const mockTextArea = document.createElement('textarea');
  mockTextArea.value = hexCode;

  document.body.appendChild(mockTextArea);
  mockTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(mockTextArea);

  hexSpan.html('Copied &#x2713;');

  setTimeout(() => {
    hexSpan.html(`<span>${hexCode} <i class="icon-clipboard"></i></span>`);
    $('.icon-clipboard').on('click', copyHex);  
  }, 800);

};

const keyboardCommands = (event) => {
  const key = event.originalEvent.keyCode;

  if (key === 32 && event.target == document.body) {
    event.preventDefault();
    randomizeColors();
  } else if (key >= 49 && key <= 53 && event.target == document.body) {
    toggleLockKey(key - 48);
  }
};

const expandSelect = () => {
  const createProjects = projects.map((project) => {

  });
 $('.projectSelect').show();
 $('.openSelect').hide();
};

const closeDropdown = (event) => {
  if (!$(event.target).parents('.projectDropdown').length) {
    $('.projectSelect').hide();
    $('.openSelect').show();
  }
};

const deletePalette = async (event) => {
  const targetedPalette = $(event.target).parents('.palette');
  const paletteClasses = $(targetedPalette).attr('class');
  const stripId = new RegExp(/\d+/, 'i');
  const getId = parseInt(paletteClasses.match(stripId)[0]);

  const deleteResult = await fetch(`/api/v1/palettes/${getId}`, {
    method: 'DELETE',
    headers: {
      'CONTENT-TYPE': 'application/json',
    }
  });

  palettes = palettes.filter( palette => palette.palette_id !== getId);
  updatePalettes();
};

const deleteProject = async (event) => {
  const targetedProject = $(event.target).siblings('.project');
  const projectClasses = $(targetedProject).attr('class');
  const stripId = new RegExp(/\d+/, 'i');
  const getId = parseInt(projectClasses.match(stripId)[0]);


  const deleteResult = await fetch(`/api/v1/projects/${getId}`, {
    method: 'DELETE',
    headers: {
      'CONTENT-TYPE': 'application/json',
    }
  });

  projects = projects.filter( project => project.project_id !== getId);
  updateProjects();
};

const updatePalettes = () => {
  console.log(palettes);
  const paletteDivs = palettes
    .filter(palette => palette.project_id === selectedProject)
      .map( palette => 
        `<div class='palette palette${palette.palette_id}'>
          <h4>${palette.palette_name}</h4>
          <div class="paletteC paletteC1" style="background: ${palette.color1}"></div>
          <div class="paletteC paletteC2" style="background: ${palette.color2}"></div>
          <div class="paletteC paletteC3" style="background: ${palette.color3}"></div>
          <div class="paletteC paletteC4" style="background: ${palette.color4}"></div>
          <div class="paletteC paletteC5" style="background: ${palette.color5}"></div>
          <i class="icon-trash"></i>
        </div>`
      );

  
  $('.paletteContainer').html(paletteDivs);
  $('.palette').find('.icon-trash').on('click', deletePalette);
};

const updateProjects = () => {
  const projectButtons = projects.map( project => 
   `<div class="projectButton">
      <button class="project project${project.project_id}">${project.project_name} </button>
      <i class="icon-trash"></i>
   </div>`
  );

  $('.projectButtonContainer').html(projectButtons);
  $('.project').on('click', selectProjectByClick);
  $('.projectButton').find('.icon-trash').on('click', deleteProject);
}

const persistPalettes = async (paletteInfo) => {
  const savePalette = await fetch('/api/v1/palettes', {
    method: 'POST',
    headers: {
      'CONTENT-TYPE': 'application/json',
    },
    body: JSON.stringify({palette: paletteInfo})
  });

  const newPaletteId = await savePalette.json();
  const newPalette = Object.assign({}, paletteInfo, {palette_id: newPaletteId});

  palettes.push(newPalette);
  updatePalettes();
};

const paletteSave = () => {
  let paletteInfo = {};
  const paletNameInput = $('.paletteName');

  if (!paletNameInput.val()) {
    const errorSpan = `<span class="createProjectError">ENTER A VALID PALETTE NAME</span>`;
    $('.submitPaletteSave').append(errorSpan);

    setTimeout(() => {
      $('span').remove('.createProjectError');
    }, 1000);
    return;
  } else if (!selectedProject) {
    const errorSpan = `<span class="createProjectError">SELECT A PROJECT TO ADD A PALETTE</span>`;
    $('.submitPaletteSave').append(errorSpan);

    setTimeout(() => {
      $('span').remove('.createProjectError');
    }, 1000);
    return;
  }

  let colorIndex = 1;
  for (var frame in frames) {
    paletteInfo[`color${colorIndex}`] = frames[frame].color.text().trim();
    colorIndex++;
  }

  paletteInfo.palette_name = paletNameInput.val();
  paletteInfo.project_id = selectedProject;
  updatePalettes();
  paletNameInput.val('');

  persistPalettes(paletteInfo);
};

const saveProject = async () => {
  const projectNameInput = $('.projectInput');
  
  const sendProject = await fetch('/api/v1/projects', {
    method: 'POST',
    headers: {
      'CONTENT-TYPE': 'application/json'
    },
    body: JSON.stringify({project: {project_name: projectNameInput.val()}})
  });

  const newProjectId = await sendProject.json();
  const newProject = Object.assign({}, {project_name: projectNameInput.val()}, {project_id: newProjectId});
  projects.push(newProject);

  selectProjectByNew(newProjectId);
  projectNameInput.val('');
};

const selectProjectByClick = (event) => {
  const targetedProject = $(event.target);
  const projectClasses = $(targetedProject).attr('class');
  const stripId = new RegExp(/\d+/, 'i');
  const getId = parseInt(projectClasses.match(stripId)[0]);

  selectedProject = getId;
  $('.project').removeClass('selected');
  targetedProject.addClass('selected');
  updatePalettes();
}

const selectProjectByNew = (id) => {
  selectedProject = id;
  console.log(id);
  updateProjects();
  $('.project').removeClass('selected');
  $(`.project${id}`).addClass('selected');
}



$('document').ready(fetchInitialData);
$('.generate').on('click', randomizeColors);
$('.lockButton').on('click', toggleLockClick);
$(window).on('keydown', keyboardCommands);
$('.openSelect').on('click', expandSelect);
$(document.body).click(closeDropdown);
$('.submitPaletteSave').on('click', paletteSave);
$('.submitProject').on('click', saveProject);

