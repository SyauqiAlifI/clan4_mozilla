const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
// const uploadDir = './uploads';
// const videoDir = './videos';

// Middleware for parsing the body
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/videos', express.static(path.join(__dirname, 'videos')));

app.get('/dash', (req, res) => {
  const uploadWeeks = fs.readdirSync('./uploads').filter(file => fs.lstatSync(`./uploads/${file}`).isDirectory());
  const videoWeeks = fs.readdirSync('./videos').filter(file => fs.lstatSync(`./videos/${file}`).isDirectory());
  const weeks = [...new Set([...uploadWeeks, ...videoWeeks])]; // Combine and deduplicate weeks

  const media = {};

  weeks.forEach(week => {
    media[week] = [];
    if (fs.existsSync(`./uploads/${week}`)) {
      fs.readdirSync(`./uploads/${week}`).forEach(file => {
        if (!file.endsWith('.json')) {
          const metadata = JSON.parse(fs.readFileSync(`./uploads/${week}/${file}.json`));
          media[week].push({ type: 'image', path: `uploads/${week}/${file}`, metadata });
        }
      });
    }
    if (fs.existsSync(`./videos/${week}`)) {
      fs.readdirSync(`./videos/${week}`).forEach(file => {
        if (!file.endsWith('.json')) {
          const metadata = JSON.parse(fs.readFileSync(`./videos/${week}/${file}.json`));
          media[week].push({ type: 'video', path: `videos/${week}/${file}`, metadata });
        }
      });
    }
  });

  res.render('dash', {
    media
  });
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

app.get('/', (req, res) => {
  const uploadWeeks = fs.readdirSync('./uploads').filter(file => fs.lstatSync(`./uploads/${file}`).isDirectory());
  const videoWeeks = fs.readdirSync('./videos').filter(file => fs.lstatSync(`./videos/${file}`).isDirectory());
  const weeks = [...new Set([...uploadWeeks, ...videoWeeks])]; // Combine and deduplicate weeks
  const teams = [
    {
      img: "teams/Alya.jpg",
      name: "Alya Inasthiya",
      sick: "Maag",
      quote: "jangan takut salah, kan ada tipe-x"
    },
    {
      img: "teams/Laela.jpg",
      name: "Laela Rahmawati",
      sick: "Maag",
      quote: "tidak ada proses yang mudah untuk hasil yang indah"
    },
    {
      img: "teams/Liza.jpg",
      name: "Yuniar khauliza",
      sick: "Maag",
      quote: "Berani melangkah adalah langkah awal menuju kesuksesaan"
    },
    {
      img: "teams/Hera.jpg",
      name: "Khaera Mir'ah Andina",
      sick: "Sakit Gigi",
      quote: "dont say to Allah if you have problem but say to problem if you have Allah"
    },
    {
      img: "teams/Wanda.jpg",
      name: "Wanda Oktiva",
      sick: "Maag",
      quote: "Tidak ada istilah gagal dalam hidup, yang ada hanya sukses yang belum tercapai."
    },
    {
      img: "teams/Ghaza.jpg",
      name: "Muhammad Ghazali Arfinsyah",
      sick: "Maag",
      quote: "Jika kamu tidak sanggup menahan lelahnya belajar maka kamu harus sanggup menahan perihnya kebodohan"
    },
    {
      img: "teams/Alif.jpg",
      name: "Syauqi Alif Ibrahim",
      sick: "Flu",
      quote: "Kesabaran adalah salah satu kunci kesuksesan"
    },
    {
      img: "teams/Fadel.jpg",
      name: "Muhammad Fadil Zulkifly",
      sick: "Maag",
      quote: "Ketika kamu ingin menyerah, ingatlah alasan kenapa kamu memulai."
    },
    {
      img: "teams/Arkam.jpg",
      name: "Muhammad Arkam",
      sick: "Maag",
      quote: "Setiap langkah kecil yg Kmu ambil saat ini akan membawa mu lebih dekat dgn tujuan mu.jadi jangan pernah berhenti melangkah maju"
    }
  ];

  const media = {};

  weeks.forEach(week => {
    media[week] = [];
    if (fs.existsSync(`./uploads/${week}`)) {
      fs.readdirSync(`./uploads/${week}`).forEach(file => {
        if (!file.endsWith('.json')) {
          const metadata = JSON.parse(fs.readFileSync(`./uploads/${week}/${file}.json`));
          media[week].push({ type: 'image', path: `uploads/${week}/${file}`, metadata });
        }
      });
    }
    if (fs.existsSync(`./videos/${week}`)) {
      fs.readdirSync(`./videos/${week}`).forEach(file => {
        if (!file.endsWith('.json')) {
          const metadata = JSON.parse(fs.readFileSync(`./videos/${week}/${file}.json`));
          media[week].push({ type: 'video', path: `videos/${week}/${file}`, metadata });
        }
      });
    }
    // Shuffle the media array for each week
    shuffleArray(media[week]);
  });

  res.render('index', {
    media, teams
  });
});

app.get('/dash/week/:week', (req, res) => {
  const weekParam = `week_${req.params.week}`;  // Make sure 'week' is formatted like 'week_1'
  const media = getMediaForWeek(weekParam);
  const availableWeeks = getAvailableWeeks(); // Function to get all available weeks
  res.render('dashweek', { weekParam, media, availableWeeks });
});

app.get('/week/:week', (req, res) => {
  const weekParam = `week_${req.params.week}`;  // Make sure 'week' is formatted like 'week_1'
  const media = getMediaForWeek(weekParam);
  const availableWeeks = getAvailableWeeks(); // Function to get all available weeks
  res.render('week', { weekParam, media, availableWeeks });
});

function getMediaForWeek(week) {
  const media = [];
  const imageDir = `./uploads/${week}`;
  const videoDir = `./videos/${week}`;

  // Check for images
  if (fs.existsSync(imageDir)) {
    fs.readdirSync(imageDir).forEach(file => {
      if (!file.endsWith('.json')) {
        const metadataPath = `${imageDir}/${file}.json`;
        const metadata = fs.existsSync(metadataPath) ? JSON.parse(fs.readFileSync(metadataPath)) : {};
        media.push({ type: 'image', fileName: file, metadata });
      }
    });
  }

  // Check for videos
  if (fs.existsSync(videoDir)) {
    fs.readdirSync(videoDir).forEach(file => {
      if (!file.endsWith('.json')) {
        const metadataPath = `${videoDir}/${file}.json`;
        const metadata = fs.existsSync(metadataPath) ? JSON.parse(fs.readFileSync(metadataPath)) : {};
        media.push({ type: 'video', fileName: file, metadata });
      }
    });
  }

  return media;
}

function getAvailableWeeks() {
  const weeks = [];
  const imageDirs = fs.readdirSync('./uploads');
  const videoDirs = fs.readdirSync('./videos');
  
  // Combine all week directories from both 'uploads' and 'videos'
  const allDirs = new Set([...imageDirs, ...videoDirs]);

  allDirs.forEach(dir => {
    if (dir.startsWith('week_')) {
      weeks.push(dir);
    }
  });

  return weeks;
}

// Function to delete an empty directory
const deleteEmptyDir = (dirPath) => {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    if (files.length === 0) {
      fs.rmdir(dirPath, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Deleted empty directory: ${dirPath}`);
        }
      });
    }
  });
};

app.post('/delete-video', (req, res) => {
  const videoPath = req.body.videoPath;
  const jsonPath = `${videoPath}.json`;
  const weekDir = path.dirname(videoPath); // Get the week directory

  fs.unlink(videoPath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error deleting the video.");
    }
    if (fs.existsSync(jsonPath)) {
      fs.unlink(jsonPath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
    deleteEmptyDir(weekDir); // Check and delete the week directory
    res.redirect('/dash');
  });
});

app.post('/delete-image', (req, res) => {
  const imagePath = req.body.imagePath;
  const jsonPath = `${imagePath}.json`;
  const weekDir = path.dirname(imagePath); // Get the week directory

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error deleting the file.");
    }
    if (fs.existsSync(jsonPath)) {
      fs.unlink(jsonPath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
    deleteEmptyDir(weekDir); // Check and delete the week directory
    res.redirect('/dash');
  });
});

app.get('/upload', (req, res) => {
  res.render('upload');
});

// Serve static files (like images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const week = req.body.week; // Get the week from the request
    const dir = `./uploads/week_${week}`; // Set the folder path

    // Create the folder if it doesn't exist
    fs.mkdirSync(dir, {
      recursive: true
    });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use original file name
  }
});

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const week = req.body.week; // Get the week from the request
    const dir = `./videos/week_${week}`; // Set the folder path

    // Create the folder if it doesn't exist
    fs.mkdirSync(dir, {
      recursive: true
    });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use original file name
  }
});

const videoUpload = multer({
  storage: videoStorage
}).array('videos', 20);

const upload = multer({
  storage: storage
}).array('images', 20);

app.post('/upload', upload, (req, res) => {
  if (!req.files) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  const titles = req.body.title;
  const descriptions = req.body.description;
  const week = req.body.week;

  // Store the title and description in your database or file system
  // For example, you can use a JSON file to store the metadata
  req.files.forEach((file, index) => {
    const metadata = {
      filename: file.filename,
      title: titles[index], // Get the corresponding title
      description: descriptions[index] // Get the corresponding description
    };

    fs.writeFileSync(`./uploads/week_${week}/${file.filename}.json`, JSON.stringify(metadata));
  });

  res.redirect('/dash');
});

app.post('/upload-video', videoUpload, (req, res) => {
  if (!req.files) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  const titles = req.body.title;
  const descriptions = req.body.description;
  const week = req.body.week;

  // Store the title and description in your database or file system
  // For example, you can use a JSON file to store the metadata
  req.files.forEach((file, index) => {
    const metadata = {
      filename: file.filename,
      title: titles[index], // Get the corresponding title
      description: descriptions[index] // Get the corresponding description
    };

    fs.writeFileSync(`./videos/week_${week}/${file.filename}.json`, JSON.stringify(metadata));
  });

  res.redirect('/dash');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});