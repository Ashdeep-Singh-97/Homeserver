"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = 3000;
// Multer configuration for handling file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/home/royal_rebellion/Workspace/homeserver/uploads/'); // Absolute path to uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use original file name for storing
    }
});
const upload = (0, multer_1.default)({ storage: storage });
// Serve the index.html file for uploading
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'index.html')); // Adjust path to index.html as necessary
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
app.use(express_1.default.static(path_1.default.join(__dirname)));
// Route to list uploaded files
app.get('/files', (req, res) => {
    fs_1.default.readdir('/home/royal_rebellion/Workspace/homeserver/uploads/', (err, files) => {
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
    const filePath = path_1.default.join('/home/royal_rebellion/Workspace/homeserver/uploads/', filename);
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
