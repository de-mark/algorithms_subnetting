const networkComponent = document.getElementById("networkEntry");
const dropdownComponent = document.getElementById("subnetDropdown");
const subnetMaskComponent = document.getElementById("exampleSubnetMask");


const createSubnetDropdown = () => {
    dropdownComponent.innerHTML = ""

    for (let i = 30; i >= 0; i--){
        dropdownComponent.innerHTML += `
        <option value="${i}">/${i}</option>
        `;
        //document.getElementById("exampleSubnetMask")
    }
    dropdownComponent.value = "30";
    displaySubnetMask();
}

// getSubnetMaskBinary : Checks the dropdown for the selected subnet and returns an array of that subnet in binary
const getSubnetMaskBinary = () => {
    let currentSubnet = parseInt(dropdownComponent.value);
    let binarySubnetMask = [...Array(32).keys()].map((_) => "1");

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


const processSubnet = () => {
    let currentNetwork = networkComponent.value;
    let currentSubnet = dropdownComponent.value;

    let nTotalHosts = 32-currentSubnet;
    let nUseableHosts = nTotalHosts - 2;

    let binaryNetwork = currentNetwork.split(".").map((octet) => parseInt(octet).toString(2));

    alert(`NETWORK - ${binaryNetwork.join(".")}`);
}



createSubnetDropdown();
dropdownComponent.addEventListener("click", displaySubnetMask);