//went from foreach()to  for loop then back to foreach, but did not want to lose the 
//for loop code since it was working.

// we use `import axios from "axios"` which is another way of saying `const axios = require("axios")`
// it is jsut better supported in the browser!
import axios from "axios";

//alchemy ftw
const apiKey = "iV9Rjt5iMP4Ci8TDngI2rWaohTB2WvZW"
const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${apiKey}/getNFTs/`;
var ownerAddr= ""
var imageUrl= ""
//add an event listener using a const so we can reuse it.
const submitButton = document.getElementById("submit-button");
//require web3 for quiknode
//nvm quiknode sux balls
// const Web3 = require("web3");
// const web3 = new Web3('https://fragrant-cool-mansion.discover.quiknode.pro/f2847e29de07c66e151b6b2ba4c2bfd25e85d705/')
// web3.eth.getBlock('latest')
// .then((answer)=>{
//     console.log(answer)
// })
//
// configure the axios request
var config = {
    method: 'get',
    url: `${baseURL}?owner=${ownerAddr}`

}



//click the button and get whatever is inside the text box id address-input
submitButton.addEventListener("click", function(){
    const addressInput = document.getElementById("address-input");
    console.log(addressInput.value)
    ownerAddr = addressInput.value;
    config = {
        method: 'get',
        url: `${baseURL}?owner=${ownerAddr}`
    
    }
    axios(config)
    .then((response) => {
        console.log(response.data)
        // console.log(response.data.ownedNfts[1].metadata.image)
        for (let i=0; i<response.data.ownedNfts.length; i++){
            console.log(response.data.ownedNfts.length)
            //not sure why the forEach is giving the error at the end, so inserted above to use for loop
        // response.data.ownedNfts.forEach(element => {
            imageUrl = response.data.ownedNfts[i].media[0].gateway
        //original line below    
        //imageUrl = element.media[0].gateway
            console.log(`here is imgUrl ${imageUrl}`)
            var img = new Image();
             //replace element with response.data.ownedNfts[i] below
           
            if (response.data.ownedNfts[i].error != null || response.data.ownedNfts[i].media[0].gateway === ``){
                console.log('no image')
            }
            else if(imageUrl.startsWith(`ipfs://`)){
                console.log(imageUrl)
                imageUrl = "https://ipfs.io/ipfs/"+imageUrl.slice(7)
            }
            else {
            img.src = imageUrl;
            document.getElementById("all-nfts").appendChild(img);
            }
        };
        //below this is pre loop
        // var imageUrl = response.data.ownedNfts[0].metadata.image
        // var img = new Image();
        // img.src = imageUrl
        // document.getElementById("all-nfts").appendChild(img);
      
    }
        
    )
        // below is the old response, now getting data instead.
        // console.log(JSON.stringify(response.data, null, 2)))
    
    .catch(error =>console.log(error));

});
// console.log("test here")
// console.log(ownerAddr);

// http request test v1

// const url = "http://reqres.in/api/users?page=2"
// const theAxios = axios.create({
//     // baseURL: '',
//   timeout: 1000
// })
// theAxios.get(url).then((answer)=>{
//     console.log(answer.data);
// })

//http request test v2



// curl -H "Content-type:application/json" \
//      -d '{"id": 1, "method": "qn_fetchNFTs", "params": { "wallet": "0x8c8A7D99E1AdFa304ac03a5116ab6d95E3Ea82AC" }}' \
//      https://fragrant-cool-mansion.discover.quiknode.pro/f2847e29de07c66e151b6b2ba4c2bfd25e85d705/