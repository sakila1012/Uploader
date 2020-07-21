import Queues from './widgets/queue.js'

class Uploader {
    constructor (uploader) {
        this.uploader = uploader;
        this.container = document.getElementById('file');

        this.queues = new Queues();
        this.pool = [];
        this.runing = false;
        this.progress = false;
        
        this.initEvent()
    }

    initEvent() {
        let me = this;
        this.container.addEventListener('change', function() {
            var filesList = document.querySelector('#file').files;
            if(filesList.length==0){         //如果取消上传，则改文件的长度为0         
                return;
            }else{  
                //如果有文件上传，这在这里面进行
                console.log(filesList);
                me.queues.addFile(filesList);
            }
        })
    }

    startSend() {

    }

}

export default Uploader

