import replace from "rollup-plugin-replace";
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve'
import fs from "fs-extra";
import rimraf from "rimraf";

rimraf.sync("dist");
fs.copySync('./src/index.html', './dist/index.html');
fs.copySync('./src/static', './dist/static');



const pkg = require('./package.json');
const version = pkg.version;

export default  {
  input: "src/scripts/app.js",
  output: {
    file: "dist/scripts/app.js",
    format: "iife"
  },
  plugins: [
    serve("dist"),
    livereload("dist"),
    replace({
      delimiters: ["{{", "}}"],
      version
    })
  ]
}