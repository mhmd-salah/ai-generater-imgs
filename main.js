const generateForm = document.querySelector( ".generate-form" );
const downloadBtn = document.querySelector( ".download-btn" );
const imageGallery = document.querySelector( ".image-gallery" );
const OPENAI_API_KEY = "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";
let isImageGenerating = false;
const updataImageCard = ( imgDataArray ) => {
  imgDataArray.forEach( ( imgObject, index ) => {
    const imgCard = imageGallery.querySelectorAll( ".img-card" )[ index ];
    const imgElement = imgCard.querySelector( "img" );

    const aiGeneratedImg = `data:image/jpeg;base64,${ imgObject.b64_json }`;
    imgElement.src = aiGeneratedImg;
    imgElement.onload = () => {
      downloadBtn.setAttribute( "href", aiGeneratedImg );
      downloadBtn.setAttribute( "download", `${ new Date().getTime() }.jpg` );
      imgCard.classList.remove( "loading" );
    };
  } );
};
const generateAiImages = async ( userPrompt, userImgQuantity ) => {
  try {
    const response = await fetch( "https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ OPENAI_API_KEY }`
      },
      body: JSON.stringify( {
        prompt: userPrompt,
        n: parseInt( userImgQuantity ),
        size: "512x512",
        response_format: "b64_json"
      } )
    } );
    if ( !response.ok ) throw new Error( "Faild to generate images! Please Try Again." );
    const { data } = await response.json();
    updataImageCard( [ ...data ] );
  } catch ( error ) {
    alert( error.message );
  } finally {
    isImageGenerating = false;
  }
};

const hendleFormSubmission = ( e ) => {
  e.preventDefault();
  if ( isImageGenerating ) return;
  isImageGenerating = true;
  const userPrompt = e.srcElement[ 0 ].value;
  const userImgQuantity = e.srcElement[ 1 ].value;

  const imgCardMarkup = Array.from( { length: userImgQuantity }, () =>
    ` <div class="img-card loading">
      <img src="images/loader.svg" alt="image">
      <a href="" class="download-btn">
        <img src="images/download.svg" alt="download icon">
      </a>
    </div>`
  ).join();
  imageGallery.innerHTML = imgCardMarkup;
  downloadBtn.setAttribute( "href", aiGeneratedImg );
  downloadBtn.setAttribute( "download", `${ new Date().getTime() }.jpg` );
  generateAiImages( userPrompt, userImgQuantity );
};

generateForm.addEventListener( "submit", hendleFormSubmission );