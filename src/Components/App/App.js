import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import Playlist from '../Playlist/Playlist';
import SearchResults from '../SearchResults/SearchResults';
import Spotify from '../../util/Spotify';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      //Array that produces search results from search bar
      searchResults: [],
      //Information when creating playlist
      playlistName: 'New Playlist',
      //User has to pick playlist items from search results
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track){
    let tracks = this.state.playlistTracks;
    if(tracks.find(savedTrack => savedTrack.id === track.id)){
      return;
    }
    tracks.push(track);
    this.setState({playlistTracks: tracks});
  }

  removeTrack(track){
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id)

    this.setState({playlistTracks: tracks});

  }

  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  savePlaylist(){
    const trackURIs =  this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then( () =>{
      this.setState({playlistName: 'NEW PLAYLIST',
                    playlistTracks: [] });
    });
  }

  search(term){
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
  }

  render() {
  return(
    <div>
      <div className="App">
      <h1>Playlist Pal</h1>
      <SearchBar onSearch = {this.search}/>
        <div className="App-playlist">
        {/*will need to send search results to component to properly render and sends onAdd so u can add to playlist from search results*/}
        <SearchResults onAdd = {this.addTrack} searchResults = {this.state.searchResults} />
        {/*will need to send playlists user selects to render properly??*/}
        <Playlist name = {this.state.playlistName} tracks = {this.state.playlistTracks} isRemoval = {false}
              onRemove = {this.removeTrack} onNameChange = {this.updatePlaylistName} onSave = {this.savePlaylist}/>
        </div>
      </div>
    </div>
   );
  }
}

export default App;
