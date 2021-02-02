const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const koastatic = require('koa-static');
const render = require('koa-art-template');
const fs = require('fs');

import TOML from 'toml-json';

const app = new Koa();
const router = new Router();
const config = TOML({ fileUrl: './config.toml' });

app.use(koastatic(path.join(__dirname, '../public')));

render(app, {
  root: path.join(__dirname, 'view'),
  extname: '.art',
  debug: process.env.NODE_ENV !== 'production',
});

// home pagefd
router.get('/', async (ctx) => {
  const title = (config.owner as any).title;
  const readDir = fs.readdirSync('./apibs');

  await ctx.render('index', { title, list: readDir });
});

router.get('/:name', async (ctx) => {
  const readDir = fs.readdirSync('./apibs');
  if (readDir.includes(ctx.params.name)) {
    const fileName = fs.readdirSync(`./apibs/${ctx.params.name}/`)[0];
    if (fileName) {
      ctx.response.redirect(
        `./${ctx.params.name}/${fileName.slice(0, fileName.lastIndexOf('.'))}`
      );
      return;
    }
  }
  ctx.response.redirect('/');
});

router.get('/:folderName/:fileName', async (ctx) => {
  await ctx.render('api/main', {
    title: ctx.params.folderName,
    navList: ['asdfsd', 'bbbb'],
  });
});

router.post('/update', async (ctx) => {
  const fileUrl = path.resolve('./data', `./1.json`);
  const data = fs.readFileSync(fileUrl);
  ctx.response.type = 'json';
  ctx.body = JSON.parse(data);
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen((config.server as any).port, () =>
  console.log(`starting at http://localhost:${(config.server as any).port}`)
);
