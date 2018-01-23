const frames = {
  frame1: {frame: $('.frame1'), color: $('.color1'), locked: false},
  frame2: {frame: $('.frame2'), color: $('.color2'), locked: false},
  frame3: {frame: $('.frame3'), color: $('.color3'), locked: false},
  frame4: {frame: $('.frame4'), color: $('.color4'), locked: false},
  frame5: {frame: $('.frame5'), color: $('.color5'), locked: false}
};

const createRandColor = () => {
  const availableChars = ['A', 'B', 'C', 'D', 'E', 'F', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let hex = '#';

  for (var i = 0 ; i < 6 ; i++) {
    const randomPosition = Math.floor(Math.random() * 16);
    hex += availableChars[randomPosition];
  }

  return hex;
};

const randomizeColors = () => {
  for (frameNum in frames) {
    if (!frames[frameNum].locked) {
      const randomColor = createRandColor();
      frames[frameNum].frame.css("background-color", randomColor);
      frames[frameNum].frame.css("box-shadow", `5px 5px 5px grey`);
  
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
  $(`.${panel}`).toggleClass('highlight');
  $(lockIcon).toggleClass('icon-lock-open-1 icon-lock-1');
  
};

const copyHex = (event) => {
  const hex = $(event.target).parents('.currentColor').text().trim();
  const mockTextArea = document.createElement('textarea');
  mockTextArea.value = hex;

  document.body.appendChild(mockTextArea);
  mockTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(mockTextArea);
};

const keyboardCommands = (event) => {
  const key = event.originalEvent.keyCode;

  if (key === 32 && event.target == document.body) {
    event.preventDefault();
    randomizeColors();
  } else if (key >= 49 && key <= 53) {
    toggleLockKey(key - 48);
  }
};

$('document').ready(randomizeColors);
$('.generate').on('click', randomizeColors);
$('.lockButton').on('click', toggleLockClick);
$(window).on('keydown', keyboardCommands);

