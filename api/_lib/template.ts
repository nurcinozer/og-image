import { readFileSync } from "fs";
// import { marked } from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";
const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const book = readFileSync(
  `${__dirname}/../_fonts/MaisonNeue-Book.woff2`
).toString("base64");

const extendedBold = readFileSync(
  `${__dirname}/../_fonts/MaisonNeueExtended-Bold.woff2`
).toString("base64");
const medium = readFileSync(
  `${__dirname}/../_fonts/MaisonNeue-Medium.otf`
).toString("base64");

function getCss() {
  return `
    @font-face {
        font-family: 'MaisonNeueBook';
        font-weight: 200;
        font-style: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${book}) format('woff2');
    }

    @font-face {
        font-family: 'MaisonNeueExtendedBold';
        font-weight: bold;
        font-style: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${extendedBold}) format('woff2');
    }

    @font-face {
        font-family: 'MaisonNeueMedium';
        font-weight: 500;
        font-style: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${medium})  format("otf");
      }


      * {
      box-sizing: border-box;
      border: 0;
      margin: 0;
      padding: 0;
      background: none;
    }
    
    html {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    img {
      display: block;
    }
    
    body {
      font-family: "MaisonNeueExtendedBold";
      line-height: 1.14;
      font-size: 64px;
      position: relative;
      background: #222222 url(https://i.ibb.co/T1GJVFq/pattern.png) no-repeat;
      background-size: cover;
      background-position: center;
      height: 100vh;
      color: white;
    }
    
    header {
      position: absolute;
      inset: 88px 100px auto;
    }
    
    .title {
      font-size: 112px;
    }


    .author {
      position: absolute;
      inset: auto 100px 200px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }
    
    .author-name {
      font-size: 56px;
      margin-bottom: 20px;
      color: #867BFF;
    }
    
    .author-photo {
      border: 8px solid #867BFF;
      border-radius: 100%;
    }
    
    .author-photo img {
      font-size: 220px;
      width: 1em;
      height: 1em;
      border-radius: 100%;
      object-fit: cover;
      object-position: center;
      border: 12px solid #161616;
    }
    `;
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, authorName, authorPhoto, authorTitle, category } = parsedReq;
//   console.log(authorName, authorPhoto, authorTitle, category);
  return `<!DOCTYPE html>
  <html>
      <meta charset="utf-8">
      <title>Generated Image</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
          ${getCss()}
      </style>
      <body>
      
  <header>
    <p class="category">${emojify(category)}</p>
    <h1 class="title">
      ${text}
    </h1>
  </header>
  
  <div class="author">
    <div>
      <h4 class="author-name">${authorName}</h4>
      <p class="author-title">${authorTitle}</p>
    </div>
    ${
      authorPhoto
        ? `<div class="author-photo">
            <img src="${sanitizeHtml(authorPhoto)}" />
           </div>`
        : ""
    }
  </div>
  
  </body>
  </html>`;
}
