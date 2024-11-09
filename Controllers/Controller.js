class Controller {
  middleware(req, res, next) {
    // 預設中介軟體方法，可以在具體控制器中覆蓋
    next();
  }

  getOpts(req) {
    // 預設參數處理方法，可以在具體控制器中覆蓋
    return req.query;
  }

  run(req, res) {
    // 預設商業邏輯方法，需要在具體控制器中實作
    res.send('BaseController run method');
  }

  async handleRequest(req, res, next) {
    try {
      this.middleware(req, res, (err) => {
        // console.log('A', req);
        // console.log('B', res);
        // console.log('C', next);
        // console.log('D', err);
        if (err) return next(err);
        const opts = this.getOpts(req);
        const result = this.run(opts);
        res.status(200).send(result);
      });
    } catch (error) {

      // TODO: 應該有機會透過error 來判斷是不是400 如果都抓不到就走500, 500是否要重啟一次server?
      if (error instanceof CustomError) {
        res.status(400).send(error.message);
      } else {
        res.status(500).send('Internal Server Error');
      }
    }
  }
}

module.exports = Controller;