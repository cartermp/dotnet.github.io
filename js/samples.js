//
// Sample Navigation Pane
//

var ConceptTag = React.createClass({
    handleClick: function(e) {
        this.props.handleClick(this.props.concept);
    },
    render: function() {
        return (
            <li className="samples-tag" onClick={this.handleClick}>
                <span>{this.props.concept}</span>
            </li>
        );
    }
});

var TagList = React.createClass({
    render: function() {
        let callback = this.props.onConceptFilterClick;
        var conceptTags = jQuery.unique(this.props.metadataItems.map(metadata => {
            return metadata.concepts[0];
        })).map(concept => {
            return <ConceptTag concept={concept}
                               handleClick={callback}/>
        });

        return (
            <ul>
                <ConceptTag concept={"All"}
                            handleClick={callback}/>
                {conceptTags}
            </ul>
        );
    }
});

var LangFilterTagItem = React.createClass({
    handleClick: function(e) {
        this.props.handleClick(this.props.lang);
    },
    render: function() {
        return (
            <li className="samples-lang-tag" onClick={this.handleClick}>
                <span>{this.props.lang}</span>
            </li>
        );
    }
})

var LangFilter = React.createClass({
    render: function() {
        // Have to scope it here because ... reasons?
        let callback = this.props.onLangFilterClicked;
        var rows = ["All", "C#", "VB", "F#"].map(lang => {
            return <LangFilterTagItem handleClick={callback}
                                      lang={lang} />;
        });

        return (
            <div>
                <ul>
                    {rows}
                </ul>
            </div>
        );
    }
});

var SearchBar = React.createClass({
    handleChange: function(e) {
        this.props.onFilterTextChanged(e.target.value)
    },
    render: function() {
        return (
            <input type="text"
                   placeholder="Search..."
                   refs="filterTextInput"
                   onChange={this.handleChange}/>
        );
    }
});

var SamplesNavPane = React.createClass({
    render: function() {
        return (
            <div className="samples-nav">
                <SearchBar onFilterTextChanged={this.props.onFilterTextChanged} />
                <h5>Filter by Language:</h5>
                <LangFilter onLangFilterClicked={this.props.onLangFilterClicked} />
                <h5>Filter by Concept:</h5>
                <TagList metadataItems={this.props.metadataItems}
                         onConceptFilterClick={this.props.onConceptFilterClick} />
            </div>
        );
    }
});

//
// Sample Box Stuff
//

function toAmericanDate(date) {
    if (date === undefined || date.length < 11) {
        return ""
    }

    let year = date.slice(0, 4);
    let month = date.slice(5, 7);
    let day = date.slice(8, 10)

    return day + "/" + month + "/" + year;
}

var SampleMetaData = React.createClass({
    render: function() {
        return (
            <div className="card">
                <div><span><b>Last Updated: </b></span>{toAmericanDate(this.props.date)}</div>
                <div><span><b>Author: </b></span>{this.props.metadata.author}</div>
            </div>
        );
    }
});

var SampleBoxConceptTag = React.createClass({
    handleConceptClick: function(e) {
        this.props.onConceptTagClick(this.props.concept)
    },
    render: function() {
        return <span onClick={this.handleConceptClick}
                     className="samples-tag">{this.props.concept}</span>;
    }
});

var SampleTags = React.createClass({
    handleLangClick: function(e) {
        this.props.handleLangTagClick(this.props.metadata.lang);
    },
    render: function() {
        // Gotta scope this because JS can't handle having this.props inside a closure
        let callback = this.props.onConceptFilterClicked;
        return (
            <div>
                <span className="samples-lang-tag"
                      onClick={this.handleLangClick}>{this.props.metadata.lang}</span>
                  {this.props.metadata.concepts.map(concept => {
                    return <SampleBoxConceptTag concept={concept}
                                                onConceptTagClick={callback}/>
                })}
            </div>
        );
    }
});

var SampleDescription = React.createClass({
    render: function() {
        return <p>{this.props.description}</p>;
    }
});

let SAMPLE_REPO_BASE_URL = "https://github.com/test-sample-repos-for-phillip/";

var SampleTitle = React.createClass({
    render: function() {
        return <h3>
                    <a href={SAMPLE_REPO_BASE_URL + this.props.repoName}>
                        {this.props.title}
                    </a>
               </h3>;
    }
});

var SampleBox = React.createClass({
    render: function() {
        return (
            <div className="samples-card">
                <SampleTitle title={this.props.metadata.title}
                             repoName={this.props.metadata.repo_name}/>
                <SampleDescription description={this.props.metadata.description} />
                <SampleTags metadata={this.props.metadata}
                            handleLangTagClick={this.props.onLangFilterClicked}
                            onConceptFilterClicked={this.props.onConceptFilterClicked}/>
                <SampleMetaData metadata={this.props.metadata}
                                date={this.props.date}/>
            </div>
        );
    }
});

//
// Sample Table Stuff
//

var SamplesTable = React.createClass({
    render: function() {
        var sampleBoxes = [];
        for (var i = 0; i < this.props.metadataItems.length; i++) {
            sampleBoxes.push(
                <SampleBox metadata={this.props.metadataItems[i]}
                           date={this.props.metadataItems[i].last_updated}
                           onLangFilterClicked={this.props.onLangFilterClicked}
                           onConceptFilterClicked={this.props.onConceptFilterClicked}/>
            );
        }

        return (
            <div className="samples-overall">
                {sampleBoxes}
            </div>
        );
    }
});

let REPO_BASE_URL = "https://api.github.com/repos/test-sample-repos-for-phillip/";

function conceptsContain(concepts, concept) {
    var ret = false;

    concepts.forEach(c => {
        if (c.toLowerCase() === concept) {
            ret = true;
        }
    });

    return ret;
}

var FullPane = React.createClass({
    handleFilterTextChanged: function(filterText) {
        console.log(filterText);
        if (filterText === '') {
            this.setState({metadataItems: this.state.allMetadataItems});
            return;
        }

        let newMetadataItems = this.state.allMetadataItems.filter(metadata => {
            return metadata.title.toLowerCase().includes(filterText.toLowerCase())
        });

        this.setState({metadataItems: newMetadataItems});
    },
    handleConceptFilterClicked: function(concept) {
        if (concept.toLowerCase() === "all") {
            this.setState({metadataItems: this.state.allMetadataItems});
            return;
        }

        let newMetadataItems = this.state.allMetadataItems.filter(item => {
            return conceptsContain(item.concepts, concept);
        });

        this.setState({metadataItems: newMetadataItems});
    },
    handleLangFilterClicked: function(lang) {
        if (lang.toLowerCase() === "all") {
            this.setState({metadataItems: this.state.allMetadataItems});
            return;
        }

        let newMetadataItems = this.state.allMetadataItems.filter(item => {
            return item.lang.toLowerCase() === lang.toLowerCase()
        });

        this.setState({metadataItems: newMetadataItems});
    },
    componentDidMount: function() {
        var reposCall = $.get(this.props.reposUrl);

        reposCall.done(repos => {
            let metadataPromises = repos.map(repo => {
                let metadataUrl = REPO_BASE_URL + repo.name + "/contents/metadata.json";
                return $.get(metadataUrl).then(content => {
                    return $.get(content.download_url)
                });
            });

            $.when.apply($, metadataPromises).done(function() {
                var mdataItems = [];

                // Have to use the magic "arguments" array because jQuery...
                for (var i = 0; i < arguments.length; i++) {
                    mdataItems.push(JSON.parse(arguments[i][0]));
                    mdataItems[i].repo_name = repos[i].name;
                    mdataItems[i].last_updated = repos[i].updated_at;
                }

                this.setState({metadataItems: mdataItems});
                this.setState({allMetadataItems: mdataItems});
            }.bind(this));
        }.bind(this));
    },
    getInitialState: function() {
        return {metadataItems: [],
                allMetadataItems: []};
    },
    render: function() {
        return (
            <div>
                <SamplesNavPane metadataItems={this.state.metadataItems}
                                onLangFilterClicked={this.handleLangFilterClicked}
                                onConceptFilterClick={this.handleConceptFilterClicked}
                                onFilterTextChanged={this.handleFilterTextChanged}/>
                <SamplesTable metadataItems={this.state.metadataItems}
                              onLangFilterClicked={this.handleLangFilterClicked}
                              onConceptFilterClicked={this.handleConceptFilterClicked}/>
            </div>
        );
    }
});

var REPOS_URL = "https://api.github.com/orgs/test-sample-repos-for-phillip/repos";

ReactDOM.render(
    <FullPane reposUrl={REPOS_URL}/>,
    document.getElementById('root')
);
