export default interface IPostWithUser {
    _id: string
    title: string
    description: string
    image: string
    datetime: string
    user: {
        _id: string
        username: string
    }
};