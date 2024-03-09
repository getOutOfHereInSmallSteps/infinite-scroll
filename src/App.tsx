import { useEffect, useState } from 'react';
import loader from './assets/loader.svg';
import './App.css';

// yeah, im being lazy with this one
function App() {
  const [images, setImages] = useState<string[]>([
    'https://image.api.playstation.com/vulcan/img/rnd/202010/2621/DHZnQKM7NaNJ5FAIjdSJMxkw.png',
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchImages = async () => {
    const IMAGE_COUNT = 10;
    const API_KEY = 'R1deC1w_9bQsYMdpozS2OaeOHXPyrBa4KkwpWib8wJ8';
    const API_URL = `https://api.unsplash.com/photos/random/?client_id=${API_KEY}&count=${IMAGE_COUNT}&page=${page}`;
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();

      const fetchedImages = data.map((item: { urls: { regular: string } }) => {
        return item.urls.regular;
      });

      setImages(prev => {
        return [...prev, ...fetchedImages];
      });
      setPage(prevPage => prevPage + 1);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isLoading
    ) {
      return;
    }
    fetchImages();
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  return (
    <>
      {isLoading && (
        <div className="loader">
          <img src={loader} alt="Loader" />
        </div>
      )}
      <h1>Unsplash API - Infinite Scroll</h1>

      <div className="image-container">
        {images.map((imgSrc: string, i: number) => {
          return <img src={imgSrc} alt="" key={i} />;
        })}
      </div>
    </>
  );
}

export default App;
