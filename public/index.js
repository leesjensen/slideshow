async function slideshow() {
  const r = await fetch('/photos');
  const data = await r.json();
  const photos = parsePhotoInfo(data);

  let currentIndex = 0;
  let speed = 3000;
  let paused = false;
  let interval = null;

  function play() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    currentIndex = calculatePos(currentIndex);
    loadImage(currentIndex, photos);
    interval = setInterval(() => {
      if (!paused) {
        currentIndex = calculatePos(currentIndex + 1);
        loadImage(currentIndex, photos);
      }
    }, speed);
  }

  function calculatePos(i) {
    if (i < 0) return photos.length - 1;
    if (i >= photos.length) return 0;
    return i;
  }

  document.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'ArrowLeft':
        currentIndex--;
        play();
        break;
      case 'ArrowRight':
        currentIndex++;
        play();
        break;
      case 'ArrowUp':
        speed = speed === 1000 ? speed : speed - 1000;
        play();
        break;
      case 'ArrowDown':
        speed += 1000;
        play();
        break;
      case 'Space':
        paused = !paused;
        const imgEl = document.querySelector('#photo');
        paused ? imgEl.classList.add('paused') : imgEl.classList.remove('paused');

        break;
    }
    e.preventDefault();
  });

  play();
}

function loadImage(currentIndex, photos) {
  const photoEl = document.querySelector('#photo');
  const info = photos[currentIndex];
  console.log(info);
  photoEl.src = `/photos/${info.filename}`;

  const captionEl = document.querySelector('#caption');
  captionEl.textContent = `${info.title}`;
}

function parsePhotoInfo(photos) {
  photos = photos.map((filename) => {
    const regEx = /^([^-]+)-\d*_?(.*)\.\w+$/;
    const matches = filename.match(regEx);
    if (matches.length > 2) {
      title = matches[2];
      title = title.replaceAll('_s', `'s`);
      title = title.replaceAll('_', ' ');
      title = title.replaceAll(/([a-z])([A-Z])/g, '$1 $2');

      return {id: Number(matches[1]), title: title, filename: filename};
    }

    return null;
  });
  photos = photos.filter((photo) => !!photo);
  photos.sort((a, b) => a.id - b.id);
  return photos;
}

slideshow();
