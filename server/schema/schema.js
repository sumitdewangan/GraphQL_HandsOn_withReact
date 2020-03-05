const graphql = require('graphql');
const Book = require('../models/book');
const Author = require('../models/author');

const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
 } = graphql;

 // dummy data
// var books = [
//     { name: 'Name of the Wind', genre: 'Fantasy', id:'1', authorId: '1' },
//     { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
//     { name: 'The Long Earch', genre: 'Sci-Fi', id:'3', authorId: '3' },
//     { name: 'The Hero of Ages', genre: 'Romantic', id: '4', authorId: '1' },
//     { name: 'The Colour of Magic', genre: 'Drama', id: '5', authorId: '1' },
// ]

// var authors = [
//     { name: 'Sumit', age: 24, id: '1' },
//     { name: 'Terry', age: 44, id: '3' },
//     { name: 'Bran', age: 65, id: '2' },
// ]

const BookType = new GraphQLObjectType({
   name: 'Book',
   fields: () => ({
       id: { type: GraphQLID },
       name: { type: GraphQLString },
       genre: { type: GraphQLString },
       author: {
           type: AuthorType,
           resolve(parent, args){
               //return authors.find(a => a.id == parent.authorId);
               return Author.findById(parent.authorId);
            }
       }
   }) 
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt},
        books: { 
            type: new GraphQLList(BookType),
            resolve(parent, args){
                //return books.filter(c => c.authorId == parent.id);
                //console.log(Book.find({ authorId: parent.id }));
                return Book.find({ authorId: parent.id });
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                //code to get data from db/other sources
                //return books.find(b => b.id == args.id );
                //console.log("book query: " + args.id);
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args){
                //return authors.find(a => a.id == args.id );
                //console.log("author query: " + args.id);
                return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                //return books;
                //console.log("books query: ");
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                //console.log("authors query: ");
                return Author.find({});
            }
        }
    }
})

const Mutation  = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: { 
                name:{ type: new GraphQLNonNull(GraphQLString) },
                age: { type: GraphQLInt }
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                })
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) },
                genre: { type: GraphQLString }
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})