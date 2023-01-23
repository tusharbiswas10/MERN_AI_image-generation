import React, {useEffect, useState} from 'react'
import {Card,Loader,FormField } from '../components'

// if data is available then we will map all the data and render cards while posting all the data into indivisual cards 
// or just return title
const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return (
      data.map((post) => <Card key={post._id} {...post} />)
    );
  }

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {

  const [loading, setloading] = useState(false);
  const [allPosts, setallPosts] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState(null);
  useEffect(() =>{
    const fetchPosts = async () =>{
      setloading(true);
      
      try {
        const response = await fetch('http://localhost:8080/api/v1/post',{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },

        })

        if(response.ok){
          const result = await response.json();
          setallPosts(result.data.reverse());
        }
      } catch (error) {
        alert(error);
      } finally {
        setloading(false);
      }
    }
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase()));
        setSearchedResults(searchResult);
      }, 500),
    );
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          Turn your imagination into visible AI generated image....
        </h1>
        <p className="mt-2 text-[#666e75] text-[18px] max-w[500px]">
            This is a  personal project using OpenAI api & MERN stack by Tushar
        </p>
        <h1 className="font-extrabold text-[#223688] text-[32px] flex justify-center items-center">
          Public Board
        </h1>
      </div>

      <div className="mt-16">
        <FormField 
        labelName="Search posts"
        type="text"
        name="text"
        placeholder="Search some post..."
        value={searchText}
        handleChange={handleSearchChange}
        />
      </div>
      
      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader/>
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing results for <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}

            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
                {
                  searchText ? (
                    <RenderCards 
                      data={searchedResults}
                      title="Sorry noting available..." 
                    />
                  ) : (
                    <RenderCards
                      data={allPosts}
                      title="No post found"
                    />
                  )
                }
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Home