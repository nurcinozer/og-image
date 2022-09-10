import { readFileSync } from "fs";
// import { marked } from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";

const book = readFileSync(
  `${__dirname}/../_fonts/MaisonNeue-Book.woff2`
).toString("base64");

const extendedBold = readFileSync(
  `${__dirname}/../_fonts/MaisonNeueExtended-Bold.woff2`
).toString("base64");
const medium = readFileSync(
  `${__dirname}/../_fonts/MaisonNeue-Medium.woff2`
).toString("base64");

function getCss() {
  return `@font-face {
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
    src: url(data:font/woff2;charset=utf-8;base64,${medium})  format("woff2");
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
  inset: 80px 100px auto;

}

.title {
  font-size: 112px;
  line-height: 125%;
  margin-top: 28px;
}

.category {
  font-size: 36px;
  line-height: 32px;
  font-family: 'MaisonNeueBook';
  background-color: #867BFF;
  padding: 8px 24px;
  width: fit-content;
  border-radius: 16px;
  -webkit-border-radius: 16px;
  -moz-border-radius: 16px;
  -ms-border-radius: 16px;
  -o-border-radius: 16px;
}

.author {
  position: absolute;
  inset: auto 100px 200px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.author-name {
  font-size: 36px;
  line-height: 32px;
  color: #867BFF;
  font-family: 'MaisonNeueBook';
  font-weight: bold;
  margin-bottom: 20px;
}

.author-title {
  font-size: 36px;
  line-height: 32px;
  font-family: 'MaisonNeueBook';
}

.author-photo {
  border: 5px solid #867BFF;
  border-radius: 100%;
  margin-right: 30px;
}

.author-photo img {
  font-size: 220px;
  width: 0.5em;
  height: 0.5em;
  border-radius: 100%;
  object-fit: cover;
  object-position: center;
  border: 5px solid #222;
}

footer {
  position: absolute;
  inset: auto 80px 0;
  height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
}
    `;
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, authorName, authorPhoto, authorTitle, category } = parsedReq;
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
    <p class="category">${category}</p>
    <h1 class="title">
      ${text.length > 50 ? text.substring(0, 50)+"..." : text}
    </h1>
  </header>
  
  <div class="author">
  ${
    authorPhoto
      ? `<div class="author-photo">
          <img src="${sanitizeHtml(authorPhoto)}" />
         </div>`
      : ""
  }
    <div>
      <h4 class="author-name">${authorName}</h4>
      <p class="author-title">${authorTitle}</p>
    </div>
  </div>

  <footer>
    <img src="https://i.ibb.co/qmpwTnd/logo-1.png" />
  </footer>
  
  </body>
  </html>`;
}
