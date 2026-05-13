import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';
import lightningcss from 'postcss-lightningcss';

export default {
  input: 'src/js/index.mjs',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'HtmlEditor',
    sourcemap: false
  },
  plugins: [
    nodeResolve({
      browser: true
    }),
    commonjs(),
    postcss({
      extract: true,
      plugins: [
        lightningcss({
          minify: true,
        })
      ]
    }),
    terser(),
    copy({
      targets: [
        { src: 'src/img/*', dest: 'dist/img' },
        { 
          src: 'node_modules/tinymce/skins', 
          dest: 'dist/tinymce' 
        },
        { 
          src: 'node_modules/tinymce/themes', 
          dest: 'dist/tinymce' 
        },
        { 
          src: 'node_modules/tinymce/icons', 
          dest: 'dist/tinymce' 
        },
        { 
          src: 'node_modules/tinymce/models', 
          dest: 'dist/tinymce' 
        },
        { 
          src: 'node_modules/tinymce/content.css', 
          dest: 'dist/tinymce' 
        }
      ]
    })
  ]
};
