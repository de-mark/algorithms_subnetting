const networkComponent = document.getElementById("networkEntry");
const dropdownComponent = document.getElementById("subnetDropdown");
const subnetMaskComponent = document.getElementById("exampleSubnetMask");

// createSubnetDropdown : Adds the possible subnet options to the dropdown (I could have done this manually, but got lazy)
const createSubnetDropdown = () => {
    dropdownComponent.innerHTML = ""

    for (let i = 30; i >= 0; i--){
        dropdownComponent.innerHTML += `
        <option value="${i}">/${i}</option>
        `;
    }
    dropdownComponent.value = "24";
    displaySubnetMask();
}

// getSubnetMaskBinary : Checks the dropdown for the selected subnet and returns an array of that subnet in binary
const getSubnetMaskBinary = () => {
    let currentSubnet = parseInt(dropdownComponent.value);
    let binarySubnetMask = [...Array(currentSubnet).keys()].map((_) => "1");

    for (let i = currentSubnet; i < 32; i++) {
        binarySubnetMask[i] = "0";
    }

    return binarySubnetMask;
}

// getSubnetMaskDecimal : Uses getSubnetMaskBinary to get the binary version of the subnet, then returns the subnet translated to decimal
const getSubnetMaskDecimal = () => {
    let binarySubnetMask = getSubnetMaskBinary();

    let decimalSubnetMask = [];

    for (let i = 0; i < 32; i+=8){
        let binOctet = binarySubnetMask.slice(i, i+8).join("");
        decimalSubnetMask.push(parseInt(binOctet, 2))
    }

    return decimalSubnetMask;
}

// displaySubnetMask : Hooked up to the dropdown; will change the subnet mask display every time the user chooses a different subnet 
const displaySubnetMask = () => {
    let decimalSubnetMask = getSubnetMaskDecimal();
    subnetMaskComponent.innerHTML = `(${decimalSubnetMask.join(".")})`;
}

// addBinary : Takes two binary strings and returns the added binary strings as a string with four decimal octets (IPv4 address)
const addBinary = (firstAddend, secondAddend) => {
    // We turn the binary into decimal and add them--then turn the numbers back to binary
    let binSum = (Number(parseInt(firstAddend, 2)) + Number(parseInt(secondAddend, 2))).toString(2);

    // Since the octets need there to be 32 bytes and the dec -> bin translation doesn't take
    // this into account, we zero pad the binary
    let zeroPaddedSum = "";

    for (let i = 0; i < 32 - binSum.length; i++){
        zeroPaddedSum += "0";
    }

    // Remember, the calculation will keep 0's on the right to keep the binary number
    // consistent to the decimal value, but will erase the zeros since it doesn't know
    // how many places we need. Therefore, we add padding to the left.
    zeroPaddedSum += binSum;

    // Now we actually have to go through the 32 bytes and add the dot separator
    let newOctetsToParse = [];
    for (let i=0; i < 32; i += 8){
        newOctetsToParse.push(zeroPaddedSum.slice(i,i+8));
    }

    // Translates each binary octet to a decimal and returns as a string
    return newOctetsToParse.map((octet) => parseInt(octet, 2)).join(".");
}


// padOctet : Used by processSubnet to ensure that the decimal values are being properly padded
// (.toString(2) will return a binary that is not necessarily 8 bytes and it is important to keep
// the number of bytes for proper translation)
const padOctet = (octet) => {
    let binary = parseInt(octet).toString(2);

    while (binary.length < 8) {
        binary = "0" + binary;
    }

    return binary;
}

// processSubnet : Runs when the user presses the "Process button"; takes the network and subnet values
// and calculates / displays the (1) Network, (2) Total Hosts, (3) Useable Hosts, (4) First Host, (5) Last (useable) Host,
// (6) Broadcast address, and (7) Next Network
const processSubnet = () => {
    // Ensures that there's no symbols or spaces in the current network other than .'s
    let currentNetwork = networkComponent.value.replace(/[.,\/#!$%+\^&\*;:{}=\-_`~()]/g,".").trim();
    let currentSubnet = dropdownComponent.value;

    let nTotalHosts = 2**(32-currentSubnet);
    let nUseableHosts = nTotalHosts - 2;

    let binaryNetwork = currentNetwork.split(".").map((octet) => padOctet(octet)).join('');
    console.log(currentNetwork);
    console.log(binaryNetwork);

    let binFirstHost = addBinary(binaryNetwork, 1);
    let binLastHost = addBinary(binaryNetwork, nUseableHosts.toString(2));
    let binBroadcast = addBinary(binaryNetwork, (nTotalHosts-1).toString(2));
    let binNextNetwork = addBinary(binaryNetwork, nTotalHosts.toString(2));

    document.getElementById("cell_network").innerHTML = currentNetwork;
    document.getElementById("cell_totalhosts").innerHTML = nTotalHosts.toLocaleString();
    document.getElementById("cell_numhosts").innerHTML = nUseableHosts.toLocaleString();
    document.getElementById("cell_firsthost").innerHTML = binFirstHost;
    document.getElementById("cell_lasthost").innerHTML = binLastHost;
    document.getElementById("cell_broadcast").innerHTML = binBroadcast;
    document.getElementById("cell_nextnet").innerHTML = binNextNetwork;
}


// init / main
createSubnetDropdown();
// Displays the subnet depending on the current value in the dropdown
dropdownComponent.addEventListener("click", displaySubnetMask);