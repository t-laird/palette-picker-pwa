const frames = {
  frame1: {frame: $('.frame1'), locked: false},
  frame2: {frame: $('.frame2'), locked: false},
  frame3: {frame: $('.frame3'), locked: false},
  frame4: {frame: $('.frame4'), locked: false},
  frame5: {frame: $('.frame5'), locked: false}
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
    console.log(frameNum);
    frames[frameNum].frame.css("background-color",createRandColor());
  }
};


$('document').ready(randomizeColors);

$('.generate').on('click', randomizeColors);