const { google } = require('googleapis');
const StorageService = require('./StorageService');

class GoogleDriveStorage extends StorageService {
    constructor(auth) {
        super();
        this.drive = google.drive({ version: 'v3', auth });
    }

    async uploadFile(file) {
        const fileMetadata = { 'name': file.originalname };
        const media = { mimeType: file.mimetype, body: file.buffer };
        const response = await this.drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        });
        return response.data.id;
    }

    async downloadFile(fileId) {
        const response = await this.drive.files.get({
            fileId: fileId,
            alt: 'media'
        }, { responseType: 'stream' });

        return response.data;
    }

    async getFileDetails(fileId) {
        const response = await this.drive.files.get({
            fileId: fileId,
            fields: 'id, name, size, mimeType'
        });
        return response.data;
    }
}

module.exports = GoogleDriveStorage;