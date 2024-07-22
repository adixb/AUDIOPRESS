import React, { useEffect, useState, useCallback } from 'react';
import Logo from '../Media/LandingPage/Logo.png';
import { VscAccount } from 'react-icons/vsc';
import { FaSearch } from 'react-icons/fa';
import { MdKeyboardVoice } from "react-icons/md";
import NewsImage from '../Media/dashboard-img.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CountryData } from '../filterData';
import { CategoryData } from '../filterData';

function DashBoard() {
  const [showSidebar, setShowSideBar] = useState(false);
  const [showExplore, setShowExplore] = useState(false); // Show explore by default
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [filterCountry, setFilterCountry] = useState('in'); // Default country
  const [filterCategory, setFilterCategory] = useState('general'); // Default category
  const [newsData, setNewsData] = useState([]);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null); // State to hold selected news item

  const navigate = useNavigate();

  const handleShowSideBar = () => {
    setShowSideBar(true);
  };

  const handleCloseSideBar = () => {
    setShowSideBar(false);
  };

  const handleShowExplore = () => {
    setShowExplore(true);
  };

  const handleFeed = () => {
    setShowExplore(false);
  };

  const handleAccountModal = () => {
    setShowAccountModal(true);
  };

  const handleNavigateLogin = () => {
    navigate("/Login");
  };

  const RenderAccountShowModal = () => {
    if (showAccountModal) {
      return (
        <div className='absolute bottom-12 left-4 w-80 p-5 h-36 bg-white border rounded-xl shadow-lg z-50'>
          <p><b>Login to access the voice assistant</b></p>
          <button className='border px-12 p-2 font-bold rounded-full my-12 text-white bg-red-600 hover:bg-red-300' onClick={handleNavigateLogin}>Log In</button>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const showModalTimeout = setTimeout(() => {
      setShowAccountModal(true);
    }, 2000);

    const hideModalTimeout = setTimeout(() => {
      setShowAccountModal(false);
    }, 6000);

    return () => {
      clearTimeout(showModalTimeout);
      clearTimeout(hideModalTimeout);
    };
  }, []);

  // Function to fetch the news based on API hit
  const fetchNews = useCallback(async () => {
    if (filterCountry && filterCategory) {
      try {
        const response = await axios.post('http://localhost:5000/api/news/getNews', {
          filterCategory,
          filterCountry,
        });
        const articles = response.data.articles || [];
        setNewsData(Array.isArray(articles) ? articles : []);
      } catch (error) {
        console.error("Error fetching the news data:", error);
      }
    }
  }, [filterCountry, filterCategory]);

  // useEffect hook to fetch the new news based on the filters
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Making sure the old data is removed and new data is shown when filters are changed
  useEffect(() => {
    setNewsData([]);
  }, [filterCountry, filterCategory]);

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
          <li className='flex items-center mb-5'><MdKeyboardVoice className='mr-2 w-7 h-7 hover:text-blue-300 cursor-pointer' />AudioPress AI</li>
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

  const handleShowNewsModal = (news) => {
    setSelectedNews(news);
    setShowNewsModal(true);
  }

  const closeHandleShowModal = () => {
    setShowNewsModal(false);
    setSelectedNews(null);
  }

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
              <p href={news.url} target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline'>Read more</p>
            </div>
          ))
        ) : (
          <p className='text-center'>No news available. Please select a category and country.</p>
        )}
      </div>
    );
  };

  return (
    <>
      <div className='Dashboard w-screen h-screen flex'>
        <div className='w-12 h-screen border-r flex flex-col items-start p-2 justify-between' onMouseLeave={handleCloseSideBar}>
          <div>
            <Link to='/'>
              <img src={Logo} alt="logo" className='w-7 cursor-pointer' />
            </Link>
            <FaSearch className='w-5 h-5 mx-2 my-5 cursor-pointer' onMouseEnter={handleShowSideBar} />
          </div>
          <VscAccount className='w-7 h-7 cursor-pointer account-icon' onClick={handleAccountModal} />
          {RenderAccountShowModal()}
        </div>
        {showSidebar && <RenderSideBar />}
        <div className='Dashboard-main p-5 w-full flex flex-col items-center overflow-x-hidden overflow-y-hidden'>
          <h1 className='text-5xl font-bold text-center mb-8'>Your News Feed</h1>
          <p className='text-lg text-center mb-8'>Stay Ahead with Cutting-Edge Insights from Your AI Voice Assistant</p>
          <div className='flex justify-center mb-4'>
            <button onClick={handleFeed} className={`text-lg font-semibold mx-4 cursor-pointer ${!showExplore ? 'text-gray-600' : 'text-black hover:text-gray-500'}`}>Feed</button>
            <button onClick={handleShowExplore} className={`text-lg font-semibold mx-4 cursor-pointer ${showExplore ? 'text-gray-600' : 'text-black hover:text-gray-500'}`}>Explore</button>
          </div>
          <div className='w-2/4 border-b border-gray-300 my-5'></div>
          {showExplore ? <RenderExplore /> : <img src={NewsImage} alt="dashboard image" className='w-2/4 h-4/5 mb-8' />}
        </div>
        {RenderNewsModal()}
      </div>
    </>
  );
}

export default DashBoard;
