let idPrefix = 'WU_FILE_',
    idSuffix = 0,
    rExt = /\.([^.]+)$/,
    statusMap = {};

function gid() {
    return idPrefix + idSuffix++;
}
class WUFile {
    constructor (source) {
        this.name = source.name || 'Untitled';

        this.size = source.size || 0;

        this.type = source.type || 'application/octet-stream';

        this.lastModifiedDate = source.lastModifiedDate || (new Date() * 1);

        this.source = source;

        this.id = gid();

        /**
         * 文件扩展名，通过文件名获取，例如test.png的扩展名为png
         * @property ext
         * @type {string}
         */
        this.ext = rExt.exec( this.name ) ? RegExp.$1 : '';        

        this.Status = {
            INITED:     'inited',    // 初始状态
            QUEUED:     'queued',    // 已经进入队列, 等待上传
            PROGRESS:   'progress',    // 上传中
            ERROR:      'error',    // 上传出错，可重试
            COMPLETE:   'complete',    // 上传完成。
            CANCELLED:  'cancelled',    // 上传取消。
            INTERRUPT:  'interrupt',    // 上传中断，可续传。
            INVALID:    'invalid'    // 文件不合格，不能重试上传。
        };

        // 存储文件状态，防止通过属性直接修改
        statusMap[ this.id ] = this.Status.INITED;

    }
    /**
     * 设置状态，状态变化时会触发`change`事件。
     * @method setStatus
     * @grammar setStatus( status[, statusText] );
     * @param {File.Status|String} status [文件状态值](#WebUploader:File:File.Status)
     * @param {String} [statusText=''] 状态说明，常在error时使用，用http, abort,server等来标记是由于什么原因导致文件错误。
     */
    setStatus (status, text) {

        var prevStatus = statusMap[ this.id ];

        typeof text !== 'undefined' && (this.statusText = text);

        if ( status !== prevStatus ) {
            statusMap[ this.id ] = status;
            /**
             * 文件状态变化
             * @event statuschange
             */
            this.trigger( 'statuschange', status, prevStatus );
        }

    }
    /**
     * 获取文件状态
     * @return {File.Status}
     * @example
        文件状态具体包括以下几种类型：
        {
            // 初始化
        INITED:     0,
        // 已入队列
        QUEUED:     1,
        // 正在上传
        PROGRESS:     2,
        // 上传出错
        ERROR:         3,
        // 上传成功
        COMPLETE:     4,
        // 上传取消
        CANCELLED:     5
    }
    */
    getStatus () {
        return statusMap[ this.id ];
    }


}

export default WUFile;