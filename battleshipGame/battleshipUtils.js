//Random Number Generator

const genRandNum = (num) => {
  return Math.floor(Math.random() * Math.floor(num))
}

const getRandDirection = (size) => {
  let randomBinary = genRandNum(size) % 2;
  return (randomBinary = 0) ? 'vertical' : 'horizontal';
}