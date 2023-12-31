const React = require('react');
const DefaultLayout = require('./Layout/Default');

function Index({tweets}) {
    return (
        <DefaultLayout title="Tweets">
            <nav>
                <a href="/tweets/new">Create a New Tweet</a>
            </nav>

            <ul>
                {
                    tweets.map(tweet => {
                        return (
                            <li key={tweet._id} className="border p-5">
                                <br />
                                <a href={`/tweets/${tweet._id}`}>{tweet.title}</a>
                                <p>{tweet.body}</p>
                                <p>{tweet.author}</p>

                                <div>
                                    <a href={`/api/tweets/add-like/${tweet._id}`}>Like</a>
                                    <br />
                                    <span>Likes: {tweet.likes}</span>
                                </div>

                                <span>{tweet.sponsored ? 'Sponsored': ''}</span>

                                <br />
                                <a href={`/tweets/${tweet._id}/edit`}>Edit Tweet</a>
                                
                                {/* forms can only have get and posts.. so we have to do the below to create a delete  */}
                                <form method="POST" action={`/api/tweets/${tweet._id}?_method=DELETE`}>
                                    <input type="submit" value="Delete"/>
                                </form>
                            </li>
                        )
                    })
                }
            </ul>

        </DefaultLayout>
    )
}

module.exports = Index;