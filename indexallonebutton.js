// we use `import axios from "axios"` which is another way of saying `const axios = require("axios")`
// it is jsut better supported in the browser!
import axios from "axios";

//alchemy ftw
const apiKey = "iV9Rjt5iMP4Ci8TDngI2rWaohTB2WvZW"
const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${apiKey}/getNFTs/`;
const baseERCURL= `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;
//start with null strings for address and url
var ownerAddr= ""
var imageUrl= ""
//add an event listener using a const so we can reuse it.
const submitButton = document.getElementById("submit-button");
///////---------------------------------------------------
//require web3 for quiknode
//nvm quiknode sux balls
// const Web3 = require("web3");
// const web3 = new Web3('https://fragrant-cool-mansion.discover.quiknode.pro/f2847e29de07c66e151b6b2ba4c2bfd25e85d705/')
// web3.eth.getBlock('latest')
// .then((answer)=>{
//     console.log(answer)
// })
//----------------------------------------------------------
// configure the axios request with base url and blank owner address
var config = {
    method: 'get',
    url: `${baseURL}?owner=${ownerAddr}`

}

//click the button and get whatever is inside the text box id address-input
submitButton.addEventListener("click", function(){
    const addressInput = document.getElementById("address-input");
    console.log(addressInput.value)
    ownerAddr = addressInput.value;
    //this line clears out the div with each submit and puts the owner's address up top
    document.getElementById(`all-nfts`).innerHTML = ownerAddr;
//set the config with the actual owner address
    config = {
        method: 'get',
        url: `${baseURL}?owner=${ownerAddr}`
           
    }

    axios(config)
    .then((response) => {
        console.log(response.data)

        // console.log(response.data.ownedNfts[1].metadata.image)
        response.data.ownedNfts.forEach(element => {

            imageUrl = element.media[0].gateway
            // console.log(`here is imgUrl ${imageUrl}`)
            var img = new Image();
            if (element.error != null || element.media[0].gateway === ``){
                console.log(`no image`)
            }
            if(imageUrl.startsWith(`ipfs://`)){
                console.log(imageUrl)
                imageUrl = "https://ipfs.io/ipfs/"+imageUrl.slice(7)
            }
            img.src = imageUrl;
            document.getElementById("all-nfts").appendChild(img);
        });
        //below this is pre loop
        // var imageUrl = response.data.ownedNfts[0].metadata.image
        // var img = new Image();
        // img.src = imageUrl
        // document.getElementById("all-nfts").appendChild(img);
      
    })
        // below is the old response, now getting data instead.
        // console.log(JSON.stringify(response.data, null, 2)))
    
    .catch(error =>console.log(error));
//---------ABOVE THIS LINE IS NFT ACTION
//--------BELOW THIS LINE IS ERC20 ACTION
    // Data for making the request to query token balances
    const data = JSON.stringify({
        jsonrpc: "2.0",
        method: "alchemy_getTokenBalances",
        headers: {
        "Content-Type": "application/json",
        },
        params: [`${ownerAddr}`],
        id: 42,
    });
    //   console.log(data);
    // config object for making a request with axios
    var ercConfig = {
    method: "post",
    url: baseERCURL,
    headers: {
        "Content-Type": "application/json",
    },
    data: data,
    };
    // console.log(ercConfig)
    async function ercDisplay(){
        let answer = await axios(ercConfig);
        answer = answer["data"];
        //get the balances
        const balances = answer["result"];
        console.log(answer)
        console.log(balances.tokenBalances)
        //remove the zero balance tokens, there could be zillions
        const nonZero = await balances.tokenBalances.filter((token)=>{
            return token.tokenBalance !== '0';
        });
        console.log('verify token balances here')

        //for loop to get all of the non zero
        let i=1;
        for (let token of nonZero){
            let balance = token.tokenBalance;
            console.log(balance)
    //optoins for the request
            const options = {
                method: "POST",
                url: baseURL,
                headers: {
                accept: "application/json",
                "content-type": "application/json",
                },
                data: {
                id: 1,
                jsonrpc: "2.0",
                method: "alchemy_getTokenMetadata",
                params: [token.contractAddress],
                },
            };
            //get metadata
            const metadata = await axios.request(options);

                // Compute token balance in human-readable format
        balance = balance / Math.pow(10, metadata["data"]["result"].decimals);
        balance = balance.toFixed(2);

        // Print name, balance, and symbol of token
        console.log(
        `${i++}. ${metadata["data"]["result"].name}: ${balance} ${
            metadata["data"]["result"].symbol
        }`
        );

        }
    
        
    }
    ercDisplay();



    //     //apparently you can't use filter.then so starting over
    //        //----------------below here not working
    // axios(ercConfig)    
    // .then((answer) => {
    //     console.log('erc data')
    //     // console.log(answer["data"]["result"])
    //     answer = answer["data"];
    //     const balances = answer["result"];
    //     console.log(answer)
    //     console.log(balances.tokenBalances)
     
    //     balances.tokenBalances.filter((token)=>{
    //         return token.tokenBalance !== 0;
    //     }).then((nonZero)=>{
    //         let i = 0;
    //         for( let token of nonZero){
    //             let balance = token.tokenBalance;
    //                 // options for making a request to get the token metadata
    //             const options = {
    //                 method: "POST",
    //                 url: baseURL,
    //                 headers: {
    //                 accept: "application/json",
    //                 "content-type": "application/json",
    //                 },
    //                 data: {
    //                 id: 1,
    //                 jsonrpc: "2.0",
    //                 method: "alchemy_getTokenMetadata",
    //                 params: [token.contractAddress],
    //                 },
    //             };
    //             axios.request(options)
    //             .then((metadata)=>{
    //                     // Compute token balance in human-readable format
    // balance = balance / Math.pow(10, metadata["data"]["result"].decimals);
    // balance = balance.toFixed(2);
    // console.log(
    //     `${i++}. ${metadata["data"]["result"].name}: ${balance} ${
    //       metadata["data"]["result"].symbol
    //     }`
    //   );
    //             })
  
    //         }

    //     })

    // }).catch((error) => console.log("error", error))

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