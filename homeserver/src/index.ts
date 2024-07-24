import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const port = 3000;

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/home/royal_rebellion/Workspace/homeserver/uploads/');  // Absolute path to uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);  // Use original file name for storing
    }
});

const upload = multer({ storage: storage });

// Serve the index.html file for uploading
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));  // Adjust path to index.html as necessary
});

// Handle file upload POST request
app.post('/upload', upload.single('zipfile'), (req, res) => {
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
    }
    res.send('File uploaded successfully: ' + req.file.originalname);
});

// Serve static files from the 'src' folder (if needed)
app.use(express.static(path.join(__dirname)));

// Route to list uploaded files
app.get('/files', (req, res) => {
    fs.readdir('/home/royal_rebellion/Workspace/homeserver/uploads/', (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        // Filter out non-ZIP files for demonstration (adjust as per your needs)
        const zipFiles = files.filter(file => file.endsWith('.zip'));
        res.send(`
            <h2>Uploaded Files</h2>
            <ul>
                ${zipFiles.map(file => `<li><a href="/files/${file}" download>${file}</a></li>`).join('')}
            </ul>
        `);
    });
});

// Route to download a specific file
app.get('/files/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join('/home/royal_rebellion/Workspace/homeserver/uploads/', filename);
    res.download(filePath, filename, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('File download failed.');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
