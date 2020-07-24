import Queue from '../queue.js';
import Mediator from '../mediator.js'
import WUFile from '../file.js'

class Queues {
  constructor (opts) {
    this.queue = new Queue();
    this.stats = this.queue.stats;
    this.mediator = new Mediator();
    this.WuFile = new WUFile();
    this.STATUS = this.WuFile.Status;
    this.running = false;

    // 记录当前正在传的数据，跟threads相关
    this.pool = [];

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
    return file;
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
        me.startUpload();
      }, 20 );
    }
  }

  startUpload () {
    let me = this;

    me.running = true;

    me._tick()
  }

  CuteFile (file, chunkSize) {
    let pending = [],
        blob = file.source,
        total = blob.size,
        chunks = chunkSize ? Math.ceil(total /chunkSize) : 1,
        start = 0,
        index = 0,
        len, api;

    api = {
      file: file,

      has: () => {
        !!pending.length;
      },

      shift: () => {
        pending.shift()
      },

      unshift: (block) => {
        pending.unshift(block)
      }
    };

    while(index < chunks) {
      len = Math.min(chunkSize, total - start);

      pending.push({
        file: file,
        start: start,
        end: chunkSize ? (start + len) : total,
        total: total,
        chunks: chunks,
        chunk: chunk++,
        cuted: api
      })

      start += len;
    }

    file.blocks = pending.concat();
    file.remaning = pending.length;

    return api;
  }

  _getStack () {
    let i = 0,
        me = this,
        act;
    while((act = me.stack[ i++ ])) {
      if(act.has() && act.file.getStatus() == me.Status.PROGRESS) {
        return act;
      } else if (!act.has() || 
              act.file.getStatus() !== me.Status.PROGRESS && 
              act.file.getStatus() !== me.Status.INTERUPT) {
        me.stack.splice(--i, 1)
      }
    }
  }

  _nextBlock () {
    let me = this,
        act,
        next, done;

    
    next = me.pending.shift();
    done = file => {
      if(!file) {
        return null;
      }
      act = me.CuteFile(file, 0);
      me.stack.push(act);
      return act.shift() 
    }

    if(this.isPromise(next)) {
      return next;
    }

    return done(next)
  }

  isPromise (obj) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
  }

  _tick () {
    let me = this, 
      val;

    if(me.pool.length < 4 && (val = me._nextBlock())) {
      me.startSend(val)
      me._tick()
    }  

  }

  _startSend (block) {
    console.log(block)
  }

}

export default Queues;