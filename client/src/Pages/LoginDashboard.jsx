import React, { useEffect, useRef, useState,useCallback } from 'react';
import Logo from '../Media/LandingPage/Logo.png'; // Assuming this is your project's logo
import { VscAccount } from 'react-icons/vsc';
import { FaSearch } from 'react-icons/fa';
import { MdKeyboardVoice } from "react-icons/md";
import NewsImage from '../Media/dashboard-img.png'; // Assuming this is an image for the dashboard
import { Link, useNavigate } from 'react-router-dom';
import { LuXCircle, LuPencil } from "react-icons/lu";
import axios from 'axios';
import { gapi } from 'gapi-script'; // Assuming you're using Google API for authentication
import { CountryData } from '../filterData';
import { CategoryData } from '../filterData';
import { FaBookmark } from "react-icons/fa";
import {useDispatch} from 'react-redux' ; 
import {addToBookmark,removeFromBookmark} from '../Features/Bookmark' ; 
import { useSelector } from 'react-redux';
import { MdDelete } from "react-icons/md";
import { MdMicOff } from "react-icons/md";

function LoginDashBoard() {
  const [showSidebar, setShowSideBar] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [googleUser, setGoogleUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [filterCountry, setFilterCountry] = useState('in'); // Default country
  const [filterCategory, setFilterCategory] = useState('general'); // Default category
  const [newsData, setNewsData] = useState([]);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null); // State to hold selected news item
  const [bookmarks,SetBookmarks]=useState(false) ; 
  const [showFeed,setShowFeed]=useState(true) ; 
  const [newsHeadLines,setNewsHeadLines]=useState('');
  const [isVoiceAssistant,setIsVoiceAssistant]=useState(false) ; 
  


  const clickOutsideRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch() ; 


  const Allbookmarks = useSelector((state)=>state.allBookmark.bookmark)

 const handleAddtoBookmark=(news)=>{
  dispatch(addToBookmark(news)) ; 
  console.log(news)
 }

 const handleRemoveBookMark=(news)=>{
  dispatch(removeFromBookmark(news)) ; 
 }
  



  axios.defaults.withCredentials = true;

  const handleShowSideBar = () => {
    setShowSideBar(true);
  };

  const handleCloseSideBar = () => {
    setShowSideBar(false);
  };

  const handleShowExplore = () => {
    setShowExplore(true);
    setShowFeed(false) ; 
    SetBookmarks(false) ; 
  };

  const handleFeed = () => {
    setShowExplore(false);
    SetBookmarks(false)
  };

  const handleBookmark=()=>{
    SetBookmarks(true) ; 
    setShowExplore(false);
    setShowFeed(false) ; 
  }

  const handleAccountModal = () => {
    setShowAccountModal(!showAccountModal);
  };

  const handleNavigateLogout = () => {
    axios.get('http://localhost:5000/api/user/Logout')
      .then(res => {
        stopVoiceAssistant();
        navigate('/');
        localStorage.removeItem('profilePicture');
        window.location.reload(true); // Force reload to clear session
        console.log(res.data);
      })
      .catch(err => console.log(err));
  };

  const handleSettingsModal = () => {
    setSettingsModal(true);
  };

  const handleCloseSettingModal = () => {
    setSettingsModal(false);
  };

  const handleRefFunction = (event) => {
    if (clickOutsideRef.current && !clickOutsideRef.current.contains(event.target)) {
      setShowAccountModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleRefFunction);

    return () => {
      document.removeEventListener('mousedown', handleRefFunction);
    };
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/UserDetails", { withCredentials: true });

        // Assuming response.data structure matches { fullname, email, img_url }
        const { fullname, email, img_url } = response.data;

        setFullName(fullname);
        setEmail(email);
        setProfilePicture(img_url);
      } catch (err) {
        console.error("Error fetching user details:", err);
        // Handle error state or logging as needed
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const start = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: ''
      }).then(() => {
        const auth2 = gapi.auth2.getAuthInstance();
        if (auth2.isSignedIn.get()) {
          const profile = auth2.currentUser.get().getBasicProfile();
          setGoogleUser({
            fullName: profile.getName(),
            email: profile.getEmail(),
            imageUrl: profile.getImageUrl()
          });
        }
      }).catch(error => {
        console.error('Google API Initialization Error:', error);
      });
    };

    gapi.load('client:auth2', start);
  }, []);

  const handleUpdateUser = async () => {
    try {
      if (!fullName || !email) {
        alert("Please provide both Full Name and Email");
        return;
      }

      const res = await axios.put("http://localhost:5000/api/user/Update", {
        fullname: fullName,
        email: email
      });

      if (res.status === 200) {
        alert("User Details Updated Successfully");
      } else {
        alert("Failed to update user details");
      }
    } catch (err) {
      console.error("Error updating user details:", err);
      alert("Error updating user details. Please try again.");
    }
  };

  const handleGoogleLogout = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      setGoogleUser(null); // Clear Google user state
      // Perform any additional logout actions here
      navigate('/'); // Navigate to the home page or login page after logout
    }).catch((error) => {
      console.error('Error signing out:', error);
      // Handle sign-out errors if necessary
    });
  };

  // Function to handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file); 
      
      axios.post("http://localhost:5000/api/user/ProfilePictureUpdate", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => {
        if (res.status === 201) {
          alert("Profile Picture Updated Successfully");
          setProfilePicture(res.data.imgUrl); // Assuming setProfilePicture is correctly defined
        }
      })
      .catch((err) => {
        console.error("Error uploading profile picture:", err);
        // Handle error state or alert user about the error
      });
    }
  };
  
  useEffect(() => {
    console.log("Profile picture updated:", profilePicture);
  }, [profilePicture]);


  const handleRemoveImage = async () => {
    try {
      const res = await axios.delete('http://localhost:5000/api/user/DelProfilePic', { withCredentials: true });
      if (res.status === 200) {
        alert("Profile Picture Removed Successfully");
        setProfilePicture('');
      } else {
        alert("Failed to remove profile picture. Please try again.");
      }
    } catch (err) {
      console.error("Error removing profile picture:", err);
      alert("An error occurred while removing the profile picture. Please try again.");
    }
  };

  const handleShowNewsModal = (news) => {
    setSelectedNews(news);
    setShowNewsModal(true);
  }

  const closeHandleShowModal = () => {
    setShowNewsModal(false);
    setSelectedNews(null);
  }
  


  // Render account modal
  const RenderAccountShowModal = () => {
    if (showAccountModal) {
      const displayFullName = googleUser ? googleUser.fullName : fullName;
      const displayEmail = googleUser ? googleUser.email : email;
  
      return (
        <div ref={clickOutsideRef} className='absolute bottom-12 left-4 w-80 z-50 p-7 h-auto flex flex-col items-start justify-between bg-white border rounded-xl shadow-lg'>
          <div className='my-5'>
            {googleUser && <img src={googleUser.imageUrl} alt="Google User" className='w-12 h-12 rounded-full object-cover' />}
            {( profilePicture) && 
              <img 
                src={ profilePicture} 
                alt='profile-picture' 
                className='w-12 h-12 rounded-full object-cover' 
              />
            }
            {!googleUser && !profilePicture && <VscAccount className='w-12 h-12' />}
            <p className='text-3xl'><strong>{displayFullName}</strong></p>
            <p>{displayEmail}</p>
          </div>
          <div>
            <p className='text-black my-2 hover:text-blue-300 cursor-pointer' onClick={handleSettingsModal}>Settings</p>
            {/* <p className='flex items-center'><FaBookmark className='cursor-pointer'/> <strong>()</strong></p> */}
            {googleUser ? (
              <p className='text-black my-2 hover:text-blue-300 cursor-pointer' onClick={handleGoogleLogout}>Log out</p>
            ) : (
              <p className='text-black my-2 hover:text-blue-300 cursor-pointer' onClick={handleNavigateLogout}>Log out</p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };
  // Render settings modal
  const RenderSettingsModal = () => {
    if (settingsModal) {
      const displayFullName = googleUser ? googleUser.fullName : fullName;
      const displayEmail = googleUser ? googleUser.email : email;

      return (
        <div className='absolute h-screen w-screen shadow-xl bg-white z-50'>
          <div className='flex items-center justify-between p-5'>
            <p className='text-5xl font-bold'>Your Profile<br />
              <span className='text-lg font-semibold text-gray-500 ml-2'>MANAGE YOUR PROFILE</span>
            </p>
            <LuXCircle className='w-7 h-7 cursor-pointer' onClick={handleCloseSettingModal} />
          </div>
          <div className='w-screen h-auto flex items-center justify-around mt-24'>
            <div className='shadow-xl flex flex-col items-center rounded-3xl p-12'>
              <div className='p-12 flex flex-col items-center text-3xl'>
                <label htmlFor='fullName' className='font-bold'>Your Full Name</label>
                <input
                  type='text'
                  id='fullName'
                  name='fullName'
                  value={displayFullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className='border p-2 rounded cursor-not-allowed'
                  disabled={!!googleUser}
                />
              </div>
              <div className='p-12 flex flex-col items-center text-3xl'>
                <label htmlFor='email' className='font-bold'>Your Email</label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={displayEmail}
                  onChange={(e) => setEmail(e.target.value)}
                  className='border p-2 rounded cursor-not-allowed'
                  disabled={!!googleUser}
                />
              </div>
              <button
                type='submit'
                onClick={handleUpdateUser}
                className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ${googleUser ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={!!googleUser}
              >
                Update
              </button>
            </div>
            <div className='shadow-xl p-12 rounded-3xl'>
              <div className='flex flex-col items-center justify-between'>
                <p className='text-3xl font-bold'>Your Profile Picture</p>
                {googleUser?(<img src={googleUser.imageUrl} alt='Profile' className='w-36 h-36 rounded-full' />):  profilePicture ? (
                  <img src={profilePicture} alt='Profile' className='w-36 h-36 rounded-full' />
                ) : (<VscAccount className='w-36 h-36' />)}
               
                <label htmlFor='fileInput' className='mt-5 p-2 rounded-lg flex flex-col items-center justify-center bg-blue-400'>
                  <LuPencil className='w-7 h-7' />
                  <p>Choose a file</p>
                </label>
                <input
  type='file'
  accept=".png, .jpg, .jpeg"
  id='fileInput'
  className='hidden'
  onChange={handleImageChange}
/>

                {profilePicture && (
                  <button
                    onClick={handleRemoveImage}
                    className='bg-red-500 text-white mt-5 px-4 py-2 rounded-lg hover:bg-red-600'
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // fetching news 
  let selectedLanguage = 'en-US'; 
  const languages = {
    'en-US':'English(United States)',
    'en-AU' : 'English (Australia)',
    'en-CA' : 'English(Canada)',
    'en-GB':'English(Great Britain)',
    'ja-JP':'Japanese',
    'ru-RU':'Russian',
  }

  const setLanguage=(countryCode)=>{
const languageMap={
  'us': 'en-US',
  'au': 'en-AU',
  'ca': 'en-CA',
  'gb': 'en-GB',
  'jp': 'ja-JP',
  'ru': 'ru-RU',
}

const languageCode = languageMap[countryCode.toLowerCase()] || 'en-US' ; 
selectedLanguage=languageCode;
console.log(`Language set to: ${languages[languageCode]}`);
  }
  

  const fetchNews = useCallback(async () => {
    if (filterCountry && filterCategory) {
      try {
        const response = await axios.post('http://localhost:5000/api/news/getNews', {
          filterCategory,
          filterCountry,
        });
        const articles = response.data.articles || [];
        const headlines = articles.map(article=>article.title).join('.')
        setNewsData(Array.isArray(articles) ? articles : []);
        setNewsHeadLines(headlines)
        setLanguage(filterCountry)
      } catch (error) {
        console.error("Error fetching the news data:", error);
      }
    }
  }, [filterCountry, filterCategory]);
  
  
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);
  
  
  useEffect(() => {
    setNewsData([]);
  }, [filterCountry, filterCategory]);
  
  const RenderNewsModal = () => {
    if (showNewsModal && selectedNews) {
      return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" onClick={closeHandleShowModal}></div>
          <div className="bg-white w-2/4 h-auto lg:w-1/2 p-6 rounded-lg shadow-lg relative z-10">
            {selectedNews.urlToImage && (
              <img src={selectedNews.urlToImage} alt={selectedNews.title} className='w-full h-64 object-cover mb-4 rounded-lg' />
            )}
            <h2 className='text-2xl font-bold mb-4'>{selectedNews.title}</h2>
            <p className='text-gray-700 mb-4'>{selectedNews.description}</p>
            <a href={selectedNews.url} target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline'>Read more</a>
          </div>
        </div>
      );
    }
    return null;
  }


  const RenderExplore = () => {
    return (
        <div className='news-container explore-scroll-container h-full overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {newsData.length ? (
                newsData.map((news, index) => (
                    <div key={index} className='news-item p-4 border rounded-lg shadow-lg hover:shadow-xl  cursor-pointer'
                        onClick={() => handleShowNewsModal(news)}
                    >
                        {news.urlToImage && (
                            <img src={news.urlToImage} alt={news.title} className='w-full h-48 object-cover mb-4 rounded-lg' />
                        )}
                        <h2 className='text-xl font-bold mb-2'>{news.title}</h2>
                        <a href={news.url} target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline'>Read more</a>
                        <p className='text-black cursor-pointer'><FaBookmark onClick={()=>handleAddtoBookmark(news)}/></p>
                    </div>
                ))
            ) : (
                <p className='text-center'>No news available. Please select a category and country.</p>
            )}
        </div>
    );
};

const RenderBookmark=({newsData})=>{
  return(
    <div className='explore-scroll-container h-full overflow-y-auto'>
            {Allbookmarks.length === 0 ? (
                <p className='text-2xl font-bold'>No Bookmarks Added...</p>
            ) : (
              Allbookmarks.map((news, index) => (
                    <div key={index} className='news-item p-4 border rounded-lg shadow-lg hover:shadow-xl  cursor-pointer'
                        onClick={() => handleShowNewsModal(news)}
                    >
                        {news.urlToImage && (
                            <img src={news.urlToImage} alt={news.title} className='w-full h-48 object-cover mb-4 rounded-lg' />
                        )}
                        <h2 className='text-xl font-bold mb-2'>{news.title}</h2>
                        <a href={news.url} target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline'>Read more</a>
                        <p className='text-black cursor-pointer'><MdDelete onClick={() => handleRemoveBookMark(news)} /></p>
                    </div>
                ))
            )}
        </div>
  )
}

let recognition;

const startVoiceAssistant = (newsHeadlines) => {
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = selectedLanguage;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = async (event) => {
    console.log('Speech received.');
    speakResponse(newsHeadlines);
  };

  recognition.onspeechend = () => {
    recognition.stop();
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error detected:', event.error);
    if (event.error === 'network') {
      speakResponse('Network error occurred. Please check your internet connection.');
    } else {
      speakResponse('Sorry, I could not understand. Please try again.');
    }
  };

  try {
    recognition.start();
   
    console.log('Speech recognition started.');
  } catch (error) {
    console.error('Error starting speech recognition:', error);
  }
};

const speakResponse = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = selectedLanguage; 
  console.log('Speaking with language:', selectedLanguage);
  window.speechSynthesis.speak(utterance);
};

const stopVoiceAssistant = () => {
  if (recognition && isVoiceAssistant) {
    recognition.stop();
    
    console.log("Speech recognition stopped.");
   
  }
  window.speechSynthesis.cancel();
  console.log('Speech synthesis stopped.');
  setIsVoiceAssistant(false)
 

  
};

const triggerVoiceAssistant = () => {
  if (newsHeadLines) {
    startVoiceAssistant(newsHeadLines);
    setIsVoiceAssistant(true)
  } else {
    console.error('No news headlines available to speak.');
  }
  

};


const RenderSideBar = () => {
  return (
    <div
      className='w-56 h-screen border-r flex flex-col items-center p-5 justify-between bg-white'
      onMouseEnter={handleShowSideBar}
      onMouseLeave={handleCloseSideBar}
    >
      <ul>
        <li className='font-bold flex items-center mb-5'>
          <img src={Logo} alt="logo" className='w-5 h-5 mx-2 cursor-pointer' />Explore News
        </li>
       
        
        <li>
          <div className='space-y-2 '>
            <strong>CATEGORIES</strong>
            {CategoryData.map((item, index) => (
              <p key={index} className='cursor-pointer hover:text-blue-300' onClick={() => setFilterCategory(item.name)}>
                {item.name}
              </p>
            ))}
          </div>
          <div className='space-y-2 my-12'>
            <strong>COUNTRY</strong>
            {CountryData.map((item, index) => (
              <p key={index} className='cursor-pointer hover:text-blue-300' onClick={() => setFilterCountry(item.code)}>
                {item.name} <strong>({item.code})</strong>
              </p>
            ))}
          </div>
        </li>
      </ul>
    </div>
  );
};


  return (
    <div className='Dashboard w-screen h-screen flex relative'>
      {RenderSettingsModal()} {/* Render settings modal */}
      <div
        className='w-12 h-screen border-r flex flex-col items-start p-2 justify-between'
        onMouseLeave={handleCloseSideBar}
      >
        <div>
          <Link to='/LoginDashboard'> <img src={Logo} alt="logo" className='w-7 cursor-pointer' /></Link>
          <FaSearch className='w-5 h-5 mx-2 my-5 cursor-pointer' onMouseEnter={handleShowSideBar} />
        </div>
        {googleUser ? (
          <img
            src={googleUser.imageUrl}
            alt="Google User"
            className='w-7 h-7 rounded-full cursor-pointer account-icon object-cover'
            onClick={handleAccountModal}
          />
        ) : ( profilePicture) ? (
          <img
            src={profilePicture}
            alt="User Profile"
            className='w-7 h-7 rounded-full cursor-pointer account-icon object-cover'
            onClick={handleAccountModal}
          />
        ) : (
          <VscAccount className='w-7 h-7 cursor-pointer account-icon' onClick={handleAccountModal} />
        )}
        {RenderAccountShowModal()} {/* Render account modal */}
      </div>
      {showSidebar && <RenderSideBar />}
        <div className='Dashboard-main p-5 w-full flex flex-col items-center overflow-x-hidden overflow-y-hidden'>
          <h1 className='text-5xl font-bold text-center mb-8'>Your News Feed</h1>
          <p className='text-lg text-center mb-8'>Stay Ahead with Cutting-Edge Insights from Your  Voice Assistant</p>
          <div className='flex justify-center mb-4'>
            <button onClick={handleFeed} className={`text-lg font-semibold mx-4 cursor-pointer ${showFeed ? 'text-gray-600' : 'text-black hover:text-gray-500'}`}>Feed</button>
            <button onClick={handleShowExplore} className={`text-lg font-semibold mx-4 cursor-pointer ${showExplore ? 'text-gray-600' : 'text-black hover:text-gray-500'}`}>Explore</button>
            <button onClick={handleBookmark} className={`text-lg font-semibold mx-4 cursor-pointer ${bookmarks ? 'text-gray-600' : 'text-black hover:text-gray-500'}`}>Bookmarks({Allbookmarks.length})</button>
            {isVoiceAssistant ? (
        <li className='flex items-center mx-4'>
          <MdMicOff className='mr-2 w-12 h-12 hover:text-blue-300 cursor-pointer' onClick={stopVoiceAssistant} />
          Turn off Voice Assistant 
        </li>
      ) : (
        <li className='flex items-center mx-4'>
          <MdKeyboardVoice className='mr-2 w-12 h-12 hover:text-blue-300 cursor-pointer' onClick={triggerVoiceAssistant} />
          Turn on Voice Assistant 
        </li>
      )}
          </div>
          <div className='w-2/4 border-b border-gray-300 my-5'></div>
          {showExplore ? <RenderExplore newsData={newsData}/>  : bookmarks?<RenderBookmark/> : (
            <div className=' flex flex-col items-center justify-start'>
              <div className="border shadow-xl rounded-lg p-2 flex flex-col items-start">
                <strong> Voice Commands :</strong>
                <p className='font-semibold'>Read !</p>
                <p className='font-semibold'>Read Me the News !</p>
                <p className='font-semibold'>Read the Top HeadLines !</p>
              </div>

              <img src={NewsImage} alt="dashboard image" className='w-[40dvw] h-[60dvh] mb-8' />
              
            </div>
          )}
        </div>
        {RenderNewsModal()}
        
    </div>
  );
}

export default LoginDashBoard;
