export class BasePostDto {
    id: number;
    author: string;
    title: string;
    content: string;
    likeCount?: number;
    commentCount?: number;
}