import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setform] = useState({
    name:'',
    prompt:'',
    photo:'',
  });
  const [generatingImag, setGeneratingImag] = useState(false);
  const [loading, setloading] = useState(false); 

  const handelSubmit = async (e) =>{
    e.preventDefault();
    if(form.prompt && form.photo) {
      setloading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form)
        })
        await response.json();
        navigate('/');
      } catch (error) {
        alert(error);
      }finally {
        setloading(false);
      }
    }
    else{
      alert('Please provide proper prompt & generate image');
    }
  }
  const handleChange = (e) =>{
    setform({ ...form,[e.target.name]: e.target.value })
  }
  const handelSurpriseMe = () =>{
    const randomPrompt = getRandomPrompt(form.prompt);
    setform({ ...form, prompt:randomPrompt})
  }
  const generateImage = async () => {
    if (form.prompt) {
      
      try {
        setGeneratingImag(true);
        const response = await fetch('http://localhost:8080/api/v1/dalle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: form.prompt}),
        });

        const data = await response.json();

        console.log('passing here');

        setform({ ...form, photo: `data:image/jpeg;base64,${data.photo}` })
      } catch (error) {
        alert(error);
      } finally {
        setGeneratingImag(false);
      }
    } else {
      alert('Please provide proper prompt');
    }
  };
  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          Create your imagination
        </h1>
        <p className="mt-2 text-[#666e75] text-[18px] max-w[500px]">
            visualize your imagination using AI...
        </p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handelSubmit}>
        <div className="flex flex-col gap-5">
            <FormField
              lableName="Your Name"
              type="text"
              name="name"
              placeholder="Osthir Pagla"
              value={form.name}
              handleChange={handleChange}
            />

            <FormField
              lableName="Prompt"
              type="text"
              name="prompt"
              placeholder="A Samurai riding a Horse on Mars, lomography"
              value={form.prompt}
              handleChange={handleChange}
              isSurpriseMe
              handelSurpriseMe={handelSurpriseMe}
            />
          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            { form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ):(
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-50"
              />
            )}

            {generatingImag && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader/>
              </div>
            )}

          </div>
        </div>
        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-blue-600 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-current"
          >
            {generatingImag ? 'Generating your imagination...' : 'Generate'}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-black text-[14px]">
            Do you like it ???
          </p>
          <button type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center">
            {loading ? 'Sharing...' : 'Share it in public board'}
          </button>
 
        </div>
      </form>
    </section>
  )
}

export default CreatePost