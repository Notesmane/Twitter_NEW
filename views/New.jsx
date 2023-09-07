const React = require('react');
const DefaultLayout = require('./Layout/Default');

function New() {
    return(
        <DefaultLayout>
            <h2>Create a New Tweet</h2>
            
            {/* action points to where the POST data will be sent */}
            <form action="/api/tweets" method="POST"> 

                Title: <input type="text" name="title" required/>

                Author: <input type="text" name="author" required/>

                <textarea name="body" required></textarea>

                <input type="submit" value="Post"/>

            </form>
        </DefaultLayout>
    )
}

module.exports = New;