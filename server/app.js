const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());

mongoose.connect('mongodb+srv://user:password@cluster0-loxpp.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser : true, useUnifiedTopology: true })
mongoose.connection.once('open', () => {
    console.log('connected to database');
});
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('Listening on port 4000');
 })