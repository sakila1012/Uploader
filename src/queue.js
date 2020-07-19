import WUFile from './file.js'

class Queue {
    constructor() {
        this.stats = {
            numOfQueue: 0,
            numOfSuccess: 0,
            numOfCancel: 0,
            numOfProgress: 0,
            numOfUploadFailed: 0,
            numOfInvalid: 0,
            numOfDeleted: 0,
            numOfInterrupt: 0
        };

        // 上传队列，仅包括等待上传的文件
        this._queue = {};
        // 存储左右文件
        this._map = {};
    }

    apend (file) {
        this._queue.push(file);
        this._fileAdded(file);
        return this;
    }

    /**
     * 
     * @param {*} fileId 
     */
    prepend (file) {
        this._queue.unshift( file );
        this._fileAdded( file )
        return this;
    }

    /**
     * 获取文件对象
     * @method getFile
     * @param {String} fileId 文件 ID
     * @return {File}
     */
    getFile (fileId) {
        if(typeof fileId !== 'string') {
            return fileId;
        }
        return this._map[fileId]
    }

    _fileAdded (file) {
        let me = this;
        existing = this._map[file.id];

        if(!existing) {
            this._map[file.id] = file
        }
    }

    _onFileStatusChange (curStatus, preStatus) {
        let stats = this.stats;

        switch ( preStatus ) {
            case WUFile.Status.PROGRESS:
                stats.numOfProgress--;
                break;

            case WUFile.Status.QUEUED:
                stats.numOfQueue --;
                break;

            case WUFile.Status.ERROR:
                stats.numOfUploadFailed--;
                break;

            case WUFile.Status.INVALID:
                stats.numOfInvalid--;
                break;

            case WUFile.Status.INTERRUPT:
                stats.numOfInterrupt--;
                break;
        }

        switch ( curStatus ) {
            case WUFile.Status.QUEUED:
                stats.numOfQueue++;
                break;

            case WUFile.Status.PROGRESS:
                stats.numOfProgress++;
                break;

            case WUFile.Status.ERROR:
                stats.numOfUploadFailed++;
                break;

            case WUFile.Status.COMPLETE:
                stats.numOfSuccess++;
                break;

            case WUFile.Status.CANCELLED:
                stats.numOfCancel++;
                break;


            case WUFile.Status.INVALID:
                stats.numOfInvalid++;
                break;

            case WUFile.Status.INTERRUPT:
                stats.numOfInterrupt++;
                break;
        }
    }

}

export default Queue;