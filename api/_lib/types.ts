export type FileType = 'png' | 'jpeg';
export type Category = 'web3' | 'fashion' | 'sustainability';

export interface ParsedRequest {
    fileType: FileType;
    text: string;

    category: Category;
    authorName: string;
    authorPhoto: string;
    authorTitle: string;
}
