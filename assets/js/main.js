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
    dropdownComponent.value = "30";
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


const addBinary = (firstAddend, secondAddend) => {
    let binSum = (Number(parseInt(firstAddend, 2)) + Number(parseInt(secondAddend, 2))).toString(2);

    console.log(firstAddend, parseInt(firstAddend, 2));
    console.log(secondAddend, parseInt(secondAddend, 2));

    let zeroPaddedSum = "";

    for (let i = 0; i < 32 - binSum.length; i++){
        zeroPaddedSum += "0";
    }

    // 0000 0000.0000 0000.0000 0110.0000 1000

    zeroPaddedSum += binSum;

    console.log(zeroPaddedSum);

    let newOctetsToParse = [];
    for (let i=0; i < 32; i += 8){
        newOctetsToParse.push(zeroPaddedSum.slice(i,i+8));
    }

    return newOctetsToParse.map((octet) => parseInt(octet, 2)).join(".");
}


const processSubnet = () => {
    let currentNetwork = networkComponent.value;
    let currentSubnet = dropdownComponent.value;

    let nTotalHosts = 2**(32-currentSubnet);
    let nUseableHosts = nTotalHosts - 2;

    let binaryNetwork = currentNetwork.split(".").map((octet) => parseInt(octet).toString(2)).join('');
    console.log(currentNetwork);
    console.log(binaryNetwork);

    let binFirstHost = addBinary(binaryNetwork, 1);
    let binLastHost = addBinary(binaryNetwork, nUseableHosts.toString(2));
    let binBroadcast = addBinary(binaryNetwork, nTotalHosts.toString(2));

    document.getElementById("cell_network").innerHTML = currentNetwork;
    document.getElementById("cell_totalhosts").innerHTML = nTotalHosts.toLocaleString();
    document.getElementById("cell_numhosts").innerHTML = nUseableHosts.toLocaleString();
    document.getElementById("cell_firsthost").innerHTML = binFirstHost;
    document.getElementById("cell_lasthost").innerHTML = binLastHost;
    document.getElementById("cell_broadcast").innerHTML = binBroadcast;
    // document.getElementById("cell_nextsub").innerHTML =
}



createSubnetDropdown();
dropdownComponent.addEventListener("click", displaySubnetMask);