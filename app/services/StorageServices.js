class StorageService {
    async uploadFile(file) {
        throw new Error("uploadFile not implemented");
    }

    async downloadFile(fileId) {
        throw new Error("downloadFile not implemented");
    }

    async getFileDetails(fileId) {
        throw new Error("getFileDetails not implemented");
    }
}

module.exports = StorageService;