var ResultList = React.createClass({
  render: function() {
    var createItem = function(item, index) {
      return (
          <div className="" key={item.id}>
            <div className="col s4">
              <div className="card medium hoverable">
                <div className="card-image">
                  <img src={item.images_o.xl}/>
                  <span className="card-title">{item.name}<span className="badge">{item.big_score}</span></span>
                </div>
                <div className="card-content">
                  <p>Best Price ₹{item.min_price_str}</p>
                </div>
                <div className="card-action">
                  <a href={item.url} target="_blank">Go to page</a>
                </div>
              </div>
            </div>
          </div>
      );
    };

    return <div className='row'>{this.props.items.map(createItem)}</div>;
  }
});

var ProgressBar = React.createClass({
  render: function() {
    return (
       <div className="progress">
          <div className="indeterminate"></div>
        </div>
    );
  }
});

var App = React.createClass({
  getInitialState: function () {
      return {
          q: '',
          tags: ["mobile"],
          next: null,
          searching: false,
          items: [],
          next: null
      };
  },

  onChange: function(e) {
    var q = e.target.value;
    if(q == this.state.q) return;

    this.setState({
      searching: true,
      q: q
    });

    this.update();
  },

  handleTagChange: function(e) {
    var tag = e.target.value;
    var enabled = e.target.checked;
    var tags;

    if(enabled) {
      tags = this.state.tags.concat([tag]);
    } else {
      var index = this.state.tags.indexOf(tag);
      var removed = this.state.tags.splice(index, 1);
      var tags = this.state.tags;
    }
    this.setState({
      tags: tags,
      searching: true
    });
    this.update();
  },

  update: _.debounce(function() {
    var self = this;
    var url = '/search';
    var options = {
      q: this.state.q,
      facet: 1,
      tags: this.state.tags
    };

    $.getJSON(url, options, function(data) {
      var items = data.products;
      self.setState({
        items: items,
        searching: false,
        next: data.next
      });
    });
  }, 1000),

  loadMore: function(e) {
    e.preventDefault();
    var self = this;
    var url = '/search';
    var options = this.state.next;
    this.setState({searching: true});

    $.getJSON(url, options, function(data) {
      var items = self.state.items.concat(data.products);
      self.setState({
        items: items,
        searching: false,
        next: data.next
      });
    });
  },

  render: function() {
      return (
        <div className='container'>

          {(function(searching) {
            if(searching) {
              return <ProgressBar />;
            }
          })(this.state.searching)}

          <nav>
            <div className="nav-wrapper">
              <form>
                <div className="input-field">
                <input id="search" type="search" className="validate" onChange={this.onChange} value={this.state.q}></input>
                  <label htmlFor="search"><i className="material-icons">search</i></label>
                </div>
              </form>
            </div>
          </nav>

          <div className="row">
            <form className="col s12">
              <p>
                <span className="col s1">
                  Brand
                </span>
                <span className="col s2">
                  <input type="checkbox" onChange={this.handleTagChange} checked={this.state.tags.indexOf('micromax') > -1} id="micromax" value="micromax"/>
                  <label htmlFor="micromax">Micromax</label>
                </span>
                <span className="col s2">
                  <input type="checkbox" onChange={this.handleTagChange} checked={this.state.tags.indexOf('samsung') > -1} id="samsung" value="samsung"/>
                  <label htmlFor="samsung">Samsung</label>
                </span>
                <span className="col s2">
                  <input type="checkbox" onChange={this.handleTagChange} checked={this.state.tags.indexOf('apple') > -1} id="apple" value="apple"/>
                  <label htmlFor="apple">Apple</label>
                </span>
                <span className="col s2">
                  <input type="checkbox" onChange={this.handleTagChange} checked={this.state.tags.indexOf('videocon') > -1} id="videocon" value="videocon"/>
                  <label htmlFor="videocon">Videcon</label>
                </span>
                <span className="col s3">
                  <input type="checkbox" onChange={this.handleTagChange} checked={this.state.tags.indexOf('spice') > -1} id="spice" value="spice"/>
                  <label htmlFor="spice">Spice</label>
                </span>
              </p>
              <p>
                <span className="col s1">
                  OS
                </span>
                <span className="col s2">
                  <input type="checkbox" onChange={this.handleTagChange} checked={this.state.tags.indexOf('android') > -1} id="android" value="android"/>
                  <label htmlFor="android">Android</label>
                </span>
                <span className="col s2">
                  <input type="checkbox" onChange={this.handleTagChange} checked={this.state.tags.indexOf('windows-os') > -1} id="windows-os" value="windows-os"/>
                  <label htmlFor="windows-os">Windows</label>
                </span>
                <span className="col s7">
                  <input type="checkbox" onChange={this.handleTagChange} checked={this.state.tags.indexOf('symbian-os') > -1} id="symbian-os" value="symbian-os"/>
                  <label htmlFor="symbian-os">Symbian</label>
                </span>
              </p>

              <p>
                <span className="col s1">
                  Features
                </span>
                <span className="col s2">
                  <input type="checkbox" onChange={this.handleTagChange} checked={this.state.tags.indexOf('touchscreen') > -1} id="touchscreen" value="touchscreen"/>
                  <label htmlFor="touchscreen">Touchscreen</label>
                </span>
                <span className="col s2">
                  <input type="checkbox" onChange={this.handleTagChange} checked={this.state.tags.indexOf('wifi') > -1} id="wifi" value="wifi"/>
                  <label htmlFor="wifi">Wifi</label>
                </span>
                <span className="col s2">
                  <input type="checkbox" onChange={this.handleTagChange} checked={this.state.tags.indexOf('bluetooth') > -1} id="bluetooth" value="bluetooth"/>
                  <label htmlFor="bluetooth">Bluetooth</label>
                </span>
                <span className="col s2">
                  <input type="checkbox" onChange={this.handleTagChange} checked={this.state.tags.indexOf('email') > -1} id="email" value="email"/>
                  <label htmlFor="email">Email</label>
                </span>
              </p>
            </form>
          </div>


          <div id="result-container">
            <ResultList items={this.state.items} />

            {(function(self) {
              if(self.state.next) {
                if(self.state.searching) {
                  return <ProgressBar />
                }  else {
                  return <button className="waves-effect waves-light btn-large" onClick={self.loadMore}>Load more</button>
                }
              }
            })(this)}

          </div>
        </div>
      );
  }
});
 
React.render(<App />, document.body);