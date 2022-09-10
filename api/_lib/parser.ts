import { IncomingMessage } from "http";
import { parse } from "url";
import { ParsedRequest } from "./types";

export function parseRequest(req: IncomingMessage) {
  console.log("HTTP " + req.url);
  const { pathname, query } = parse(req.url || "/", true);
  const { fontSize, category, authorName, authorPhoto, authorTitle } =
    query || {};

  console.log(authorName, authorPhoto, authorTitle);

  // remove plus sign from url authortitle string
  const authorTitleString = authorTitle?.toString().replace(/\+/g, " ");
  if (Array.isArray(fontSize)) {
    throw new Error("Expected a single fontSize");
  }

  const arr = (pathname || "/").slice(1).split(".");
  let extension = "";
  let text = "";
  if (arr.length === 0) {
    text = "";
  } else if (arr.length === 1) {
    text = arr[0];
  } else {
    extension = arr.pop() as string;
    text = arr.join(".");
  }

  const parsedRequest: ParsedRequest = {
    fileType: extension === "jpeg" ? extension : "png",
    text: decodeURIComponent(text),
    authorName: getArray(query.authorName)[0] || "",
    authorPhoto: getArray(query.authorPhoto)[0] || "",
    authorTitle: authorTitleString || "",
    category:
      category === "web3"
        ? "web3"
        : category === "fashion"
        ? "fashion"
        : "sustainability",
  };
  return parsedRequest;
}

function getArray(stringOrArray: string[] | string | undefined): string[] {
  if (typeof stringOrArray === "undefined") {
    return [];
  } else if (Array.isArray(stringOrArray)) {
    return stringOrArray;
  } else {
    return [stringOrArray];
  }
}
