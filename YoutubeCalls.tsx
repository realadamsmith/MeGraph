// // HistoryButton.js
// import React from 'react';

// import { Button } from 'react-native';
// import { google  } from 'googleapis';


// const HistoryButton: React.FC = () => {
//     const [videos, setVideos] = React.useState([]);
  
//     const getYouTubeHistory = async () => {
//       const youtube = google.youtube({
//         version: 'v3',
//         auth: apiKey,
//       });
  
//       const response = await youtube.videos.list({
//         part: 'snippet',
//         myHistory: true,
//       });
  
//       const videos = response.data.items;
//       setVideos(videos);
//     };
  
//     return (
//       <Button
//         title="View YouTube history"
//         onPress={getYouTubeHistory}
//       />
//     );
//   };
  
//   export default HistoryButton;