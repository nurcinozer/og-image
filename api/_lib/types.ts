export type FileType = 'png' | 'jpeg';
export type Category = '💻' | '👚' | '♻️';

export interface ParsedRequest {
    fileType: FileType;
    text: string;

    category: Category;
    authorName: string;
    authorPhoto: string;
    authorTitle: string;
}
