import Queue from '../queue.js';
import Mediator from '../mediator.js'
import WUFile from '../file.js'

class Queues {
  constructor (opts) {
    let me = this;
    me.queue = new Queue();
    me.stats = me.queue.stats;
    me.mediator = new Mediator();

    this._ruid = null;
  }

  // 为支持外部直接添加一个原生的 File 对象
  _wrapFile (file) {
    if ( !(file instanceof WUFile) ) {
      if ( !(file instanceof File) ) {
          if ( !this._ruid ) {
              throw new Error('Can\'t add external files.');
          }
          file = new File( this._ruid, file );
      }
      file = new WUFile( file );
    }
    return file;
  }

  /***
   * @description 当文件被加入队列后触发
   * @for Uploader
   */
  _addFile (file) {
    let me = this;
    file = me._wrapFile( file );
    me.queue.append( file )
    me.mediator.trigger( 'fileQueued', file );

  }

  /**
   * @methods addFiles
   * @grammer addFiles( file )
   * @description 添加文件队列
   * @for Uploader
   */
  addFile (files) {
    let me = this;
    let pool = [];

    if(!files.length) {
      files = [files]
    }

    files = $.map(files, function(file) {
      return me._addFile(file)      
    })


    if(files.length ){
      setTimeout(function() {
        me.request('start-upload');
      }, 20 );
    }
  }

}

export default Queues;